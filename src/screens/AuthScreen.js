import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, SafeAreaView, StatusBar, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { colors, roles } from "../constants/theme";
import { formatClerkError } from "../../authUtils";
import { verifyStudentIdInDB } from "../../storage";
import { styles } from "../styles/styles";

export function AuthScreen({ onClose }) {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);

  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign up state
  const [signUpStudentId, setSignUpStudentId] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("Student");

  // Verification step state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSignIn = async () => {
    if (!isSignInLoaded) return;
    if (!signInEmail.trim() || !signInPassword) {
      Alert.alert("Required Fields", "Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: signInEmail.trim(),
        password: signInPassword
      });

      if (completeSignIn.status === "complete") {
        await setSignInActive({ session: completeSignIn.createdSessionId });
        setLoading(false);
        if (onClose) onClose();
        Alert.alert("Welcome Back!", "Successfully authenticated via Clerk.");
      } else if (completeSignIn.status === "needs_first_factor" || completeSignIn.status === "needs_second_factor") {
        await signIn.prepareFirstFactor({ strategy: "email_code" });
        setLoading(false);
        setSignUpEmail(signInEmail.trim());
        setPendingVerification(true);
        Alert.alert("One-Time Code Sent", `A verification code was sent to ${signInEmail.trim()}.`);
      } else {
        setLoading(false);
        Alert.alert("Sign In Status", `Status: ${completeSignIn.status}`);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Clerk Authentication Failed", formatClerkError(err));
    }
  };

  const handleSignUp = async () => {
    if (!isSignUpLoaded) return;
    if (!signUpStudentId.trim()) {
      Alert.alert("Student ID Required", "Please enter your official School Student ID / Member ID (e.g. VSPS-2026-0808).");
      return;
    }
    if (!signUpName.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes("@")) {
      Alert.alert("Required Field", "Please enter a valid email address.");
      return;
    }
    if (!signUpPassword || signUpPassword.length < 8) {
      Alert.alert("Password Criteria", "Password must be at least 8 characters long for Clerk security compliance.");
      return;
    }

    setLoading(true);

    // 🛡️ SECURITY GATEKEEPER: Check Student ID against Supabase Database
    const checkResult = await verifyStudentIdInDB(signUpStudentId.trim(), signUpEmail.trim());
    if (!checkResult.valid) {
      setLoading(false);
      Alert.alert("Registration Blocked ⛔", checkResult.error);
      return;
    }

    try {
      const nameParts = signUpName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      await signUp.create({
        emailAddress: signUpEmail.trim(),
        password: signUpPassword,
        firstName,
        lastName,
        unsafeMetadata: { role: "Student", studentId: signUpStudentId.trim() }
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setLoading(false);
      setPendingVerification(true);
      Alert.alert("Verification Code Sent", `A 6-digit verification code was sent to ${signUpEmail.trim()}. Please check your email.`);
    } catch (err) {
      setLoading(false);
      Alert.alert("Clerk Sign Up Error", formatClerkError(err));
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("Code Required", "Please enter the email verification code sent by Clerk.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup" && isSignUpLoaded) {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: verificationCode.trim()
        });

        if (completeSignUp.status === "complete") {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
          setLoading(false);
          if (onClose) onClose();
          Alert.alert("Account Verified! 🎉", "Your account was successfully registered and verified with Clerk.");
        } else {
          setLoading(false);
          Alert.alert("Verification Pending", `Status: ${completeSignUp.status}`);
        }
      } else if (mode === "login" && isSignInLoaded) {
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: verificationCode.trim()
        });
        if (completeSignIn.status === "complete") {
          await setSignInActive({ session: completeSignIn.createdSessionId });
          setLoading(false);
          if (onClose) onClose();
          Alert.alert("Welcome Back!", "Successfully authenticated via Clerk.");
        } else {
          setLoading(false);
          Alert.alert("Verification Pending", `Status: ${completeSignIn.status}`);
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Verification Error", formatClerkError(err));
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      if (mode === "signup" && isSignUpLoaded) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      } else if (mode === "login" && isSignInLoaded) {
        await signIn.prepareFirstFactor({ strategy: "email_code" });
      }
      setLoading(false);
      Alert.alert("New Code Sent 📬", `A new verification code was sent to ${signUpEmail || signInEmail}.`);
    } catch (err) {
      setLoading(false);
      Alert.alert("Resend Error", formatClerkError(err));
    }
  };

  return (
    <SafeAreaView style={styles.authSafe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.authScroll}>
        <View style={styles.authHeader}>
          <Image source={require("../../assets/logo.png")} style={styles.authLogo} resizeMode="contain" />
          <Text style={styles.authSchoolTitle}>Vidhya Sager Public School</Text>
          <Text style={styles.authSubtitle}>Smart Campus Identity Portal</Text>

          <View style={styles.clerkBadge}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color={colors.teal} />
            <Text style={styles.clerkBadgeText}>Powered by Clerk Authentication API</Text>
          </View>
        </View>

        {/* Mode Selector */}
        <View style={styles.authSegment}>
          <Pressable
            onPress={() => {
              setMode("login");
              setPendingVerification(false);
            }}
            style={[styles.authSegmentBtn, mode === "login" && styles.authSegmentBtnActive]}
          >
            <Text style={[styles.authSegmentText, mode === "login" && styles.authSegmentTextActive]}>
              Clerk Sign In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode("signup");
              setPendingVerification(false);
            }}
            style={[styles.authSegmentBtn, mode === "signup" && styles.authSegmentBtnActive]}
          >
            <Text style={[styles.authSegmentText, mode === "signup" && styles.authSegmentTextActive]}>
              New Account Sign Up
            </Text>
          </Pressable>
        </View>

        {pendingVerification ? (
          <View style={styles.formContainer}>
            <View style={styles.jsonNoticeBox}>
              <MaterialCommunityIcons name="email-check-outline" size={22} color={colors.teal} />
              <Text style={styles.jsonNoticeText}>
                We sent a 6-digit verification code to <Text style={{ fontWeight: "800" }}>{signUpEmail || signInEmail}</Text>.
              </Text>
            </View>

            <Text style={styles.inputLabel}>Clerk One-Time Verification Code (OTP) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code received on email"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            <Pressable onPress={handleVerifyCode} disabled={loading} style={[styles.primaryAuthBtn, loading && { opacity: 0.6 }]}>
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryAuthBtnText}>{loading ? "Verifying Code..." : "Verify OTP & Continue"}</Text>
            </Pressable>

            <Pressable onPress={handleResendCode} disabled={loading} style={{ marginTop: 14, alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: colors.blue, fontWeight: "700" }}>I need a new code (Resend Code)</Text>
            </Pressable>

            <Pressable onPress={() => setPendingVerification(false)} style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "600" }}>Back to {mode === "signup" ? "Sign Up Form" : "Sign In Form"}</Text>
            </Pressable>
          </View>
        ) : mode === "login" ? (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Registered Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. user@domain.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={signInEmail}
              onChangeText={setSignInEmail}
            />

            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Clerk password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={signInPassword}
              onChangeText={setSignInPassword}
            />

            <Pressable onPress={handleSignIn} disabled={loading} style={[styles.primaryAuthBtn, loading && { opacity: 0.6 }]}>
              <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryAuthBtnText}>{loading ? "Authenticating..." : "Sign In with Clerk"}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={[styles.jsonNoticeBox, { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }]}>
              <MaterialCommunityIcons name="shield-account-outline" size={20} color={colors.green} />
              <Text style={[styles.jsonNoticeText, { color: colors.green }]}>
                New account registration defaults to <Text style={{ fontWeight: "900" }}>Student</Text> role. Admin & Teacher access can be assigned from Supabase Database.
              </Text>
            </View>

            <Text style={styles.inputLabel}>Official Student ID / Roll No *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. VSPS-2026-0808"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              value={signUpStudentId}
              onChangeText={setSignUpStudentId}
            />

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ananya Sharma"
              placeholderTextColor="#94A3B8"
              value={signUpName}
              onChangeText={setSignUpName}
            />

            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ananya@vsps.edu"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={signUpEmail}
              onChangeText={setSignUpEmail}
            />

            <Text style={styles.inputLabel}>Create Password (min 8 characters) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create strong password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={signUpPassword}
              onChangeText={setSignUpPassword}
            />

            <Pressable onPress={handleSignUp} disabled={loading} style={[styles.primaryAuthBtn, loading && { opacity: 0.6 }]}>
              <MaterialCommunityIcons name="account-plus-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryAuthBtnText}>{loading ? "Creating Clerk Account..." : "Register with Clerk"}</Text>
            </Pressable>
          </View>
        )}

        {onClose && (
          <Pressable onPress={onClose} style={styles.closeAuthBtn}>
            <Text style={styles.closeAuthText}>Cancel & Close</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
