import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function DigitalIdsScreen({ students = [], currentUser }) {
  return (
    <View>
      <SectionTitle title="Digital ID Cards" />
      <View style={styles.jsonFileBanner}>
        <MaterialCommunityIcons name="database-check-outline" size={24} color={colors.teal} />
        <View style={styles.flex}>
          <Text style={styles.jsonFileTitle}>Storage: Local SQLite Database</Text>
          <Text style={styles.jsonFileUri}>vsps_school.db · Persistent across restarts</Text>
          <Text style={styles.jsonCountText}>Total Registered Students: {students.length}</Text>
        </View>
      </View>

      {students.map((student) => {
        const isCurrent = currentUser && (currentUser.id === student.id || currentUser.email === student.email);
        return (
          <View key={student.id || student.email} style={[styles.idCard, isCurrent && styles.idCardHighlight]}>
            {isCurrent && (
              <View style={styles.yourBadge}>
                <Text style={styles.yourBadgeText}>CURRENTLY LOGGED IN</Text>
              </View>
            )}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.name ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "VS"}
              </Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.idName}>{student.name}</Text>
              <Text style={styles.idMeta}>{student.classSection || "Student"} - Roll {student.rollNo || "01"}</Text>
              <Text style={styles.idMeta}>ID: {student.id}</Text>
              <Text style={styles.idMetaSub}>{student.email}</Text>
            </View>
            <Image source={require("../../assets/logo.png")} style={styles.idLogo} resizeMode="contain" />
          </View>
        );
      })}

      <View style={styles.idCard}>
        <View style={[styles.avatar, styles.staffAvatar]}>
          <Text style={styles.avatarText}>MS</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.idName}>Meera Sharma</Text>
          <Text style={styles.idMeta}>Science Teacher</Text>
          <Text style={styles.idMeta}>ID: VSPS-STF-113</Text>
        </View>
        <Image source={require("../../assets/logo.png")} style={styles.idLogo} resizeMode="contain" />
      </View>
    </View>
  );
}
