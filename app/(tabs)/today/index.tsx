import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompleteCheck } from "@/components/ui/complete-check";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { EVENT_TYPE_LABELS, illustrationOfTheDay } from "@/constants/events";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import {
  EventStatus,
  PetEvent,
  completeEvent,
  getActiveEventsForAllPets,
  getEventStatus,
  getReferenceDate,
} from "@/services/events";
import { getPetIcon } from "@/services/pets";
import { formatDate, formatLongDate, formatTime } from "@/utils/date";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const GREETINGS = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
} as const;

function dayPeriod(): keyof typeof GREETINGS {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

const SECTIONS: { status: EventStatus; title: string }[] = [
  { status: "overdue", title: "Overdue" },
  { status: "today", title: "Today" },
  { status: "week", title: "Next 7 days" },
];

function TodayCard({
  item,
  onComplete,
}: {
  item: PetEvent;
  onComplete: () => Promise<void>;
}) {
  const router = useRouter();
  const { pet, event } = item;
  const status = getEventStatus(event);
  const date = getReferenceDate(event);

  return (
    <Card
      onPress={() => router.push(`/pets/${pet.id}/events/edit/${event.id}`)}
      style={styles.card}
    >
      <Avatar source={getPetIcon(pet)} size="s" tone={pet.type} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>
          {pet.name} · {EVENT_TYPE_LABELS[event.type].singular}
        </Text>
        <Text style={styles.cardMeta}>
          {status === "today" ? formatTime(date) : `${formatDate(date)} · ${formatTime(date)}`}
        </Text>
        {status === "overdue" ? <Badge tone="overdue" text="Overdue" /> : null}
      </View>
      <CompleteCheck onComplete={onComplete} />
    </Card>
  );
}

export default function Today() {
  const [items, setItems] = useState<PetEvent[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setItems(await getActiveEventsForAllPets());
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleComplete = async (item: PetEvent) => {
    try {
      await completeEvent(item.event);
      await load();
    } catch {
      Alert.alert("Error", "Could not complete the event.");
    }
  };

  const grouped = SECTIONS.map((s) => ({
    ...s,
    items: (items ?? []).filter((i) => getEventStatus(i.event) === s.status),
  })).filter((s) => s.items.length > 0);

  const period = dayPeriod();

  return (
    <Screen>
      <Hero
        title={GREETINGS[period]}
        subtitle={formatLongDate(new Date())}
        image={illustrationOfTheDay()}
      />
      {items === null ? (
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
          {grouped.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Image
                  source={require("@/assets/icons/cats/1.png")}
                  style={styles.emptyImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.emptyTitle}>Nothing for today</Text>
              <Text style={styles.emptyText}>
                Events due today, overdue or in the next 7 days show up here.
              </Text>
            </View>
          ) : (
            grouped.map((section) => (
              <View key={section.status} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item) => (
                  <TodayCard
                    key={item.event.id}
                    item={item}
                    onComplete={() => handleComplete(item)}
                  />
                ))}
              </View>
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
  loading: { marginTop: 40 },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: Fonts.title, fontSize: 16, color: Colors.text },
  cardMeta: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted },
  empty: { alignItems: "center", paddingVertical: 48, gap: Spacing.sm },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: Colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyImage: { width: 84, height: 84 },
  emptyTitle: { fontFamily: Fonts.title, fontSize: 20, color: Colors.text },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  bottom: { height: Spacing.xl },
});
