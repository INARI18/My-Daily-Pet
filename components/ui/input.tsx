import { Fonts, Radius, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
  right?: React.ReactNode;
};

export function FieldLabel({ children }: { children: string }) {
  const styles = useStyles(makeStyles);
  return <Text style={styles.label}>{children}</Text>;
}

export function FieldError({ children }: { children?: string | null }) {
  const styles = useStyles(makeStyles);
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

export function Input({
  label,
  error,
  containerStyle,
  right,
  style,
  multiline,
  ...rest
}: InputProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  return (
    <View style={containerStyle}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View>
        <TextInput
          placeholderTextColor={c.textMuted}
          multiline={multiline}
          style={[
            styles.input,
            multiline && styles.multiline,
            !!error && styles.inputError,
            !!right && styles.withRight,
            style,
          ]}
          {...rest}
        />
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      <FieldError>{error}</FieldError>
    </View>
  );
}

export const makeFieldStyles = (c: Palette) => StyleSheet.create({
  box: {
    backgroundColor: c.surface,
    borderRadius: Radius.control,
    borderWidth: 1.5,
    borderColor: c.border,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    justifyContent: "center",
  },
});

const makeStyles = (c: Palette) => StyleSheet.create({
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: c.textMuted,
    marginBottom: 6,
  },
  input: {
    ...makeFieldStyles(c).box,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: c.text,
    paddingVertical: 12,
  },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  inputError: { borderColor: c.danger },
  withRight: { paddingRight: 40 },
  right: { position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" },
  error: {
    fontFamily: Fonts.bodyStrong,
    fontSize: 12,
    color: c.danger,
    marginTop: 4,
  },
});
