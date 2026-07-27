import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Modal, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionTitle } from "../components/common/SectionTitle";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { receipts } from "../constants/mockData";
import { loadFeesFromDB, saveFeeToDB, updateFeeInDB, deleteFeeFromDB } from "../../storage";
import { colors } from "../constants/theme";
import { styles } from "../styles/styles";

export function FeesScreen({ role }) {
  const isAdmin = role === "Admin";
  const [feesList, setFeesList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [feeLabel, setFeeLabel] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeStatus, setFeeStatus] = useState("Unpaid");

  const refreshFees = async () => {
    const list = await loadFeesFromDB();
    setFeesList(list);
  };

  useEffect(() => {
    refreshFees();
  }, []);

  const handleAddFee = async () => {
    if (!feeLabel.trim()) { Alert.alert("Required", "Fee description label is required."); return; }
    if (!feeAmount.trim()) { Alert.alert("Required", "Fee amount is required."); return; }
    const updated = await saveFeeToDB({
      label: feeLabel.trim(),
      value: feeAmount.startsWith("Rs") ? feeAmount.trim() : `Rs ${feeAmount.trim()}`,
      status: feeStatus
    });
    setFeesList(updated);
    setShowAddModal(false);
    setFeeLabel("");
    setFeeAmount("");
    Alert.alert("Fee Added ✅", `Added "${feeLabel.trim()}" into Supabase fees table.`);
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === "Paid" ? "Unpaid" : "Paid";
    const updated = await updateFeeInDB({ ...item, status: nextStatus });
    setFeesList(updated);
    Alert.alert("Status Updated 🔄", `Marked ${item.label} as ${nextStatus}.`);
  };

  const handleDeleteFee = (item) => {
    Alert.alert("Delete Fee Item", `Are you sure you want to remove "${item.label}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteFeeFromDB(item.id);
          setFeesList(updated);
          Alert.alert("Deleted 🗑️", `${item.label} was removed.`);
        }
      }
    ]);
  };

  // Calculate total unpaid due
  const totalNumber = feesList
    .filter((f) => f.status === "Unpaid")
    .reduce((sum, f) => {
      const num = parseInt((f.value || "").replace(/[^0-9]/g, ""), 10) || 0;
      return sum + num;
    }, 0);

  const totalFormatted = `Rs ${totalNumber.toLocaleString("en-IN")}`;

  return (
    <View>
      <SectionTitle title="Fee Management" />

      {/* Cloud Sync Banner */}
      <View style={styles.dbBanner}>
        <MaterialCommunityIcons name="cloud-sync-outline" size={24} color={colors.teal} />
        <View style={styles.flex}>
          <Text style={styles.dbBannerText}>Supabase Cloud Fees Database</Text>
          <Text style={{ fontSize: 11, color: colors.muted }}>Real-time payment dues and receipt status</Text>
        </View>
        <Pressable onPress={refreshFees} style={styles.refreshBtn}>
          <MaterialCommunityIcons name="refresh" size={16} color={colors.blue} />
          <Text style={styles.refreshBtnText}>Sync</Text>
        </Pressable>
      </View>

      {/* Admin Action Button */}
      {isAdmin && (
        <PrimaryButton
          icon="plus-circle-outline"
          label="+ Add New Fee Item (Admin)"
          onPress={() => setShowAddModal(true)}
        />
      )}

      {/* Dues Card */}
      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardKicker}>Current Dues Breakdown</Text>
        {feesList.length === 0 ? (
          <Text style={[styles.cardBody, { marginVertical: 12, textAlign: "center" }]}>No fee items listed.</Text>
        ) : (
          feesList.map((item) => (
            <View key={item.id} style={[styles.feeRow, { alignItems: "center" }]}>
              <View style={styles.flex}>
                <Text style={styles.cardBody}>{item.label}</Text>
                <Text style={styles.feeValue}>{item.value}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Pressable
                  onPress={() => isAdmin && handleToggleStatus(item)}
                  style={{
                    backgroundColor: item.status === "Paid" ? "#DCFCE7" : "#FEF3C7",
                    borderColor: item.status === "Paid" ? "#86EFAC" : "#FDE68A",
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 6
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: "900", color: item.status === "Paid" ? colors.green : colors.amber }}>
                    {item.status}
                  </Text>
                </Pressable>
                {isAdmin && (
                  <Pressable onPress={() => handleDeleteFee(item)} style={{ padding: 4 }}>
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.red} />
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
        <View style={styles.totalRow}>
          <Text style={styles.cardTitle}>Total Unpaid Dues</Text>
          <Text style={styles.totalValue}>{totalFormatted}</Text>
        </View>
      </View>

      {/* Payment methods */}
      {!isAdmin && (
        <>
          <View style={styles.paymentMethods}>
            {["Card", "UPI", "Net Banking"].map((method) => (
              <Pressable key={method} style={styles.methodChip}>
                <Text style={styles.methodText}>{method}</Text>
              </Pressable>
            ))}
          </View>
          <PrimaryButton
            icon="lock-check-outline"
            label="Pay Securely with OTP"
            onPress={() => Alert.alert("OTP Sent", "Payment authorization code sent to guardian mobile number.")}
          />
        </>
      )}

      {/* Automated receipts */}
      <SectionTitle title="Automated Receipts" />
      {receipts.map((receipt) => (
        <View key={receipt.id} style={styles.resourceRow}>
          <MaterialCommunityIcons name="receipt-text-outline" size={28} color={colors.green} />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{receipt.id} - {receipt.amount}</Text>
            <Text style={styles.cardBody}>{receipt.date} via {receipt.mode}. {receipt.status}</Text>
          </View>
          <Ionicons name="mail-outline" size={22} color={colors.blue} />
        </View>
      ))}

      {/* Admin Add Fee Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={false} onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.authSafe}>
          <ScrollView contentContainerStyle={styles.authScroll}>
            <View style={styles.editModalHeader}>
              <MaterialCommunityIcons name="cash-plus" size={36} color={colors.blue} />
              <Text style={styles.editModalTitle}>Add Fee Item</Text>
              <Text style={styles.editModalSub}>Creates record in Supabase fees table</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Fee Label *</Text>
              <TextInput style={styles.input} value={feeLabel} onChangeText={setFeeLabel} placeholder="e.g. Annual Sports Fee" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Amount (Rs) *</Text>
              <TextInput style={styles.input} value={feeAmount} onChangeText={setFeeAmount} keyboardType="numeric" placeholder="e.g. 2500" placeholderTextColor="#94A3B8" />

              <Text style={styles.inputLabel}>Initial Status</Text>
              <View style={styles.rolePickerRow}>
                {["Unpaid", "Paid"].map((st) => (
                  <Pressable key={st} onPress={() => setFeeStatus(st)} style={[styles.rolePickChip, feeStatus === st && styles.rolePickChipActive]}>
                    <Text style={[styles.rolePickText, feeStatus === st && styles.rolePickTextActive]}>{st}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable onPress={handleAddFee} style={styles.primaryAuthBtn}>
                <MaterialCommunityIcons name="content-save-check" size={20} color="#FFFFFF" />
                <Text style={styles.primaryAuthBtnText}>Save Fee Item to Supabase</Text>
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
