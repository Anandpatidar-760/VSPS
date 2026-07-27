import React from "react";
import { View, Text } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { calendar } from "../constants/mockData";
import { styles } from "../styles/styles";

export function CalendarScreen() {
  return (
    <View>
      <SectionTitle title="School Calendar" />
      {calendar.map((item) => (
        <View key={item.id} style={styles.timelineItem}>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.tag}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
