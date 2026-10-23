import { Badge, BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompleteCheck } from "@/components/ui/complete-check";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { EVENT_TYPE_LABELS, isEventType } from "@/constants/events";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import {
  EventStatus,
  completeEvent,
  getAllEventsForPet,
  getEventStatus,
  getReferenceDate,
  isCompleted,
} from "@/services/events";
import { Event } from "@/types/event";
import { formatDate, formatTime } from "@/utils/date";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, Clock, Repeat } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BADGES: Partial<Record<EventStatus, { tone: BadgeTone; text: string }>> = {
  overdue: { tone: "overdue", text: "Overdue" },
  today: { tone: "today", text: "Today" },
  week: { tone: "week", text: "This week" },
  done: { tone: "done", text: "Done" },
};

const FILTERS = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
] as const;

function EventCard({
  event,
  onPress,
  onComplete,
}: {
  event: Event;
  onPress: () => void;
  onComplete: () => Promise<void>;
}) {
  const status = getEventStatus(event);
  const badge = BADGES[status];
  const date = getReferenceDate(event);
  const done = status === "done";

  return (
    <Card onPress={onPress} style={[styles.card, done && styles.cardDone]}>
      <View style={styles.cardTop}>
        <CompleteCheck checked={done} onComplete={done ? undefined : onComplete} />
        <View style={styles.flex}>
          <View style={styles.line}>
            <CalendarDays size={15} color={done ? Colors.textMuted : Colors.primary} />
            <Text style={[styles.date, done && styles.muted]}>{formatDate(date)}</Text>
          </View>
          <View style={styles.line}>
            <Clock size={14} color={Colors.textMuted} />
            <Text style={styles.time}>{formatTime(date)}</Text>
            {event.recurrence ? (
              <>
                <Repeat size={13} color={Colors.textMuted} style={styles.repeatIcon} />
                <Text style={styles.time}>
                  every {event.recurrence.amount} {event.recurrence.unit}
                </Text>
              </>
            ) : null}
          </View>
        </View>
        {badge ? <Badge tone={badge.tone} text={badge.text} /> : null}
      </View>
      {event.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {event.notes}
        </Text>
      ) : null}
    </Card>
  );
}

export default function EventsByType() {
  const { id: petId, eventType } = useLocalSearchParams<{ id: string; eventType: string }>();
  const router = useRouter();
  const type = isEventType(eventType) ? eventType : "other";

  const [events, setEvents] = useState<Event[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const load = useCallback(async () => {
    const all = await getAllEventsForPet(petId);
    setEvents(
      all
        .filter((e) => e.type === type)
        .sort((a, b) => getReferenceDate(a).getTime() - getReferenceDate(b).getTime())
    );
    setRefreshing(false);
  }, [petId, type]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleComplete = async (event: Event) => {
    try {
      await completeEvent(event);
      await load();
    } catch {
      Alert.alert("Error", "Could not complete the event.");
    }
  };

  const visible = events?.filter((e) => (filter === "completed") === isCompleted(e)) ?? [];
  const labels = EVENT_TYPE_LABELS[type];

  return (
    <Screen>
      <Header title={labels.plural} onBack={() => router.back()} />
      <Button
        title={`New ${labels.singular.toLowerCase()}`}
        variant="accent"
        onPress={() => router.push(`/pets/${petId}/events/add?type=${type}`)}
      />
      <Segmented
        options={FILTERS}
        value={filter}
        onChange={setFilter}
        containerStyle={styles.filter}
      />
      {events === null ? (
        <ActivityIndicator color={Colors.primary} style={styles.loading} />
      ) : (
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={Colors.primary}
            />
          }
        >
          <Text style={styles.count}>
            {visible.length === 0
              ? "No events"
              : `${visible.length} ${visible.length === 1 ? "event" : "events"}`}
          </Text>
          {visible.length === 0 ? (
            <View style={styles.empty}>
              <CalendarDays size={56} color={Colors.border} />
              <Text style={styles.emptyTitle}>
                {filter === "completed" ? "Nothing completed yet" : "No events yet"}
              </Text>
              <Text style={styles.emptyText}>
                {filter === "completed"
                  ? "Completed one-time events show up here."
                  : `Add the first ${labels.singular.toLowerCase()} to get started.`}
              </Text>
            </View>
          ) : (
            visible.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/pets/${petId}/events/edit/${event.id}`)}
                onComplete={() => handleComplete(event)}
              />
            ))
          )}
          <View style={styles.bottom} />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  filter: { marginTop: Spacing.md, marginBottom: Spacing.md },
  loading: { marginTop: 40 },
  count: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  card: { marginBottom: Spacing.md },
  cardDone: { opacity: 0.7 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
  line: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  date: { fontFamily: Fonts.title, fontSize: 17, color: Colors.text },
  time: { fontFamily: Fonts.body, fontSize: 13.5, color: Colors.textMuted },
  repeatIcon: { marginLeft: 6 },
  muted: { color: Colors.textMuted },
  notes: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  empty: { alignItems: "center", paddingVertical: 48, gap: Spacing.sm },
  emptyTitle: { fontFamily: Fonts.title, fontSize: 18, color: Colors.text, marginTop: Spacing.sm },
  emptyText: { fontFamily: Fonts.body, fontSize: 13.5, color: Colors.textMuted, textAlign: "center" },
  bottom: { height: Spacing.xl },
});
