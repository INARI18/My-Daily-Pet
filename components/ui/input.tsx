import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
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
  return <Text style={styles.label}>{children}</Text>;
}

export function FieldError({ children }: { children?: string | null }) {
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
  return (
    <View style={containerStyle}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View>
        <TextInput
          placeholderTextColor={Colors.textMuted}
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

export const fieldStyles = StyleSheet.create({
  box: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.control,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginBottom: 6,
  },
  input: {
    ...fieldStyles.box,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 12,
  },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  inputError: { borderColor: Colors.danger },
  withRight: { paddingRight: 40 },
  right: { position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" },
  error: {
    fontFamily: Fonts.bodyStrong,
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
});
