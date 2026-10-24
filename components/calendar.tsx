import { CompleteCheck } from "@/components/ui/complete-check";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { Occurrence, getOccurrencesByDay } from "@/services/events";
import { Event } from "@/types/event";
import { addDays, formatTime, toYMD } from "@/utils/date";
import { X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type PetCalendarProps = {
  visible: boolean;
  onClose: () => void;
  events: Event[];
  onSelectEvent: (event: Event) => void;
};

const DAYS_AHEAD = 365;

export default function PetCalendar({ visible, onClose, events, onSelectEvent }: PetCalendarProps) {
  const t = useT();
  const [lang] = useLanguage();
  const [selected, setSelected] = useState(() => toYMD(new Date()));

  const byDay = useMemo(
    () => getOccurrencesByDay(events, addDays(new Date(), DAYS_AHEAD)),
    [events]
  );

  const marked = useMemo(() => {
    const result: Record<string, object> = {};
    for (const [day, occurrences] of Object.entries(byDay)) {
      result[day] = {
        marked: true,
        dotColor: occurrences.every((o) => o.done) ? Colors.textMuted : Colors.accent,
      };
    }
    result[selected] = { ...(result[selected] ?? {}), selected: true, selectedColor: Colors.primary };
    return result;
  }, [byDay, selected]);

  const dayItems: Occurrence[] = byDay[selected] ?? [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("planner.calendar.title")}</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel={t("planner.calendar.close")}>
              <X size={22} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Calendar
            key={lang}
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={marked}
            enableSwipeMonths
            firstDay={1}
            theme={{
              backgroundColor: Colors.surface,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textMuted,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.onPrimary,
              todayTextColor: Colors.accent,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.border,
              dotColor: Colors.accent,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
              textMonthFontFamily: Fonts.title,
              textDayHeaderFontFamily: Fonts.bodyBold,
              textDayFontFamily: Fonts.body,
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
          />

          <View style={styles.divider} />
          <Text style={styles.dayLabel}>
            {dayItems.length === 0
              ? t("planner.calendar.nothing")
              : t("planner.calendar.activities", { count: dayItems.length })}
          </Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {dayItems.map((occ, index) => (
              <Pressable
                key={`${occ.event.id}-${index}`}
                onPress={() => onSelectEvent(occ.event)}
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              >
                <CompleteCheck checked={occ.done} />
                <View style={styles.itemBody}>
                  <Text style={[styles.itemTitle, occ.done && styles.muted]}>
                    {t(`eventTypes.${occ.event.type}.singular`)}
                  </Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {formatTime(occ.date, lang)}
                    {occ.event.recurrence
                      ? ` · ${t(`recurrence.${occ.event.recurrence.unit}`, { count: occ.event.recurrence.amount })}`
                      : ""}
                    {occ.event.notes ? ` · ${occ.event.notes}` : ""}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(58, 39, 64, 0.45)",
  },
  sheet: {
    height: "88%",
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.card + 6,
    borderTopRightRadius: Radius.card + 6,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  title: { fontFamily: Fonts.title, fontSize: 22, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  dayLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  list: { flex: 1 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pressed: { opacity: 0.7 },
  itemBody: { flex: 1 },
  itemTitle: { fontFamily: Fonts.titleMedium, fontSize: 15, color: Colors.text },
  itemMeta: { fontFamily: Fonts.body, fontSize: 12.5, color: Colors.textMuted, marginTop: 1 },
  muted: { color: Colors.textMuted },
});
