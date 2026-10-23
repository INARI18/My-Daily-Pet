import {
  EventForm,
  EventFormValues,
  toEventInput,
  toYMD,
} from "@/components/forms/event-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { deleteEvent, getEventById, updateEvent } from "@/services/events";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

export default function EditEvent() {
  const { id: petId, eventId } = useLocalSearchParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<EventFormValues | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEventById(petId, eventId).then((event) => {
      if (!event) {
        Alert.alert("Error", "Event not found", [{ text: "OK", onPress: () => router.back() }]);
        return;
      }
      const d = event.inicialDate;
      setInitial({
        type: event.type,
        date: toYMD(d),
        hours: String(d.getHours()).padStart(2, "0"),
        minutes: String(d.getMinutes()).padStart(2, "0"),
        hasRecurrence: !!event.recurrence,
        recurrenceAmount: String(event.recurrence?.amount ?? 1),
        recurrenceUnit: event.recurrence?.unit ?? "days",
        notificationEnabled: event.notificationEnabled,
        notes: event.notes ?? "",
      });
    });
  }, [petId, eventId, router]);

  const handleSubmit = async (values: EventFormValues) => {
    setSaving(true);
    try {
      const input = toEventInput(values, petId);
      await updateEvent(petId, eventId, {
        ...input,
        // without recurrence there is no next occurrence
        ...(input.recurrence ? {} : { nextDate: undefined }),
      });
      router.back();
    } catch {
      Alert.alert("Error", "Could not save the event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete event", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteEvent(petId, eventId);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title="Edit event" onBack={() => router.back()} />
      {initial ? (
        <EventForm
          initial={initial}
          submitLabel="Save"
          submitting={saving}
          onSubmit={handleSubmit}
          secondary={{
            label: "Delete",
            variant: "danger",
            icon: <Trash2 size={16} color={Colors.danger} />,
            onPress: handleDelete,
          }}
        />
      ) : (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      )}
    </Screen>
  );
}
