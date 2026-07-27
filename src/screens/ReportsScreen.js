import React from "react";
import { View, Text } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { feedback } from "../constants/mockData";
import { styles } from "../styles/styles";

export function ReportsScreen() {
  return (
    <View>
      <SectionTitle title="Progress Reports" />
      <View style={styles.reportCard}>
        <Text style={styles.cardTitle}>Term I Academic Growth</Text>
        {[
          ["Mathematics", "92%"],
          ["Science", "88%"],
          ["English", "86%"],
          ["Attendance", "96%"]
        ].map(([label, value]) => (
          <View key={label} style={styles.progressRow}>
            <Text style={styles.cardBody}>{label}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: value }]} />
            </View>
            <Text style={styles.progressValue}>{value}</Text>
          </View>
        ))}
      </View>
      <SectionTitle title="Continuous Assessment & Feedback" />
      {feedback.map((item) => (
        <View key={item.subject} style={styles.newsCard}>
          <Text style={styles.cardKicker}>{item.subject}</Text>
          <Text style={styles.cardTitle}>Teacher Feedback</Text>
          <Text style={styles.cardBody}>{item.note}</Text>
        </View>
      ))}
    </View>
  );
}
