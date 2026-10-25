import { Event, Recurrence } from "@/types/event";

export type EventType = Event["type"];
export type RecurrenceUnit = Recurrence["unit"];

export const EVENT_TYPES: EventType[] = [
  "bath",
  "walk",
  "medication",
  "vaccination",
  "food",
  "playTime",
  "other",
];

// planner grid, in display order
export const PLANNER_CATEGORIES: { type: EventType; icon: number }[] = [
  { type: "bath", icon: require("@/assets/images/planner/shower.png") },
  { type: "walk", icon: require("@/assets/images/planner/walk2.png") },
  { type: "medication", icon: require("@/assets/images/planner/medication.png") },
  { type: "vaccination", icon: require("@/assets/images/planner/vaccines.png") },
  { type: "food", icon: require("@/assets/images/planner/food.png") },
  { type: "playTime", icon: require("@/assets/images/planner/play_time.png") },
];

export const PLANNER_ICON: Record<EventType, number> = {
  bath: PLANNER_CATEGORIES[0].icon,
  walk: PLANNER_CATEGORIES[1].icon,
  medication: PLANNER_CATEGORIES[2].icon,
  vaccination: PLANNER_CATEGORIES[3].icon,
  food: PLANNER_CATEGORIES[4].icon,
  playTime: PLANNER_CATEGORIES[5].icon,
  other: PLANNER_CATEGORIES[5].icon,
};

// every illustration in the set; the Today hero rotates through them once a day
export const ALL_ILLUSTRATIONS: number[] = [
  require("@/assets/images/planner/walk.png"),
  require("@/assets/images/planner/play_time.png"),
  require("@/assets/images/planner/food2.png"),
  require("@/assets/images/planner/shower.png"),
  require("@/assets/images/planner/vaccines.png"),
  require("@/assets/images/planner/walk2.png"),
  require("@/assets/images/planner/medication.png"),
  require("@/assets/images/planner/food.png"),
];

// same picture all day, a different one tomorrow
export function illustrationOfTheDay(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return ALL_ILLUSTRATIONS[dayOfYear % ALL_ILLUSTRATIONS.length];
}

export const PETS_ILLUSTRATION = require("@/assets/images/planner/play_time.png");

export const RECURRENCE_UNITS: RecurrenceUnit[] = ["hours", "days", "weeks", "months", "years"];

export function isEventType(value: string | undefined): value is EventType {
  return !!value && (EVENT_TYPES as string[]).includes(value);
}
