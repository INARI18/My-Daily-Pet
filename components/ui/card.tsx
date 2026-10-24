import { Radius, Shadow, Spacing, Palette } from "@/constants/theme";
import { useStyles } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, style }: CardProps) {
  const styles = useStyles(makeStyles);
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const makeStyles = (c: Palette) => StyleSheet.create({
  card: {
    backgroundColor: c.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg - 2,
    borderWidth: 1,
    borderColor: c.cardBorder,
    ...Shadow.card,
  },
  pressed: { opacity: 0.85 },
});
