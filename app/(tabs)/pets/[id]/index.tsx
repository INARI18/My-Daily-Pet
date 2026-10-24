import PetCalendar from "@/components/calendar";
import { Card } from "@/components/ui/card";
import { HeaderIconButton } from "@/components/ui/header";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { PETS_ILLUSTRATION, PLANNER_CATEGORIES } from "@/constants/events";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useT } from "@/i18n/LanguageProvider";
import { getAllEventsForPet } from "@/services/events";
import { getPetById, getPetIcon } from "@/services/pets";
import { Event } from "@/types/event";
import { Pet } from "@/types/pet";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PetPlanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const [pet, setPet] = useState<Pet | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    let active = true;
    getPetById(id).then((p) => active && setPet(p));
    return () => {
      active = false;
    };
  }, [id]);

  // events feed the calendar; reload when coming back from add/edit
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllEventsForPet(id).then((list) => active && setEvents(list));
      return () => {
        active = false;
      };
    }, [id])
  );

  const openEvent = (event: Event) => {
    setShowCalendar(false);
    router.push(`/pets/${id}/events/edit/${event.id}`);
  };

  return (
    <Screen scroll>
      <Hero
        title={pet?.name ?? " "}
        subtitle={t("planner.subtitle")}
        image={pet ? getPetIcon(pet) : PETS_ILLUSTRATION}
        imageSize={pet ? 80 : 96}
        onBack={() => router.back()}
        right={
          <HeaderIconButton
            onPress={() => setShowCalendar(true)}
            accessibilityLabel={t("planner.calendar.open")}
          >
            <CalendarDays size={20} color={Colors.primary} />
          </HeaderIconButton>
        }
      />
      <View style={styles.grid}>
        {PLANNER_CATEGORIES.map((category) => (
          <Card
            key={category.type}
            onPress={() => router.push(`/pets/${id}/events/${category.type}`)}
            style={styles.tile}
          >
            <Text style={styles.tileLabel}>{t(`eventTypes.${category.type}.plural`)}</Text>
            <Image source={category.icon} style={styles.tileImage} resizeMode="contain" />
          </Card>
        ))}
      </View>
      <PetCalendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        events={events}
        onSelectEvent={openEvent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  tile: {
    width: "48%",
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  tileLabel: { fontFamily: Fonts.title, fontSize: 16, color: Colors.text, marginBottom: 6 },
  tileImage: { width: 108, height: 100 },
});
