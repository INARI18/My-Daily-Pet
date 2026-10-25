import { Shadow, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from "react-native";

const SIZES = { s: 40, m: 56, l: 84 } as const;


type AvatarProps = {
  source: ImageSourcePropType;
  size?: keyof typeof SIZES;
  tone?: "dog" | "cat" | "none"; // background tint per pet type
  style?: ViewStyle;
};

export function Avatar({ source, size = "m", tone = "none", style }: AvatarProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const tones = { dog: c.petDog, cat: c.petCat, none: c.surface };
  const px = SIZES[size];
  return (
    <View
      style={[
        styles.box,
        { width: px, height: px, borderRadius: Math.round(px * 0.3), backgroundColor: tones[tone] },
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

const makeStyles = (c: Palette) => StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
});
