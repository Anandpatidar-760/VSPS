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

  try {
    const { error } = await supabase.from("students").insert([
      {
        id: record.id,
        name: record.name,
        email: record.email,
        phone: record.phone || "",
        class_section: record.classSection || "Class VIII A",
        roll_no: record.rollNo || "01",
        password: record.password || "",
        role: record.role || "Student",
        onboarding_code: record.onboardingCode || "VSPS-ONBOARD-2026",
        created_at: record.createdAt
      }
    ]);

    if (error && !error.message?.includes("duplicate")) {
      console.warn("Supabase save warning:", error.message);
    }
  } catch (err) {
    console.warn("Supabase save exception:", err.message);
  }

  // Save to SQLite
  try {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO students
         (id, name, email, phone, classSection, rollNo, password, role, onboardingCode, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        record.name,
        record.email,
        record.phone || "",
        record.classSection || "Class VIII A",
        record.rollNo || "01",
        record.password || "",
        record.role || "Student",
        record.onboardingCode || "VSPS-ONBOARD-2026",
        record.createdAt
      ]
    );
  } catch (err) {
    // If duplicated locally, update
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
        password: student.password || "",
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

