import React from "react";
import { View } from "react-native";
import { Metric } from "./Metric";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function StatsRow() {
  return (
    <View style={styles.statsRow}>
      <Metric label="Attendance" value="96%" color={colors.green} />
      <Metric label="Homework" value="8/9" color={colors.blue} />
      <Metric label="Fees" value="Due" color={colors.amber} />
    </View>
  );
}
