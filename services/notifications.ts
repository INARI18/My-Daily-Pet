import { i18n } from "@/i18n";
import { addDays, formatDate, formatTime, isSameDay } from "@/utils/date";
import type * as NotificationsModule from "expo-notifications";
import { Platform } from "react-native";
import { getActiveEventsForAllPets, getOccurrencesByDay } from "./events";
import { getNotificationsEnabled } from "./preferences";

export const REMINDER_OFFSETS = [0, 15, 60, 1440] as const;
export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

const CHANNEL_ID = "reminders";
const DAYS_AHEAD = 30;
const MAX_SCHEDULED = 60; // iOS keeps at most 64 pending

export type ReminderData = { petId: string; eventId: string };
export type PermissionState = "granted" | "denied" | "undetermined" | "unavailable";

// expo-notifications throws at import time when a native module is missing
// (e.g. an Expo Go client older than the package). Load it defensively so the
// app keeps working without reminders instead of crashing.
let Notifications: typeof NotificationsModule | null = null;
if (Platform.OS !== "web") {
  try {
    Notifications = require("expo-notifications");
    Notifications!.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.warn("[reminders] expo-notifications unavailable, reminders disabled:", error);
    Notifications = null;
  }
}

export const remindersAvailable = Notifications !== null;

export async function setupNotifications(): Promise<void> {
  if (!Notifications || Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: i18n.t("notifications.channel"),
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#5C1A5C",
  });
}

export async function getPermissionState(): Promise<PermissionState> {
  if (!Notifications) return "unavailable";
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined";
}

// asks only while the answer is still undetermined
export async function ensurePermission(): Promise<boolean> {
  if (!Notifications) return false;
  const current = await getPermissionState();
  if (current === "granted") return true;
  if (current !== "undetermined") return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

let syncing: Promise<void> | null = null;

// Rebuilds every scheduled reminder from the current events. Safe to call often;
// concurrent calls share one run.
export function syncReminders(): Promise<void> {
  if (!Notifications) return Promise.resolve();
  if (!syncing) {
    syncing = doSync(Notifications).finally(() => {
      syncing = null;
    });
  }
  return syncing;
}

async function doSync(N: typeof NotificationsModule): Promise<void> {
  await N.cancelAllScheduledNotificationsAsync();

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
    await N.scheduleNotificationAsync({
      content: {
        title: `${pet?.name ?? ""} · ${i18n.t(`eventTypes.${occ.event.type}.singular`)}`,
        body: occ.event.notes ? `${when} · ${occ.event.notes}` : when,
        data,
        sound: true,
        ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
      },
      trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: fireAt },
    });
  }
}

function reminderDataFrom(
  response: NotificationsModule.NotificationResponse | null | undefined
): ReminderData | null {
  const data = response?.notification.request.content.data as Partial<ReminderData> | undefined;
  return data?.petId && data?.eventId ? { petId: data.petId, eventId: data.eventId } : null;
}

// Calls `onTap` when the user opens a reminder; returns the unsubscribe function.
export function addReminderTapListener(onTap: (data: ReminderData) => void): () => void {
  if (!Notifications) return () => {};
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = reminderDataFrom(response);
    if (data) onTap(data);
  });
  return () => sub.remove();
}

// Hook: the reminder that launched the app, if any (null elsewhere).
export const useLaunchReminder: () => ReminderData | null = Notifications
  ? () => reminderDataFrom(Notifications!.useLastNotificationResponse())
  : () => null;
