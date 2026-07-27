import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/styles";

export function Metric({ label, value, color }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}
