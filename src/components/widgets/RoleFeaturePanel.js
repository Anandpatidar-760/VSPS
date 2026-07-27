import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function RoleFeaturePanel({ role }) {
  const roleCopy = {
    Parent: [
      ["Fee Management", "Outstanding dues, automated receipts, and secure card, UPI, or net banking payments."],
      ["Attendance Alerts", "Instant parent notification when a linked child is marked absent."],
      ["Performance Tracking", "Report cards, continuous assessments, and teacher feedback in one place."]
    ],
    Student: [
      ["Homework & Assignments", "Daily tasks, submission deadlines, and downloadable digital worksheets."],
      ["Timetable Access", "Daily schedules with room and lab locations."],
      ["Learning Resources", "E-books, video tutorials, study packs, and revision materials."]
    ],
    Teacher: [
      ["Attendance Marking", "Mobile attendance for assigned classes without paper registers."],
      ["Grade Management", "Upload scores and remarks directly into the school information system."],
      ["Parent Communication", "Send messages, newsletters, and circulars to guardians."]
    ],
    Admin: [
      ["Push Notifications", "Target emergency, event, transport, or closure alerts to selected groups."],
      ["Transport Tracking", "Monitor GPS-enabled school buses and route safety."],
      ["Staff Directories", "Maintain teaching and administrative contacts centrally."]
    ]
  };

  return (
    <View style={styles.featurePanel}>
      {roleCopy[role].map(([title, body]) => (
        <View key={title} style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardBody}>{body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
