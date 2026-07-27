import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function StatusPill({ status }) {
  const color = status === "Present" ? colors.green : status === "Absent" ? colors.red : colors.amber;
  return (
    <View style={[styles.statusPill, { borderColor: color }]}>
      <Text style={[styles.statusText, { color }]}>{status}</Text>
    </View>
  );
}
