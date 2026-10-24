import {
  ensurePermission,
  reminderDataFrom,
  setupNotifications,
  syncReminders,
} from "@/services/notifications";
import { subscribeEventsChanged } from "@/utils/events-bus";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

// Keeps scheduled reminders in sync with the data and opens the event when a
// reminder is tapped. Mounted once, inside the authenticated area.
// expo-notifications has no web support, so the web build gets a no-op.
export const useReminders: () => void = Platform.OS === "web" ? () => {} : useRemindersNative;

function useRemindersNative() {
  const router = useRouter();
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    let active = true;
    const resync = () => {
      syncReminders().catch((e) => console.warn("reminder sync failed", e));
    };

    (async () => {
      await setupNotifications();
      await ensurePermission();
      if (active) resync();
    })();

    const unsubscribeBus = subscribeEventsChanged(resync);
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") resync();
    });
    const tap = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = reminderDataFrom(response);
      if (data) router.push(`/pets/${data.petId}/events/edit/${data.eventId}`);
    });

    return () => {
      active = false;
      unsubscribeBus();
      appState.remove();
      tap.remove();
    };
  }, [router]);

  // app opened from a reminder while closed
  useEffect(() => {
    const data = reminderDataFrom(lastResponse ?? null);
    if (data) router.push(`/pets/${data.petId}/events/edit/${data.eventId}`);
  }, [lastResponse, router]);
}
