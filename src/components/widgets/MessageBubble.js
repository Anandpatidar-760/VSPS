import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/styles";

export function MessageBubble({ text, mine }) {
  return (
    <View style={[styles.bubble, mine && styles.bubbleMine]}>
      <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{text}</Text>
    </View>
  );
}
