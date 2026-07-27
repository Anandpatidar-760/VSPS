import { StyleSheet, Platform, StatusBar } from "react-native";
import { colors } from "../constants/theme";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  app: {
    flex: 1,
    backgroundColor: colors.bg
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.ink,
    overflow: "hidden"
  },
  brandText: {
    flex: 1
  },
  schoolName: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3
  },
  schoolMeta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500"
  },
  sessionStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    backgroundColor: "#CCFBF1",
    borderColor: "#99F6E4",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  sessionText: {
    flex: 1,
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700"
  },
  sessionLink: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: "800"
  },
  roleRow: {
    gap: 8,
    paddingTop: 14
  },
  roleChip: {
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC"
  },
  roleChipActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  roleText: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 13
  },
  roleTextActive: {
    color: "#FFFFFF"
  },
  content: {
    padding: 18,
    paddingBottom: 120
  },
  hero: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    elevation: 2,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6
  },
  heroText: {
    flex: 1,
    paddingRight: 10
  },
  eyebrow: {
    color: colors.blue,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5
  },
  heroTitle: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 28,
    marginTop: 4,
    letterSpacing: -0.5
  },
  heroBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    fontWeight: "500"
  },
  heroLogoImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.ink,
    overflow: "hidden"
  },
  idLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink,
    overflow: "hidden"
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 14,
    letterSpacing: -0.4
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  actionCard: {
    width: "48%",
    minHeight: 96,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderColor: colors.line,
    borderWidth: 1,
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4
  },
  actionText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "700"
  },
  featurePanel: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    gap: 14
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 4
  },
  stack: {
    gap: 12
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderColor: colors.line,
    borderWidth: 1,
    overflow: "hidden",
    paddingRight: 14
  },
  alertStripe: {
    width: 6,
    alignSelf: "stretch"
  },
  alertBody: {
    flex: 1,
    padding: 14
  },
  cardKicker: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800"
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  timelineItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "stretch"
  },
  datePill: {
    width: 68,
    borderRadius: 12,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    padding: 8
  },
  dateText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 13
  },
  timelineContent: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14
  },
  newsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  linkText: {
    color: colors.blue,
    fontWeight: "800",
    marginTop: 10
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  },
  rollCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center"
  },
  rollText: {
    color: colors.blue,
    fontWeight: "800"
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  statusText: {
    fontWeight: "800",
    fontSize: 12
  },
  flex: {
    flex: 1
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    marginTop: 14,
    elevation: 2,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  gradeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 15
  },
  remarkInput: {
    flex: 1
  },
  largeInput: {
    minHeight: 96,
    marginTop: 10,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  timetableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9"
  },
  timeText: {
    width: 76,
    color: colors.muted,
    fontWeight: "700"
  },
  subjectText: {
    color: colors.ink,
    fontWeight: "700"
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14
  },
  metric: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  feeValue: {
    color: colors.ink,
    fontWeight: "800"
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginTop: 10,
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  totalValue: {
    color: colors.blue,
    fontSize: 22,
    fontWeight: "900"
  },
  paymentMethods: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6
  },
  segmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  methodChip: {
    flex: 1,
    borderRadius: 10,
    borderColor: colors.line,
    borderWidth: 1,
    backgroundColor: colors.surface,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center"
  },
  methodText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 13
  },
  reportCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16
  },
  progressRow: {
    marginTop: 14
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    marginTop: 8,
    overflow: "hidden"
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.teal
  },
  progressValue: {
    alignSelf: "flex-end",
    color: colors.ink,
    fontWeight: "800",
    marginTop: 4
  },
  chatBox: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12
  },
  bubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 14,
    maxWidth: "84%"
  },
  bubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: colors.blue
  },
  bubbleText: {
    color: colors.ink,
    lineHeight: 20
  },
  bubbleTextMine: {
    color: "#FFFFFF"
  },
  messageInputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center"
  },
  mapMock: {
    height: 260,
    borderRadius: 14,
    backgroundColor: "#CCFBF1",
    borderColor: "#99F6E4",
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden"
  },
  routeLine: {
    position: "absolute",
    width: 220,
    height: 4,
    backgroundColor: colors.teal,
    top: 132,
    left: 44,
    transform: [{ rotate: "-28deg" }]
  },
  stopDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: colors.teal
  },
  stopOne: {
    top: 176,
    left: 38
  },
  stopTwo: {
    top: 118,
    left: 154
  },
  stopThree: {
    top: 68,
    right: 54
  },
  busMarker: {
    position: "absolute",
    top: 94,
    left: 166,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFFFFF",
    borderWidth: 3
  },
  idCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center"
  },
  staffAvatar: {
    backgroundColor: colors.teal
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 18
  },
  idName: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 17
  },
  idMeta: {
    color: colors.muted,
    marginTop: 2
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  securityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  securityCard: {
    width: "48%",
    minHeight: 160,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 8
  },
  tabShell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingTop: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6
  },
  tabRow: {
    gap: 8,
    paddingHorizontal: 14
  },
  tabItem: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center"
  },
  tabItemActive: {
    backgroundColor: colors.blue
  },
  tabText: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 13
  },
  tabTextActive: {
    color: "#FFFFFF"
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFE4E6",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  logoutBtnText: {
    color: colors.red,
    fontWeight: "800",
    fontSize: 12
  },
  loginBtnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.blue,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  loginBtnHeaderText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12
  },
  authSafe: {
    flex: 1,
    backgroundColor: colors.bg
  },
  authScroll: {
    padding: 22
  },
  authHeader: {
    alignItems: "center",
    marginVertical: 18
  },
  authLogo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 14
  },
  authSchoolTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.ink,
    textAlign: "center",
    letterSpacing: -0.4
  },
  authSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    fontWeight: "500"
  },
  authSegment: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20
  },
  authSegmentBtn: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 10
  },
  authSegmentBtnActive: {
    backgroundColor: colors.blue
  },
  authSegmentText: {
    fontWeight: "800",
    fontSize: 13,
    color: colors.muted
  },
  authSegmentTextActive: {
    color: "#FFFFFF"
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderColor: colors.line,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8
  },
  jsonNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16
  },
  jsonNoticeText: {
    fontSize: 13,
    color: colors.ink,
    flex: 1,
    lineHeight: 18
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 6,
    marginTop: 12
  },
  rowInputs: {
    flexDirection: "row",
    gap: 10
  },
  primaryAuthBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.blue,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 22
  },
  primaryAuthBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15
  },
  rolePickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  rolePickChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderColor: colors.line,
    borderWidth: 1
  },
  rolePickChipActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  rolePickText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink
  },
  rolePickTextActive: {
    color: "#FFFFFF"
  },
  closeAuthBtn: {
    alignItems: "center",
    marginTop: 20,
    padding: 10
  },
  closeAuthText: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 13,
    textDecorationLine: "underline"
  },
  jsonFileBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#CCFBF1",
    borderColor: "#99F6E4",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14
  },
  jsonFileTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.ink
  },
  jsonFileUri: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2
  },
  jsonCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.teal,
    marginTop: 4
  },
  dbBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#CCFBF1",
    borderColor: "#99F6E4",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  dbBannerText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.ink
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.blue
  },
  crudLegend: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap"
  },
  crudItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  crudBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  crudBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900"
  },
  crudLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted
  },
  crudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3
  },
  crudRowMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  rolePillRow: {
    flexDirection: "row",
    marginTop: 4
  },
  rolePill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8
  },
  rolePillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900"
  },
  crudActions: {
    gap: 8,
    alignItems: "center"
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFE4E6",
    borderColor: "#FECDD3",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 44,
    gap: 10
  },
  emptyStateText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 17
  },
  emptyStateSubText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center"
  },
  editModalHeader: {
    alignItems: "center",
    gap: 6,
    marginBottom: 22
  },
  editModalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.ink
  },
  editModalSub: {
    fontSize: 13,
    color: colors.muted
  },
  idCardHighlight: {
    borderColor: colors.blue,
    borderWidth: 2,
    backgroundColor: "#EEF2FF"
  },
  yourBadge: {
    position: "absolute",
    top: -10,
    right: 14,
    backgroundColor: colors.blue,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  yourBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5
  },
  idMetaSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2
  },
  clerkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 8
  },
  clerkBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.teal
  }
});
