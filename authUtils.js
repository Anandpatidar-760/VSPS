import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const tokenCache = {
  async getToken(key) {
    try {
      if (Platform.OS === "web") {
        return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
      }
      try {
        const SecureStore = require("expo-secure-store");
        return await SecureStore.getItemAsync(key);
      } catch (e) {
        return await AsyncStorage.getItem(key);
      }
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      if (Platform.OS === "web") {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(key, value);
        }
        return;
      }
      try {
        const SecureStore = require("expo-secure-store");
        return await SecureStore.setItemAsync(key, value);
      } catch (e) {
        return await AsyncStorage.setItem(key, value);
      }
    } catch (err) {
      return;
    }
  }
};

export function formatClerkError(err) {
  if (err?.errors?.[0]?.longMessage) {
    return err.errors[0].longMessage;
  }
  if (err?.errors?.[0]?.message) {
    return err.errors[0].message;
  }
  if (err?.message) {
    return err.message;
  }
  return "An unexpected authentication error occurred. Please try again.";
}
