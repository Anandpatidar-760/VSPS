import React from "react";
import { View, Text } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { StatsRow } from "../components/common/StatsRow";
import { HomeworkScreen } from "./HomeworkScreen";
import { timetable } from "../constants/mockData";
import { styles } from "../styles/styles";

export function DashboardScreen() {
  return (
    <View>
      <SectionTitle title="Student Dashboard" />
      <StatsRow />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Timetable</Text>
        {timetable.slice(0, 4).map(([time, subject, room]) => (
          <View key={`${time}-${subject}`} style={styles.timetableRow}>
            <Text style={styles.timeText}>{time}</Text>
            <View style={styles.flex}>
              <Text style={styles.subjectText}>{subject}</Text>
              <Text style={styles.cardBody}>{room}</Text>
            </View>
          </View>
        ))}
      </View>
      <HomeworkScreen role="Student" />
    </View>
  );
}
