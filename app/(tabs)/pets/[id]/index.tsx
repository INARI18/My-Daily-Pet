import PetCalendar from "@/components/calendar";
import { Card } from "@/components/ui/card";
import { Header, HeaderIconButton } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { EVENT_TYPE_LABELS, PLANNER_CATEGORIES } from "@/constants/events";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { getPetById } from "@/services/pets";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PetPlanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [petName, setPetName] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    let active = true;
    getPetById(id).then((pet) => active && setPetName(pet?.name ?? ""));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Screen scroll>
      <Header
        title={petName ?? " "}
        onBack={() => router.back()}
        right={
          <HeaderIconButton
            onPress={() => setShowCalendar(true)}
            accessibilityLabel="Calendar"
          >
            <CalendarDays size={20} color={Colors.primary} />
          </HeaderIconButton>
        }
      />
      <Text style={styles.subtitle}>What do you want to plan?</Text>
      <View style={styles.grid}>
        {PLANNER_CATEGORIES.map((category) => (
          <Card
            key={category.type}
            onPress={() => router.push(`/pets/${id}/events/${category.type}`)}
            style={styles.tile}
          >
            <Text style={styles.tileLabel}>{EVENT_TYPE_LABELS[category.type].plural}</Text>
            <Image source={category.icon} style={styles.tileImage} resizeMode="contain" />
          </Card>
        ))}
      </View>
      <PetCalendar visible={showCalendar} onClose={() => setShowCalendar(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
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
