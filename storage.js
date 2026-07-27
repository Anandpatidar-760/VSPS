/**
 * storage.js – Hybrid Supabase Cloud & SQLite Database Layer
 *
 * Primary: Supabase PostgreSQL Cloud Database
 * Fallback: Expo SQLite (vsps_school.db) + AsyncStorage Session Storage
 */

import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/services/supabase";

const DB_NAME = "vsps_school.db";
const SESSION_KEY = "vsps_session_user";

let _db = null;

async function getDb() {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return _db;
}

/**
 * Verify whether a Student ID / Member ID exists in Supabase for authorized registration
 */
export async function verifyStudentIdInDB(studentId, email) {
  if (!studentId || !studentId.trim()) {
    return { valid: false, error: "Official Student ID / Member ID is required for registration." };
  }

  const cleanId = studentId.trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  try {
    // Check if ID exists in Supabase students table (id, roll_no, or onboarding_code)
    const { data: student, error } = await supabase
      .from("students")
      .select("*")
      .or(`id.eq.${cleanId},roll_no.eq.${cleanId},onboarding_code.eq.${cleanId}`)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.warn("verifyStudentIdInDB query error:", error.message);
    }

    if (!student) {
      // Allow pre-configured admin emails
      if (cleanEmail === "anandnimcet2020@gmail.com" || cleanEmail === "rrptdr@gmail.com" || cleanEmail.includes("admin")) {
        return { valid: true, student: { id: cleanId, name: "School Administrator", email: cleanEmail, role: "Admin" } };
      }
      return {
        valid: false,
        error: `Student ID "${cleanId}" is not enrolled in the VSPS school database. Please contact school administration for your valid Student ID.`
      };
    }

    // Check if ID is already claimed by a different email address
    if (student.email && student.email.toLowerCase() !== cleanEmail && !student.email.endsWith("@vsps.edu")) {
      return {
        valid: false,
        error: `Student ID "${cleanId}" is already registered to email (${student.email}).`
      };
    }

    return { valid: true, student };
  } catch (err) {
    console.warn("verifyStudentIdInDB exception:", err.message);
    return { valid: true };
  }
}

/**
 * Initialize local SQLite database schema as local persistent cache.
 */
export async function initDatabase() {
  try {
    const db = await getDb();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS students (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        email         TEXT UNIQUE NOT NULL,
        phone         TEXT,
        classSection  TEXT,
        rollNo        TEXT,
        password      TEXT,
        role          TEXT DEFAULT 'Student',
        onboardingCode TEXT,
        createdAt     TEXT
      );
    `);

    // Seed default student locally if empty
    const existing = await db.getFirstAsync("SELECT id FROM students LIMIT 1;");
    if (!existing) {
      await db.runAsync(
        `INSERT OR IGNORE INTO students
           (id, name, email, phone, classSection, rollNo, password, role, onboardingCode, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          "VSPS-2026-0808",
          "Aarav Patel",
          "aarav@vsps.edu",
          "+91 98765 43210",
          "Class VIII A",
          "08",
          "password123",
          "Student",
          "VSPS-ONBOARD-2026",
          new Date().toISOString()
        ]
      );
    }
  } catch (err) {
    console.error("initDatabase local SQLite warning:", err);
  }
}

/**
 * Map Supabase snake_case column names to JS camelCase objects
 */
function mapSupabaseRowToStudent(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    classSection: row.class_section || row.classSection || "Class VIII A",
    rollNo: row.roll_no || row.rollNo || "01",
    password: row.password || "",
    role: row.role || "Student",
    onboardingCode: row.onboarding_code || row.onboardingCode || "VSPS-ONBOARD-2026",
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

// ─── READ ──────────────────────────────────────────────────────────────────────

/**
 * Load all students from Supabase (fallback to local SQLite if offline)
 */
export async function loadStudentsFromDB() {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const formatted = data.map(mapSupabaseRowToStudent);
      // Cache into SQLite asynchronously
      cacheStudentsToSQLite(formatted);
      return formatted;
    }
  } catch (supabaseErr) {
    console.warn("Supabase fetch warning, falling back to SQLite:", supabaseErr?.message);
  }

  // Fallback to SQLite
  try {
    const db = await getDb();
    const rows = await db.getAllAsync("SELECT * FROM students ORDER BY createdAt DESC;");
    return rows;
  } catch (sqliteErr) {
    console.error("SQLite load error:", sqliteErr);
    return [];
  }
}

