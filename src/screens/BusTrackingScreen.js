import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { styles } from "../styles/styles";

export function BusTrackingScreen() {
  return (
    <View>
      <SectionTitle title="Bus Tracking" />
      <View style={styles.mapMock}>
        <View style={styles.routeLine} />
        <View style={[styles.stopDot, styles.stopOne]} />
        <View style={[styles.stopDot, styles.stopTwo]} />
        <View style={[styles.stopDot, styles.stopThree]} />
        <View style={styles.busMarker}>
          <MaterialCommunityIcons name="bus" size={28} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bus 12 - Route B</Text>
        <Text style={styles.cardBody}>Current location: Civil Lines. Estimated arrival at your stop: 12 minutes.</Text>
        <Text style={styles.linkText}>Notify parent if route is delayed</Text>
      </View>
    </View>
  );
}
