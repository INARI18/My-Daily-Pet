import { DarkColors, LightColors, Palette } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark";
export type Scheme = "light" | "dark";

const THEME_KEY = "preferences.theme";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  scheme: Scheme;
  colors: Palette;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") setPreferenceState(stored);
    });
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(THEME_KEY, p);
  }, []);

  const scheme: Scheme = preference === "system" ? (system === "dark" ? "dark" : "light") : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference, scheme, colors: scheme === "dark" ? DarkColors : LightColors }),
    [preference, setPreference, scheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useColors must be used inside AppThemeProvider");
  return ctx;
}

export function useColors(): Palette {
  return useThemeContext().colors;
}

export function useScheme(): Scheme {
  return useThemeContext().scheme;
}

export function useThemePreference(): [ThemePreference, (p: ThemePreference) => void] {
  const { preference, setPreference } = useThemeContext();
  return [preference, setPreference];
}

// react-navigation theme + status bar following the app scheme
export function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { scheme, colors } = useThemeContext();
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = useMemo(
    () => ({
      ...base,
      colors: { ...base.colors, background: colors.bg, card: colors.surface, text: colors.text, primary: colors.primary },
    }),
    [base, colors]
  );
  return (
    <NavThemeProvider value={theme}>
      {children}
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </NavThemeProvider>
  );
}

// Memoizes a palette-dependent StyleSheet per palette instance.
export function useStyles<T>(make: (c: Palette) => T): T {
  const colors = useColors();
  return useMemo(() => make(colors), [make, colors]);
}
