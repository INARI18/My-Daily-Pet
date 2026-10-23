import { PetForm, PetFormValues } from "@/components/forms/pet-form";
import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Colors } from "@/constants/theme";
import { deletePet, getPetById, updatePet } from "@/services/pets";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteField } from "firebase/firestore";
import { Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

function toYMD(d?: Date) {
  if (!d) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function EditPet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<PetFormValues | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPetById(id).then((pet) => {
      if (!pet) {
        Alert.alert("Error", "Pet not found", [{ text: "OK", onPress: () => router.back() }]);
        return;
      }
      setInitial({
        name: pet.name,
        type: pet.type,
        gender: pet.gender,
        birthDate: toYMD(pet.birthDate),
        weight: pet.weight ? String(pet.weight) : "",
        castrated: pet.castrated,
        iconUrl: pet.iconUrl,
      });
    });
  }, [id, router]);

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
      router.back();
    } catch {
      Alert.alert("Error", "Could not save the pet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete pet",
      "This removes the pet and all its events. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deletePet(id);
            router.dismissTo("/pets");
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <Header title="Edit pet" onBack={() => router.back()} />
      {initial ? (
        <PetForm
          initial={initial}
          submitLabel="Save"
          submitting={saving}
          onSubmit={handleSubmit}
          secondary={{
            label: "Delete",
            variant: "danger",
            icon: <Trash2 size={16} color={Colors.danger} />,
            onPress: handleDelete,
          }}
        />
      ) : (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      )}
    </Screen>
  );
}
