import PetCalendar from "@/components/calendar";
import Navbar from "@/components/ui/navbar";
import { ThemedButton } from "@/components/ui/themed-button";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { getPetById } from "@/services/pets";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar1 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANNER_CATEGORIES = [
  {
    id: "bath",
    label: "Baths",
    icon: require("@/assets/images/planner/shower.png"),
  },
  {
    id: "walk",
    label: "Walks",
    icon: require("@/assets/images/planner/walk2.png"),
  },
  {
    id: "medication",
    label: "Medication",
    icon: require("@/assets/images/planner/medication.png"),
  },
  {
    id: "vaccination",
    label: "Vaccines",
    icon: require("@/assets/images/planner/vaccines.png"),
  },
  {
    id: "food",
    label: "Food",
    icon: require("@/assets/images/planner/food.png"),
  },
  {
    id: "playTime",
    label: "Play Time",
    icon: require("@/assets/images/planner/play_time.png"),
  },
];

export default function PetPlanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Planner for pet ID:", id);
  const [pet, setPet] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function fetchPet() {
      if (!id) return;
      const p = await getPetById(id);
      if (mounted) setPet(p);
    }
    fetchPet();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/planner/${id}/events/${categoryId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Navbar pageName="Planner" />
      <View style={styles.container}>
        <View style={styles.plannerContainer}>
          <Text style={styles.petName}>{pet?.name ?? "Loading..."}</Text>

          {/* Render categories in pairs */}
          {[0, 2, 4].map((startIndex) => (
            <View key={startIndex} style={styles.plannerButtonContainer}>
              {PLANNER_CATEGORIES.slice(startIndex, startIndex + 2).map(
                (category) => (
                  <Pressable
                    key={category.id}
                    style={styles.plannerButton}
                    onPress={() => handleCategoryPress(category.id)}
                  >
                    <Text style={styles.plannerButtonText}>
                      {category.label}
                    </Text>
                    <Image style={styles.plannerIcon} source={category.icon} />
                  </Pressable>
                )
              )}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <ThemedButton
              icon={<Calendar1 size={15} color={Palette.neutral.white} />}
              style={styles.calendarButton}
              title={showCalendar ? "Hide Calendar" : "Calendar"}
              onPress={() => setShowCalendar((s) => !s)}
            />
          </View>
          <PetCalendar
            visible={showCalendar}
            onClose={() => setShowCalendar(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  plannerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Palette.neutral.offWhite,
    borderRadius: 6,
    margin: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  petName: {
    fontFamily: Fonts.fredoka.bold,
    fontSize: 24,
    marginBottom: 3,
    marginTop: 3,
    color: Palette.purple.darker,
    textAlign: "center",
  },
  plannerButtonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  plannerButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Palette.neutral.white,
    alignItems: "center",
    borderRadius: 8,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  plannerButtonText: {
    fontFamily: Fonts.fredoka.medium,
    textAlign: "center",
    marginBottom: 8,
  },
  plannerIcon: {
    height: 110,
    width: 110,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  calendarButton: {
    padding: 10,
    backgroundColor: Palette.purple.darker,
    borderRadius: 8,
    marginTop: 3,
  },
});
