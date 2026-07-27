import React from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { notifications } from "../constants/mockData";
import { styles } from "../styles/styles";

export function NotificationsScreen({ compact }) {
  return (
    <View style={styles.stack}>
      {notifications.slice(0, compact ? 2 : notifications.length).map((item) => (
        <View key={item.id} style={styles.alertCard}>
          <View style={[styles.alertStripe, { backgroundColor: item.color }]} />
          <View style={styles.alertBody}>
            <Text style={styles.cardKicker}>{item.type}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
          <Ionicons name="notifications-outline" size={22} color={item.color} />
        </View>
      ))}
      {!compact && (
        <>
          <View style={styles.segmentRow}>
            {["All Parents", "Class VIII A", "Bus Route B", "Teachers"].map((group) => (
              <Pressable key={group} style={styles.methodChip}>
                <Text style={styles.methodText}>{group}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput placeholder="Write targeted alert, emergency update, or event reminder" style={[styles.input, styles.largeInput]} multiline />
          <PrimaryButton icon="send" label="Send Targeted Push Alert" onPress={() => Alert.alert("Notification queued", "Targeted push notification is ready for selected school groups.")} />
        </>
      )}
    </View>
  );
}
