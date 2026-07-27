import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, SafeAreaView, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { saveStudentToDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export const CLASS_OPTIONS = [
  "LKG",
  "UKG",
  "Class 1st",
  "Class 2nd",
  "Class 3rd",
  "Class 4th",
  "Class 5th",
  "Class 6th",
  "Class 7th",
  "Class 8th",
  "Class 9th",
  "Class 10th"
];

/**
 * Calculate next sequential Roll Number for a class based on database records.
 * e.g., if Class 1st has Roll Nos 1, 2, 3 -> returns "04".
 * If Class 2nd has Roll No 1 -> returns "02".
 */
export function calculateNextRollNo(selectedClass, existingStudents = []) {
  if (!selectedClass) return "01";
  const normClass = selectedClass.trim().toLowerCase();

  const classStudents = existingStudents.filter((s) => {
    const sClass = (s.classSection || "").trim().toLowerCase();
    return sClass === normClass || sClass.startsWith(normClass);
  });

  if (classStudents.length === 0) return "01";

  let maxRoll = 0;
  classStudents.forEach((s) => {
    const rawVal = String(s.rollNo || s.roll_no || "0").trim();
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > maxRoll) {
      maxRoll = parsed;
    }
  });

  const next = maxRoll + 1;
  return next < 10 ? `0${next}` : `${next}`;
}

