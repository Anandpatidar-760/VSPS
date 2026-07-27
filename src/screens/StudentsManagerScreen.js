import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, SafeAreaView, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { saveStudentToDB } from "../../storage";
import { colors, roles } from "../constants/theme";
import { styles } from "../styles/styles";

export function StudentsManagerScreen({ students = [], onUpdate, onDelete, onRefresh }) {
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Search / filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Form states (Add & Edit)
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fClass, setFClass] = useState("Class VIII A");
  const [fRoll, setFRoll] = useState("01");
  const [fRole, setFRole] = useState("Student");
  const [fPassword, setFPassword] = useState("password123");

  const openAdd = () => {
    setFName("");
    setFEmail("");
    setFPhone("");
    setFClass("Class VIII A");
    setFRoll("01");
    setFRole("Student");
    setFPassword("password123");
    setShowAddModal(true);
  };

  const submitAdd = async () => {
    if (!fName.trim()) { Alert.alert("Required", "Full name is required."); return; }
    if (!fEmail.trim() || !fEmail.includes("@")) { Alert.alert("Required", "Valid email address is required."); return; }
    try {
      await saveStudentToDB({
        name: fName.trim(),
        email: fEmail.trim(),
        phone: fPhone.trim(),
        classSection: fClass.trim(),
        rollNo: fRoll.trim(),
        role: fRole,
        password: fPassword
      });
      setShowAddModal(false);
      if (onRefresh) await onRefresh();
      Alert.alert("Success 🎉", `Registered ${fName.trim()} in Supabase Cloud & Local DB.`);
    } catch (err) {
      Alert.alert("Create Error", err.message || "Failed to create student.");
    }
  };

  const openEdit = (student) => {
    setEditTarget(student);
    setFName(student.name || "");
    setFEmail(student.email || "");
    setFPhone(student.phone || "");
    setFClass(student.classSection || "");
    setFRoll(student.rollNo || "");
    setFRole(student.role || "Student");
    setFPassword(student.password || "");
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!fName.trim()) { Alert.alert("Required", "Name cannot be empty."); return; }
    if (!fEmail.trim() || !fEmail.includes("@")) { Alert.alert("Required", "Enter a valid email."); return; }
    await onUpdate({
      ...editTarget,
      name: fName.trim(),
      email: fEmail.trim(),
      phone: fPhone.trim(),
      classSection: fClass.trim(),
      rollNo: fRoll.trim(),
      role: fRole,
      password: fPassword
    });
    setShowEditModal(false);
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <SectionTitle title="Student Management" />

      {/* Supabase Cloud Live Banner */}
      <View style={styles.dbBanner}>
        <MaterialCommunityIcons name="cloud-check-outline" size={24} color={colors.teal} />
        <View style={styles.flex}>
          <Text style={styles.dbBannerText}>
            Supabase Cloud Connected · {students.length} Total Records
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 1 }}>
            PostgreSQL DB synced with Local SQLite Cache
          </Text>
        </View>
        <Pressable onPress={onRefresh} style={styles.refreshBtn}>
          <MaterialCommunityIcons name="refresh" size={16} color={colors.blue} />
          <Text style={styles.refreshBtnText}>Sync</Text>
        </Pressable>
      </View>

      {/* Add New Student Action */}
      <PrimaryButton
        icon="account-plus-outline"
        label="+ Add New Member to Supabase"
        onPress={openAdd}
      />

      {/* Search Input */}
      <View style={{ marginTop: 14, marginBottom: 6 }}>
        <TextInput
          style={styles.input}
          placeholder="Search member by name, email or role..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* CRUD Legend */}
      <View style={styles.crudLegend}>
        {[
          ["C", "Create (Add Member)", colors.green],
          ["R", "Read (Synced list)", colors.blue],
          ["U", "Update (Edit)", colors.amber],
          ["D", "Delete (Remove)", colors.red]
        ].map(([op, label, color]) => (
          <View key={op} style={styles.crudItem}>
            <View style={[styles.crudBadge, { backgroundColor: color }]}>
              <Text style={styles.crudBadgeText}>{op}</Text>
            </View>
            <Text style={styles.crudLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Student List Rows */}
      {filteredStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-off-outline" size={48} color={colors.line} />
          <Text style={styles.emptyStateText}>No members found.</Text>
          <Text style={styles.emptyStateSubText}>Tap "+ Add New Member" above to create one in Supabase.</Text>
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
              <Text style={styles.cardTitle}>{student.name}</Text>
              <Text style={styles.crudRowMeta}>{student.classSection} · Roll {student.rollNo}</Text>
              <Text style={styles.idMetaSub}>{student.email}</Text>
              <View style={styles.rolePillRow}>
                <View style={[styles.rolePill, { backgroundColor: student.role === "Admin" ? colors.violet : student.role === "Teacher" ? colors.teal : colors.blue }]}>
                  <Text style={styles.rolePillText}>{student.role}</Text>
                </View>
              </View>
            </View>
            <View style={styles.crudActions}>
              <Pressable onPress={() => openEdit(student)} style={styles.editBtn}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.amber} />
              </Pressable>
              <Pressable onPress={() => onDelete(student)} style={styles.deleteBtn}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* CREATE MODAL */}
      <Modal visible={showAddModal} animationType="slide" transparent={false} onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-plus-outline" size={36} color={colors.teal} />
              <Text style={styles.editModalTitle}>Add New Member</Text>
              <Text style={styles.editModalSub}>Creates record in Supabase PostgreSQL Cloud</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholderTextColor="#94A3B8" placeholder="e.g. Priyesh Sharma" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94A3B8" placeholder="priyesh@vsps.edu" />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Class & Section</Text>
                  <TextInput style={styles.input} value={fClass} onChangeText={setFClass} placeholderTextColor="#94A3B8" placeholder="e.g. Class IX A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Roll No.</Text>
                  <TextInput style={styles.input} value={fRoll} onChangeText={setFRoll} keyboardType="numeric" placeholderTextColor="#94A3B8" placeholder="e.g. 15" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholderTextColor="#94A3B8" placeholder="+91 98765 00000" />

              <Text style={styles.inputLabel}>Campus Role</Text>
              <View style={styles.rolePickerRow}>
                {roles.map((r) => (
                  <Pressable key={r} onPress={() => setFRole(r)} style={[styles.rolePickChip, fRole === r && styles.rolePickChipActive]}>
                    <Text style={[styles.rolePickText, fRole === r && styles.rolePickTextActive]}>{r}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Default Password</Text>
              <TextInput style={styles.input} value={fPassword} onChangeText={setFPassword} secureTextEntry placeholderTextColor="#94A3B8" placeholder="Set password" />

              <Pressable onPress={submitAdd} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Create Member in Supabase</Text>
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
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-edit-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Edit Member</Text>
              <Text style={styles.editModalSub}>ID: {editTarget?.id}</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholderTextColor="#94A3B8" placeholder="Student name" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94A3B8" placeholder="email@vsps.edu" />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Class & Section</Text>
                  <TextInput style={styles.input} value={fClass} onChangeText={setFClass} placeholderTextColor="#94A3B8" placeholder="e.g. Class IX A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Roll No.</Text>
                  <TextInput style={styles.input} value={fRoll} onChangeText={setFRoll} keyboardType="numeric" placeholderTextColor="#94A3B8" placeholder="e.g. 14" />
                </View>
              </View>

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholderTextColor="#94A3B8" placeholder="+91 98765 00000" />

              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.rolePickerRow}>
                {roles.map((r) => (
                  <Pressable key={r} onPress={() => setFRole(r)} style={[styles.rolePickChip, fRole === r && styles.rolePickChipActive]}>
                    <Text style={[styles.rolePickText, fRole === r && styles.rolePickTextActive]}>{r}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} value={fPassword} onChangeText={setFPassword} secureTextEntry placeholderTextColor="#94A3B8" placeholder="Leave unchanged or set new password" />

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
