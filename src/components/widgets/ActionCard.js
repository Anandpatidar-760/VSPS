import React from "react";
import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function ActionCard({ label, onPress }) {
  const icon = {
    Attendance: "clipboard-check-outline",
    Gradebook: "chart-box-outline",
    Homework: "notebook-edit-outline",
    Fees: "credit-card-outline",
    Bus: "bus-clock",
    Messages: "message-text-outline",
    Newsletters: "email-newsletter",
    Resources: "bookshelf",
    Reports: "chart-line",
    Timetable: "timetable",
    Calendar: "calendar-month-outline",
    News: "newspaper-variant-outline",
    Notifications: "bell-ring-outline",
    Transport: "bus-marker",
    Staff: "account-group-outline",
    Security: "shield-lock-outline",
    IDs: "badge-account-horizontal-outline",
    "Student Dashboard": "view-dashboard-outline"
  }[label];

  return (
    <Pressable onPress={onPress} style={styles.actionCard}>
      <MaterialCommunityIcons name={icon} size={26} color={colors.teal} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}
