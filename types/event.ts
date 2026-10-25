import { Timestamp } from "firebase/firestore";

type RecurrenceUnit = "hours" | "days" | "weeks" | "months" | "years";
export type Recurrence = { amount: number; unit: RecurrenceUnit };

export type Event = {
  id: string;
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
  reminderOffsetMinutes?: number; // 0 | 15 | 60 | 1440 before the occurrence; missing = 0
  createdAt: Date;
  lastCompletedAt?: Date;
  notes?: string;
};

// shape of the document as stored in Firestore (dates as Timestamps)
// stored shape (dates as Timestamps)
export type EventFirestore = Omit<
  Event,
  "id" | "inicialDate" | "nextDate" | "createdAt" | "lastCompletedAt"
> & {
  inicialDate: Timestamp;
  nextDate?: Timestamp;
  createdAt: Timestamp;
  lastCompletedAt?: Timestamp;
};
