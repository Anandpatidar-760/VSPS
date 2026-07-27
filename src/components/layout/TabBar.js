import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function TabBar({ tabs, active, setActive, visible = true }) {
  const getTabIcon = (name) => {
    switch (name) {
      case "Home": return "home-variant-outline";
      case "Students": return "account-group-outline";
      case "Fees": return "card-account-details-outline";
      case "Calendar": return "calendar-month-outline";
      case "Attendance": return "clipboard-check-outline";
      case "Homework": return "book-open-variant";
      case "Dashboard": return "view-dashboard-outline";
      case "Reports": return "chart-box-outline";
      case "Bus": return "bus-clock";
      case "Security": return "shield-lock-outline";
      case "Profile": return "account-circle-outline";
      default: return "grid-large";
    }
  };

  const getActiveTabIcon = (name) => {
    switch (name) {
      case "Home": return "home-variant";
      case "Students": return "account-group";
      case "Fees": return "card-account-details";
      case "Calendar": return "calendar-month";
      case "Attendance": return "clipboard-check";
      case "Homework": return "book-open-page-variant";
      case "Dashboard": return "view-dashboard";
      case "Reports": return "chart-box";
      case "Bus": return "bus";
      case "Security": return "shield-lock";
      case "Profile": return "account-circle";
      default: return "grid-large";
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.fbTabShell}>
      <View style={styles.fbTabInner}>
        {tabs.map((tab) => {
          const isActive = active === tab;
          const iconName = isActive ? getActiveTabIcon(tab) : getTabIcon(tab);

          return (
            <Pressable
              key={tab}
              onPress={() => setActive(tab)}
              style={styles.fbTabItem}
            >
              <View style={[styles.fbIconContainer, isActive && styles.fbIconContainerActive]}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={isActive ? colors.blue : colors.muted}
                />
              </View>

              <Text
                style={[
                  styles.fbTabText,
                  isActive && styles.fbTabTextActive
                ]}
                numberOfLines={1}
              >
                {tab}
              </Text>
              
              {isActive && <View style={styles.fbActiveBarLine} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
