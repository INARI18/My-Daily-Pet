import { AppThemeProvider, NavigationThemeProvider } from "@/theme/ThemeProvider";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { onAuthStateChanged, User } from "firebase/auth";

import {
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from "@expo-google-fonts/baloo-2";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { auth } from "../firebase-config";

export const unstable_settings = {
  anchor: null,
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_800ExtraBold,
    Baloo2_700Bold,
    Nunito_800ExtraBold,
    Nunito_600SemiBold,
    Nunito_400Regular,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

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
      router.replace("/today");
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
      <AppThemeProvider>
        <LanguageProvider>
          <NavigationThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
            </Stack>
          </NavigationThemeProvider>
        </LanguageProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
