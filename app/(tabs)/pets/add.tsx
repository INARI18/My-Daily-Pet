import { PetForm, PetFormValues } from "@/components/forms/pet-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { useT } from "@/i18n/LanguageProvider";
import { addPet } from "@/services/pets";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export default function AddPet() {
  const router = useRouter();
  const t = useT();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: PetFormValues) => {
    setSaving(true);
    try {
      await addPet({
        name: values.name.trim(),
        type: values.type,
        gender: values.gender,
        weight: parseFloat(values.weight),
        castrated: values.castrated,
        // Firestore rejects undefined, so unknown birthdate is omitted
        ...(values.birthDate ? { birthDate: new Date(values.birthDate) } : {}),
        ...(values.iconUrl ? { iconUrl: values.iconUrl } : {}),
      });
      router.back();
    } catch {
      Alert.alert(t("common.error"), t("pets.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll>
      <Header title={t("pets.add.title")} onBack={() => router.back()} />
      <PetForm
        submitLabel={t("common.save")}
        submitting={saving}
        onSubmit={handleSubmit}
        secondary={{ label: t("common.cancel"), variant: "ghost", onPress: () => router.back() }}
      />
    </Screen>
  );
}
