import { Tabs } from "expo-router";
import React from "react";

// expo-router 58+: only screens declared here are reachable (tab bar is hidden anyway)
const SCREENS = [
  "index",
  "profiles/index",
  "addPet/index",
  "editPet/[id]",
  "user/index",
  "planner/[id]/index",
  "planner/[id]/events/[eventType]",
  "planner/[id]/events/addEvent",
  "planner/[id]/events/editEvent/[eventId]",
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: false,
      }}
    >
      {SCREENS.map((name) => (
        <Tabs.Screen key={name} name={name} />
      ))}
    </Tabs>
  );
}
