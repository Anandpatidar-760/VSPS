import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { timetable } from "../constants/mockData";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function TimetableScreen() {
  return (
    <View>
      <SectionTitle title="Timetable Access" />
      <View style={styles.card}>
        {timetable.map(([time, subject, room]) => (
          <View key={`${time}-${subject}`} style={styles.timetableRow}>
            <Text style={styles.timeText}>{time}</Text>
            <View style={styles.flex}>
              <Text style={styles.subjectText}>{subject}</Text>
              <Text style={styles.cardBody}>Location: {room}</Text>
            </View>
            <Ionicons name="location-outline" size={20} color={colors.blue} />
          </View>
        ))}
      </View>
    </View>
  );
}
