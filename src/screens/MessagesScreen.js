import React from "react";
import { View, TextInput, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { MessageBubble } from "../components/widgets/MessageBubble";
import { styles } from "../styles/styles";

export function MessagesScreen({ role }) {
  return (
    <View>
      <SectionTitle title={role === "Teacher" ? "Parent Communication" : "Direct Messaging"} />
      <View style={styles.chatBox}>
        <MessageBubble text={role === "Teacher" ? "Aarav has submitted the science worksheet." : "Could you please confirm tomorrow's English homework?"} />
        <MessageBubble mine text={role === "Teacher" ? "Thanks, I have marked it received." : "Yes, please complete the essay draft by 5 PM."} />
      </View>
      <View style={styles.messageInputRow}>
        <TextInput placeholder="Type a secure message" style={[styles.input, styles.flex]} />
        <Pressable style={styles.sendButton} onPress={() => Alert.alert("Sent", "Message delivered in this prototype.")}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
