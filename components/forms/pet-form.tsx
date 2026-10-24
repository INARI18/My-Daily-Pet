import IconPickerModal from "@/components/icons-modal";
import { Button } from "@/components/ui/button";
import { ChipGroup } from "@/components/ui/chip";
import { DateField } from "@/components/ui/date-field";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Colors, Radius, Shadow, Spacing } from "@/constants/theme";
import { useT } from "@/i18n/LanguageProvider";
import { PawPrint, SquarePen } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export type PetFormValues = {
  name: string;
  type: "dog" | "cat";
  gender: "male" | "female";
  birthDate: string; // YYYY-MM-DD or ""
  weight: string;
  castrated: boolean;
  iconUrl?: string;
};

export const EMPTY_PET: PetFormValues = {
  name: "",
  type: "dog",
  gender: "male",
  birthDate: "",
  weight: "",
  castrated: false,
};

type PetFormProps = {
  initial?: PetFormValues;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: PetFormValues) => void;
  secondary?: {
    label: string;
    variant: "ghost" | "danger";
    icon?: React.ReactNode;
    onPress: () => void;
  };
};

export function PetForm({
  initial = EMPTY_PET,
  submitLabel,
  submitting = false,
  onSubmit,
  secondary,
}: PetFormProps) {
  const t = useT();
  const [values, setValues] = useState<PetFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<"name" | "weight", string>>>({});
  const [iconModal, setIconModal] = useState(false);

  const typeOptions = [
    { label: t("pets.form.dog"), value: "dog" },
    { label: t("pets.form.cat"), value: "cat" },
  ] as const;
  const genderOptions = [
    { label: t("pets.form.female"), value: "female" },
    { label: t("pets.form.male"), value: "male" },
  ] as const;
  const yesNo = [
    { label: t("pets.form.yes"), value: "yes" },
    { label: t("pets.form.no"), value: "no" },
  ] as const;

  const set = <K extends keyof PetFormValues>(key: K, value: PetFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = t("pets.form.errors.name");
    const weight = parseFloat(values.weight);
    if (isNaN(weight) || weight <= 0) next.weight = t("pets.form.errors.weight");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleIconSelect = (icon: ImageSourcePropType) => {
    const uri =
      typeof icon === "number"
        ? Image.resolveAssetSource(icon)?.uri
        : (icon as { uri?: string }).uri;
    set("iconUrl", uri);
    setIconModal(false);
  };

  return (
    <View style={styles.form}>
      <Pressable style={styles.avatarWrap} onPress={() => setIconModal(true)}>
        <View style={styles.avatar}>
          {values.iconUrl ? (
            <Image
              source={{ uri: values.iconUrl }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          ) : (
            <PawPrint size={36} color={Colors.textMuted} />
          )}
        </View>
        <View style={styles.avatarEdit}>
          <SquarePen size={14} color={Colors.onPrimary} />
        </View>
      </Pressable>

      <Input
        label={t("pets.form.name")}
        placeholder={t("pets.form.namePlaceholder")}
        value={values.name}
        onChangeText={(v) => set("name", v)}
        error={errors.name}
        autoCapitalize="words"
      />

      <ChipGroup
        label={t("pets.form.type")}
        options={typeOptions}
        value={values.type}
        onChange={(v) => set("type", v)}
        grow
      />

      <Segmented
        label={t("pets.form.gender")}
        options={genderOptions}
        value={values.gender}
        onChange={(v) => set("gender", v)}
      />

      <View style={styles.row}>
        <DateField
          label={t("pets.form.birthdate")}
          placeholder={t("pets.form.selectDate")}
          value={values.birthDate}
          onChange={(v) => set("birthDate", v)}
          maximumDate={new Date()}
          clearable
          containerStyle={styles.flex}
        />
        <Input
          label={t("pets.form.weight")}
          placeholder="9.5"
          value={values.weight}
          onChangeText={(v) => set("weight", v.replace(",", "."))}
          keyboardType="decimal-pad"
          error={errors.weight}
          containerStyle={styles.flex}
        />
      </View>

      <Segmented
        label={t("pets.form.castrated")}
        options={yesNo}
        value={values.castrated ? "yes" : "no"}
        onChange={(v) => set("castrated", v === "yes")}
      />

      <View style={styles.buttons}>
        {secondary ? (
          <Button
            title={secondary.label}
            variant={secondary.variant}
            icon={secondary.icon}
            onPress={secondary.onPress}
            style={styles.flex}
          />
        ) : null}
        <Button
          title={submitLabel}
          onPress={() => validate() && onSubmit(values)}
          loading={submitting}
          style={styles.flex}
        />
      </View>

      <IconPickerModal
        visible={iconModal}
        onClose={() => setIconModal(false)}
        onSelect={handleIconSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.lg },
  flex: { flex: 1 },
  row: { flexDirection: "row", gap: Spacing.md },
  avatarWrap: { alignSelf: "center", marginTop: Spacing.sm },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.avatar,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  avatarImage: { width: 64, height: 64 },
  avatarEdit: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.sm },
});
