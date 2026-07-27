import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { loadNotificationsFromDB, saveNotificationToDB, deleteNotificationFromDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function NotificationsScreen({ compact, role = "Student" }) {
  const isAdmin = role === "Admin";
  const [list, setList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("Announcement");
  const [color, setColor] = useState("#4F46E5");

  const refreshList = async () => {
    const data = await loadNotificationsFromDB();
    setList(data);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleCreateAlert = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Required Fields", "Please enter both Title and Details for the alert.");
      return;
    }
    await saveNotificationToDB({
      title: title.trim(),
      body: body.trim(),
      type,
      color
    });
    setShowAddModal(false);
    setTitle("");
    setBody("");
    await refreshList();
    Alert.alert("Alert Created ✅", "Priority notification posted live to Supabase Cloud.");
  };

  const handleDeleteAlert = (item) => {
    Alert.alert(
      "Delete Priority Alert",
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteNotificationFromDB(item.id);
            await refreshList();
            Alert.alert("Deleted 🗑️", "Alert removed from Supabase.");
          }
        }
      ]
    );
  };

  const displayList = list.slice(0, compact ? 2 : list.length);

  return (
    <View style={styles.stack}>
      {!compact && <SectionTitle title="Priority Alerts & Notifications" />}

      {/* Admin Add Action */}
      {!compact && isAdmin && (
        <PrimaryButton
          icon="bell-plus-outline"
          label="+ Create Priority Alert (Admin)"
          onPress={() => setShowAddModal(true)}
        />
      )}

      {displayList.map((item) => (
        <View key={item.id} style={styles.alertCard}>
          <View style={[styles.alertStripe, { backgroundColor: item.color || colors.blue }]} />
          <View style={styles.alertBody}>
            <Text style={styles.cardKicker}>{item.type}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
          <View style={{ alignItems: "center", gap: 10 }}>
            <Ionicons name="notifications-outline" size={22} color={item.color || colors.blue} />
            {!compact && isAdmin && (
              <Pressable onPress={() => handleDeleteAlert(item)} style={{ padding: 4 }}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
              </Pressable>
            )}
          </View>
        </View>
      ))}

      {/* CREATE ALERT MODAL */}
      <Modal visible={showAddModal} animationType="slide" transparent={false} onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="bell-ring-outline" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Create Priority Alert</Text>
              <Text style={styles.editModalSub}>Posts live announcement to Supabase Cloud</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Alert Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Heavy rain advisory / Science Exhibition"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Alert Category</Text>
              <View style={styles.rolePickerRow}>
                {[
                  ["Announcement", colors.blue],
                  ["Emergency", colors.red],
                  ["Reminder", colors.amber]
                ].map(([cat, c]) => (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      setType(cat);
                      setColor(c);
                    }}
                    style={[styles.rolePickChip, type === cat && { backgroundColor: c, borderColor: c }]}
                  >
                    <Text style={[styles.rolePickText, type === cat && styles.rolePickTextActive]}>{cat}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Details / Body *</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                value={body}
                onChangeText={setBody}
                multiline
                placeholder="Enter complete notification message for parents and students..."
                placeholderTextColor="#94A3B8"
              />

              <Pressable onPress={handleCreateAlert} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Publish Alert to Supabase</Text>
              </Pressable>

              <Pressable onPress={() => setShowAddModal(false)} style={styles.closeAuthBtn}>
                <Text style={styles.closeAuthText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
