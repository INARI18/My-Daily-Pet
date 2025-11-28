import { ThemedText } from "@/components/themed-text";
import { Fonts } from "@/constants/fonts";
import React from "react";
import { StyleSheet, View } from "react-native";

type BadgeProps = {
  text: string;
  backgroundColor?: string;
  textColor?: string;
};

export default function Badge({
  text,
  backgroundColor = "#000",
  textColor = "#fff",
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText style={[styles.badgeText, { color: textColor }]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 8,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    elevation: 50,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Fonts.fredoka.bold,
    color: "#fff",
    textTransform: "uppercase",
  },
});