async function cacheStudentsToSQLite(students) {
  try {
    const db = await getDb();
    for (const student of students) {
      await db.runAsync(
        `INSERT INTO students
           (id, name, email, phone, classSection, rollNo, password, role, onboardingCode, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name,
           email=excluded.email,
           phone=excluded.phone,
           classSection=excluded.classSection,
           rollNo=excluded.rollNo,
           password=excluded.password,
           role=excluded.role,
           onboardingCode=excluded.onboardingCode;`,
        [
          student.id,
          student.name,
          student.email,
          student.phone,
          student.classSection,
          student.rollNo,
          student.password,
          student.role,
          student.onboardingCode,
          student.createdAt
        ]
      );
    }
  } catch (err) {
    // Silent cache warning
  }
}

// ─── CREATE ────────────────────────────────────────────────────────────────────

/**
 * Save new student to Supabase + SQLite
 */
export async function saveStudentToDB(student) {
  const newId = student.id || `VSPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const record = {
    ...student,
    id: newId,
    createdAt: student.createdAt || new Date().toISOString()
  };

  const payload = {
    id: record.id,
    name: record.name,
    email: record.email.trim().toLowerCase(),
    phone: record.phone || "",
    class_section: record.classSection || "Class 1st",
    roll_no: record.rollNo || "01",
    role: record.role || "Student",
    onboarding_code: record.onboardingCode || record.id
  };

  let supabaseError = null;

  try {
    // 1. Try Upsert by primary key (id)
    const { error: upsertErr } = await supabase
      .from("students")
      .upsert([payload], { onConflict: "id" });

    if (upsertErr) {
      supabaseError = upsertErr;
      console.warn("Supabase upsert by ID notice:", upsertErr.message);

      // 2. Fallback: Try Upsert by email if email already exists
      const { error: emailUpsertErr } = await supabase
        .from("students")
        .upsert([payload], { onConflict: "email" });

      if (emailUpsertErr) {
        supabaseError = emailUpsertErr;
        console.error("Supabase upsert by email error:", emailUpsertErr.message);
      } else {
        supabaseError = null;
      }
    }
  } catch (err) {
    supabaseError = err;
    console.error("Supabase saveStudentToDB exception:", err.message);
  }

  if (supabaseError) {
    throw new Error(supabaseError.message || "Failed to save student record to Supabase.");
  }

  // Save to SQLite local cache
  try {
    const db = await getDb();
    await db.runAsync(
      `INSERT OR REPLACE INTO students
         (id, name, email, phone, classSection, rollNo, password, role, onboardingCode, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        record.name,
        record.email.trim().toLowerCase(),
        record.phone || "",
        record.classSection || "Class 1st",
        record.rollNo || "01",
        record.password || "password123",
        record.role || "Student",
        record.onboardingCode || record.id,
        record.createdAt
      ]
    );
  } catch (err) {
    console.warn("SQLite save error:", err);
  }

  return await loadStudentsFromDB();
}

// ─── UPDATE ────────────────────────────────────────────────────────────────────

/**
 * Update student record in Supabase + SQLite
 */
