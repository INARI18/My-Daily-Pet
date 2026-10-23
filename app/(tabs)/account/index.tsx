import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Colors, Fonts, Radius, Shadow, Spacing } from "@/constants/theme";
import { auth } from "@/firebase-config";
import { useLanguage } from "@/hooks/use-preferences";
import { deleteAccount, logOut, sendPasswordReset } from "@/services/account";
import { getFirebaseErrorMessage } from "@/services/firebaseErrorHandler";
import {
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  Trash2,
  UserRound,
} from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
] as const;

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Row({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && styles.pressed]}
    >
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>{icon}</View>
      <View style={styles.flex}>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

export default function Account() {
  const [language, setLanguage] = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);
  const email = auth.currentUser?.email ?? "";

  const handlePasswordReset = () => {
    Alert.alert("Change password", `We will email a reset link to ${email}.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send email",
        onPress: async () => {
          try {
            await sendPasswordReset();
            Alert.alert("Email sent", "Check your inbox to set a new password.");
          } catch (err: any) {
            Alert.alert("Error", getFirebaseErrorMessage(err.code));
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This permanently deletes your account, all pets and all events. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete everything",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (err: any) {
              Alert.alert("Error", getFirebaseErrorMessage(err.code));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logOut();
          } catch {
            Alert.alert("Error", "Could not log out. Please try again.");
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title="Account" />

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <UserRound size={40} color={Colors.primary} strokeWidth={1.8} />
        </View>
        <View style={styles.emailPill}>
          <Mail size={14} color={Colors.primary} />
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <SectionTitle>Preferences</SectionTitle>
      <Card style={styles.card}>
        <Segmented label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
        <Text style={styles.hint}>Texts will follow this setting once translations are in.</Text>
      </Card>

      <SectionTitle>Security</SectionTitle>
      <Card style={styles.listCard}>
        <Row
          icon={<KeyRound size={18} color={Colors.primary} />}
          title="Change password"
          subtitle="We send a reset link to your email"
          onPress={handlePasswordReset}
        />
        <Row
          icon={<Trash2 size={18} color={Colors.danger} />}
          title="Delete account"
          subtitle="Removes your pets and events for good"
          onPress={handleDeleteAccount}
          danger
          last
        />
      </Card>

      <Button
        title="Log out"
        variant="ghost"
        icon={<LogOut size={16} color={Colors.textMuted} />}
        onPress={handleLogout}
        loading={loggingOut}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { alignItems: "center", marginTop: Spacing.sm, marginBottom: Spacing.xl, gap: Spacing.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.avatar,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  emailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
  },
  email: { fontFamily: Fonts.bodyStrong, fontSize: 14, color: Colors.primary },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  card: { marginBottom: Spacing.xl },
  hint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted, marginTop: Spacing.sm },
  listCard: { paddingVertical: 4, marginBottom: Spacing.xl },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.md, paddingVertical: Spacing.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  pressed: { opacity: 0.7 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconDanger: { backgroundColor: Colors.dangerSoft },
  rowTitle: { fontFamily: Fonts.titleMedium, fontSize: 15, color: Colors.text },
  rowSubtitle: { fontFamily: Fonts.body, fontSize: 12.5, color: Colors.textMuted, marginTop: 1 },
  dangerText: { color: Colors.danger },
  logout: { marginTop: Spacing.sm },
});
