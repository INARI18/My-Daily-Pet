import { Palette } from "@/constants/palette";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type InputFilter = "none" | "alphabetic" | "int" | "numeric";

type ThemedInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  filter?: InputFilter;
  error?: string | null;
};

export function ThemedInput({
  containerStyle,
  style,
  isPassword = false,
  filter = "none",
  onChangeText,
  keyboardType,
  error = null,
  value,
  onBlur,
  ...props
}: ThemedInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const filterText = (text: string) => {
    switch (filter) {
      case "alphabetic":
        return text.replace(/[^A-Za-z\u00C0-\u017F\s]/g, "");
      case "int":
        return text.replace(/[^0-9]/g, "");
      case "numeric":
        return text.replace(/[^0-9.]/g, "");
      case "none":
      default:
        return text;
    }
  };

  const handleChangeText = (text: string) => {
    const filtered = filterText(text);
    if (filtered !== text) {
      onChangeText?.(filtered);
    } else {
      onChangeText?.(filtered);
    }
  };

  const resolvedKeyboardType: KeyboardTypeOptions | undefined =
    keyboardType ?? (filter === "numeric" ? "numeric" : undefined);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        value={value} // ensure value prop is passed to TextInput
        style={[styles.input, error && styles.inputError, style]}
        secureTextEntry={isPassword && !isPasswordVisible}
        onChangeText={handleChangeText}
        keyboardType={resolvedKeyboardType}
        onBlur={onBlur}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible((prev) => !prev)}
          style={styles.eyeIcon}
        >
          {isPasswordVisible ? (
            <Eye color={Palette.neutral.gray} size={24} />
          ) : (
            <EyeOff color={Palette.neutral.gray} size={24} />
          )}
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Palette.neutral.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Palette.neutral.white,
    fontSize: 16,
  },
  inputError: {
    borderColor: Palette.buttons.warning,
    borderWidth: 1.5,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  errorText: {
    color: Palette.buttons.warning,
    fontSize: 12,
    marginTop: 4,
  },
});
