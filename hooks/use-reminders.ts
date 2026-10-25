import {
  addReminderTapListener,
  ensurePermission,
  remindersAvailable,
  setupNotifications,
  syncReminders,
  useLaunchReminder,
} from "@/services/notifications";
import { subscribeEventsChanged } from "@/utils/events-bus";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";

// Keeps scheduled reminders in sync with the data and opens the event when a
// reminder is tapped. Mounted once, inside the authenticated area. Does nothing
// where expo-notifications is unavailable (web, or a client without the module).
export function useReminders() {
  const router = useRouter();
  const launchReminder = useLaunchReminder();

  useEffect(() => {
    if (!remindersAvailable) return;
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
    const removeTap = addReminderTapListener((data) =>
      router.push(`/pets/${data.petId}/events/edit/${data.eventId}`)
    );

    return () => {
      active = false;
      unsubscribeBus();
      appState.remove();
      removeTap();
    };
  }, [router]);

  // app opened from a reminder while closed
  useEffect(() => {
    if (launchReminder) {
      router.push(`/pets/${launchReminder.petId}/events/edit/${launchReminder.eventId}`);
    }
  }, [launchReminder, router]);
}
