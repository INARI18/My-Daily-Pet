import { Fonts, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type BadgeTone = "today" | "week" | "overdue" | "done" | "info";

const TONES = (c: Palette): Record<BadgeTone, { bg: string; text: string }> => ({
  today: { bg: c.warningSoft, text: c.warning },
  week: { bg: c.successSoft, text: c.success },
  overdue: { bg: c.dangerSoft, text: c.danger },
  done: { bg: c.primarySoft, text: c.primary },
  info: { bg: c.border, text: c.textMuted },
});

export function Badge({ tone, text }: { tone: BadgeTone; text: string }) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = TONES(c)[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.text }]}>{text.toUpperCase()}</Text>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  text: { fontFamily: Fonts.bodyBold, fontSize: 10, letterSpacing: 0.4 },
});
