import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { useRouter } from "expo-router";
import { Home, Undo2, UserRound } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Navbar({ pageName }: { pageName: string }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Undo2 color={Palette.neutral.white} size={24} />
      </TouchableOpacity>
      <Text style={styles.text}>{pageName}</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/user")}
      >
        <UserRound color={Palette.neutral.white} size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/")}
      >
        <Home color={Palette.neutral.white} size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Palette.purple.darker,
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    justifyContent: "space-between",
  },
  text: {
    color: Palette.neutral.white,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: Fonts.nunito.extraBold,
    flex: 1,
  },
  backButton: {
    backgroundColor: Palette.purple.dark,
    borderRadius: 8,
    padding: 5,
  },
  homeButton: {
    backgroundColor: Palette.yellow.main,
    borderRadius: 8,
    padding: 5,
  },
});
