import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../themed-text";

type ThemedDatePickerProps = {
  value: string;
  onChangeDate: (date: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  error?: string | null;
  maximumDate?: Date;
  minimumDate?: Date;
};

export function ThemedDatePicker({
  value,
  onChangeDate,
  placeholder = "Select date",
  containerStyle,
  style,
  error = null,
  maximumDate,
  minimumDate,
}: ThemedDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (
    pickerEvent: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const currentDate = selectedDate || (value ? new Date(value) : new Date());

    // on Android, always hide the picker after selection
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    // only update date if user confirmed the selection
    if (pickerEvent.type === "set") {
      const formattedDate = currentDate.toISOString().split("T")[0];
      onChangeDate(formattedDate);
    }
  };

  // Determine the date value for the picker
  const dateValue = value ? new Date(value) : new Date();

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={[styles.input, error && styles.inputError, style]}
          value={value}
          placeholder={placeholder}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      {Platform.OS === "ios" ? (
        <Modal
          transparent
          visible={showPicker}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <ThemedText style={styles.doneButton}>Done</ThemedText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
        )
      )}
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
    color: "#000",
  },
  inputError: {
    borderColor: Palette.buttons.warning,
    borderWidth: 1.5,
  },
  errorText: {
    color: Palette.buttons.warning,
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(25, 43, 146, 0.5)",
  },
  modalContent: {
    backgroundColor: Palette.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.neutral.lightGray,
  },
  doneButton: {
    color: Palette.purple.darker,
    fontSize: 16,
    fontFamily: Fonts.fredoka.medium,
  },
});
