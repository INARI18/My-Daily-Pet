import { useLocalSearchParams, useRouter } from "expo-router";
import { SquarePen } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/components/ui/navbar";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import {
  calculateAge,
  getPetGenderSymbol,
  getPetIcon,
  getPets,
} from "@/services/pets";
import { Pet } from "@/types/pet";
import { getAuth } from "firebase/auth";

function ProfileCard({ pet }: { pet: Pet }) {
  const age = calculateAge(pet.birthDate);
  const router = useRouter();

  const handlePressCard = () => {
    if (!pet.id) return;
    router.push(`/(tabs)/planner/${pet.id}` as any);
  };

  const handlePressEditButton = () => {
    if (!pet.id) return;
    router.push(`/(tabs)/editPet/${pet.id}` as any);
  };

  return (
    <Pressable onPress={handlePressCard}>
      <View
        style={{
          backgroundColor: Palette.neutral.white,
          padding: 18,
          borderRadius: 8,
          marginBottom: 16,
          flexDirection: "row",
          gap: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
          }}
        >
          <Image
            source={getPetIcon(pet)}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={{ flexDirection: "column", gap: 5, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: Fonts.nunito.semiBold,
                color: Palette.neutral.black,
              }}
            >
              {pet.name}
            </Text>
            <Image
              source={getPetGenderSymbol(pet)}
              style={{
                width: pet.gender === "female" ? 16 : 14,
                height: pet.gender === "female" ? 16 : 14,
              }}
            />
          </View>
          <Text style={{ color: Palette.neutral.gray, fontSize: 12 }}>
            {age} years | {pet.weight} kg |{" "}
            {pet.castrated ? "Castrated" : "Not Castrated"}
          </Text>
        </View>
        <Pressable style={styles.editButton} onPress={handlePressEditButton}>
          <SquarePen color={Palette.purple.darker} size={22} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function Profiles() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const auth = getAuth();
  const [pets, setPets] = useState<Pet[]>(
    params.pets && typeof params.pets === "string"
      ? JSON.parse(params.pets)
      : []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // verify if the user is authenticated before fetching data
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    if (!params.pets) {
      const fetchPets = async () => {
        try {
          const fetchedPets = await getPets();
          setPets(fetchedPets);
        } catch (error) {
          console.error("Erro ao buscar pets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPets();
    } else {
      setLoading(false);
    }
  }, [params, auth.currentUser]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Navbar pageName="My Pets" />
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Palette.purple.main}
            style={{ marginTop: 20 }}
          />
        ) : (
          <ScrollView
            style={styles.profilesContainer}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {pets.length === 0 ? (
              <Text style={styles.emptyText}>
                You don't have any pets registered yet. Add one by clicking the
                button below!
              </Text>
            ) : (
              pets.map((pet) => <ProfileCard key={pet.id} pet={pet} />)
            )}
          </ScrollView>
        )}
        <Pressable style={styles.fab} onPress={() => router.push("../addPet")}>
          <Image
            source={require("@/assets/images/profiles/add_pet_profile_button.png")}
            style={{ width: 65, height: 65 }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  profilesContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Palette.neutral.offWhite,
    borderRadius: 6,
    margin: 10,
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.purple.main,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 16,
    color: Palette.neutral.gray,
    textAlign: "center",
    marginTop: 20,
  },
  editButton: {
    padding: 10,
    backgroundColor: Palette.neutral.offWhite,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
