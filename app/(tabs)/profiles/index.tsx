import { useRouter } from "expo-router";
import {
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
import { Pet, calculateAge, getPetGenderSymbol, getPetIcon } from "@/types/pet";

const mockProfiles: Pet[] = [
  {
    id: "1",
    name: "Fluffy",
    birthDate: new Date("2023-06-15"),
    weight: 3,
    gender: "male",
    type: "cat",
    castrated: true,
    iconUrl: require("@/assets/icons/cats/1.png"),
  },
  {
    id: "2",
    name: "Thor",
    birthDate: new Date("2019-04-20"),
    weight: 4,
    gender: "male",
    type: "dog",
    castrated: false,
    iconUrl: require("@/assets/icons/dogs/2.png"),
  },
  {
    id: "3",
    name: "Snowball",
    birthDate: new Date("2024-06-15"),
    weight: 2,
    gender: "female",
    type: "cat",
    castrated: true,
    iconUrl: require("@/assets/icons/cats/11.png"),
  },
  {
    id: "4",
    name: "Luna",
    birthDate: new Date("2022-03-10"),
    weight: 3.5,
    gender: "female",
    type: "cat",
    castrated: true,
    iconUrl: require("@/assets/icons/cats/4.png"),
  },
  {
    id: "5",
    name: "Max",
    birthDate: new Date("2020-08-25"),
    weight: 8,
    gender: "male",
    type: "dog",
    castrated: true,
    iconUrl: require("@/assets/icons/dogs/7.png"),
  },
  {
    id: "6",
    name: "Mia",
    birthDate: new Date("2023-11-05"),
    weight: 2.5,
    gender: "female",
    type: "cat",
    castrated: false,
    iconUrl: require("@/assets/icons/cats/8.png"),
  },
  {
    id: "7",
    name: "Rex",
    birthDate: new Date("2018-01-15"),
    weight: 12,
    gender: "male",
    type: "dog",
    castrated: true,
    iconUrl: require("@/assets/icons/dogs/9.png"),
  },
  {
    id: "8",
    name: "Bella",
    birthDate: new Date("2021-07-20"),
    weight: 5,
    gender: "female",
    type: "dog",
    castrated: true,
    iconUrl: require("@/assets/icons/dogs/19.png"),
  },
  {
    id: "9",
    name: "Oliver",
    birthDate: new Date("2024-02-14"),
    weight: 1.5,
    gender: "male",
    type: "cat",
    castrated: false,
    iconUrl: require("@/assets/icons/cats/8.png"),
  },
  {
    id: "10",
    name: "Charlie",
    birthDate: new Date("2019-09-30"),
    weight: 7,
    gender: "male",
    type: "dog",
    castrated: false,
    iconUrl: require("@/assets/icons/dogs/10.png"),
  },
];

function ProfileCard({ pet }: { pet: Pet }) {
  const age = calculateAge(pet.birthDate);

  return (
    <View
      style={{
        backgroundColor: Palette.neutral.lightGray,
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
    </View>
  );
}

export default function Profiles() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Navbar pageName="My Pets" />
        <ScrollView
          style={styles.profilesContainer}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {mockProfiles.map((profile) => (
            <ProfileCard key={profile.id} pet={profile} />
          ))}
        </ScrollView>
        <Pressable style={styles.fab} onPress={() => {}}>
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
    backgroundColor: Palette.neutral.white,
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
});