export function StudentsManagerScreen({ students = [], onUpdate, onDelete, onRefresh }) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddClassDropdown, setShowAddClassDropdown] = useState(false);
  const [showEditClassDropdown, setShowEditClassDropdown] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Form states (Add & Edit)
  const [fStudentId, setFStudentId] = useState("");
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fClass, setFClass] = useState("Class 1st");
  const [fRoll, setFRoll] = useState("01");
  const [fRole, setFRole] = useState("Student");

  const handleSelectAddClass = (selectedClass) => {
    setFClass(selectedClass);
    setShowAddClassDropdown(false);
    // Automatically calculate exact database next roll number
    const autoRoll = calculateNextRollNo(selectedClass, students);
    setFRoll(autoRoll);
  };

  const handleSelectEditClass = (selectedClass) => {
    setFClass(selectedClass);
    setShowEditClassDropdown(false);
  };

  const openAdd = () => {
    const defaultId = `VSPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialClass = "Class 1st";
    const initialRoll = calculateNextRollNo(initialClass, students);

    setFStudentId(defaultId);
    setFName("");
    setFEmail("");
    setFPhone("");
    setFClass(initialClass);
    setFRoll(initialRoll);
    setFRole("Student");
    setShowAddClassDropdown(false);
    setShowAddModal(true);
  };

  const submitAdd = async () => {
    if (!fStudentId.trim()) { Alert.alert("Required", "Official Student ID is required."); return; }
    if (!fName.trim()) { Alert.alert("Required", "Full name is required."); return; }
    if (!fEmail.trim() || !fEmail.includes("@")) { Alert.alert("Required", "Valid email address is required."); return; }
    try {
      await saveStudentToDB({
        id: fStudentId.trim(),
        onboardingCode: fStudentId.trim(),
        name: fName.trim(),
        email: fEmail.trim(),
        phone: fPhone.trim(),
        classSection: fClass.trim(),
        rollNo: fRoll.trim(),
        role: fRole
      });
      setShowAddModal(false);
      if (onRefresh) await onRefresh();
      Alert.alert("Student Enrolled ✅", `Registered Student ID "${fStudentId.trim()}" (Roll No: ${fRoll.trim()}) for ${fName.trim()} in Supabase Cloud.`);
    } catch (err) {
      Alert.alert("Create Error", err.message || "Failed to create student.");
    }
  };

  const openEdit = (student) => {
    setEditTarget(student);
    setFStudentId(student.id || student.onboardingCode || "");
    setFName(student.name || "");
    setFEmail(student.email || "");
    setFPhone(student.phone || "");
    setFClass(student.classSection || "Class 1st");
    setFRoll(student.rollNo || "01");
    setFRole(student.role || "Student");
    setShowEditClassDropdown(false);
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!fStudentId.trim()) { Alert.alert("Required", "Student ID cannot be empty."); return; }
    if (!fName.trim()) { Alert.alert("Required", "Name cannot be empty."); return; }
    if (!fEmail.trim() || !fEmail.includes("@")) { Alert.alert("Required", "Enter a valid email."); return; }
    await onUpdate({
      ...editTarget,
      id: fStudentId.trim(),
      onboardingCode: fStudentId.trim(),
      name: fName.trim(),
      email: fEmail.trim(),
      phone: fPhone.trim(),
      classSection: fClass.trim(),
      rollNo: fRoll.trim(),
      role: fRole
    });
    setShowEditModal(false);
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      "Delete Student Record",
      `Are you sure you want to remove ${student.name} (${student.id}) from Supabase?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (onDelete) await onDelete(student.id);
            Alert.alert("Deleted 🗑️", `Removed ${student.name} from Supabase Cloud.`);
          }
        }
      ]
    );
  };

  // Filter strictly for Students (exclude Teachers & Admins)
  const onlyStudents = students.filter(s =>
    !s.role || s.role === "Student" || s.role === ""
  );

  const filteredStudents = onlyStudents.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle title="Enrolled Student Directory" />

      {/* Add New Student Action */}
      <PrimaryButton
        icon="account-plus-outline"
        label="+ Issue & Enroll New Student"
        onPress={openAdd}
      />

      {/* Search Input */}
      <View style={{ marginTop: 14, marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="Search student by ID, name, or email..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Student List Rows */}
      {filteredStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-off-outline" size={48} color={colors.line} />
          <Text style={styles.emptyStateText}>No students found.</Text>
          <Text style={styles.emptyStateSubText}>Tap "+ Issue & Enroll New Student" above to register a student in Supabase.</Text>
        </View>
      ) : (
        filteredStudents.map((student) => (
          <View key={student.id} style={styles.crudRow}>
            <View style={[styles.avatar, { width: 46, height: 46, borderRadius: 8 }]}>
              <Text style={styles.avatarText}>
                {student.name ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "VS"}
              </Text>
            </View>
            <View style={styles.flex}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.cardTitle}>{student.name}</Text>
                <View style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: "900", color: colors.blue }}>{student.id}</Text>
                </View>
              </View>
              <Text style={styles.cardBody}>
                {student.classSection || "Class 1st"} · Roll No: {student.rollNo || "01"}
              </Text>
              <Text style={styles.idMetaSub}>{student.email} | {student.phone || "No phone"}</Text>
            </View>

            <View style={styles.crudActions}>
              <Pressable onPress={() => openEdit(student)} style={styles.editBtn}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.amber} />
              </Pressable>
              <Pressable onPress={() => handleDeleteStudent(student)} style={styles.deleteBtn}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* ADD STUDENT MODAL */}
      <Modal visible={showAddModal} animationType="slide" transparent={false} onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll} nestedScrollEnabled={true}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="badge-account-horizontal-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Issue Official Student ID</Text>
              <Text style={styles.editModalSub}>Creates record in Supabase PostgreSQL Cloud</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Official Student ID / Member ID *</Text>
              <TextInput
                style={[styles.input, { fontWeight: "800", color: colors.blue, backgroundColor: "#F8FAFC" }]}
                value={fStudentId}
                onChangeText={setFStudentId}
                autoCapitalize="characters"
                placeholder="e.g. VSPS-2026-0815"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholderTextColor="#94A3B8" placeholder="e.g. Priyesh Sharma" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94A3B8" placeholder="priyesh@vsps.edu" />

              {/* Class & Roll No Section */}
              <View style={styles.rowInputs}>
                {/* Full Width Chevron Dropdown Box */}
                <View style={{ flex: 1.8 }}>
                  <Text style={styles.inputLabel}>Select Class *</Text>
                  <Pressable
                    onPress={() => setShowAddClassDropdown(!showAddClassDropdown)}
                    style={[
                      styles.input,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#EEF2FF",
                        borderColor: colors.blue,
                        borderWidth: 1.5,
                        paddingHorizontal: 12
                      }
                    ]}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: colors.blue }}>{fClass}</Text>
                    <Ionicons
                      name={showAddClassDropdown ? "chevron-up-circle" : "chevron-down-circle"}
                      size={22}
                      color={colors.blue}
                    />
                  </Pressable>
                </View>

                {/* Database Auto-Calculated Non-Editable Roll Number */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Roll No. (Auto)</Text>
                  <View style={[styles.input, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }]}>
                    <Text style={{ fontSize: 15, fontWeight: "900", color: colors.emerald }}>{fRoll}</Text>
                    <MaterialCommunityIcons name="lock-outline" size={16} color={colors.emerald} />
                  </View>
                </View>
              </View>

              {/* INLINE EXPANDABLE CLASS DROPDOWN LIST */}
              {showAddClassDropdown && (
                <View style={{ backgroundColor: "#FFFFFF", borderColor: colors.blue, borderWidth: 1.5, borderRadius: 12, padding: 8, marginTop: 4, marginBottom: 12, maxHeight: 240, elevation: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: "800", color: colors.muted, marginBottom: 6, paddingHorizontal: 6 }}>
                    SELECT CLASS FROM LIST:
                  </Text>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                    {CLASS_OPTIONS.map((c) => {
                      const isSelected = fClass === c;
                      const nextRollForClass = calculateNextRollNo(c, students);
                      return (
                        <Pressable
                          key={c}
                          onPress={() => handleSelectAddClass(c)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            borderRadius: 8,
                            backgroundColor: isSelected ? "#EEF2FF" : "transparent",
                            marginBottom: 4
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: isSelected ? "900" : "600", color: isSelected ? colors.blue : colors.ink }}>
                            {c}
                          </Text>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ fontSize: 12, fontWeight: "700", color: colors.emerald }}>
                              Next Roll: {nextRollForClass}
                            </Text>
                            {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.blue} />}
                          </View>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholderTextColor="#94A3B8" placeholder="+91 98765 00000" />

              <Pressable onPress={submitAdd} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Issue Student ID in Supabase</Text>
              </Pressable>

              <Pressable onPress={() => setShowAddModal(false)} style={styles.closeAuthBtn}>
                <Text style={styles.closeAuthText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* EDIT MODAL */}
      <Modal visible={showEditModal} animationType="slide" transparent={false} onRequestClose={() => setShowEditModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll} nestedScrollEnabled={true}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-edit-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Edit Student Details</Text>
              <Text style={styles.editModalSub}>ID: {editTarget?.id}</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Official Student ID / Member ID *</Text>
              <TextInput
                style={[styles.input, { fontWeight: "800", color: colors.blue }]}
                value={fStudentId}
                onChangeText={setFStudentId}
                autoCapitalize="characters"
                placeholder="e.g. VSPS-2026-0815"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholderTextColor="#94A3B8" placeholder="Student name" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94A3B8" placeholder="email@vsps.edu" />

              <View style={styles.rowInputs}>
                {/* Chevron Dropdown Box */}
                <View style={{ flex: 1.8 }}>
                  <Text style={styles.inputLabel}>Select Class *</Text>
                  <Pressable
                    onPress={() => setShowEditClassDropdown(!showEditClassDropdown)}
                    style={[
                      styles.input,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justify: "space-between",
                        backgroundColor: "#EEF2FF",
                        borderColor: colors.blue,
                        borderWidth: 1.5,
                        paddingHorizontal: 12
                      }
                    ]}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: colors.blue }}>{fClass}</Text>
                    <Ionicons
                      name={showEditClassDropdown ? "chevron-up-circle" : "chevron-down-circle"}
                      size={22}
                      color={colors.blue}
                    />
                  </Pressable>
                </View>

                {/* Non-Editable Roll Number */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Roll No. (Auto)</Text>
                  <View style={[styles.input, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }]}>
                    <Text style={{ fontSize: 15, fontWeight: "900", color: colors.emerald }}>{fRoll}</Text>
                    <MaterialCommunityIcons name="lock-outline" size={16} color={colors.emerald} />
                  </View>
                </View>
              </View>

              {/* INLINE EXPANDABLE CLASS DROPDOWN LIST */}
              {showEditClassDropdown && (
                <View style={{ backgroundColor: "#FFFFFF", borderColor: colors.blue, borderWidth: 1.5, borderRadius: 12, padding: 8, marginTop: 4, marginBottom: 12, maxHeight: 240, elevation: 4 }}>
                  <Text style={{ fontSize: 12, fontWeight: "800", color: colors.muted, marginBottom: 6, paddingHorizontal: 6 }}>
                    SELECT CLASS FROM LIST:
                  </Text>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                    {CLASS_OPTIONS.map((c) => {
                      const isSelected = fClass === c;
                      return (
                        <Pressable
                          key={c}
                          onPress={() => handleSelectEditClass(c)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justify: "space-between",
                            paddingVertical: 12,
                            paddingHorizontal: 14,
                            borderRadius: 8,
                            backgroundColor: isSelected ? "#EEF2FF" : "transparent",
                            marginBottom: 4
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: isSelected ? "900" : "600", color: isSelected ? colors.blue : colors.ink }}>
                            {c}
                          </Text>
                          {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.blue} />}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholderTextColor="#94A3B8" placeholder="+91 98765 00000" />

              <Pressable onPress={submitEdit} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="content-save-check" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Save Changes to Supabase</Text>
              </Pressable>

              <Pressable onPress={() => setShowEditModal(false)} style={styles.closeAuthBtn}>
                <Text style={styles.closeAuthText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
