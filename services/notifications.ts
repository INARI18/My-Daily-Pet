import { i18n } from "@/i18n";
import { addDays, formatDate, formatTime, isSameDay } from "@/utils/date";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getActiveEventsForAllPets, getOccurrencesByDay } from "./events";
import { getNotificationsEnabled } from "./preferences";

export const REMINDER_OFFSETS = [0, 15, 60, 1440] as const;
export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

const CHANNEL_ID = "reminders";
const DAYS_AHEAD = 30;
const MAX_SCHEDULED = 60; // iOS keeps at most 64 pending

export type ReminderData = { petId: string; eventId: string };

// show reminders even while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: i18n.t("notifications.channel"),
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#5C1A5C",
    });
  }
}

export type PermissionState = "granted" | "denied" | "undetermined";

export async function getPermissionState(): Promise<PermissionState> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined";
}

// asks only while the answer is still undetermined
export async function ensurePermission(): Promise<boolean> {
  const current = await getPermissionState();
  if (current === "granted") return true;
  if (current === "denied") return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

let syncing: Promise<void> | null = null;

// Rebuilds every scheduled reminder from the current events. Safe to call often;
// concurrent calls share one run.
export function syncReminders(): Promise<void> {
  if (!syncing) {
    syncing = doSync().finally(() => {
      syncing = null;
    });
  }
  return syncing;
}

async function doSync(): Promise<void> {
  if (Platform.OS === "web") return;
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!(await getNotificationsEnabled())) return;
  if ((await getPermissionState()) !== "granted") return;

  const now = new Date();
  const until = addDays(now, DAYS_AHEAD);
  const petEvents = await getActiveEventsForAllPets();
  const petsById = new Map(petEvents.map(({ pet }) => [pet.id, pet]));
  const events = petEvents.map(({ event }) => event).filter((e) => e.notificationEnabled);

  const byDay = getOccurrencesByDay(events, until);
  const reminders = Object.values(byDay)
    .flat()
    .filter((occ) => !occ.done)
    .map((occ) => ({
      occ,
      fireAt: new Date(occ.date.getTime() - (occ.event.reminderOffsetMinutes ?? 0) * 60_000),
    }))
    .filter((r) => r.fireAt > now)
    .sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime())
    .slice(0, MAX_SCHEDULED);

  const lang = i18n.locale as "en" | "pt";
  for (const { occ, fireAt } of reminders) {
    const pet = petsById.get(occ.event.petId);
    const when = isSameDay(occ.date, fireAt)
      ? i18n.t("notifications.bodyToday", { time: formatTime(occ.date, lang) })
      : i18n.t("notifications.bodyDate", {
          date: formatDate(occ.date, lang),
          time: formatTime(occ.date, lang),
        });
    const data: ReminderData = { petId: occ.event.petId, eventId: occ.event.id };
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${pet?.name ?? ""} · ${i18n.t(`eventTypes.${occ.event.type}.singular`)}`,
        body: occ.event.notes ? `${when} · ${occ.event.notes}` : when,
        data,
        sound: true,
        ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireAt },
    });
  }
}

export function reminderDataFrom(response: Notifications.NotificationResponse | null): ReminderData | null {
  const data = response?.notification.request.content.data as Partial<ReminderData> | undefined;
  return data?.petId && data?.eventId ? { petId: data.petId, eventId: data.eventId } : null;
}
