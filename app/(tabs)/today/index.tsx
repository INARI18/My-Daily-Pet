import { Header } from "@/components/ui/header";
import { Screen } from "@/components/ui/screen";
import { Colors, Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";

// placeholder until the Today screen is implemented
export default function Today() {
  return (
    <Screen>
      <Header title="Today" />
      <Text style={styles.text}>Nothing for today</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { fontFamily: Fonts.body, color: Colors.textMuted, marginTop: 24 },
});
