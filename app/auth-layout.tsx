import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/palette";
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_700Bold,
  useFonts,
} from "@expo-google-fonts/fredoka";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

// keeps the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once the fonts have loaded or an error occurs
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </ThemedView>
    );
  }

  return <ThemedView style={styles.container}>{children}</ThemedView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Palette.purple.main,
  },
});

export default AuthLayout;
