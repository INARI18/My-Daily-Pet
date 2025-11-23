import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
};

export function ThemedButton({
  title,
  onPress,
  loading,
  style,
}: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style, loading && styles.disabledButton]}
      onPress={loading ? undefined : onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Palette.neutral.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Palette.purple.darker,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: Palette.purple.light,
  },
  text: {
    color: Palette.neutral.white,
    fontFamily: Fonts.nunito.extraBold,
    fontSize: 16,
  },
});
