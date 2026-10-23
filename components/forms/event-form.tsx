import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChipGroup } from "@/components/ui/chip";
import { DateField } from "@/components/ui/date-field";
import { Input } from "@/components/ui/input";
import {
  EVENT_TYPE_LABELS,
  EventType,
  RECURRENCE_UNITS,
  RecurrenceUnit,
} from "@/constants/events";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { EventInput } from "@/services/events";
import { Bell, CalendarDays, FileText, Repeat } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export type EventFormValues = {
  type: EventType;
  date: string; // YYYY-MM-DD
  hours: string;
  minutes: string;
  hasRecurrence: boolean;
  recurrenceAmount: string;
  recurrenceUnit: RecurrenceUnit;
  notificationEnabled: boolean;
  notes: string;
};

// defaults to the next full hour so a new event does not start in the past
export function defaultEventValues(type: EventType): EventFormValues {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return {
    type,
    date: toYMD(d),
    hours: String(d.getHours()).padStart(2, "0"),
    minutes: "00",
    hasRecurrence: false,
    recurrenceAmount: "1",
    recurrenceUnit: "days",
    notificationEnabled: true,
    notes: "",
  };
}

export function toYMD(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// converts form values into the service input (petId added by the caller)
export function toEventInput(values: EventFormValues, petId: string): EventInput {
  const [y, m, d] = values.date.split("-").map(Number);
  const inicialDate = new Date(y, m - 1, d, parseInt(values.hours), parseInt(values.minutes));
  return {
    petId,
    type: values.type,
    inicialDate,
    notificationEnabled: values.notificationEnabled,
    notes: values.notes.trim() || undefined,
    recurrence: values.hasRecurrence
      ? { amount: parseInt(values.recurrenceAmount), unit: values.recurrenceUnit }
      : undefined,
  };
}

type EventFormProps = {
  initial: EventFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: EventFormValues) => void;
  secondary?: {
    label: string;
    variant: "ghost" | "danger";
    icon?: React.ReactNode;
    onPress: () => void;
  };
};

type Errors = Partial<Record<"date" | "hours" | "minutes" | "recurrenceAmount", string>>;

function SectionHeader({
  icon,
  title,
  switchValue,
  onSwitch,
}: {
  icon: React.ReactNode;
  title: string;
  switchValue?: boolean;
  onSwitch?: (v: boolean) => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSwitch ? (
        <Switch
          value={!!switchValue}
          onValueChange={onSwitch}
          trackColor={{ false: Colors.border, true: Colors.accent }}
          thumbColor={Colors.surface}
        />
      ) : null}
    </View>
  );
}

export function EventForm({
  initial,
  submitLabel,
  submitting = false,
  onSubmit,
  secondary,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(initial);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!values.date) next.date = "Date is required";
    const h = parseInt(values.hours);
    const m = parseInt(values.minutes);
    if (isNaN(h) || h < 0 || h > 23) next.hours = "0 to 23";
    if (isNaN(m) || m < 0 || m > 59) next.minutes = "0 to 59";
    if (values.hasRecurrence) {
      const amount = parseInt(values.recurrenceAmount);
      if (isNaN(amount) || amount < 1) next.recurrenceAmount = "At least 1";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const iconColor = Colors.primary;

  return (
    <View style={styles.form}>
      <Card>
        <SectionHeader
          icon={<CalendarDays size={18} color={iconColor} />}
          title={EVENT_TYPE_LABELS[values.type].singular}
        />
        <DateField
          label="Date"
          value={values.date}
          onChange={(v) => set("date", v)}
          minimumDate={new Date()}
          error={errors.date}
        />
        <View style={styles.timeRow}>
          <Input
            label="Hours"
            value={values.hours}
            onChangeText={(t) => set("hours", t)}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00"
            error={errors.hours}
            containerStyle={styles.flex}
          />
          <Text style={styles.colon}>:</Text>
          <Input
            label="Minutes"
            value={values.minutes}
            onChangeText={(t) => set("minutes", t)}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00"
            error={errors.minutes}
            containerStyle={styles.flex}
          />
        </View>
      </Card>

      <Card>
        <SectionHeader
          icon={<Repeat size={18} color={iconColor} />}
          title="Repeat"
          switchValue={values.hasRecurrence}
          onSwitch={(v) => set("hasRecurrence", v)}
        />
        {values.hasRecurrence ? (
          <View style={styles.recurrence}>
            <Input
              label="Every"
              value={values.recurrenceAmount}
              onChangeText={(t) => set("recurrenceAmount", t.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={3}
              error={errors.recurrenceAmount}
              containerStyle={styles.amount}
            />
            <ChipGroup
              label="Unit"
              options={RECURRENCE_UNITS}
              value={values.recurrenceUnit}
              onChange={(v) => set("recurrenceUnit", v)}
              containerStyle={styles.flex}
            />
          </View>
        ) : null}
      </Card>

      <Card>
        <SectionHeader
          icon={<Bell size={18} color={iconColor} />}
          title="Notifications"
          switchValue={values.notificationEnabled}
          onSwitch={(v) => set("notificationEnabled", v)}
        />
      </Card>

      <Card>
        <SectionHeader icon={<FileText size={18} color={iconColor} />} title="Notes" />
        <Input
          value={values.notes}
          onChangeText={(t) => set("notes", t)}
          placeholder="Anything worth remembering..."
          multiline
          numberOfLines={4}
        />
      </Card>

      <View style={styles.buttons}>
        {secondary ? (
          <Button
            title={secondary.label}
            variant={secondary.variant}
            icon={secondary.icon}
            onPress={secondary.onPress}
            style={styles.flex}
          />
        ) : null}
        <Button
          title={submitLabel}
          onPress={() => validate() && onSubmit(values)}
          loading={submitting}
          style={styles.flex}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.md },
  flex: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: { flex: 1, fontFamily: Fonts.title, fontSize: 17, color: Colors.text },
  timeRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm, marginTop: Spacing.md },
  colon: { fontFamily: Fonts.title, fontSize: 22, color: Colors.text, marginTop: 30 },
  recurrence: { flexDirection: "row", gap: Spacing.md, alignItems: "flex-start" },
  amount: { width: 84 },
  buttons: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.sm },
});
