import { Colors, Shadow } from "@/constants/theme";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native";

const SIZES = { s: 40, m: 56, l: 84 } as const;

// background tint per pet type
const TONES = { dog: "#FFF1DC", cat: Colors.accentSoft, none: Colors.surface } as const;

type AvatarProps = {
  source: ImageSourcePropType;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  style?: ViewStyle;
};

export function Avatar({ source, size = "m", tone = "none", style }: AvatarProps) {
  const px = SIZES[size];
  return (
    <View
      style={[
        styles.box,
        { width: px, height: px, borderRadius: Math.round(px * 0.3), backgroundColor: TONES[tone] },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: px * 0.74, height: px * 0.74 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
});
