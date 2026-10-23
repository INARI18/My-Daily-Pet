import { Colors, Shadow } from "@/constants/theme";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native";

const SIZES = { s: 40, m: 56, l: 84 } as const;

type AvatarProps = {
  source: ImageSourcePropType;
  size?: keyof typeof SIZES;
  style?: ViewStyle;
};

export function Avatar({ source, size = "m", style }: AvatarProps) {
  const px = SIZES[size];
  return (
    <View
      style={[
        styles.box,
        { width: px, height: px, borderRadius: Math.round(px * 0.3) },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: px * 0.72, height: px * 0.72 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
});
