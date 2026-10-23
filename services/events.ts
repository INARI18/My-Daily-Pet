import { auth, db } from "@/firebase-config";
import { Event, EventFirestore, Recurrence } from "@/types/event";
import { Pet } from "@/types/pet";
import { addDays, isSameDay, startOfDay } from "@/utils/date";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getPets } from "./pets";

export type EventInput = Omit<Event, "id" | "createdAt">;

// ---- status rules (see spec, section 5) ----

export function getReferenceDate(event: Event): Date {
  return event.nextDate ?? event.inicialDate;
}

// one-time events are done once completed; recurring ones never are
export function isCompleted(event: Event): boolean {
  return !event.recurrence && !!event.lastCompletedAt;
}

export type EventStatus = "done" | "overdue" | "today" | "week" | "later";

export function getEventStatus(event: Event, now = new Date()): EventStatus {
  if (isCompleted(event)) return "done";
  const ref = getReferenceDate(event);
  if (isSameDay(ref, now)) return "today";
  if (ref < now) return "overdue";
  if (ref <= addDays(startOfDay(now), 7)) return "week";
  return "later";
}

export function calculateNextDate(baseDate: Date, recurrence: Recurrence): Date {
  const nextDate = new Date(baseDate);
  switch (recurrence.unit) {
    case "hours":
      nextDate.setHours(nextDate.getHours() + recurrence.amount);
      break;
    case "days":
      nextDate.setDate(nextDate.getDate() + recurrence.amount);
      break;
    case "weeks":
      nextDate.setDate(nextDate.getDate() + recurrence.amount * 7);
      break;
    case "months":
      nextDate.setMonth(nextDate.getMonth() + recurrence.amount);
      break;
    case "years":
      nextDate.setFullYear(nextDate.getFullYear() + recurrence.amount);
      break;
  }
  return nextDate;
}

// ---- Firestore mapping ----

function eventsRef(petId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return collection(doc(db, "users", user.uid, "pets", petId), "events");
}

function eventToFirestore(eventData: EventInput): Record<string, any> {
  const data: Record<string, any> = {
    petId: eventData.petId,
    type: eventData.type,
    inicialDate: Timestamp.fromDate(eventData.inicialDate),
    notificationEnabled: eventData.notificationEnabled,
    createdAt: serverTimestamp(),
  };
  if (eventData.recurrence) {
    data.recurrence = eventData.recurrence;
    data.nextDate = Timestamp.fromDate(
      calculateNextDate(eventData.inicialDate, eventData.recurrence)
    );
  }
  if (eventData.nextDate) data.nextDate = Timestamp.fromDate(eventData.nextDate);
  if (eventData.lastCompletedAt) {
    data.lastCompletedAt = Timestamp.fromDate(eventData.lastCompletedAt);
  }
  if (eventData.notes) data.notes = eventData.notes;
  return data;
}

function firestoreToEvent(id: string, data: EventFirestore): Event {
  return {
    id,
    petId: data.petId,
    type: data.type,
    inicialDate: data.inicialDate?.toDate(),
    recurrence: data.recurrence,
    nextDate: data.nextDate?.toDate(),
    notificationEnabled: data.notificationEnabled,
    createdAt: data.createdAt?.toDate(),
    lastCompletedAt: data.lastCompletedAt?.toDate(),
    notes: data.notes,
  };
}

// ---- CRUD ----

export const addEvent = async (petId: string, eventData: EventInput): Promise<string> => {
  const docRef = await addDoc(eventsRef(petId), eventToFirestore(eventData));
  return docRef.id;
};

export const getEventById = async (
  petId: string,
  eventId: string
): Promise<Event | null> => {
  const snap = await getDoc(doc(eventsRef(petId), eventId));
  return snap.exists() ? firestoreToEvent(snap.id, snap.data() as EventFirestore) : null;
};

export const getAllEventsForPet = async (petId: string): Promise<Event[]> => {
  try {
    const snapshot = await getDocs(eventsRef(petId));
    return snapshot.docs.map((d) => firestoreToEvent(d.id, d.data() as EventFirestore));
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
};

export const deleteEvent = async (petId: string, eventId: string): Promise<void> => {
  await deleteDoc(doc(eventsRef(petId), eventId));
};

export const updateEvent = async (
  petId: string,
  eventId: string,
  updates: Partial<EventInput>
): Promise<void> => {
  const data: Record<string, any> = {};

  if (updates.inicialDate) data.inicialDate = Timestamp.fromDate(updates.inicialDate);
  if (updates.lastCompletedAt) {
    data.lastCompletedAt = Timestamp.fromDate(updates.lastCompletedAt);
  }
  if (updates.type !== undefined) data.type = updates.type;
  if (updates.notificationEnabled !== undefined) {
    data.notificationEnabled = updates.notificationEnabled;
  }
  // a key explicitly set to undefined means "remove it" (Firestore ignores undefined)
  if ("recurrence" in updates) data.recurrence = updates.recurrence ?? deleteField();
  if ("notes" in updates) data.notes = updates.notes ?? deleteField();
  if ("nextDate" in updates) {
    data.nextDate = updates.nextDate ? Timestamp.fromDate(updates.nextDate) : deleteField();
  } else if (updates.recurrence && updates.inicialDate) {
    // keep nextDate in sync when the schedule changes
    data.nextDate = Timestamp.fromDate(
      calculateNextDate(updates.inicialDate, updates.recurrence)
    );
  }

  await updateDoc(doc(eventsRef(petId), eventId), data);
};

// Marks an event as done. Recurring events advance nextDate, keeping the original
// cadence, until it lands in the future; one-time events become completed.
export const completeEvent = async (event: Event): Promise<void> => {
  const now = new Date();
  const data: Record<string, any> = { lastCompletedAt: Timestamp.fromDate(now) };

  if (event.recurrence) {
    let next = getReferenceDate(event);
    do {
      next = calculateNextDate(next, event.recurrence);
    } while (next <= now);
    data.nextDate = Timestamp.fromDate(next);
  }

  await updateDoc(doc(eventsRef(event.petId), event.id), data);
};

// ---- cross-pet queries (Today tab) ----

export type PetEvent = { pet: Pet; event: Event };

export const getActiveEventsForAllPets = async (): Promise<PetEvent[]> => {
  const pets = await getPets();
  const perPet = await Promise.all(
    pets.map(async (pet) => {
      const events = await getAllEventsForPet(pet.id);
      return events.filter((e) => !isCompleted(e)).map((event) => ({ pet, event }));
    })
  );
  return perPet
    .flat()
    .sort((a, b) => getReferenceDate(a.event).getTime() - getReferenceDate(b.event).getTime());
};
