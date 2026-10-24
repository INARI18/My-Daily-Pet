import { Fonts, Radius, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "accent" | "light" | "ghost" | "danger";

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

const VARIANT_STYLES = (c: Palette): Record<Variant, { bg: string; text: string; border?: string }> => ({
  primary: { bg: c.primary, text: c.onPrimary },
  accent: { bg: c.accent, text: c.onPrimary },
  light: { bg: c.onBrand, text: c.brand }, // for use on the auth screens
  ghost: { bg: "transparent", text: c.textMuted, border: c.border },
  danger: { bg: c.dangerSoft, text: c.danger },
});

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
  const styles = useStyles(makeStyles);
  const c = useColors();
  const v = VARIANT_STYLES(c)[variant];
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

const makeStyles = (c: Palette) => StyleSheet.create({
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
