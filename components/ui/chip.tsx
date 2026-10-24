import { Fonts, Radius, Spacing, Palette } from "@/constants/theme";
import { useStyles } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { FieldLabel } from "./input";

export type Option<T extends string> = { label: string; value: T };

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  grow?: boolean;
};

export function Chip({ label, selected = false, onPress, grow = false }: ChipProps) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, grow && styles.grow, selected && styles.chipSelected]}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

type ChipGroupProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  grow?: boolean;
  containerStyle?: ViewStyle;
};

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  grow = false,
  containerStyle,
}: ChipGroupProps<T>) {
  const styles = useStyles(makeStyles);
  return (
    <View style={containerStyle}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View style={styles.row}>
        {options.map((o) => (
          <Chip
            key={o.value}
            label={o.label}
            selected={o.value === value}
            onPress={() => onChange(o.value)}
            grow={grow}
          />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.chip,
    backgroundColor: c.surface,
    borderWidth: 1.5,
    borderColor: c.border,
    alignItems: "center",
  },
  grow: { flex: 1 },
  chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontFamily: Fonts.bodyBold, fontSize: 13, color: c.textMuted },
  chipTextSelected: { color: c.onPrimary },
});
