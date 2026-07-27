import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function Header({ role, currentUser, onOpenProfile, onOpenAuth }) {
  const roleColor = role === "Admin" ? colors.indigo : role === "Teacher" ? colors.teal : colors.blue;
  const initials = currentUser?.name ? currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "VS";

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image source={require("../../../assets/logo.png")} style={styles.logoImage} resizeMode="contain" />
        <View style={styles.brandText}>
          <Text style={styles.schoolName} numberOfLines={1} ellipsizeMode="tail">
            Vidhya Sager Public School
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
            <Text style={styles.schoolMeta} numberOfLines={1}>
              {currentUser ? `Welcome, ${currentUser.name}` : "Smart campus mobile app"}
            </Text>
            <View style={{ backgroundColor: roleColor, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 9, fontWeight: "900", textTransform: "uppercase" }}>{role}</Text>
            </View>
          </View>
        </View>

        {currentUser ? (
          <Pressable onPress={onOpenProfile} style={{ alignItems: "center", justifyContent: "center" }}>
            {currentUser.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: colors.blue }} />
            ) : (
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.blue, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 13 }}>{initials}</Text>
              </View>
            )}
          </Pressable>
        ) : (
          <Pressable onPress={onOpenAuth} style={styles.loginBtnHeader}>
            <Ionicons name="person-circle-outline" size={17} color="#FFFFFF" />
            <Text style={styles.loginBtnHeaderText}>Login / Sign Up</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