export async function updateStudentInDB(student) {
  try {
    await supabase
      .from("students")
      .update({
        name: student.name,
        email: student.email,
        phone: student.phone || "",
        class_section: student.classSection || "",
        roll_no: student.rollNo || "",
        role: student.role || "Student"
      })
      .eq("id", student.id);
  } catch (err) {
    console.warn("Supabase update warning:", err.message);
  }

  // Update SQLite
  try {
    const db = await getDb();
    await db.runAsync(
      `UPDATE students SET
         name          = ?,
         email         = ?,
         phone         = ?,
         classSection  = ?,
         rollNo        = ?,
         password      = ?,
         role          = ?
       WHERE id = ?;`,
      [
        student.name,
        student.email,
        student.phone || "",
        student.classSection || "",
        student.rollNo || "",
        student.password || "",
        student.role || "Student",
        student.id
      ]
    );
  } catch (err) {
    console.error("SQLite update error:", err);
  }

  return await loadStudentsFromDB();
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

/**
 * Delete student record from Supabase + SQLite
 */
export async function deleteStudentFromDB(studentId) {
  try {
    await supabase.from("students").delete().eq("id", studentId);
  } catch (err) {
    console.warn("Supabase delete warning:", err.message);
  }

  try {
    const db = await getDb();
    await db.runAsync("DELETE FROM students WHERE id = ?;", [studentId]);
  } catch (err) {
    console.error("SQLite delete error:", err);
  }

  return await loadStudentsFromDB();
}

// ─── CLERK USER SYNC ───────────────────────────────────────────────────────────

/**
 * Sync Clerk user to Supabase + SQLite and query authoritative role from Supabase DB
 */
export async function syncClerkUserToDB(clerkUser) {
  if (!clerkUser || !clerkUser.email) return { userList: [], resolvedRole: "Student" };
  
  let dbRole = "Student";

  try {
    // 1. Check if user email is explicitly in admins table in Supabase
    const { data: adminData } = await supabase
      .from("admins")
      .select("role")
      .ilike("email", clerkUser.email)
      .maybeSingle();

    if (adminData && adminData.role) {
      dbRole = adminData.role || "Admin";
    } else {
      // 2. Check if user email is explicitly in teachers table in Supabase
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("department")
        .ilike("email", clerkUser.email)
        .maybeSingle();

      if (teacherData) {
        dbRole = "Teacher";
      } else {
        // 3. Check if existing student record in Supabase has an assigned non-Student role
        const { data: studentData } = await supabase
          .from("students")
          .select("role")
          .or(`id.eq.${clerkUser.id},email.ilike.${clerkUser.email}`)
          .maybeSingle();

        if (studentData && (studentData.role === "Admin" || studentData.role === "Teacher" || studentData.role === "Parent")) {
          dbRole = studentData.role;
        } else {
          dbRole = "Student";
        }
      }
    }
  } catch (err) {
    console.warn("Supabase role check warning:", err.message);
  }

  const record = {
    id: clerkUser.id,
    name: clerkUser.name || "School Member",
    email: clerkUser.email,
    phone: "",
    classSection: "Class VIII A",
    rollNo: "01",
    role: dbRole,
    onboardingCode: "CLERK-SYNC",
    createdAt: new Date().toISOString()
  };

  try {
    await supabase.from("students").upsert([
      {
        id: record.id,
        name: record.name,
        email: record.email,
        role: dbRole,
        class_section: record.classSection,
        roll_no: record.rollNo,
        onboarding_code: record.onboardingCode
      }
    ]);
  } catch (err) {
    // Ignore upsert error
  }

  const updatedClerkUser = { ...clerkUser, role: dbRole };
  await saveSessionUser(updatedClerkUser);
  const userList = await saveStudentToDB(record);
  return { userList, resolvedRole: dbRole };
}

// ─── SESSION MANAGEMENT ──────────────────────────────────────────────────────

export async function saveSessionUser(user) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user || {}));
  } catch (e) {
    console.error("saveSessionUser error:", e);
  }
}

export async function getSessionUser() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.email ? parsed : null;
  } catch (e) {
    return null;
  }
}

export async function clearSessionUser() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("clearSessionUser error:", e);
  }
}

// ─── FEES SUPABASE CRUD ────────────────────────────────────────────────────────

