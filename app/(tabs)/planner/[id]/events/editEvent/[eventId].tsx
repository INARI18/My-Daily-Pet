import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedDatePicker } from "@/components/ui/themed-date-picker";
import { ThemedInput } from "@/components/ui/themed-input";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import {
  deleteEvent,
  getAllEventsForPet,
  updateEvent,
} from "@/services/events";
import { Event } from "@/types/event";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  CalendarSync,
  FileText,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EVENT_TYPES = [
  { label: "Food", value: "food" },
  { label: "Walk", value: "walk" },
  { label: "Medication", value: "medication" },
  { label: "Play Time", value: "playTime" },
  { label: "Vaccination", value: "vaccination" },
  { label: "Bath", value: "bath" },
  { label: "Other", value: "other" },
] as const;

const RECURRENCE_UNITS = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
] as const;

export default function EditEvent() {
  const { id: petId, eventId } = useLocalSearchParams<{
    id: string;
    eventId: string;
  }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventData, setEventData] = useState<{
    type: Event["type"];
    inicialDate: string;
    hours: string;
    minutes: string;
    hasRecurrence: boolean;
    recurrenceAmount: string;
    recurrenceUnit: "hours" | "days" | "weeks" | "months" | "years";
    notificationEnabled: boolean;
    notes: string;
  }>({
    type: "food",
    inicialDate: "",
    hours: "",
    minutes: "",
    hasRecurrence: false,
    recurrenceAmount: "1",
    recurrenceUnit: "days",
    notificationEnabled: true,
    notes: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const events = await getAllEventsForPet(petId);
        const event = events.find((e) => e.id === eventId);

        if (event) {
          const date = new Date(event.inicialDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateStr = `${year}-${month}-${day}`;
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");

          setEventData({
            type: event.type,
            inicialDate: dateStr,
            hours,
            minutes,
            hasRecurrence: !!event.recurrence,
            recurrenceAmount: event.recurrence?.amount.toString() || "1",
            recurrenceUnit: event.recurrence?.unit || "days",
            notificationEnabled: event.notificationEnabled,
            notes: event.notes || "",
          });
        } else {
          Alert.alert("Error", "Event not found", [
            { text: "OK", onPress: () => router.push(`/planner/${petId}`) },
          ]);
        }
      } catch (error) {
        console.error("Error loading event:", error);
        Alert.alert("Error", "Failed to load event", [
          { text: "OK", onPress: () => router.push(`/planner/${petId}`) },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [petId, eventId]);

  const handleInputChange = (field: string, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};

    if (!eventData.inicialDate.trim()) {
      newErrors.inicialDate = "Date is required";
    }

    const hours = parseInt(eventData.hours);
    const minutes = parseInt(eventData.minutes);

    if (isNaN(hours) || hours < 0 || hours > 23) {
      newErrors.hours = "Invalid hours (0-23)";
    }

    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      newErrors.minutes = "Invalid minutes (0-59)";
    }

    if (eventData.hasRecurrence) {
      const amount = parseInt(eventData.recurrenceAmount);
      if (isNaN(amount) || amount < 1) {
        newErrors.recurrenceAmount = "Amount must be at least 1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSave = async () => {
    setTouched({
      inicialDate: true,
      hours: true,
      minutes: true,
      recurrenceAmount: true,
    });

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const [year, month, day] = eventData.inicialDate.split("-").map(Number);
      const hours = parseInt(eventData.hours);
      const minutes = parseInt(eventData.minutes);
      const inicialDate = new Date(year, month - 1, day, hours, minutes);

      const updates: Partial<Omit<Event, "id" | "createdAt">> = {
        type: eventData.type,
        inicialDate,
        notificationEnabled: eventData.notificationEnabled,
        notes: eventData.notes.trim() || undefined,
      };

      if (eventData.hasRecurrence) {
        updates.recurrence = {
          amount: parseInt(eventData.recurrenceAmount),
          unit: eventData.recurrenceUnit,
        };
      } else {
        updates.recurrence = undefined;
        updates.nextDate = undefined;
      }

      await updateEvent(petId, eventId, updates);

      Alert.alert("Success", "Event updated successfully!", [
        {
          text: "OK",
          onPress: () =>
            router.push(`/planner/${petId}/events/${eventData.type}`),
        },
      ]);
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(petId, eventId);
              Alert.alert("Success", "Event deleted successfully!", [
                {
                  text: "OK",
                  onPress: () =>
                    router.push(`/planner/${petId}/events/${eventData.type}`),
                },
              ]);
            } catch (error) {
              console.error("Error deleting event:", error);
              Alert.alert("Error", "Failed to delete event.");
            }
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.push(`/planner/${petId}`);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
        edges={["top", "bottom"]}
      >
        <ActivityIndicator
          size="large"
          color={Palette.purple.main}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Palette.purple.darker} />
          </TouchableOpacity>

          <ThemedText style={styles.title}>Edit Event</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>Event Details</ThemedText>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Event Type</ThemedText>
                <View
                  style={[styles.pickerContainer, styles.fixedTypeContainer]}
                >
                  <ThemedText style={styles.fixedTypeText}>
                    {EVENT_TYPES.find((t) => t.value === eventData.type)
                      ?.label || eventData.type}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Calendar size={18} color={Palette.purple.darker} />
                <ThemedText style={styles.cardTitle}>When</ThemedText>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Date</ThemedText>
                <ThemedDatePicker
                  value={eventData.inicialDate}
                  onChangeDate={(date) => {
                    const [year, month, day] = date.split("-").map(Number);
                    const formattedDate = `${year}-${String(month).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;
                    handleInputChange("inicialDate", formattedDate);
                  }}
                  placeholder="Select date"
                  style={styles.input}
                  minimumDate={new Date()}
                  error={touched.inicialDate ? errors.inicialDate : null}
                />
                {touched.inicialDate && errors.inicialDate && (
                  <ThemedText style={styles.errorText}>
                    {errors.inicialDate}
                  </ThemedText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Time</ThemedText>
                <View style={styles.timeRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedInput
                      placeholder="00"
                      value={eventData.hours}
                      onChangeText={(text) => handleInputChange("hours", text)}
                      keyboardType="number-pad"
                      style={styles.input}
                      maxLength={2}
                      error={touched.hours ? errors.hours : null}
                      onBlur={() => handleBlur("hours")}
                    />
                    <ThemedText style={styles.timeLabel}>Hours</ThemedText>
                  </View>
                  <ThemedText style={styles.timeSeparator}>:</ThemedText>
                  <View style={{ flex: 1 }}>
                    <ThemedInput
                      placeholder="00"
                      value={eventData.minutes}
                      onChangeText={(text) =>
                        handleInputChange("minutes", text)
                      }
                      keyboardType="number-pad"
                      style={styles.input}
                      maxLength={2}
                      error={touched.minutes ? errors.minutes : null}
                      onBlur={() => handleBlur("minutes")}
                    />
                    <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <CalendarSync size={18} color={Palette.purple.darker} />
                <ThemedText style={styles.cardTitle}>Repeat</ThemedText>
                <Switch
                  value={eventData.hasRecurrence}
                  onValueChange={(value) =>
                    handleInputChange("hasRecurrence", value)
                  }
                  trackColor={{
                    false: Palette.neutral.gray,
                    true: Palette.yellow.main,
                  }}
                  thumbColor={
                    eventData.hasRecurrence
                      ? Palette.purple.darker
                      : Palette.neutral.lightGray
                  }
                />
              </View>

              {eventData.hasRecurrence && (
                <View style={styles.recurrenceContent}>
                  <ThemedText style={styles.recurrenceLabel}>
                    Repeat Every
                  </ThemedText>

                  <View style={styles.recurrenceRow}>
                    <View
                      style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}
                    >
                      <ThemedInput
                        placeholder="1"
                        value={eventData.recurrenceAmount}
                        onChangeText={(text) =>
                          handleInputChange("recurrenceAmount", text)
                        }
                        keyboardType="number-pad"
                        style={styles.input}
                        filter="numeric"
                        error={
                          touched.recurrenceAmount
                            ? errors.recurrenceAmount
                            : null
                        }
                        onBlur={() => handleBlur("recurrenceAmount")}
                      />
                    </View>

                    <View
                      style={[styles.inputGroup, { flex: 2, marginBottom: 0 }]}
                    >
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={eventData.recurrenceUnit}
                          onValueChange={(value) =>
                            handleInputChange("recurrenceUnit", value)
                          }
                          style={styles.picker}
                        >
                          {RECURRENCE_UNITS.map((unit) => (
                            <Picker.Item
                              key={unit.value}
                              label={unit.label}
                              value={unit.value}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                {eventData.notificationEnabled ? (
                  <Bell size={18} color={Palette.purple.darker} />
                ) : (
                  <BellOff size={18} color={Palette.neutral.gray} />
                )}
                <ThemedText style={styles.cardTitle}>Notifications</ThemedText>
                <Switch
                  value={eventData.notificationEnabled}
                  onValueChange={(value) =>
                    handleInputChange("notificationEnabled", value)
                  }
                  trackColor={{
                    false: Palette.neutral.gray,
                    true: Palette.yellow.main,
                  }}
                  thumbColor={
                    eventData.notificationEnabled
                      ? Palette.purple.darker
                      : Palette.neutral.lightGray
                  }
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FileText size={18} color={Palette.purple.darker} />
                <ThemedText style={styles.cardTitle}>Notes</ThemedText>
              </View>

              <ThemedInput
                placeholder="Add any additional notes..."
                value={eventData.notes}
                onChangeText={(text) => handleInputChange("notes", text)}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonRow}>
              <ThemedButton
                title="Delete"
                style={styles.deleteButton}
                onPress={handleDelete}
                icon={<Trash2 size={18} color={Palette.neutral.white} />}
              />
              <ThemedButton
                title={saving ? "Saving..." : "Save"}
                style={styles.saveButton}
                onPress={handleSave}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.neutral.offWhite,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Palette.neutral.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: Palette.neutral.lightGray,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: Palette.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.purple.darker,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Palette.neutral.lightGray,
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  pickerContainer: {
    backgroundColor: Palette.neutral.lightGray,
    borderRadius: 10,
    overflow: "hidden",
  },
  fixedTypeContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  fixedTypeText: {
    fontSize: 15,
    fontFamily: Fonts.fredoka.regular,
    color: Palette.neutral.black,
  },
  picker: {
    height: 55,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeSeparator: {
    fontSize: 24,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 11,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.neutral.gray,
    textAlign: "center",
    marginTop: 4,
  },
  recurrenceContent: {
    marginTop: 8,
  },
  recurrenceLabel: {
    fontSize: 13,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.purple.darker,
    marginBottom: 12,
  },
  recurrenceRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Palette.buttons.warning,
    paddingVertical: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.buttons.warning,
    marginTop: 6,
  },
  bottomSpacing: {
    height: 40,
  },
});
