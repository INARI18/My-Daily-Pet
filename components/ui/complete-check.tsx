import { Colors } from "@/constants/theme";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

type CompleteCheckProps = {
  onComplete?: () => Promise<void> | void;
  checked?: boolean; // static, already done
};

// Task-list style check: empty circle that fills when tapped.
export function CompleteCheck({ onComplete, checked = false }: CompleteCheckProps) {
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
      accessibilityLabel={checked ? "Done" : "Mark as done"}
      style={({ pressed }) => [styles.circle, filled && styles.filled, pressed && styles.pressed]}
    >
      <Check
        size={16}
        strokeWidth={3}
        color={filled ? Colors.onPrimary : Colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: { backgroundColor: Colors.success, borderColor: Colors.success },
  pressed: { opacity: 0.7 },
});
