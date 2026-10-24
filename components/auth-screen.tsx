import { Fonts, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { Bone, Cat, Dog, PawPrint } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// decorative pet icons scattered around the login/register screens
const DECORATIONS: { Icon: typeof Dog; size: number; style: ViewStyle }[] = [
  { Icon: Dog, size: 120, style: { top: -20, left: -40, transform: [{ rotate: "-20deg" }] } },
  { Icon: Cat, size: 100, style: { top: 20, right: -25, transform: [{ rotate: "25deg" }] } },
  { Icon: Cat, size: 130, style: { bottom: -45, left: -50, transform: [{ rotate: "15deg" }] } },
  { Icon: Dog, size: 105, style: { bottom: -30, right: -35, transform: [{ rotate: "-30deg" }] } },
  { Icon: PawPrint, size: 70, style: { top: "40%", left: -25, transform: [{ rotate: "10deg" }] } },
  { Icon: Bone, size: 85, style: { top: "50%", right: -20, transform: [{ rotate: "25deg" }] } },
  { Icon: Bone, size: 65, style: { top: "12%", left: "50%", transform: [{ rotate: "30deg" }] } },
  { Icon: Bone, size: 75, style: { bottom: "8%", left: "40%", transform: [{ rotate: "-18deg" }] } },
  { Icon: PawPrint, size: 50, style: { top: "18%", left: "15%", transform: [{ rotate: "-70deg" }] } },
  { Icon: PawPrint, size: 55, style: { bottom: "15%", right: "12%", transform: [{ rotate: "-25deg" }] } },
];

type AuthScreenProps = {
  title: string;
  subtitle: string;
  error?: string | null;
  children: React.ReactNode;
};

export function AuthScreen({ title, subtitle, error, children }: AuthScreenProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  return (
    <SafeAreaView style={styles.safe}>
      {DECORATIONS.map(({ Icon, size, style }, i) => (
        <View key={i} style={[styles.decoration, style]} pointerEvents="none">
          <Icon size={size} color={c.onBrand} strokeWidth={1.5} />
        </View>
      ))}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <View style={styles.form}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.brand, overflow: "hidden" },
  decoration: { position: "absolute", opacity: 0.12 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: Spacing.xl },
  title: {
    fontFamily: Fonts.title,
    fontSize: 40,
    color: c.onBrand,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Fonts.bodyStrong,
    fontSize: 15,
    color: c.onBrand,
    textAlign: "center",
    opacity: 0.85,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },
  errorBox: {
    backgroundColor: c.dangerSoft,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.bodyStrong,
    fontSize: 13,
    color: c.danger,
    textAlign: "center",
  },
  form: { gap: Spacing.md },
});
