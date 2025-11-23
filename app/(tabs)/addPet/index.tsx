import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedInput } from "@/components/ui/themed-input";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { addPet } from "@/services/pets";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { PawPrint, SquarePen } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPet() {
  const router = useRouter();
  const [petData, setPetData] = useState({
    name: "",
    type: "dog",
    gender: "male",
    birthDate: "",
    weight: "",
    castrated: "no",
  });

  const handleInputChange = (field: string, value: string) => {
    setPetData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    addPet({
      ...petData,
      type: petData.type as "dog" | "cat",
      gender: petData.gender as "male" | "female",
      castrated: petData.castrated === "yes",
      birthDate: new Date(petData.birthDate),
      weight: parseFloat(petData.weight),
    });
    setPetData({
      name: "",
      type: "dog",
      gender: "male",
      birthDate: "",
      weight: "",
      castrated: "no",
    });
    router.replace("/(tabs)/profiles");
  };

  const handleCancel = () => {
    router.replace("/(tabs)/profiles");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Edit Pet Details</ThemedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Foto do Pet */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imageContainer} activeOpacity={0.7}>
              <View style={styles.imagePlaceholder}>
                <PawPrint
                  size={32}
                  color={Palette.neutral.gray}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.editIconOverlay}>
                <SquarePen
                  size={16}
                  color={Palette.neutral.white}
                  strokeWidth={2.5}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <ThemedInput
                placeholder="Name"
                value={petData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Type</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={petData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                  style={[styles.input, styles.picker]}
                >
                  <Picker.Item label="Dog" value="dog" />
                  <Picker.Item label="Cat" value="cat" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Gender</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={petData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  style={[styles.input, styles.picker]}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Birthdate</ThemedText>
              <ThemedInput
                placeholder="03/01/2016"
                value={petData.birthDate}
                onChangeText={(text) => handleInputChange("birthDate", text)}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Weight</ThemedText>
              <ThemedInput
                placeholder="9kg"
                value={petData.weight}
                onChangeText={(text) => handleInputChange("weight", text)}
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Castrated</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={petData.castrated}
                  onValueChange={(value) =>
                    handleInputChange("castrated", value)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <ThemedButton
              title="Cancel"
              style={styles.cancelButton}
              onPress={handleCancel}
            />
            <ThemedButton
              title="Save"
              style={styles.saveButton}
              onPress={handleSave}
            />
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.neutral.offWhite,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: Palette.neutral.offWhite,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  imageContainer: {
    position: "relative",
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: Palette.neutral.lightGray,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  editIconOverlay: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.purple.darker,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Palette.neutral.offWhite,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.purple.darker,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Palette.neutral.lightGray,
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerContainer: {
    backgroundColor: Palette.neutral.lightGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 55,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Palette.neutral.gray,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  bottomSpacing: {
    height: 40,
  },
});