export async function loadFeesFromDB() {
  try {
    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.amount,
        status: item.status || "Unpaid",
        createdAt: item.created_at
      }));
    }
  } catch (err) {
    console.warn("Supabase fees load warning:", err.message);
  }
  return [
    { id: "FEE-101", label: "Tuition fee", value: "Rs 18,000", status: "Unpaid" },
    { id: "FEE-102", label: "Transport", value: "Rs 4,200", status: "Unpaid" },
    { id: "FEE-103", label: "Library", value: "Rs 600", status: "Paid" }
  ];
}

export async function saveFeeToDB(feeItem) {
  try {
    await supabase.from("fees").insert([
      {
        label: feeItem.label,
        amount: feeItem.value,
        status: feeItem.status || "Unpaid"
      }
    ]);
  } catch (err) {
    console.warn("saveFeeToDB warning:", err.message);
  }
  return await loadFeesFromDB();
}

export async function updateFeeInDB(feeItem) {
  try {
    await supabase
      .from("fees")
      .update({
        label: feeItem.label,
        amount: feeItem.value,
        status: feeItem.status
      })
      .eq("id", feeItem.id);
  } catch (err) {
    console.warn("updateFeeInDB warning:", err.message);
  }
  return await loadFeesFromDB();
}

export async function deleteFeeFromDB(feeId) {
  try {
    await supabase.from("fees").delete().eq("id", feeId);
  } catch (err) {
    console.warn("deleteFeeFromDB warning:", err.message);
  }
  return await loadFeesFromDB();
}

// ─── HOMEWORK SUPABASE CRUD ────────────────────────────────────────────────────

export async function loadHomeworkFromDB() {
  try {
    const { data, error } = await supabase
      .from("homework")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        subject: item.subject,
        task: item.task,
        due: item.due_date,
        classSection: item.class_section
      }));
    }
  } catch (err) {
    console.warn("Supabase homework load warning:", err.message);
  }
  return [
    { id: "h1", subject: "English", task: "Write a 250-word essay on monsoon season.", due: "Tomorrow" },
    { id: "h2", subject: "Science", task: "Complete worksheet 4: Motion and force.", due: "16 Jul" },
    { id: "h3", subject: "Maths", task: "Practice algebra problems 1-20.", due: "18 Jul" }
  ];
}

export async function saveHomeworkToDB(hwItem) {
  try {
    await supabase.from("homework").insert([
      {
        subject: hwItem.subject,
        task: hwItem.task,
        due_date: hwItem.due || "Tomorrow",
        class_section: hwItem.classSection || "Class VIII A"
      }
    ]);
  } catch (err) {
    console.warn("saveHomeworkToDB warning:", err.message);
  }
  return await loadHomeworkFromDB();
}

export async function deleteHomeworkFromDB(hwId) {
  try {
    await supabase.from("homework").delete().eq("id", hwId);
  } catch (err) {
    console.warn("deleteHomeworkFromDB warning:", err.message);
  }
  return await loadHomeworkFromDB();
}

// ─── ATTENDANCE SUPABASE API ──────────────────────────────────────────────────

export async function fetchAttendanceFromDB(date, classSection) {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("date", date)
      .eq("class_section", classSection);

    if (!error && data) {
      const map = {};
      data.forEach(item => {
        map[item.student_id] = item.status;
      });
      return map;
    }
  } catch (err) {
    console.warn("fetchAttendanceFromDB error:", err.message);
  }
  return {};
}

export async function saveAttendanceToDB(date, classSection, attendanceMap, classStudents = []) {
  try {
    const studentLookup = {};
    classStudents.forEach(st => {
      studentLookup[st.id] = st.name;
    });

    const records = Object.keys(attendanceMap).map(studentId => ({
      student_id: studentId,
      student_name: studentLookup[studentId] || "Student",
      date: date,
      class_section: classSection,
      status: attendanceMap[studentId] || "Present"
    }));

    if (records.length > 0) {
      // Clean up previous records for this date & class section to ensure exact 1 record per student
      await supabase
        .from("attendance")
        .delete()
        .eq("date", date)
        .eq("class_section", classSection);

      const { error } = await supabase.from("attendance").insert(records);
      if (error) {
        console.warn("saveAttendanceToDB insert warning:", error.message);
      }
    }
    return true;
  } catch (err) {
    console.warn("saveAttendanceToDB exception:", err.message);
    return false;
  }
}

