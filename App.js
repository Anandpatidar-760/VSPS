import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View
} from "react-native";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";

import {
  initDatabase,
  loadStudentsFromDB,
  updateStudentInDB,
  deleteStudentFromDB,
  clearSessionUser,
  syncClerkUserToDB
} from "./storage";
import { tokenCache, formatClerkError } from "./authUtils";

// Constants & Theme
import { CLERK_PUBLISHABLE_KEY } from "./src/constants/theme";

// Layout Components
import { Header } from "./src/components/layout/Header";
import { TabBar } from "./src/components/layout/TabBar";

// Screens
import { HomeScreen } from "./src/screens/HomeScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { CalendarScreen } from "./src/screens/CalendarScreen";
import { NewsScreen } from "./src/screens/NewsScreen";
import { AttendanceScreen } from "./src/screens/AttendanceScreen";
import { GradebookScreen } from "./src/screens/GradebookScreen";
import { HomeworkScreen } from "./src/screens/HomeworkScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { TimetableScreen } from "./src/screens/TimetableScreen";
import { FeesScreen } from "./src/screens/FeesScreen";
import { ReportsScreen } from "./src/screens/ReportsScreen";
import { MessagesScreen } from "./src/screens/MessagesScreen";
import { BusTrackingScreen } from "./src/screens/BusTrackingScreen";
import { TransportAdminScreen } from "./src/screens/TransportAdminScreen";
import { StaffDirectoryScreen } from "./src/screens/StaffDirectoryScreen";
import { SecurityCenterScreen } from "./src/screens/SecurityCenterScreen";
import { NewslettersScreen } from "./src/screens/NewslettersScreen";
import { StudentsManagerScreen } from "./src/screens/StudentsManagerScreen";
import { DigitalIdsScreen } from "./src/screens/DigitalIdsScreen";
import { ResourcesScreen } from "./src/screens/ResourcesScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

// Global Styles
import { styles } from "./src/styles/styles";

