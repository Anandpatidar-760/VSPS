import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";
import { styles } from "../../styles/styles";

export function TabBar({ tabs, active, setActive }) {
  const getTabIcon = (name) => {
    switch (name) {
      case "Home": return "home-outline";
      case "Students": return "account-group-outline";
      case "Fees": return "card-account-details-outline";
      case "Calendar": return "calendar-month-outline";
      case "Attendance": return "clipboard-check-outline";
      case "Homework": return "book-open-variant";
      case "Dashboard": return "view-dashboard-outline";
      case "Reports": return "chart-box-outline";
      case "Bus": return "bus-clock";
      case "Security": return "shield-lock-outline";
      default: return "grid-large";
    }
  };

  return (
    <View style={styles.tabShell}>
      <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
        {tabs.map((tab) => {
          const isActive = active === tab;
          const iconName = getTabIcon(tab);
          return (
            <Pressable
              key={tab}
              onPress={() => setActive(tab)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: isActive ? "#EEF2FF" : "transparent"
              }}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={22}
                color={isActive ? colors.blue : colors.muted}
              />
              <Text style={{
                fontSize: 11,
                fontWeight: isActive ? "800" : "600",
                color: isActive ? colors.blue : colors.muted,
                marginTop: 2
              }}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
