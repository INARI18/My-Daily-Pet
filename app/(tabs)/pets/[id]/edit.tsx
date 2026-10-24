import { PetForm, PetFormValues } from "@/components/forms/pet-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { useColors } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
import { deletePet, getPetById, updatePet } from "@/services/pets";
import { addWeight } from "@/services/weights";
import { toYMD } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteField } from "firebase/firestore";
import { Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

export default function EditPet() {
  const c = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const [initial, setInitial] = useState<PetFormValues | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPetById(id).then((pet) => {
      if (!pet) {
        Alert.alert(t("common.error"), t("pets.notFound"), [
          { text: t("common.ok"), onPress: () => router.back() },
        ]);
        return;
      }
      setInitial({
        name: pet.name,
        type: pet.type,
        gender: pet.gender,
        birthDate: pet.birthDate ? toYMD(pet.birthDate) : "",
        weight: pet.weight ? String(pet.weight) : "",
        castrated: pet.castrated,
        iconUrl: pet.iconUrl,
      });
    });
  }, [id, router, t]);

  const handleSubmit = async (values: PetFormValues) => {
    setSaving(true);
    try {
      await updatePet(id, {
        name: values.name.trim(),
        type: values.type,
        gender: values.gender,
        weight: parseFloat(values.weight),
        castrated: values.castrated,
        // cleared date removes the field (unknown birthdate)
        birthDate: values.birthDate ? new Date(values.birthDate) : deleteField(),
        ...(values.iconUrl ? { iconUrl: values.iconUrl } : {}),
      });
      // a changed weight is a new measurement, so the history stays in sync
      const weight = parseFloat(values.weight);
      if (weight !== parseFloat(initial?.weight ?? "")) {
        await addWeight(id, weight, new Date());
      }
      router.back();
    } catch {
      Alert.alert(t("common.error"), t("pets.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t("pets.deleteConfirm.title"), t("pets.deleteConfirm.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await deletePet(id);
          router.dismissTo("/pets");
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      <Header title={t("pets.edit.title")} onBack={() => router.back()} />
      {initial ? (
        <PetForm
          initial={initial}
          submitLabel={t("common.save")}
          submitting={saving}
          onSubmit={handleSubmit}
          secondary={{
            label: t("common.delete"),
            variant: "danger",
            icon: <Trash2 size={16} color={c.danger} />,
            onPress: handleDelete,
          }}
        />
      ) : (
        <ActivityIndicator color={c.primary} style={{ marginTop: 40 }} />
      )}
    </Screen>
  );
}