function App() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [role, setRole] = useState("Student");
  const [active, setActive] = useState("Home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(15);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customUserOverrides, setCustomUserOverrides] = useState(null);

  const currentUser = useMemo(() => {
    if (!user) return null;
    const cleanEmail = (user.primaryEmailAddress?.emailAddress || "").trim().toLowerCase();
    const clerkRole = user.unsafeMetadata?.role || user.publicMetadata?.role;
    const clerkStudentId = user.unsafeMetadata?.studentId;

    // 1. Check matching student/teacher/admin record in database list
    const matched = students.find(
      (s) =>
        (s.email && s.email.trim().toLowerCase() === cleanEmail) ||
        (clerkStudentId && s.id === clerkStudentId)
    );

    if (matched) {
      return {
        ...matched,
        name: customUserOverrides?.name || matched.name || user.fullName || "User",
        email: cleanEmail || matched.email,
        role: matched.role || clerkRole || "Student",
        avatar: customUserOverrides?.avatar || matched.avatar || user.imageUrl
      };
    }

    // 2. Check explicit Admin email accounts
    if (
      cleanEmail === "anandnimcet2020@gmail.com" ||
      cleanEmail === "rrptdr@gmail.com" ||
      cleanEmail === "admin@vsps.edu"
    ) {
      return {
        id: "VSPS-ADMIN-01",
        name: customUserOverrides?.name || user.fullName || user.firstName || "Anand Admin",
        email: cleanEmail,
        role: "Admin",
        avatar: customUserOverrides?.avatar || user.imageUrl
      };
    }

    // 3. Fallback to Clerk metadata role or Student
    return {
      id: user.id,
      name: customUserOverrides?.name || user.fullName || user.firstName || "Campus User",
      email: cleanEmail,
      role: clerkRole || "Student",
      avatar: customUserOverrides?.avatar || user.imageUrl
    };
  }, [user, students, customUserOverrides]);

  useEffect(() => {
    const bootstrap = async () => {
      await initDatabase();
      const list = await loadStudentsFromDB();
      setStudents(list);

      if (user) {
        const syncedUser = await syncClerkUserToDB(user);
        if (syncedUser && syncedUser.role) {
          setRole(syncedUser.role);
        }
      }
    };
    bootstrap();
  }, [user]);

  const refreshStudents = async () => {
    const list = await loadStudentsFromDB();
    setStudents(list);
  };

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      const updatedList = await updateStudentInDB(updatedStudent);
      setStudents(updatedList);
      Alert.alert("Updated ✅", `${updatedStudent.name}'s details updated in Supabase database.`);
    } catch (error) {
      Alert.alert("Update Error", error.message || "Failed to update student.");
    }
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      "Delete Student",
      `Are you sure you want to permanently delete ${student.name}? This will delete the record from Supabase.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedList = await deleteStudentFromDB(student.id);
              setStudents(updatedList);
              Alert.alert("Deleted 🗑️", `${student.name} has been removed from Supabase.`);
            } catch (error) {
              Alert.alert("Delete Error", error.message || "Failed to delete student.");
            }
          }
        }
      ]
    );
  };

  const effectiveRole = currentUser ? currentUser.role : role;

  const tabs = useMemo(() => {
    if (effectiveRole === "Admin") return ["Home", "Students", "Fees", "Calendar", "Profile"];
    if (effectiveRole === "Teacher") return ["Home", "Attendance", "Homework", "Calendar", "Profile"];
    if (effectiveRole === "Student") return ["Home", "Dashboard", "Homework", "Fees", "Profile"];
    return ["Home", "Fees", "Reports", "Bus", "Profile"];
  }, [effectiveRole]);

  const ALL_SUPPORTED_SCREENS = [
    "Home", "Notifications", "Calendar", "News", "Attendance", "Gradebook",
    "Homework", "Dashboard", "Timetable", "Fees", "Reports", "Messages",
    "Bus", "Transport", "Staff", "Security", "Newsletters", "Students",
    "IDs", "Resources", "Profile"
  ];
  const safeActive = ALL_SUPPORTED_SCREENS.includes(active) ? active : "Home";

  const handleLogout = async () => {
    try {
      await signOut();
      await clearSessionUser();
      setShowAuthModal(false);
      Alert.alert("Signed Out", "You have been signed out cleanly.");
    } catch (error) {
      Alert.alert("Logout Error", formatClerkError(error));
    }
  };

  const handleUpdateUser = (updatedInfo) => {
    setCustomUserOverrides(updatedInfo);
  };

  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY && currentY > 40) {
      setIsTabBarVisible(false);
    } else if (currentY < lastScrollY || currentY <= 10) {
      setIsTabBarVisible(true);
    }
    setLastScrollY(currentY);
  };

  if (isLoaded && !isSignedIn) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={[styles.safe, isDarkMode && { backgroundColor: "#0F172A" }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={[styles.app, isDarkMode && { backgroundColor: "#0F172A" }]}>
        <Header
          role={effectiveRole}
          currentUser={currentUser}
          onOpenProfile={() => setActive("Profile")}
          onOpenAuth={() => setShowAuthModal(true)}
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {safeActive === "Home" && <HomeScreen role={effectiveRole} setActive={setActive} currentUser={currentUser} onOpenAuth={() => setShowAuthModal(true)} />}
          {safeActive === "Notifications" && <NotificationsScreen role={effectiveRole} />}
          {safeActive === "Calendar" && <CalendarScreen />}
          {safeActive === "News" && <NewsScreen />}
          {safeActive === "Attendance" && <AttendanceScreen role={effectiveRole} currentUser={currentUser} students={students} />}
          {safeActive === "Gradebook" && <GradebookScreen />}
          {safeActive === "Homework" && <HomeworkScreen role={effectiveRole} />}
          {safeActive === "Dashboard" && <DashboardScreen currentUser={currentUser} />}
          {safeActive === "Timetable" && <TimetableScreen />}
          {safeActive === "Fees" && <FeesScreen role={effectiveRole} />}
          {safeActive === "Reports" && <ReportsScreen />}
          {safeActive === "Messages" && <MessagesScreen role={effectiveRole} />}
          {safeActive === "Bus" && <BusTrackingScreen />}
          {safeActive === "Transport" && <TransportAdminScreen />}
          {safeActive === "Staff" && <StaffDirectoryScreen role={effectiveRole} />}
          {safeActive === "Security" && <SecurityCenterScreen />}
          {safeActive === "Newsletters" && <NewslettersScreen />}
          {safeActive === "Students" && (
            <StudentsManagerScreen
              students={students}
              onUpdate={handleUpdateStudent}
              onDelete={handleDeleteStudent}
              onRefresh={refreshStudents}
            />
          )}
          {safeActive === "IDs" && <DigitalIdsScreen students={students} currentUser={currentUser} />}
          {safeActive === "Resources" && <ResourcesScreen />}
          {safeActive === "Profile" && (
            <ProfileScreen
              currentUser={currentUser}
              role={effectiveRole}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              onNavigate={setActive}
            />
          )}
        </ScrollView>
        <TabBar tabs={tabs} active={safeActive} setActive={setActive} visible={isTabBarVisible} />
      </View>

      <Modal visible={showAuthModal} animationType="slide" transparent={false} onRequestClose={() => setShowAuthModal(false)}>
        <AuthScreen onClose={() => setShowAuthModal(false)} />
      </Modal>
    </SafeAreaView>
  );
}

function RootApp() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <App />
    </ClerkProvider>
  );
}

export default RootApp;
