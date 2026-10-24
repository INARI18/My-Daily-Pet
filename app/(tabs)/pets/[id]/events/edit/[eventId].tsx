import {
  EventForm,
  EventFormValues,
  toEventInput,
  toYMD,
} from "@/components/forms/event-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { useT } from "@/i18n/LanguageProvider";
import { deleteEvent, getEventById, updateEvent } from "@/services/events";
import { REMINDER_OFFSETS, ReminderOffset } from "@/services/notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

export default function EditEvent() {
  const { id: petId, eventId } = useLocalSearchParams<{ id: string; eventId: string }>();
  const router = useRouter();
  const t = useT();
  const [initial, setInitial] = useState<EventFormValues | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getEventById(petId, eventId).then((event) => {
      if (!event) {
        Alert.alert(t("common.error"), t("events.notFound"), [
          { text: t("common.ok"), onPress: () => router.back() },
        ]);
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
        reminderOffset: (REMINDER_OFFSETS.find((m) => m === event.reminderOffsetMinutes) ?? 0) as ReminderOffset,
        notes: event.notes ?? "",
      });
    });
  }, [petId, eventId, router, t]);

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
      Alert.alert(t("common.error"), t("events.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t("events.deleteConfirm.title"), t("events.deleteConfirm.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
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
      <Header title={t("events.editTitle")} onBack={() => router.back()} />
      {initial ? (
        <EventForm
          initial={initial}
          submitLabel={t("common.save")}
          submitting={saving}
          onSubmit={handleSubmit}
          secondary={{
            label: t("common.delete"),
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
