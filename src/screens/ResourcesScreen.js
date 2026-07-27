import React from "react";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { resources } from "../constants/mockData";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function ResourcesScreen() {
  return (
    <View>
      <SectionTitle title="Resource Library" />
      {resources.map((item) => (
        <View key={item.id} style={styles.resourceRow}>
          <MaterialCommunityIcons name={item.icon} size={28} color={colors.violet} />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardBody}>{item.meta}</Text>
          </View>
          <Ionicons name="download-outline" size={22} color={colors.blue} />
        </View>
      ))}
    </View>
  );
}
