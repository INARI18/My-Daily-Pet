import { Event, Recurrence } from "@/types/event";

export type EventType = Event["type"];
export type RecurrenceUnit = Recurrence["unit"];

export const EVENT_TYPE_LABELS: Record<EventType, { plural: string; singular: string }> = {
  bath: { plural: "Baths", singular: "Bath" },
  walk: { plural: "Walks", singular: "Walk" },
  medication: { plural: "Medication", singular: "Medication" },
  vaccination: { plural: "Vaccines", singular: "Vaccine" },
  food: { plural: "Food", singular: "Meal" },
  playTime: { plural: "Play time", singular: "Play time" },
  other: { plural: "Other", singular: "Event" },
};

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

// hero illustrations for the Today tab, by time of day
export const TODAY_ILLUSTRATIONS = {
  morning: require("@/assets/images/planner/walk.png"),
  afternoon: require("@/assets/images/planner/play_time.png"),
  evening: require("@/assets/images/planner/food2.png"),
} as const;

export const PETS_ILLUSTRATION = require("@/assets/images/planner/play_time.png");

export const RECURRENCE_UNITS: { label: string; value: RecurrenceUnit }[] = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
];

export function isEventType(value: string | undefined): value is EventType {
  return !!value && value in EVENT_TYPE_LABELS;
}
