import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
};

export function ThemedButton({
  title,
  onPress,
  loading,
  style,
  icon,
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
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.text}>{title}</Text>
        </>
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
    flexDirection: "row",
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
  iconContainer: {
    marginRight: 8,
  },
});
