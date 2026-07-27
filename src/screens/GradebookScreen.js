import React from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { styles } from "../styles/styles";

export function GradebookScreen() {
  return (
    <View>
      <SectionTitle title="Grade Management" />
      {["Mathematics", "Science", "English"].map((subject, index) => (
        <View key={subject} style={styles.inputCard}>
          <Text style={styles.cardTitle}>{subject}</Text>
          <View style={styles.gradeRow}>
            <TextInput placeholder="Marks" keyboardType="numeric" style={styles.input} defaultValue={`${84 + index * 3}`} />
            <TextInput placeholder="Remarks" style={[styles.input, styles.remarkInput]} defaultValue={index === 0 ? "Strong progress" : ""} />
          </View>
        </View>
      ))}
      <PrimaryButton icon="database-sync-outline" label="Sync Grades to School Information System" onPress={() => Alert.alert("Grades synced", "Exam scores and remarks are ready for the school information system.")} />
    </View>
  );
}
