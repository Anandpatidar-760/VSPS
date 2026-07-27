import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function ActionCard({ label, onPress }) {
  const iconConfig = {
    Attendance: ["clipboard-check-outline", colors.teal, "#CCFBF1"],
    Gradebook: ["chart-box-outline", colors.blue, "#EEF2FF"],
    Homework: ["notebook-edit-outline", colors.violet, "#F3E8FF"],
    Fees: ["credit-card-outline", colors.emerald, "#D1FAE5"],
    Bus: ["bus-clock", colors.amber, "#FEF3C7"],
    Messages: ["message-text-outline", colors.blue, "#EEF2FF"],
    Newsletters: ["email-newsletter", colors.teal, "#CCFBF1"],
    Resources: ["bookshelf", colors.violet, "#F3E8FF"],
    Reports: ["chart-line", colors.blue, "#EEF2FF"],
    Timetable: ["timetable", colors.indigo, "#EEF2FF"],
    Calendar: ["calendar-month-outline", colors.amber, "#FEF3C7"],
    News: ["newspaper-variant-outline", colors.blue, "#EEF2FF"],
    Notifications: ["bell-ring-outline", colors.red, "#FFE4E6"],
    Transport: ["bus-marker", colors.teal, "#CCFBF1"],
    Staff: ["account-group-outline", colors.indigo, "#EEF2FF"],
    Security: ["shield-lock-outline", colors.violet, "#F3E8FF"],
    IDs: ["badge-account-horizontal-outline", colors.blue, "#EEF2FF"],
    "Student Dashboard": ["view-dashboard-outline", colors.indigo, "#EEF2FF"]
  }[label] || ["grid-large", colors.blue, "#EEF2FF"];

  const [iconName, iconColor, iconBg] = iconConfig;

  return (
    <Pressable onPress={onPress} style={styles.actionCard}>
      <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: iconBg, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <MaterialCommunityIcons name={iconName} size={22} color={iconColor} />
      </View>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}
