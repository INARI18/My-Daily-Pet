import IconPickerModal from "@/components/icons-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedDatePicker } from "@/components/ui/themed-date-picker";
import { ThemedInput } from "@/components/ui/themed-input";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { deletePet, getPetById, updatePet } from "@/services/pets";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteField } from "firebase/firestore";
import { ArrowLeft, PawPrint, SquarePen, Trash2 } from "lucide-react-native";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("ID do pet:", id);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState({
    name: "",
    type: "dog",
    gender: "male",
    birthDate: "",
    weight: "",
    castrated: "no",
  });

  const [isIconModalVisible, setIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<ImageSourcePropType | null>(
    null
  );

  // validation state
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  // load pet data
  useEffect(() => {
    const loadPet = async () => {
      try {
        const pet = await getPetById(id);

        if (pet) {
          console.log("Pet loaded:", pet);

          // Convert birthDate to string
          let birthDateStr = "";
          if (pet.birthDate) {
            if (pet.birthDate instanceof Date) {
              birthDateStr = pet.birthDate.toISOString().split("T")[0];
            } else if (typeof pet.birthDate === "string") {
              birthDateStr = pet.birthDate;
            }
          }

          setPetData({
            name: pet.name || "",
            type: pet.type || "dog",
            gender: pet.gender || "male",
            birthDate: birthDateStr,
            weight: pet.weight ? pet.weight.toString() : "",
            castrated: pet.castrated ? "yes" : "no",
          });

          // load icon if exists
          if (pet.iconUrl) {
            // iconUrl (string) => ImageSourcePropType
            setSelectedIcon({ uri: pet.iconUrl });
          }
        } else {
          console.log("Pet not found");
        }
      } catch (error) {
        console.error("Error loading pet:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setPetData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};

    if (!petData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const weight = parseFloat(petData.weight);
    if (isNaN(weight) || weight <= 0) {
      newErrors.weight = "Weight must be a number greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSave = async () => {
    setTouched({ name: true, weight: true });

    if (!validate()) {
      return;
    }

    try {
      const updateData: any = {
        name: petData.name,
        type: petData.type as "dog" | "cat",
        gender: petData.gender as "male" | "female",
        castrated: petData.castrated === "yes",
        // cleared date removes the field (unknown birthdate)
        birthDate: petData.birthDate.trim()
          ? new Date(petData.birthDate.trim())
          : deleteField(),
        weight: parseFloat(petData.weight),
      };

      // handle icon update
      if (
        selectedIcon &&
        typeof selectedIcon === "object" &&
        "uri" in selectedIcon
      ) {
        updateData.iconUrl = (selectedIcon as { uri: string }).uri;
      }
      // handle number (require), resolve to URI
      else if (selectedIcon && typeof selectedIcon === "number") {
        updateData.iconUrl = Image.resolveAssetSource(selectedIcon)?.uri;
      }

      await updatePet(id, updateData);

      router.replace("/(tabs)/profiles");
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
    }
  };

  const handleDelete = async () => {
    // Confirmation before deleting pet
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePet(id);
              router.replace("/(tabs)/profiles");
            } catch (error) {
              console.error("Erro ao deletar pet:", error);
            }
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.replace("/(tabs)/profiles");
  };

  const handleIconSelect = (icon: ImageSourcePropType) => {
    setSelectedIcon(icon);
    setPetData((prev) => ({
      ...prev,
      iconUrl: Image.resolveAssetSource(icon)?.uri,
    }));
    setIconModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
        edges={["top", "bottom"]}
      >
        <ActivityIndicator
          size="large"
          color={Palette.purple.main}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={Palette.purple.darker} />
            </TouchableOpacity>

            <ThemedText style={styles.title}>Edit Pet</ThemedText>
            <View style={{ width: 24 }} />
          </View>
          {/* pet icon */}
          <View style={styles.imageSection}>
            <TouchableOpacity
              style={styles.imageContainer}
              activeOpacity={0.7}
              onPress={() => setIconModalVisible(true)}
            >
              <View style={styles.imagePlaceholder}>
                {selectedIcon ? (
                  <Image
                    source={selectedIcon}
                    style={{ width: 64, height: 64 }}
                    resizeMode="contain"
                  />
                ) : (
                  <PawPrint
                    size={32}
                    color={Palette.neutral.gray}
                    strokeWidth={2}
                  />
                )}
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

          {/* FORM */}
          <View style={styles.formSection}>
            {/* name */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <ThemedInput
                placeholder="Name"
                value={petData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                style={styles.input}
                error={touched.name ? errors.name : null}
                onBlur={() => handleBlur("name")}
              />
            </View>

            {/* type */}
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

            {/* gender */}
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

            {/* birthdate */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Birthdate</ThemedText>
              <ThemedDatePicker
                value={petData.birthDate}
                onChangeDate={(date) => handleInputChange("birthDate", date)}
                placeholder="Select date"
                style={styles.input}
                maximumDate={new Date()}
                clearable
              />
            </View>

            {/* weight */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Weight</ThemedText>
              <ThemedInput
                placeholder="9.5kg"
                value={petData.weight}
                onChangeText={(text) => handleInputChange("weight", text)}
                keyboardType="decimal-pad"
                style={styles.input}
                filter="numeric"
                error={touched.weight ? errors.weight : null}
                onBlur={() => handleBlur("weight")}
              />
            </View>

            {/* castrated */}
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

          {/* buttons */}
          <View style={styles.buttonContainer}>
            <ThemedButton
              title="Delete"
              style={styles.deleteButton}
              onPress={handleDelete}
              icon={<Trash2 color={Palette.neutral.white} size={16} />}
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

      <IconPickerModal
        visible={isIconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelect={handleIconSelect}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
  deleteButton: {
    flex: 1,
    backgroundColor: Palette.buttons.warning,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  backButton: {
    padding: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
