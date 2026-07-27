import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { loadTeachersFromDB, saveTeacherToDB, updateTeacherInDB, deleteTeacherFromDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

const AVAILABLE_CLASSES = ["Class VIII A", "Class IX A", "Class X B", "Class XI C"];

export function StaffDirectoryScreen({ role = "Student" }) {
  const isAdmin = role === "Admin";
  const [teachers, setTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Form states
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fSubject, setFSubject] = useState("Science");
  const [fDept, setFDept] = useState("Academics");
  const [fClass, setFClass] = useState("Class VIII A");

  const refreshTeachers = async () => {
    const list = await loadTeachersFromDB();
    setTeachers(list);
  };

  useEffect(() => {
    refreshTeachers();
  }, []);

  const openAdd = () => {
    setFName("");
    setFEmail("");
    setFPhone("");
    setFSubject("Mathematics");
    setFDept("Academics");
    setFClass("Class IX A");
    setShowAddModal(true);
  };

  const submitAdd = async () => {
    if (!fName.trim()) { Alert.alert("Required", "Teacher name is required."); return; }
    if (!fEmail.trim() || !fEmail.includes("@")) { Alert.alert("Required", "Valid email address is required."); return; }
    try {
      await saveTeacherToDB({
        name: fName.trim(),
        email: fEmail.trim(),
        phone: fPhone.trim(),
        subject: fSubject.trim(),
        department: fDept.trim(),
        assignedClass: fClass
      });
      setShowAddModal(false);
      await refreshTeachers();
      Alert.alert("Teacher Registered ✅", `Added ${fName.trim()} in Supabase Cloud.`);
    } catch (err) {
      Alert.alert("Create Error", err.message || "Failed to create teacher.");
    }
  };

  const openEdit = (t) => {
    setEditTarget(t);
    setFName(t.name || "");
    setFEmail(t.email || "");
    setFPhone(t.phone || "");
    setFSubject(t.subject || "");
    setFDept(t.department || "Academics");
    setFClass(t.assignedClass || "Class VIII A");
    setShowEditModal(true);
  };

  const submitEdit = async () => {
    if (!fName.trim()) { Alert.alert("Required", "Name cannot be empty."); return; }
    await updateTeacherInDB({
      ...editTarget,
      name: fName.trim(),
      email: fEmail.trim(),
      phone: fPhone.trim(),
      subject: fSubject.trim(),
      department: fDept.trim(),
      assignedClass: fClass
    });
    setShowEditModal(false);
    await refreshTeachers();
    Alert.alert("Teacher Updated ✅", `Updated ${fName.trim()} in Supabase.`);
  };

  const handleDelete = (t) => {
    Alert.alert(
      "Delete Teacher",
      `Are you sure you want to remove ${t.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTeacherFromDB(t.id);
            await refreshTeachers();
            Alert.alert("Deleted 🗑️", `Removed ${t.name} from Supabase.`);
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle title="Teachers & Staff Directory" />

      {/* Admin Add Action */}
      {isAdmin && (
        <PrimaryButton
          icon="account-plus-outline"
          label="+ Add New Teacher / Staff (Admin)"
          onPress={openAdd}
        />
      )}

      {teachers.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-group-outline" size={48} color={colors.line} />
          <Text style={styles.emptyStateText}>No staff members found.</Text>
        </View>
      ) : (
        teachers.map((staff) => {
          const initials = staff.name ? staff.name.split(" ").map(p => p[0]).join("").slice(0, 2) : "TS";
          return (
            <View key={staff.id || staff.email} style={styles.crudRow}>
              <View style={[styles.avatar, styles.staffAvatar]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.flex}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.cardTitle}>{staff.name}</Text>
                  <View style={{ backgroundColor: "#CCFBF1", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: "900", color: colors.teal }}>{staff.assignedClass || "Class VIII A"}</Text>
                  </View>
                </View>
                <Text style={styles.cardBody}>{staff.subject} Teacher · {staff.department}</Text>
                <Text style={styles.idMetaSub}>{staff.email} | {staff.phone}</Text>
              </View>

              {isAdmin ? (
                <View style={styles.crudActions}>
                  <Pressable onPress={() => openEdit(staff)} style={styles.editBtn}>
                    <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.amber} />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(staff)} style={styles.deleteBtn}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
                  </Pressable>
                </View>
              ) : (
                <Ionicons name="call-outline" size={22} color={colors.blue} />
              )}
            </View>
          );
        })
      )}

      {/* CREATE TEACHER MODAL */}
      <Modal visible={showAddModal} animationType="slide" transparent={false} onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-plus-outline" size={36} color={colors.teal} />
              <Text style={styles.editModalTitle}>Add New Teacher / Staff</Text>
              <Text style={styles.editModalSub}>Registers record in Supabase Cloud</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholder="e.g. Vikram Singh" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholder="vikram.teacher@vsps.edu" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput style={styles.input} value={fSubject} onChangeText={setFSubject} placeholder="e.g. Mathematics, Science" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Assigned Class</Text>
              <View style={styles.rolePickerRow}>
                {AVAILABLE_CLASSES.map(c => (
                  <Pressable key={c} onPress={() => setFClass(c)} style={[styles.rolePickChip, fClass === c && styles.rolePickChipActive]}>
                    <Text style={[styles.rolePickText, fClass === c && styles.rolePickTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholder="+91 98765 00000" placeholderTextColor="#94A3B8" />

              <Pressable onPress={submitAdd} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Save Teacher in Supabase</Text>
              </Pressable>

              <Pressable onPress={() => setShowAddModal(false)} style={styles.closeAuthBtn}>
                <Text style={styles.closeAuthText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* EDIT TEACHER MODAL */}
      <Modal visible={showEditModal} animationType="slide" transparent={false} onRequestClose={() => setShowEditModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-edit-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Edit Teacher Details</Text>
              <Text style={styles.editModalSub}>{editTarget?.name}</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={fName} onChangeText={setFName} placeholder="Full Name" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput style={styles.input} value={fEmail} onChangeText={setFEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Email" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput style={styles.input} value={fSubject} onChangeText={setFSubject} placeholder="Subject" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Assigned Class</Text>
              <View style={styles.rolePickerRow}>
                {AVAILABLE_CLASSES.map(c => (
                  <Pressable key={c} onPress={() => setFClass(c)} style={[styles.rolePickChip, fClass === c && styles.rolePickChipActive]}>
                    <Text style={[styles.rolePickText, fClass === c && styles.rolePickTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput style={styles.input} value={fPhone} onChangeText={setFPhone} keyboardType="phone-pad" placeholder="Phone" placeholderTextColor="#94A3B8" />

              <Pressable onPress={submitEdit} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="content-save-check" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Save Changes in Supabase</Text>
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
