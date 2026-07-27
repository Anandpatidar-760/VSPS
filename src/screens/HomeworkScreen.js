import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { loadHomeworkFromDB, saveHomeworkToDB, deleteHomeworkFromDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function HomeworkScreen({ role }) {
  const isTeacherOrAdmin = role === "Teacher" || role === "Admin";
  const [hwList, setHwList] = useState([]);
  const [subject, setSubject] = useState("");
  const [task, setTask] = useState("");
  const [due, setDue] = useState("Tomorrow");

  const refreshHomework = async () => {
    const list = await loadHomeworkFromDB();
    setHwList(list);
  };

  useEffect(() => {
    refreshHomework();
  }, []);

  const handleAssign = async () => {
    if (!subject.trim()) { Alert.alert("Required", "Please enter subject name."); return; }
    if (!task.trim()) { Alert.alert("Required", "Please enter assignment details."); return; }

    const updated = await saveHomeworkToDB({
      subject: subject.trim(),
      task: task.trim(),
      due: due.trim() || "Tomorrow",
      classSection: "Class VIII A"
    });

    setHwList(updated);
    setSubject("");
    setTask("");
    Alert.alert("Homework Published 🚀", `Published ${subject.trim()} homework to Supabase database.`);
  };

  const handleDeleteHw = (item) => {
    Alert.alert("Delete Assignment", `Delete "${item.subject}" homework task?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteHomeworkFromDB(item.id);
          setHwList(updated);
          Alert.alert("Deleted 🗑️", `Homework deleted from Supabase.`);
        }
      }
    ]);
  };

  return (
    <View>
      <SectionTitle title={isTeacherOrAdmin ? "Teacher Homework Portal" : "Homework Assignments"} />

      {/* Teacher Add Homework Form */}
      {isTeacherOrAdmin && (
        <View style={styles.inputCard}>
          <Text style={[styles.cardTitle, { marginBottom: 8 }]}>Assign New Homework (Teacher)</Text>
          <TextInput
            placeholder="Subject (e.g. Science, Mathematics)"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            placeholder="Assignment details & instructions..."
            value={task}
            onChangeText={setTask}
            style={[styles.input, styles.largeInput]}
            multiline
            placeholderTextColor="#94A3B8"
          />
          <TextInput
            placeholder="Due Date (e.g. Tomorrow, 18 Jul)"
            value={due}
            onChangeText={setDue}
            style={[styles.input, { marginTop: 10 }]}
            placeholderTextColor="#94A3B8"
          />
          <PrimaryButton icon="file-upload-outline" label="Publish Homework to Supabase" onPress={handleAssign} />
        </View>
      )}

      {/* Homework List */}
      {hwList.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="notebook-check-outline" size={48} color={colors.line} />
          <Text style={styles.emptyStateText}>No homework assignments currently due.</Text>
        </View>
      ) : (
        hwList.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.cardKicker}>{item.subject}</Text>
              {isTeacherOrAdmin && (
                <Pressable onPress={() => handleDeleteHw(item)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
                </Pressable>
              )}
            </View>
            <Text style={styles.cardTitle}>{item.task}</Text>
            <Text style={styles.cardBody}>Due: {item.due}. Digital worksheet attached for mobile submission.</Text>
            <Text style={styles.linkText}>Open worksheet</Text>
          </View>
        ))
      )}
    </View>
  );
}
