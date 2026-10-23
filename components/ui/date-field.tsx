import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { FieldError, FieldLabel, fieldStyles } from "./input";

type DateFieldProps = {
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string | null;
  clearable?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
};

export function parseYMD(value: string): Date | null {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function formatYMD(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function DateField({
  value,
  onChange,
  label,
  placeholder = "Select date",
  error,
  clearable = false,
  minimumDate,
  maximumDate,
  containerStyle,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const dateValue = parseYMD(value) ?? new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "set" && selected) onChange(formatYMD(selected));
  };

  const picker = (
    <DateTimePicker
      value={dateValue}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={handleChange}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
    />
  );

  return (
    <View style={containerStyle}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View>
        <Pressable
          onPress={() => setOpen(true)}
          style={[fieldStyles.box, !!error && styles.boxError]}
        >
          <Text style={[styles.text, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>
        </Pressable>
        {clearable && !!value ? (
          <Pressable
            style={styles.clear}
            onPress={() => onChange("")}
            hitSlop={8}
            accessibilityLabel="Clear date"
          >
            <X size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <FieldError>{error}</FieldError>

      {Platform.OS === "ios" ? (
        <Modal
          transparent
          visible={open}
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <Pressable onPress={() => setOpen(false)} style={styles.done}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
              {picker}
            </View>
          </View>
        </Modal>
      ) : (
        open && picker
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: Fonts.body, fontSize: 15, color: Colors.text },
  placeholder: { color: Colors.textMuted },
  boxError: { borderColor: Colors.danger },
  clear: { position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(58, 39, 64, 0.4)",
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    paddingBottom: Spacing.xl,
  },
  done: {
    alignSelf: "flex-end",
    padding: Spacing.lg,
  },
  doneText: { fontFamily: Fonts.bodyBold, fontSize: 16, color: Colors.primary },
});
