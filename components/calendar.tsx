import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type PetCalendarProps = {
  visible?: boolean;
  onClose?: (e?: GestureResponderEvent) => void;
};

export default function PetCalendar({ visible = false, onClose }: PetCalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="slide"
      onRequestClose={() => onClose?.()}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.container}>
            <Calendar
              // ensure a consistent month view and readable layout
              onDayPress={(day) => setSelected(day.dateString)}
              markedDates={
                selected
                  ? {
                      [selected]: {
                        selected: true,
                        selectedColor: Colors.primary,
                      },
                    }
                  : {}
              }
              style={{ height: 360 }}
              enableSwipeMonths
              firstDay={1}
              hideExtraDays={false}
              monthFormat={"MMMM yyyy"}
              theme={{
                backgroundColor: Colors.bg,
                calendarBackground: Colors.bg,
                textSectionTitleColor: Colors.primary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: "#ffffff",
                todayTextColor: Colors.primary,
                dayTextColor: Colors.text,
                textDisabledColor: "#cfcfcf",
                arrowColor: Colors.primary,
                monthTextColor: Colors.text,
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalContent: {
    width: "100%",
    height: "88%",
    backgroundColor: Colors.bg,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: Colors.bg,
  },
  closeButton: {
    padding: 6,
  },
  closeText: {
    color: Colors.danger,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    padding: 8,
  },
});
