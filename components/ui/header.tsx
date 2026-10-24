import { Colors, Fonts, Radius, Shadow, Spacing } from "@/constants/theme";
import { useT } from "@/i18n/LanguageProvider";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export function Header({ title, onBack, right }: HeaderProps) {
  const t = useT();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={styles.iconButton}
          hitSlop={8}
          accessibilityLabel={t("common.back")}
        >
          <ArrowLeft size={20} color={Colors.primary} />
        </Pressable>
      ) : null}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

export function HeaderIconButton({
  onPress,
  children,
  accessibilityLabel,
}: {
  onPress: () => void;
  children: React.ReactNode;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.iconButton}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.text,
  },
});
