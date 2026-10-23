import IconPickerModal from "@/components/icons-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/ui/themed-button";
import { ThemedDatePicker } from "@/components/ui/themed-date-picker";
import { ThemedInput } from "@/components/ui/themed-input";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { addPet } from "@/services/pets";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { PawPrint, SquarePen } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

  const [isIconModalVisible, setIconModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<ImageSourcePropType | null>(
    null
  );

  // validation state
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const handleInputChange = (field: string, value: string) => {
    setPetData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      if (!prev[field]) return prev;
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

  const handleSave = () => {
    setTouched({ name: true, weight: true });

    if (!validate()) {
      return;
    }

    // Firestore rejects undefined values, so omit birthDate when unknown
    const { birthDate: birthDateStr, ...rest } = petData;
    addPet({
      ...rest,
      type: petData.type as "dog" | "cat",
      gender: petData.gender as "male" | "female",
      castrated: petData.castrated === "yes",
      ...(birthDateStr.trim() ? { birthDate: new Date(birthDateStr.trim()) } : {}),
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

    setErrors({});
    setTouched({});

    router.replace("/pets");
  };

  const handleCancel = () => {
    router.replace("/pets");
  };

  const handleIconSelect = (icon: ImageSourcePropType) => {
    setSelectedIcon(icon); // define the selected icon
    setPetData((prev) => ({
      ...prev,
      iconUrl: Image.resolveAssetSource(icon)?.uri,
    })); // ensures the iconUrl is a valid string
    setIconModalVisible(false);
  };

  // reset form when leaving the screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedIcon(null);
        setPetData({
          name: "",
          type: "dog",
          gender: "male",
          birthDate: "",
          weight: "",
          castrated: "no",
        });
        setErrors({});
        setTouched({});
      };
    }, [])
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Add New Pet</ThemedText>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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

          {/* name */}
          <View style={styles.formSection}>
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
    backgroundColor: Palette.buttons.other,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  bottomSpacing: {
    height: 40,
  },
});
