import { ThemedView } from "@/components/themed-view";
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_700Bold,
  useFonts,
} from "@expo-google-fonts/fredoka";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_700Bold,
  });

  if (!fontsLoaded) {
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
  },
});

export default AuthLayout;
