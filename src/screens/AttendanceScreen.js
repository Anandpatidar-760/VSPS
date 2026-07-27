import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { StatusPill } from "../components/common/StatusPill";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { saveAttendanceToDB, fetchAttendanceFromDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

const AVAILABLE_CLASSES = ["Class VIII A", "Class IX A", "Class X B", "Class XI C"];

const DEFAULT_DEMO_STUDENTS = [
  { id: "VSPS-2026-0808", name: "Aarav Patel", classSection: "Class VIII A", rollNo: "08" },
  { id: "VSPS-2026-0809", name: "Meera Patel", classSection: "Class VIII A", rollNo: "14" },
  { id: "VSPS-2026-0810", name: "Rohan Singh", classSection: "Class VIII A", rollNo: "22" },
  { id: "VSPS-2026-0901", name: "Priyesh Sharma", classSection: "Class IX A", rollNo: "01" },
  { id: "VSPS-2026-0902", name: "Ananya Roy", classSection: "Class IX A", rollNo: "02" },
  { id: "VSPS-2026-1001", name: "Vikramaditya Verma", classSection: "Class X B", rollNo: "01" },
  { id: "VSPS-2026-1002", name: "Diya Kapoor", classSection: "Class X B", rollNo: "02" }
];

export function AttendanceScreen({ role = "Admin", currentUser, students = [] }) {
  const isTeacherOrAdmin = role === "Teacher" || role === "Admin";
  const todayDate = new Date().toISOString().split("T")[0];

  const userAssignedClass = currentUser?.classSection || currentUser?.assignedClass || "Class VIII A";
  const [selectedClass, setSelectedClass] = useState(userAssignedClass);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saving, setSaving] = useState(false);

  // Filter students for the selected class
  const allStudents = students.length > 0 ? students : DEFAULT_DEMO_STUDENTS;
  const classStudents = allStudents.filter(s =>
    (s.classSection || "Class VIII A").toLowerCase() === selectedClass.toLowerCase()
  );

  // Initialize attendance statuses
  useEffect(() => {
    const loadSaved = async () => {
      const dbSavedMap = await fetchAttendanceFromDB(todayDate, selectedClass);
      const initialMap = {};
      classStudents.forEach(st => {
        initialMap[st.id] = dbSavedMap[st.id] || "Present";
      });
      setAttendanceMap(initialMap);
    };
    loadSaved();
  }, [selectedClass]);

  const toggleStatus = (studentId, name) => {
    if (!isTeacherOrAdmin) return;
    const current = attendanceMap[studentId] || "Present";
    const next = current === "Present" ? "Absent" : current === "Absent" ? "Late" : "Present";
    if (next === "Absent") {
      Alert.alert("Parent Alert Triggered 🔔", `${name}'s guardian will be notified of absence.`);
    }
    setAttendanceMap(prev => ({ ...prev, [studentId]: next }));
  };

  const handleSaveAttendance = async () => {
    if (!isTeacherOrAdmin) return;
    setSaving(true);
    const success = await saveAttendanceToDB(todayDate, selectedClass, attendanceMap, classStudents);
    setSaving(false);
    if (success) {
      Alert.alert("Attendance Saved ✅", `Attendance for ${selectedClass} (${todayDate}) submitted to Supabase Cloud.`);
    } else {
      Alert.alert("Saved Locally", `Attendance recorded locally for ${selectedClass}.`);
    }
  };

  const totalCount = classStudents.length;
  const presentCount = Object.values(attendanceMap).filter(v => v === "Present").length;
  const absentCount = Object.values(attendanceMap).filter(v => v === "Absent").length;
  const lateCount = Object.values(attendanceMap).filter(v => v === "Late").length;

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle title={isTeacherOrAdmin ? "Multi-Class Attendance Portal" : "Class Attendance Report"} />

      {/* Class Selector Bar */}
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.inputLabel}>Select Class / Section</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
          {AVAILABLE_CLASSES.map(c => {
            const isSelected = selectedClass === c;
            return (
              <Pressable
                key={c}
                onPress={() => setSelectedClass(c)}
                style={[styles.rolePickChip, isSelected && styles.rolePickChipActive]}
              >
                <Text style={[styles.rolePickText, isSelected && styles.rolePickTextActive]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Attendance Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: colors.emerald }]}>{presentCount}</Text>
          <Text style={styles.metricLabel}>Present Today</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: colors.red }]}>{absentCount}</Text>
          <Text style={styles.metricLabel}>Absent</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: colors.amber }]}>{lateCount}</Text>
          <Text style={styles.metricLabel}>Late Arrival</Text>
        </View>
      </View>

      {/* Read Only Notice for Students & Parents */}
      {!isTeacherOrAdmin && (
        <View style={styles.jsonNoticeBox}>
          <MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.blue} />
          <Text style={styles.jsonNoticeText}>
            Attendance view only. Only Class Teachers and Admins can mark attendance.
          </Text>
        </View>
      )}

      {/* Student List for Class */}
      {classStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-search-outline" size={44} color={colors.muted} />
          <Text style={styles.emptyStateText}>No students in {selectedClass}</Text>
          <Text style={styles.emptyStateSubText}>Add students in Student Management to take attendance.</Text>
        </View>
      ) : (
        classStudents.map((student) => {
          const status = attendanceMap[student.id] || "Present";
          return (
            <Pressable
              key={student.id}
              onPress={() => toggleStatus(student.id, student.name)}
              disabled={!isTeacherOrAdmin}
              style={styles.studentRow}
            >
              <View style={styles.rollCircle}>
                <Text style={styles.rollText}>{student.rollNo || "01"}</Text>
              </View>
              <View style={styles.flex}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.cardTitle}>{student.name}</Text>
                  <View style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: "900", color: colors.blue }}>{student.id}</Text>
                  </View>
                </View>
                <Text style={styles.cardBody}>{selectedClass}</Text>
              </View>
              <StatusPill status={status} />
            </Pressable>
          );
        })
      )}

      {/* Save Button for Teachers & Admins */}
      {isTeacherOrAdmin && classStudents.length > 0 && (
        <PrimaryButton
          icon="cloud-upload-outline"
          label={saving ? "Saving to Supabase..." : `Submit ${selectedClass} Attendance to Supabase`}
          onPress={handleSaveAttendance}
        />
      )}
    </View>
  );
}
