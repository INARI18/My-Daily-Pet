import PetCalendar from "@/components/calendar";
import { Avatar } from "@/components/ui/avatar";
import { HeaderIconButton } from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompleteCheck } from "@/components/ui/complete-check";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { illustrationOfTheDay } from "@/constants/events";
import { Fonts, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import {
  EventStatus,
  PetEvent,
  completeEvent,
  getActiveEventsForAllPets,
  getEventStatus,
  getReferenceDate,
} from "@/services/events";
import { getPetIcon, getPets } from "@/services/pets";
import { Button } from "@/components/ui/button";
import { formatDate, formatLongDate, formatTime } from "@/utils/date";
import { useFocusEffect, useRouter } from "expo-router";
import { CalendarDays } from "lucide-react-native";
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

function dayPeriod(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

const SECTIONS: EventStatus[] = ["overdue", "today", "week"];

function TodayCard({
  item,
  onComplete,
}: {
  item: PetEvent;
  onComplete: () => Promise<void>;
}) {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const t = useT();
  const [lang] = useLanguage();
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
          {pet.name} · {t(`eventTypes.${event.type}.singular`)}
        </Text>
        <Text style={styles.cardMeta}>
          {status === "today"
            ? formatTime(date, lang)
            : `${formatDate(date, lang)} · ${formatTime(date, lang)}`}
        </Text>
        {status === "overdue" ? <Badge tone="overdue" text={t("badges.overdue")} /> : null}
      </View>
      <CompleteCheck onComplete={onComplete} />
    </Card>
  );
}

export default function Today() {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  const [lang] = useLanguage();
  const router = useRouter();
  const [items, setItems] = useState<PetEvent[] | null>(null);
  const [hasPets, setHasPets] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [events, pets] = await Promise.all([getActiveEventsForAllPets(), getPets()]);
    setItems(events);
    setHasPets(pets.length > 0);
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
      Alert.alert(t("common.error"), t("today.completeError"));
    }
  };

  const grouped = SECTIONS.map((status) => ({
    status,
    items: (items ?? []).filter((i) => getEventStatus(i.event) === status),
  })).filter((s) => s.items.length > 0);

  return (
    <Screen>
      <Hero
        title={t(`today.greeting.${dayPeriod()}`)}
        subtitle={formatLongDate(new Date(), lang)}
        image={illustrationOfTheDay()}
        right={
          <HeaderIconButton
            onPress={() => setShowCalendar(true)}
            accessibilityLabel={t("planner.calendar.open")}
          >
            <CalendarDays size={20} color={c.primary} />
          </HeaderIconButton>
        }
      />
      <PetCalendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        events={(items ?? []).map((i) => i.event)}
        petNames={Object.fromEntries((items ?? []).map((i) => [i.pet.id, i.pet.name]))}
        onSelectEvent={(event) => {
          setShowCalendar(false);
          router.push(`/pets/${event.petId}/events/edit/${event.id}`);
        }}
      />
      {items === null ? (
        <ActivityIndicator color={c.primary} style={styles.loading} />
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
              tintColor={c.primary}
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
              <Text style={styles.emptyTitle}>
                {hasPets ? t("today.empty.title") : t("today.noPets.title")}
              </Text>
              <Text style={styles.emptyText}>
                {hasPets ? t("today.empty.text") : t("today.noPets.text")}
              </Text>
              {!hasPets ? (
                <Button
                  title={t("pets.addButton")}
                  onPress={() => router.push("/pets/add")}
                  style={styles.emptyButton}
                />
              ) : null}
            </View>
          ) : (
            grouped.map((section) => (
              <View key={section.status} style={styles.section}>
                <Text style={styles.sectionTitle}>{t(`today.sections.${section.status}`)}</Text>
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

const makeStyles = (c: Palette) => StyleSheet.create({
  flex: { flex: 1 },
  loading: { marginTop: 40 },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: c.textMuted,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: Fonts.title, fontSize: 16, color: c.text },
  cardMeta: { fontFamily: Fonts.body, fontSize: 13, color: c.textMuted },
  empty: { alignItems: "center", paddingVertical: 48, gap: Spacing.sm },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: c.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyImage: { width: 84, height: 84 },
  emptyButton: { marginTop: Spacing.md, alignSelf: "stretch" },
  emptyTitle: { fontFamily: Fonts.title, fontSize: 20, color: c.text },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    color: c.textMuted,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  bottom: { height: Spacing.xl },
});
