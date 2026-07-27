import React from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { styles } from "../styles/styles";

export function NewslettersScreen() {
  return (
    <View>
      <SectionTitle title="Newsletters & Circulars" />
      <View style={styles.inputCard}>
        <TextInput placeholder="Circular title" style={styles.input} />
        <TextInput placeholder="Message for guardians" style={[styles.input, styles.largeInput]} multiline />
        <View style={styles.segmentRow}>
          {["Class VIII A", "All Guardians", "Bus Route B"].map((group) => (
            <Pressable key={group} style={styles.methodChip}>
              <Text style={styles.methodText}>{group}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton icon="email-newsletter" label="Send Newsletter / Circular" onPress={() => Alert.alert("Sent", "Newsletter was shared with selected guardians.")} />
      </View>
    </View>
  );
}
