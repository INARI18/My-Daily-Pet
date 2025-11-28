type RecurrenceUnit = "hours" | "days" | "weeks" | "months" | "years";
export type Recurrence = { amount: number; unit: RecurrenceUnit };

export type Event = {
  petId: string;
  type:
    | "food"
    | "walk"
    | "medication"
    | "playTime"
    | "vaccination"
    | "bath"
    | "other";
  inicialDate: Date;
  recurrence?: Recurrence;
  nextDate?: Date;
  notificationEnabled: boolean;
  createdAt: Date;
  lastCompletedAt?: Date;
  notes?: string;
};
