import React, { useState } from "react";
import { View, Text, Image, TextInput, Pressable, Modal, Switch, ScrollView, SafeAreaView, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function ProfileScreen({ currentUser, role, onLogout, onUpdateUser, isDarkMode, onToggleTheme, onNavigate }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || "Anand Admin");
  const [avatarInput, setAvatarInput] = useState(currentUser?.avatar || "");
  const [appAlerts, setAppAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  const roleColor = role === "Admin" ? colors.indigo : role === "Teacher" ? colors.teal : colors.blue;
  const initials = currentUser?.name ? currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "VS";

  const handleSaveProfile = () => {
    if (!nameInput.trim()) {
      Alert.alert("Required", "Name cannot be empty.");
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name: nameInput.trim(),
        avatar: avatarInput.trim()
      });
    }
    setShowEditModal(false);
    Alert.alert("Success 🎉", "Profile updated successfully!");
  };

  return (
    <View style={{ flex: 1 }}>
      <SectionTitle title="User Profile & Settings" />

      {/* Main Profile Card */}
      <View style={styles.inputCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          {currentUser?.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={{ width: 64, height: 64, borderRadius: 32 }} />
          ) : (
            <View style={[styles.avatar, { width: 64, height: 64, borderRadius: 32, backgroundColor: roleColor }]}>
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 22 }}>{initials}</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Text style={styles.cardTitle}>{currentUser?.name || "Anand Admin"}</Text>
              <View style={{ backgroundColor: roleColor, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "900", textTransform: "uppercase" }}>{role}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{currentUser?.email || "anandnimcet2020@gmail.com"}</Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
              <View style={{ backgroundColor: "#EEF2FF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderColor: "#C7D2FE", borderWidth: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: "900", color: colors.blue }}>
                  ID: {currentUser?.id || "VSPS-ADMIN-01"}
                </Text>
              </View>
            </View>
          </View>

          <Pressable onPress={() => setShowEditModal(true)} style={styles.editBtn}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.amber} />
          </Pressable>
        </View>
      </View>

      {/* Settings Section */}
      <SectionTitle title="App Settings & Preferences" />

      <View style={styles.inputCard}>
        {/* Dark / Light Mode Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name={isDarkMode ? "weather-night" : "white-balance-sunny"} size={22} color={colors.blue} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.ink }}>Dark Theme</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>Switch between Light and Dark interface</Text>
            </View>
          </View>
          <Switch value={isDarkMode} onValueChange={onToggleTheme} trackColor={{ false: "#E2E8F0", true: colors.blue }} thumbColor="#FFFFFF" />
        </View>

        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 10 }} />

        {/* Push Notifications Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#CCFBF1", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={colors.teal} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.ink }}>Push Notifications</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>Receive attendance & grade alerts</Text>
            </View>
          </View>
          <Switch value={appAlerts} onValueChange={setAppAlerts} trackColor={{ false: "#E2E8F0", true: colors.teal }} thumbColor="#FFFFFF" />
        </View>

        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 10 }} />

        {/* Email Digest Toggle */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="email-outline" size={22} color={colors.amber} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.ink }}>Weekly Email Digest</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>Get weekly fee & report summary</Text>
            </View>
          </View>
          <Switch value={emailDigest} onValueChange={setEmailDigest} trackColor={{ false: "#E2E8F0", true: colors.amber }} thumbColor="#FFFFFF" />
        </View>
      </View>

      {/* Security & Support Shortcuts */}
      <SectionTitle title="Account Security" />

      <View style={styles.inputCard}>
        <Pressable
          onPress={() => onNavigate && onNavigate("Security")}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#F3E8FF", alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="shield-lock-outline" size={22} color={colors.violet} />
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.ink }}>Security Center</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>MFA, Password & Active Sessions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={colors.muted} />
        </Pressable>
      </View>

      {/* Prominent Account Logout Button */}
      <Pressable
        onPress={onLogout}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: "#FFE4E6",
          borderColor: "#FECDD3",
          borderWidth: 1,
          borderRadius: 14,
          paddingVertical: 14,
          marginTop: 18,
          marginBottom: 10
        }}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.red} />
        <Text style={{ color: colors.red, fontSize: 15, fontWeight: "900" }}>Log Out of Account</Text>
      </Pressable>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={showEditModal} animationType="slide" transparent={false} onRequestClose={() => setShowEditModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="account-edit-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Edit Your Profile</Text>
              <Text style={styles.editModalSub}>Update your personal information</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Profile Picture / Avatar URL</Text>
              <TextInput
                style={styles.input}
                value={avatarInput}
                onChangeText={setAvatarInput}
                placeholder="https://example.com/photo.jpg"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />

              <Pressable onPress={handleSaveProfile} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="content-save-check" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Save Profile Changes</Text>
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
