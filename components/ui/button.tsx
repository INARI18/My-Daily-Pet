import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "accent" | "ghost" | "danger";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: "md" | "sm";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: Colors.primary, text: Colors.onPrimary },
  accent: { bg: Colors.accent, text: Colors.onPrimary },
  ghost: { bg: "transparent", text: Colors.textMuted, border: Colors.border },
  danger: { bg: Colors.dangerSoft, text: Colors.danger },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        size === "sm" && styles.sm,
        { backgroundColor: v.bg },
        v.border && { borderWidth: 2, borderColor: v.border },
        pressed && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[styles.label, size === "sm" && styles.labelSm, { color: v.text }]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.control,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  sm: { paddingVertical: 8, paddingHorizontal: Spacing.md },
  content: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  label: { fontFamily: Fonts.titleMedium, fontSize: 16 },
  labelSm: { fontSize: 14 },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
