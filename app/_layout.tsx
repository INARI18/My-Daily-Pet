import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { onAuthStateChanged, User } from "firebase/auth";

import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { auth } from "../firebase-config";

export const unstable_settings = {
  anchor: null,
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fredoka_700Bold,
    Fredoka_500Medium,
    Fredoka_400Regular,
    Nunito_800ExtraBold,
    Nunito_600SemiBold,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      // Usuário não autenticado tentando acessar tabs
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      // Usuário autenticado na tela de login
      router.replace("/(tabs)");
    }
  }, [user, segments, loading]);

  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (loading || !fontsLoaded) {
    return null; // Mantém a splash screen
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
