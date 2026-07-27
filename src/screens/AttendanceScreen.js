import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { StatusPill } from "../components/common/StatusPill";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { attendanceRows } from "../constants/mockData";
import { styles } from "../styles/styles";

export function AttendanceScreen() {
  const [rows, setRows] = useState(attendanceRows);

  function toggleStatus(id) {
    setRows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = item.status === "Present" ? "Absent" : item.status === "Absent" ? "Late" : "Present";
        if (next === "Absent") {
          Alert.alert("Parent attendance alert", `${item.name}'s guardian will be notified instantly.`);
        }
        return { ...item, status: next };
      })
    );
  }

  return (
    <View>
      <SectionTitle title="Attendance Tracker" />
      {rows.map((item) => (
        <Pressable key={item.id} onPress={() => toggleStatus(item.id)} style={styles.studentRow}>
          <View style={styles.rollCircle}>
            <Text style={styles.rollText}>{item.roll}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardBody}>Class VIII A</Text>
          </View>
          <StatusPill status={item.status} />
        </Pressable>
      ))}
      <PrimaryButton icon="content-save-outline" label="Save Attendance & Notify Parents" onPress={() => Alert.alert("Saved", "Attendance is recorded and absence alerts were sent to linked guardians.")} />
    </View>
  );
}
