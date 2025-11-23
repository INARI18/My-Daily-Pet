import { Palette } from "@/constants/palette";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type ThemedInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
  isPassword?: boolean; // if true, enables password visibility toggle
};

export function ThemedInput({
  containerStyle,
  style,
  isPassword = false,
  ...props
}: ThemedInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, style]}
        secureTextEntry={isPassword && !isPasswordVisible}
        {...props}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
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
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
});
