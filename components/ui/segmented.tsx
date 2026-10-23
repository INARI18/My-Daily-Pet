import { Colors, Fonts, Radius } from "@/constants/theme";
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

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.control,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 4,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.control - 4,
    alignItems: "center",
  },
  itemSelected: { backgroundColor: Colors.accentSoft },
  text: { fontFamily: Fonts.bodyBold, fontSize: 13, color: Colors.textMuted },
  textSelected: { color: Colors.primary },
});
