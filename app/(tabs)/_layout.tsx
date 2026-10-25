import { Fonts } from "@/constants/theme";
import { useColors } from "@/theme/ThemeProvider";
import { useReminders } from "@/hooks/use-reminders";
import { useT } from "@/i18n/LanguageProvider";
import { Tabs } from "expo-router";
import { CalendarCheck, Compass, PawPrint, UserRound } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Today is the landing tab
export const unstable_settings = { anchor: "today" };

export default function TabLayout() {
  const c = useColors();
  const t = useT();
  // edge-to-edge on Android: keep the tab bar above the system navigation bar
  const insets = useSafeAreaInsets();
  useReminders();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          height: 58 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontFamily: Fonts.bodyBold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t("tabs.today"),
          tabBarIcon: ({ color, size }) => (
            <CalendarCheck color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: t("tabs.pets"),
          tabBarIcon: ({ color, size }) => <PawPrint color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: t("tabs.discover"),
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("tabs.account"),
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
