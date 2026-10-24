import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { PETS_ILLUSTRATION } from "@/constants/events";
import { Fonts, Radius, Shadow, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
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
  const c = useColors();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const t = useT();
  const age = calculateAge(pet.birthDate);
  const meta = [
    age === null ? t("pets.meta.ageUnknown") : t("pets.meta.years", { count: age }),
    t("pets.meta.kg", { weight: pet.weight }),
    pet.castrated ? t("pets.meta.castrated") : t("pets.meta.notCastrated"),
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
        accessibilityLabel={t("pets.editLabel")}
      >
        <SquarePen size={18} color={c.primary} />
      </Pressable>
    </Card>
  );
}

export default function Pets() {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const t = useT();
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
        title={t("pets.title")}
        subtitle={pets === null ? " " : t("pets.count", { count: pets.length })}
        image={PETS_ILLUSTRATION}
      />
      {pets === null ? (
        <ActivityIndicator color={c.primary} style={styles.loading} />
      ) : pets.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.empty}>{t("pets.empty")}</Text>
          <Button title={t("pets.addButton")} onPress={() => router.push("/pets/add")} />
        </View>
      ) : (
        pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
      )}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/pets/add")}
        accessibilityLabel={t("pets.addLabel")}
      >
        <Plus size={28} color={c.onPrimary} strokeWidth={2.5} />
      </Pressable>
    </Screen>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  content: { paddingBottom: 96, minHeight: "100%" },
  loading: { marginTop: 40 },
  emptyBox: { marginTop: 32, gap: Spacing.lg },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: c.textMuted,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontFamily: Fonts.title, fontSize: 18, color: c.text },
  gender: { width: 14, height: 14 },
  meta: { fontFamily: Fonts.body, fontSize: 12.5, color: c.textMuted, marginTop: 2 },
  edit: {
    width: 36,
    height: 36,
    borderRadius: Radius.chip,
    backgroundColor: c.primarySoft,
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
    backgroundColor: c.accent,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
});
