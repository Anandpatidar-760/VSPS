import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { staffDirectory } from "../constants/mockData";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function StaffDirectoryScreen() {
  return (
    <View>
      <SectionTitle title="Staff Directory" />
      {staffDirectory.map((staff) => (
        <View key={staff.contact} style={styles.resourceRow}>
          <View style={[styles.avatar, styles.staffAvatar]}>
            <Text style={styles.avatarText}>{staff.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{staff.name}</Text>
            <Text style={styles.cardBody}>{staff.role}</Text>
            <Text style={styles.idMetaSub}>{staff.contact} | {staff.phone}</Text>
          </View>
          <Ionicons name="call-outline" size={22} color={colors.blue} />
        </View>
      ))}
    </View>
  );
}
