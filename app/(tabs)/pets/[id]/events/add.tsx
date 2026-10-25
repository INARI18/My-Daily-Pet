import {
  EventForm,
  EventFormValues,
  defaultEventValues,
  toEventInput,
} from "@/components/forms/event-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { isEventType } from "@/constants/events";
import { useT } from "@/i18n/LanguageProvider";
import { addEvent } from "@/services/events";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export default function AddEvent() {
  const { id: petId, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const router = useRouter();
  const t = useT();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: EventFormValues) => {
    setSaving(true);
    try {
      await addEvent(petId, toEventInput(values, petId));
      router.back();
    } catch {
      Alert.alert(t("common.error"), t("events.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll>
      <Header title={t("events.addTitle")} onBack={() => router.back()} />
      <EventForm
        initial={defaultEventValues(isEventType(type) ? type : "other")}
        submitLabel={t("common.save")}
        submitting={saving}
        onSubmit={handleSubmit}
        secondary={{ label: t("common.cancel"), variant: "ghost", onPress: () => router.back() }}
      />
    </Screen>
  );
}
