import { Palette } from "@/constants/palette";
import React, { useEffect, useState } from "react";
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
  initialSelected?: string | null;
};

export default function PetCalendar({
  visible = false,
  onClose,
  initialSelected = null,
}: PetCalendarProps) {
  const [selected, setSelected] = useState<string | null>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
              onDayPress={(day) => {
                setSelected(day.dateString);
                console.log("Data selecionada:", day);
              }}
              markedDates={
                selected
                  ? {
                      [selected]: {
                        selected: true,
                        selectedColor: Palette.purple.main,
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
                backgroundColor: Palette.neutral.offWhite,
                calendarBackground: Palette.neutral.offWhite,
                textSectionTitleColor: Palette.purple.darker,
                selectedDayBackgroundColor: Palette.purple.main,
                selectedDayTextColor: "#ffffff",
                todayTextColor: Palette.purple.main,
                dayTextColor: Palette.neutral.black,
                textDisabledColor: "#cfcfcf",
                arrowColor: Palette.purple.main,
                monthTextColor: Palette.neutral.black,
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
    backgroundColor: Palette.neutral.offWhite,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    backgroundColor: Palette.neutral.offWhite,
  },
  closeButton: {
    padding: 6,
  },
  closeText: {
    color: Palette.buttons.warning,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    padding: 8,
  },
});
