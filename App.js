import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar
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

  const currentUser = useMemo(() => {
    if (!isSignedIn || !user) return null;
    const fullName = user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ");
    const email = user.primaryEmailAddress?.emailAddress || "";
    const userRole = role || "Student";
    return {
      id: user.id,
      name: fullName || email || "School Member",
      email: email,
      role: userRole,
      clerkUser: true
    };
  }, [isSignedIn, user, role]);

  const refreshStudents = async () => {
    const list = await loadStudentsFromDB();
    setStudents(list);
  };

  useEffect(() => {
    async function init() {
      await initDatabase();
      await refreshStudents();
    }
    init();
  }, []);

  // Automatic Supabase & SQLite DB synchronization & role check
  useEffect(() => {
    if (!user || !isSignedIn) return;
    async function sync() {
      const basicUser = {
        id: user.id,
        name: user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.primaryEmailAddress?.emailAddress || "Member",
        email: user.primaryEmailAddress?.emailAddress || "",
        role: role
      };
      const res = await syncClerkUserToDB(basicUser);
      if (res && res.userList) {
        setStudents(res.userList);
      }
      if (res && res.resolvedRole && res.resolvedRole !== role) {
        setRole(res.resolvedRole);
      }
    }
    sync();
  }, [user, isSignedIn]);

  useEffect(() => {
    if (!currentUser) return undefined;
    const timer = setInterval(() => {
      setSessionMinutes((value) => (value > 1 ? value - 1 : 0));
    }, 60000);
    return () => clearInterval(timer);
  }, [currentUser]);

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

  // Clean 4-option bottom navigation bar customized per role
  const tabs = useMemo(() => {
    if (effectiveRole === "Admin") return ["Home", "Students", "Fees", "Calendar"];
    if (effectiveRole === "Teacher") return ["Home", "Attendance", "Homework", "Calendar"];
    if (effectiveRole === "Student") return ["Home", "Dashboard", "Homework", "Fees"];
    return ["Home", "Fees", "Reports", "Bus"];
  }, [effectiveRole]);

  const safeActive = tabs.includes(active) ? active : "Home";

  const handleLogout = async () => {
    try {
      await signOut();
      await clearSessionUser();
      setShowAuthModal(false);
      Alert.alert("Signed Out", "You have been signed out from Clerk.");
    } catch (error) {
      Alert.alert("Logout Error", formatClerkError(error));
    }
  };

  const handleUserActivity = () => {
    if (currentUser) {
      setSessionMinutes(15);
    }
  };

  // Initial Auth Gatekeeper
  if (isLoaded && !isSignedIn) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <Pressable style={styles.app} onPress={handleUserActivity}>
        <Header
          role={effectiveRole}
          currentUser={currentUser}
          sessionMinutes={sessionMinutes}
          onLogout={handleLogout}
          onOpenAuth={() => setShowAuthModal(true)}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {safeActive === "Home" && <HomeScreen role={effectiveRole} setActive={setActive} currentUser={currentUser} onOpenAuth={() => setShowAuthModal(true)} />}
          {safeActive === "Notifications" && <NotificationsScreen />}
          {safeActive === "Calendar" && <CalendarScreen />}
          {safeActive === "News" && <NewsScreen />}
          {safeActive === "Attendance" && <AttendanceScreen />}
          {safeActive === "Gradebook" && <GradebookScreen />}
          {safeActive === "Homework" && <HomeworkScreen role={effectiveRole} />}
          {safeActive === "Dashboard" && <DashboardScreen currentUser={currentUser} />}
          {safeActive === "Timetable" && <TimetableScreen />}
          {safeActive === "Fees" && <FeesScreen role={effectiveRole} />}
          {safeActive === "Reports" && <ReportsScreen />}
          {safeActive === "Messages" && <MessagesScreen role={effectiveRole} />}
          {safeActive === "Bus" && <BusTrackingScreen />}
          {safeActive === "Transport" && <TransportAdminScreen />}
          {safeActive === "Staff" && <StaffDirectoryScreen />}
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
        </ScrollView>
        <TabBar tabs={tabs} active={safeActive} setActive={setActive} />
      </Pressable>

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
