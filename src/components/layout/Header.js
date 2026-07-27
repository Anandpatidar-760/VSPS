import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function Header({ role, currentUser, sessionMinutes, onLogout, onOpenAuth }) {
  const roleColor = role === "Admin" ? colors.violet : role === "Teacher" ? colors.teal : colors.blue;

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image source={require("../../../assets/logo.png")} style={styles.logoImage} resizeMode="contain" />
        <View style={styles.brandText}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={styles.schoolName}>Vidhya Sager Public School</Text>
            <View style={{ backgroundColor: roleColor, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "900", textTransform: "uppercase" }}>{role}</Text>
            </View>
          </View>
          <Text style={styles.schoolMeta}>
            {currentUser ? `Welcome, ${currentUser.name}` : "Smart campus mobile app"}
          </Text>
        </View>
        {currentUser ? (
          <Pressable onPress={onLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={16} color={colors.red} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onOpenAuth} style={styles.loginBtnHeader}>
            <Ionicons name="person-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.loginBtnHeaderText}>Login / Sign Up</Text>
          </Pressable>
        )}
      </View>
      {currentUser && (
        <View style={styles.sessionStrip}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.teal} />
          <Text style={styles.sessionText}>Secure session auto-locks in {sessionMinutes} min</Text>
          <Pressable onPress={onOpenAuth}>
            <Text style={styles.sessionLink}>Verify MFA</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
