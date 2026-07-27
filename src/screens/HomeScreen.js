import React from "react";
import { View, Text, Image } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { ActionCard } from "../components/widgets/ActionCard";
import { RoleFeaturePanel } from "../components/widgets/RoleFeaturePanel";
import { NotificationsScreen } from "./NotificationsScreen";
import { quickActions, tabForAction } from "../constants/mockData";
import { styles } from "../styles/styles";

export function HomeScreen({ role, setActive }) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>{role} portal</Text>
          <Text style={styles.heroTitle}>Today at VSPS</Text>
          <Text style={styles.heroBody}>Attendance, homework, updates, fees, and transport in one secure school app.</Text>
        </View>
        <Image source={require("../../assets/logo.png")} style={styles.heroLogoImage} resizeMode="contain" />
      </View>
      <SectionTitle title="Quick Actions" />
      <View style={styles.actionGrid}>
        {quickActions[role].map((label) => (
          <ActionCard key={label} label={label} onPress={() => setActive(tabForAction(label))} />
        ))}
      </View>
      <RoleFeaturePanel role={role} />
      <SectionTitle title="Priority Alerts" />
      <NotificationsScreen compact />
    </View>
  );
}
