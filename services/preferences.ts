import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_KEY = "preferences.notifications";

// global reminders switch (default on)
export const getNotificationsEnabled = async (): Promise<boolean> =>
  (await AsyncStorage.getItem(NOTIFICATIONS_KEY)) !== "off";

export const setNotificationsEnabled = (enabled: boolean): Promise<void> =>
  AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled ? "on" : "off");
