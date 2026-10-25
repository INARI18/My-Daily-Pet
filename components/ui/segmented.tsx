import { Fonts, Radius, Palette } from "@/constants/theme";
import { useStyles } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import type { Option } from "./chip";
import { FieldLabel } from "./input";

type SegmentedProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  containerStyle?: ViewStyle;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  containerStyle,
}: SegmentedProps<T>) {
  const styles = useStyles(makeStyles);
  return (
    <View style={containerStyle}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View style={styles.track}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[styles.item, selected && styles.itemSelected]}
              accessibilityState={{ selected }}
            >
              <Text style={[styles.text, selected && styles.textSelected]}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: c.surface,
    borderRadius: Radius.control,
    borderWidth: 1.5,
    borderColor: c.border,
    padding: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.control - 4,
    alignItems: "center",
  },
  itemSelected: { backgroundColor: c.accentSoft },
  text: { fontFamily: Fonts.bodyBold, fontSize: 13, color: c.textMuted },
  textSelected: { color: c.primary },
});
