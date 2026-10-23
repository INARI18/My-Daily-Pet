import { Colors, Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type BadgeTone = "today" | "week" | "overdue" | "done" | "info";

const TONES: Record<BadgeTone, { bg: string; text: string }> = {
  today: { bg: Colors.warningSoft, text: Colors.warning },
  week: { bg: Colors.successSoft, text: Colors.success },
  overdue: { bg: Colors.dangerSoft, text: Colors.danger },
  done: { bg: Colors.primarySoft, text: Colors.primary },
  info: { bg: Colors.border, text: Colors.textMuted },
};

export function Badge({ tone, text }: { tone: BadgeTone; text: string }) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.text }]}>{text.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  text: { fontFamily: Fonts.bodyBold, fontSize: 10, letterSpacing: 0.4 },
});
