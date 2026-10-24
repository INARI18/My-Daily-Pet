import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Fonts, Radius, Shadow, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles, useThemePreference } from "@/theme/ThemeProvider";
import { auth } from "@/firebase-config";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { deleteAccount, logOut, sendPasswordReset } from "@/services/account";
import { exportDataAsJson } from "@/services/export";
import { getFirebaseErrorMessage } from "@/services/firebaseErrorHandler";
import {
  PermissionState,
  ensurePermission,
  getPermissionState,
  syncReminders,
} from "@/services/notifications";
import { getNotificationsEnabled, setNotificationsEnabled } from "@/services/preferences";
import { useFocusEffect } from "expo-router";
import {
  ChevronRight,
  Download,
  KeyRound,
  LogOut,
  Mail,
  Trash2,
  UserRound,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Português", value: "pt" },
] as const;

function SectionTitle({ children }: { children: string }) {
  const styles = useStyles(makeStyles);
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
  const c = useColors();
  const styles = useStyles(makeStyles);
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
      <ChevronRight size={18} color={c.textMuted} />
    </Pressable>
  );
}

export default function Account() {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  const [language, setLanguage] = useLanguage();
  const [themePreference, setThemePreference] = useThemePreference();
  const themeOptions = (["system", "light", "dark"] as const).map((v) => ({
    label: t(`account.themeOptions.${v}`),
    value: v,
  }));
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [permission, setPermission] = useState<PermissionState>("undetermined");
  const email = auth.currentUser?.email ?? "";

  useFocusEffect(
    useCallback(() => {
      getNotificationsEnabled().then(setNotificationsOn);
      if (Platform.OS !== "web") getPermissionState().then(setPermission);
    }, [])
  );

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsOn(value);
    await setNotificationsEnabled(value);
    if (value && Platform.OS !== "web") {
      await ensurePermission();
      setPermission(await getPermissionState());
    }
    syncReminders().catch(() => {});
  };

  const handleExport = async () => {
    try {
      await exportDataAsJson();
    } catch (err: any) {
      Alert.alert(t("common.error"), err?.message ?? t("account.exportError"));
    }
  };

  const handlePasswordReset = () => {
    Alert.alert(t("account.resetConfirm.title"), t("account.resetConfirm.message", { email }), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.resetConfirm.send"),
        onPress: async () => {
          try {
            await sendPasswordReset();
            Alert.alert(t("account.emailSent.title"), t("account.emailSent.message"));
          } catch (err: any) {
            Alert.alert(t("common.error"), getFirebaseErrorMessage(err.code));
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("account.deleteConfirm.title"), t("account.deleteConfirm.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.deleteConfirm.confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAccount();
          } catch (err: any) {
            Alert.alert(t("common.error"), getFirebaseErrorMessage(err.code));
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(t("account.logoutConfirm.title"), t("account.logoutConfirm.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("account.logout"),
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logOut();
          } catch {
            Alert.alert(t("common.error"), t("account.logoutError"));
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title={t("account.title")} />

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <UserRound size={40} color={c.primary} strokeWidth={1.8} />
        </View>
        <View style={styles.emailPill}>
          <Mail size={14} color={c.primary} />
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <SectionTitle>{t("account.preferences")}</SectionTitle>
      <Card style={styles.card}>
        <Segmented
          label={t("account.language")}
          options={LANGUAGES}
          value={language}
          onChange={setLanguage}
        />
        <Segmented
          label={t("account.theme")}
          options={themeOptions}
          value={themePreference}
          onChange={setThemePreference}
          containerStyle={styles.themeRow}
        />
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <Text style={styles.switchTitle}>{t("notifications.setting")}</Text>
            <Text style={styles.switchHint}>{t("notifications.settingHint")}</Text>
          </View>
          <Switch
            value={notificationsOn}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: c.border, true: c.accent }}
            thumbColor={c.surface}
          />
        </View>
        {notificationsOn && permission === "denied" ? (
          <View style={styles.deniedBox}>
            <Text style={styles.deniedText}>{t("notifications.denied")}</Text>
            <Button
              title={t("notifications.openSettings")}
              variant="ghost"
              size="sm"
              onPress={() => Linking.openSettings()}
            />
          </View>
        ) : null}
        {notificationsOn && permission === "unavailable" && Platform.OS !== "web" ? (
          <View style={styles.deniedBox}>
            <Text style={styles.deniedText}>{t("notifications.unavailable")}</Text>
          </View>
        ) : null}
      </Card>

      <SectionTitle>{t("account.data")}</SectionTitle>
      <Card style={styles.listCard}>
        <Row
          icon={<Download size={18} color={c.primary} />}
          title={t("account.export.title")}
          subtitle={t("account.export.subtitle")}
          onPress={handleExport}
          last
        />
      </Card>

      <SectionTitle>{t("account.security")}</SectionTitle>
      <Card style={styles.listCard}>
        <Row
          icon={<KeyRound size={18} color={c.primary} />}
          title={t("account.changePassword.title")}
          subtitle={t("account.changePassword.subtitle")}
          onPress={handlePasswordReset}
        />
        <Row
          icon={<Trash2 size={18} color={c.danger} />}
          title={t("account.deleteAccount.title")}
          subtitle={t("account.deleteAccount.subtitle")}
          onPress={handleDeleteAccount}
          danger
          last
        />
      </Card>

      <Button
        title={t("account.logout")}
        variant="ghost"
        icon={<LogOut size={16} color={c.textMuted} />}
        onPress={handleLogout}
        loading={loggingOut}
        style={styles.logout}
      />
    </Screen>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  flex: { flex: 1 },
  profile: { alignItems: "center", marginTop: Spacing.sm, marginBottom: Spacing.xl, gap: Spacing.md },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.avatar,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  emailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: c.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
  },
  email: { fontFamily: Fonts.bodyStrong, fontSize: 14, color: c.primary },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: c.textMuted,
    marginBottom: Spacing.sm,
  },
  card: { marginBottom: Spacing.xl },
  themeRow: { marginTop: Spacing.lg },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  switchTitle: { fontFamily: Fonts.titleMedium, fontSize: 15, color: c.text },
  switchHint: { fontFamily: Fonts.body, fontSize: 12, color: c.textMuted, marginTop: 1 },
  deniedBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.chip,
    backgroundColor: c.dangerSoft,
    gap: Spacing.sm,
  },
  deniedText: { fontFamily: Fonts.bodyStrong, fontSize: 12.5, color: c.danger },
  listCard: { paddingVertical: 4, marginBottom: Spacing.xl },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.md, paddingVertical: Spacing.md },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: c.border },
  pressed: { opacity: 0.7 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: c.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconDanger: { backgroundColor: c.dangerSoft },
  rowTitle: { fontFamily: Fonts.titleMedium, fontSize: 15, color: c.text },
  rowSubtitle: { fontFamily: Fonts.body, fontSize: 12.5, color: c.textMuted, marginTop: 1 },
  dangerText: { color: c.danger },
  logout: { marginTop: Spacing.sm },
});
