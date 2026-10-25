import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { PETS_ILLUSTRATION } from "@/constants/events";
import { Fonts, Palette, Radius, Shadow, Spacing } from "@/constants/theme";
import { useT } from "@/i18n/LanguageProvider";
import {
  calculateAge,
  deletePet,
  getPetGenderSymbol,
  getPetIcon,
  getPets,
} from "@/services/pets";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { Pet } from "@/types/pet";
import { useFocusEffect, useRouter } from "expo-router";
import { Check, Plus, SquarePen, Trash2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function PetCard({
  pet,
  selecting,
  selected,
  onToggle,
}: {
  pet: Pet;
  selecting: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const c = useColors();
  const styles = useStyles(makeStyles);
  const age = calculateAge(pet.birthDate);
  const meta = [
    age === null ? t("pets.meta.ageUnknown") : t("pets.meta.years", { count: age }),
    t("pets.meta.kg", { weight: pet.weight }),
    pet.castrated ? t("pets.meta.castrated") : t("pets.meta.notCastrated"),
  ].join("  ·  ");

  return (
    <Card
      onPress={() => (selecting ? onToggle() : router.push(`/pets/${pet.id}`))}
      onLongPress={onToggle}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <Avatar source={getPetIcon(pet)} size="m" tone={pet.type} />
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <Image source={getPetGenderSymbol(pet)} style={styles.gender} />
        </View>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      {selecting ? (
        <View style={[styles.check, selected && styles.checkOn]}>
          {selected ? <Check size={16} color={c.onPrimary} strokeWidth={3} /> : null}
        </View>
      ) : (
        <Pressable
          onPress={() => router.push(`/pets/${pet.id}/edit`)}
          style={styles.edit}
          hitSlop={8}
          accessibilityLabel={t("pets.editLabel")}
        >
          <SquarePen size={18} color={c.primary} />
        </Pressable>
      )}
    </Card>
  );
}

export default function Pets() {
  const router = useRouter();
  const t = useT();
  const c = useColors();
  const styles = useStyles(makeStyles);
  const [pets, setPets] = useState<Pet[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selecting = selected.size > 0;

  const load = useCallback(async () => setPets(await getPets()), []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getPets().then((list) => active && setPets(list));
      setSelected(new Set());
      return () => {
        active = false;
      };
    }, [])
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleDeleteSelected = () => {
    const count = selected.size;
    Alert.alert(t("pets.deleteSelected.title"), t("pets.deleteSelected.message", { count }), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await Promise.all([...selected].map((id) => deletePet(id)));
          setSelected(new Set());
          await load();
        },
      },
    ]);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <Hero
        title={t("pets.title")}
        subtitle={pets === null ? " " : t("pets.count", { count: pets.length })}
        image={PETS_ILLUSTRATION}
      />
      {selecting ? (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>{t("pets.selected", { count: selected.size })}</Text>
          <Button
            title={t("common.cancel")}
            variant="ghost"
            size="sm"
            onPress={() => setSelected(new Set())}
          />
          <Button
            title={t("common.delete")}
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} color={c.danger} />}
            onPress={handleDeleteSelected}
          />
        </View>
      ) : null}
      {pets === null ? (
        <ActivityIndicator color={c.primary} style={styles.loading} />
      ) : pets.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.empty}>{t("pets.empty")}</Text>
          <Button title={t("pets.addButton")} onPress={() => router.push("/pets/add")} />
        </View>
      ) : (
        pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            selecting={selecting}
            selected={selected.has(pet.id)}
            onToggle={() => toggle(pet.id)}
          />
        ))
      )}
      {!selecting ? (
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/pets/add")}
          accessibilityLabel={t("pets.addLabel")}
        >
          <Plus size={28} color={c.onPrimary} strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </Screen>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    content: { paddingBottom: 96, minHeight: "100%" },
    loading: { marginTop: 40 },
    emptyBox: { marginTop: 32, gap: Spacing.lg },
    empty: {
      fontFamily: Fonts.body,
      fontSize: 15,
      color: c.textMuted,
      textAlign: "center",
    },
    selectionBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    selectionText: { flex: 1, fontFamily: Fonts.bodyBold, fontSize: 13, color: c.textMuted },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    cardSelected: { borderColor: c.primary, borderWidth: 1.5 },
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
    check: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },
    checkOn: { backgroundColor: c.primary, borderColor: c.primary },
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
