import { useColors } from "@/theme/ThemeProvider";
import { PawPrint } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

// Two large, faint paw prints behind the screen content.
export function PawBackground() {
  const c = useColors();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.left}>
        <PawPrint size={190} color={c.paw} fill={c.paw} strokeWidth={0.5} />
      </View>
      <View style={styles.right}>
        <PawPrint size={220} color={c.paw} fill={c.paw} strokeWidth={0.5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  left: { position: "absolute", left: -50, top: "42%", transform: [{ rotate: "-20deg" }] },
  right: { position: "absolute", right: -70, bottom: "6%", transform: [{ rotate: "25deg" }] },
});
