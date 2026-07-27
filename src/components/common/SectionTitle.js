import React from "react";
import { Text } from "react-native";
import { styles } from "../../styles/styles";

export function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}