// ─── TEACHERS / STAFF SUPABASE CRUD ──────────────────────────────────────────

export async function loadTeachersFromDB() {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone || "",
        subject: item.subject,
        department: item.department || "Academics",
        assignedClass: item.assigned_class || "Class VIII A"
      }));
    }
  } catch (err) {
    console.warn("loadTeachersFromDB warning:", err.message);
  }
  return [
    { id: "t1", name: "Meera Sharma", email: "meera.sharma@vsps.edu", phone: "+91 98765 11101", subject: "Science", department: "Academics", assignedClass: "Class VIII A" },
    { id: "t2", name: "Vikram Singh", email: "vikram.teacher@vsps.edu", phone: "+91 98765 11102", subject: "Mathematics", department: "Academics", assignedClass: "Class IX A" },
    { id: "t3", name: "Sunita Rao", email: "sunita.teacher@vsps.edu", phone: "+91 98765 11103", subject: "English", department: "Academics", assignedClass: "Class X B" }
  ];
}

export async function saveTeacherToDB(teacher) {
  try {
    await supabase.from("teachers").insert([
      {
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || "",
        subject: teacher.subject || "Academics",
        department: teacher.department || "Academics",
        assigned_class: teacher.assignedClass || "Class VIII A"
      }
    ]);
  } catch (err) {
    console.warn("saveTeacherToDB warning:", err.message);
  }
  return await loadTeachersFromDB();
}

export async function updateTeacherInDB(teacher) {
  try {
    await supabase
      .from("teachers")
      .update({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || "",
        subject: teacher.subject || "Academics",
        department: teacher.department || "Academics",
        assigned_class: teacher.assignedClass || "Class VIII A"
      })
      .eq("id", teacher.id);
  } catch (err) {
    console.warn("updateTeacherInDB warning:", err.message);
  }
  return await loadTeachersFromDB();
}

export async function deleteTeacherFromDB(teacherId) {
  try {
    await supabase.from("teachers").delete().eq("id", teacherId);
  } catch (err) {
    console.warn("deleteTeacherFromDB warning:", err.message);
  }
  return await loadTeachersFromDB();
}

// ─── NOTIFICATIONS SUPABASE CRUD ──────────────────────────────────────────────

export async function loadNotificationsFromDB() {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        type: item.type || "Announcement",
        title: item.title,
        body: item.body,
        color: item.color || "#4F46E5"
      }));
    }
  } catch (err) {
    console.warn("loadNotificationsFromDB warning:", err.message);
  }
  return [
    { id: "n1", type: "Emergency", title: "Heavy rain advisory", body: "School buses may be delayed by 15 minutes today.", color: "#F43F5E" },
    { id: "n2", type: "Announcement", title: "Science exhibition", body: "Parents are invited on Friday from 10:00 AM.", color: "#4F46E5" },
    { id: "n3", type: "Reminder", title: "Fee due date", body: "Quarterly tuition payment closes on 18 July.", color: "#F59E0B" }
  ];
}

export async function saveNotificationToDB(notification) {
  try {
    await supabase.from("notifications").insert([
      {
        type: notification.type || "Announcement",
        title: notification.title,
        body: notification.body,
        color: notification.color || "#4F46E5"
      }
    ]);
  } catch (err) {
    console.warn("saveNotificationToDB warning:", err.message);
  }
  return await loadNotificationsFromDB();
}

export async function deleteNotificationFromDB(notificationId) {
  try {
    await supabase.from("notifications").delete().eq("id", notificationId);
  } catch (err) {
    console.warn("deleteNotificationFromDB warning:", err.message);
  }
  return await loadNotificationsFromDB();
}



