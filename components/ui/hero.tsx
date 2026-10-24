import { Fonts, Radius, Shadow, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

type HeroProps = {
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  imageSize?: number;
  onBack?: () => void;
  right?: React.ReactNode;
};

// Lilac block with the screen title and one of the illustrations; replaces Header
// on the main screens so every screen has a piece of the illustration set.
export function Hero({ title, subtitle, image, imageSize = 96, onBack, right }: HeroProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  return (
    <View style={styles.wrap}>
      {onBack || right ? (
        <View style={styles.toolbar}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8} accessibilityLabel={t("common.back")}>
              <ArrowLeft size={20} color={c.primary} />
            </Pressable>
          ) : (
            <View />
          )}
          {right}
        </View>
      ) : null}
      <View style={styles.block}>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Image
          source={image}
          style={[styles.image, { width: imageSize, height: imageSize * 0.9 }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  wrap: { paddingTop: Spacing.lg, marginBottom: Spacing.lg },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: c.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  block: {
    backgroundColor: c.accentSoft,
    borderRadius: Radius.card + 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    overflow: "hidden",
  },
  text: { flex: 1 },
  title: { fontFamily: Fonts.title, fontSize: 26, lineHeight: 30, color: c.text },
  subtitle: {
    fontFamily: Fonts.bodyStrong,
    fontSize: 13,
    color: c.primary,
    opacity: 0.85,
    marginTop: 4,
  },
  image: { marginVertical: -Spacing.xs },
});
