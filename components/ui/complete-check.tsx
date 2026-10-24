import { Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

type CompleteCheckProps = {
  onComplete?: () => Promise<void> | void;
  checked?: boolean; // static, already done
};

// Task-list style check: empty circle that fills when tapped.
export function CompleteCheck({ onComplete, checked = false }: CompleteCheckProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  const [pending, setPending] = useState(false);
  const filled = checked || pending;

  const handlePress = async () => {
    if (!onComplete) return;
    setPending(true);
    try {
      await onComplete();
    } finally {
      setPending(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={checked || pending || !onComplete}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: filled }}
      accessibilityLabel={checked ? t("common.done") : t("common.markDone")}
      style={({ pressed }) => [styles.circle, filled && styles.filled, pressed && styles.pressed]}
    >
      <Check
        size={16}
        strokeWidth={3}
        color={filled ? c.onPrimary : c.border}
      />
    </Pressable>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: { backgroundColor: c.success, borderColor: c.success },
  pressed: { opacity: 0.7 },
});
