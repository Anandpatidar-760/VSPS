import React from "react";
import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../styles/styles";

export function PrimaryButton({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <MaterialCommunityIcons name={icon} size={20} color="#FFFFFF" />
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}
