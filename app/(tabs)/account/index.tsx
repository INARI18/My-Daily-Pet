import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Colors, Fonts, Radius, Shadow, Spacing } from "@/constants/theme";
import { auth } from "@/firebase-config";
import { signOut } from "firebase/auth";
import { LogOut, Mail, UserRound } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function Account() {
  const [loading, setLoading] = useState(false);
  const email = auth.currentUser?.email ?? "";

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(auth);
          } catch {
            Alert.alert("Error", "Could not log out. Please try again.");
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <Header title="Account" />
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <UserRound size={44} color={Colors.primary} strokeWidth={1.8} />
        </View>
        <View style={styles.emailPill}>
          <Mail size={14} color={Colors.primary} />
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <View style={styles.flex} />
      <Button
        title="Log out"
        variant="danger"
        icon={<LogOut size={16} color={Colors.danger} />}
        onPress={handleLogout}
        loading={loading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { alignItems: "center", marginTop: Spacing.xl, gap: Spacing.md },
  avatar: {
    width: 96,
    height: 96,
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
});
