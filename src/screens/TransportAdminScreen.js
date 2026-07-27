import React from "react";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { BusTrackingScreen } from "./BusTrackingScreen";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function TransportAdminScreen() {
  const buses = [
    ["Bus 12", "Route B", "Civil Lines", "On time"],
    ["Bus 07", "Route A", "Railway Colony", "Delayed 8 min"],
    ["Bus 18", "Route D", "Green Park", "On time"]
  ];

  return (
    <View>
      <SectionTitle title="Transport Tracking" />
      <BusTrackingScreen />
      {buses.map(([bus, route, location, status]) => (
        <View key={bus} style={styles.resourceRow}>
          <MaterialCommunityIcons name="bus-clock" size={28} color={status.includes("Delayed") ? colors.amber : colors.green} />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{bus} - {route}</Text>
            <Text style={styles.cardBody}>{location}. {status}</Text>
          </View>
          <Ionicons name="navigate-outline" size={22} color={colors.blue} />
        </View>
      ))}
    </View>
  );
}
