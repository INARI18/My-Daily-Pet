import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { PETS_ILLUSTRATION } from "@/constants/events";
import { Colors, Fonts, Radius, Shadow, Spacing } from "@/constants/theme";
import {
  calculateAge,
  getPetGenderSymbol,
  getPetIcon,
  getPets,
} from "@/services/pets";
import { Pet } from "@/types/pet";
import { useFocusEffect, useRouter } from "expo-router";
import { Plus, SquarePen } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function PetCard({ pet }: { pet: Pet }) {
  const router = useRouter();
  const age = calculateAge(pet.birthDate);
  const meta = [
    age === null ? "Age unknown" : `${age} ${age === 1 ? "year" : "years"}`,
    `${pet.weight} kg`,
    pet.castrated ? "Castrated" : "Not castrated",
  ].join("  ·  ");

  return (
    <Card onPress={() => router.push(`/pets/${pet.id}`)} style={styles.card}>
      <Avatar source={getPetIcon(pet)} size="m" tone={pet.type} />
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <Image source={getPetGenderSymbol(pet)} style={styles.gender} />
        </View>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Pressable
        onPress={() => router.push(`/pets/${pet.id}/edit`)}
        style={styles.edit}
        hitSlop={8}
        accessibilityLabel="Edit pet"
      >
        <SquarePen size={18} color={Colors.primary} />
      </Pressable>
    </Card>
  );
}

export default function Pets() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getPets().then((list) => active && setPets(list));
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <Screen scroll contentStyle={styles.content}>
      <Hero
        title="My Pets"
        subtitle={
          pets === null
            ? " "
            : pets.length === 0
              ? "No pets yet"
              : `${pets.length} ${pets.length === 1 ? "pet" : "pets"}`
        }
        image={PETS_ILLUSTRATION}
      />
      {pets === null ? (
        <ActivityIndicator color={Colors.primary} style={styles.loading} />
      ) : pets.length === 0 ? (
        <Text style={styles.empty}>
          No pets yet. Tap + to add your first one.
        </Text>
      ) : (
        pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
      )}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/pets/add")}
        accessibilityLabel="Add pet"
      >
        <Plus size={28} color={Colors.onPrimary} strokeWidth={2.5} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 96, minHeight: "100%" },
  loading: { marginTop: 40 },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontFamily: Fonts.title, fontSize: 18, color: Colors.text },
  gender: { width: 14, height: 14 },
  meta: { fontFamily: Fonts.body, fontSize: 12.5, color: Colors.textMuted, marginTop: 2 },
  edit: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
});
