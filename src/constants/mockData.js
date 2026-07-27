import { colors } from "./theme";

export const notifications = [
  { id: "n1", type: "Emergency", title: "Heavy rain advisory", body: "School buses may be delayed by 15 minutes today.", color: colors.red },
  { id: "n2", type: "Announcement", title: "Science exhibition", body: "Parents are invited on Friday from 10:00 AM.", color: colors.blue },
  { id: "n3", type: "Reminder", title: "Fee due date", body: "Quarterly tuition payment closes on 18 July.", color: colors.amber }
];

export const calendar = [
  { id: "c1", date: "15 Jul", title: "Unit Test: Mathematics", tag: "Exam" },
  { id: "c2", date: "19 Jul", title: "Parent-teacher meeting", tag: "Meeting" },
  { id: "c3", date: "26 Jul", title: "Founder's Day celebration", tag: "Event" },
  { id: "c4", date: "15 Aug", title: "Independence Day holiday", tag: "Holiday" }
];

export const news = [
  { id: "b1", title: "VSPS wins inter-school debate", body: "Class IX students secured first place in the city debate championship." },
  { id: "b2", title: "Weekly newsletter published", body: "Read classroom highlights, sports updates, and important dates." },
  { id: "b3", title: "Robotics club registrations", body: "Students from classes VI-X can register before Monday." }
];

export const homework = [
  { id: "h1", subject: "English", task: "Write a 250-word essay on monsoon season.", due: "Tomorrow" },
  { id: "h2", subject: "Science", task: "Complete worksheet 4: Motion and force.", due: "16 Jul" },
  { id: "h3", subject: "Maths", task: "Practice algebra problems 1-20.", due: "18 Jul" }
];

export const timetable = [
  ["08:30", "Assembly", "Main Ground"],
  ["09:00", "Mathematics", "Room 204"],
  ["10:00", "Science", "Lab 2"],
  ["11:15", "English", "Room 108"],
  ["12:10", "Computer Lab", "ICT Lab"],
  ["01:30", "Social Studies", "Room 203"]
];

export const resources = [
  { id: "r1", name: "Class VIII Syllabus", meta: "PDF - 1.8 MB", icon: "book-open-page-variant" },
  { id: "r2", name: "Maths Worksheet Pack", meta: "Worksheet - 960 KB", icon: "file-document-outline" },
  { id: "r3", name: "Previous Exam Papers", meta: "ZIP - 7 files", icon: "archive-outline" },
  { id: "r4", name: "Digital Textbooks", meta: "E-books - 12 books", icon: "bookshelf" },
  { id: "r5", name: "Fractions Video Tutorial", meta: "Video - 18 min", icon: "play-circle-outline" },
  { id: "r6", name: "Science Revision Pack", meta: "Study material - Class VIII", icon: "lightbulb-on-outline" }
];

export const receipts = [
  { id: "REC-2407", date: "08 Jul", amount: "Rs 18,000", mode: "UPI", status: "Receipt sent" },
  { id: "REC-2211", date: "12 Apr", amount: "Rs 22,800", mode: "Card", status: "Paid" }
];

export const feedback = [
  { subject: "Mathematics", note: "Excellent problem solving. Needs more speed in algebra drills." },
  { subject: "English", note: "Creative writing is improving; reading log is pending this week." },
  { subject: "Science", note: "Strong lab participation and worksheet submission on time." }
];

export const staffDirectory = [
  { name: "Meera Sharma", role: "Science Teacher", contact: "meera.sharma@vsps.edu", phone: "+91 98765 11101" },
  { name: "Rakesh Verma", role: "Transport Coordinator", contact: "transport@vsps.edu", phone: "+91 98765 11102" },
  { name: "Nidhi Kapoor", role: "Accounts Office", contact: "fees@vsps.edu", phone: "+91 98765 11103" },
  { name: "Arun Iyer", role: "Principal", contact: "principal@vsps.edu", phone: "+91 98765 11104" }
];

export const authFeatures = [
  { title: "Clerk Cloud Authentication", body: "Secure user identities powered by Clerk identity platform API key.", icon: "shield-account" },
  { title: "MFA & Email Verification", body: "Clerk 6-digit email code verification protects student & parent registration.", icon: "email-check-outline" },
  { title: "Role-Based Access Control", body: "Metadata-driven roles for Parent, Student, Teacher, and Admin permissions.", icon: "account-lock-outline" },
  { title: "Secure Token Storage", body: "Encrypted JWT session token caching via expo-secure-store.", icon: "key-chain" },
  { title: "Password Management", body: "Self-service password registration with Clerk 8+ character security rules.", icon: "lock-reset" },
  { title: "Session Auto-Lock", body: "Automatic idle lock and secure Clerk session sign-out.", icon: "clock-outline" }
];

export const attendanceRows = [
  { id: "s1", name: "Aarav Sharma", roll: "08", status: "Present" },
  { id: "s2", name: "Meera Patel", roll: "14", status: "Present" },
  { id: "s3", name: "Rohan Singh", roll: "22", status: "Absent" },
  { id: "s4", name: "Naina Gupta", roll: "29", status: "Late" }
];

export const feeItems = [
  { label: "Tuition fee", value: "Rs 18,000" },
  { label: "Transport", value: "Rs 4,200" },
  { label: "Library", value: "Rs 600" }
];

export const quickActions = {
  Parent: ["Student Dashboard", "Fees", "Reports", "Bus"],
  Student: ["Homework", "Timetable", "Resources", "Reports"],
  Teacher: ["Attendance", "Gradebook", "Messages", "Newsletters"],
  Admin: ["Notifications", "Transport", "Staff", "Security"]
};

export function tabForAction(action) {
  const map = {
    "Student Dashboard": "Dashboard",
    Timetable: "Timetable",
    Fees: "Fees",
    Bus: "Bus",
    Transport: "Transport",
    Staff: "Staff",
    Security: "Security",
    Newsletters: "Newsletters",
    Calendar: "Calendar",
    Homework: "Homework",
    Reports: "Reports",
    Resources: "Resources",
    Attendance: "Attendance",
    Gradebook: "Gradebook",
    Messages: "Messages",
    Notifications: "Notifications",
    News: "News",
    IDs: "IDs",
    Students: "Students"
  };
  return map[action] || "Home";
}
