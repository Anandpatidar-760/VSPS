import React from "react";
import { View, Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { authFeatures } from "../constants/mockData";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function SecurityCenterScreen() {
  return (
    <View>
      <SectionTitle title="Core Authentication" />
      <View style={styles.securityGrid}>
        {authFeatures.map((item) => (
          <View key={item.title} style={styles.securityCard}>
            <MaterialCommunityIcons name={item.icon} size={26} color={colors.blue} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}
      </View>
      <SectionTitle title="User Setup Workflow" />
      <View style={styles.card}>
        {[
          ["Administrators", "Pre-register accounts from the school master database and generate onboarding codes or activation links."],
          ["Parents", "Log in with registered mobile number or email; one parent account links multiple siblings."],
          ["Students & Teachers", "Use school-issued email accounts through automated SSO integration."]
        ].map(([title, body]) => (
          <View key={title} style={styles.featureItem}>
            <Ionicons name="person-circle-outline" size={20} color={colors.teal} />
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardBody}>{body}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
