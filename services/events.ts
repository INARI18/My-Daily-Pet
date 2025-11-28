import { auth, db } from "@/firebase-config";
import { Event, EventFirestore, Recurrence } from "@/types/event";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

/**
 * Calcula a próxima data baseada em uma data inicial e recorrência
 */
export function calculateNextDate(
  baseDate: Date,
  recurrence: Recurrence
): Date {
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

/**
 * Converte um Event para o formato do Firestore
 */
function eventToFirestore(
  eventData: Omit<Event, "id" | "createdAt">
): Record<string, any> {
  const firestoreData: Record<string, any> = {
    petId: eventData.petId,
    type: eventData.type,
    inicialDate: Timestamp.fromDate(eventData.inicialDate),
    notificationEnabled: eventData.notificationEnabled,
    createdAt: serverTimestamp(),
  };

  if (eventData.recurrence) {
    firestoreData.recurrence = eventData.recurrence;
    firestoreData.nextDate = Timestamp.fromDate(
      calculateNextDate(eventData.inicialDate, eventData.recurrence)
    );
  }

  if (eventData.nextDate) {
    firestoreData.nextDate = Timestamp.fromDate(eventData.nextDate);
  }

  if (eventData.lastCompletedAt) {
    firestoreData.lastCompletedAt = Timestamp.fromDate(
      eventData.lastCompletedAt
    );
  }

  if (eventData.notes) {
    firestoreData.notes = eventData.notes;
  }

  return firestoreData;
}

/**
 * Converte dados do Firestore para Event
 */
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

/**
 * Adiciona um novo evento para um pet
 */
export const addEvent = async (
  petId: string,
  eventData: Omit<Event, "id" | "createdAt">
): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petRef = doc(userRef, "pets", petId);
    const eventsCollectionRef = collection(petRef, "events");

    const firestoreData = eventToFirestore(eventData);
    const docRef = await addDoc(eventsCollectionRef, firestoreData);

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar evento:", error);
    throw error;
  }
};

/**
 * Deleta um evento
 */
export const deleteEvent = async (
  petId: string,
  eventId: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petRef = doc(userRef, "pets", petId);
    const eventRef = doc(petRef, "events", eventId);

    await deleteDoc(eventRef);
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    throw error;
  }
};

/**
 * Atualiza um evento existente
 */
export const updateEvent = async (
  petId: string,
  eventId: string,
  updates: Partial<Omit<Event, "id" | "createdAt">>
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petRef = doc(userRef, "pets", petId);
    const eventRef = doc(petRef, "events", eventId);

    const firestoreUpdates: Record<string, any> = {};

    if (updates.inicialDate) {
      firestoreUpdates.inicialDate = Timestamp.fromDate(updates.inicialDate);
    }
    if (updates.nextDate) {
      firestoreUpdates.nextDate = Timestamp.fromDate(updates.nextDate);
    }
    if (updates.lastCompletedAt) {
      firestoreUpdates.lastCompletedAt = Timestamp.fromDate(
        updates.lastCompletedAt
      );
    }
    if (updates.type !== undefined) {
      firestoreUpdates.type = updates.type;
    }
    if (updates.notificationEnabled !== undefined) {
      firestoreUpdates.notificationEnabled = updates.notificationEnabled;
    }
    if (updates.recurrence !== undefined) {
      firestoreUpdates.recurrence = updates.recurrence;
    }
    if (updates.notes !== undefined) {
      firestoreUpdates.notes = updates.notes;
    }
    if (updates.petId !== undefined) {
      firestoreUpdates.petId = updates.petId;
    }

    await updateDoc(eventRef, firestoreUpdates);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }
};

/**
 * Marca um evento como completo e calcula a próxima data se houver recorrência
 */
export const completeEvent = async (
  petId: string,
  eventId: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petRef = doc(userRef, "pets", petId);
    const eventRef = doc(petRef, "events", eventId);

    const now = new Date();
    const updates: Record<string, any> = {
      lastCompletedAt: Timestamp.fromDate(now),
    };

    // Se houver recorrência, calcular próxima data
    const events = await getAllEventsForPet(petId);
    const event = events.find((e) => e.id === eventId);

    if (event?.recurrence) {
      const nextDate = calculateNextDate(now, event.recurrence);
      updates.nextDate = Timestamp.fromDate(nextDate);
    }

    await updateDoc(eventRef, updates);
  } catch (error) {
    console.error("Erro ao completar evento:", error);
    throw error;
  }
};

/**
 * Busca todos os eventos de um pet
 */
export const getAllEventsForPet = async (petId: string): Promise<Event[]> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petRef = doc(userRef, "pets", petId);
    const eventsCollectionRef = collection(petRef, "events");
    const eventsSnapshot = await getDocs(eventsCollectionRef);

    return eventsSnapshot.docs.map((doc) =>
      firestoreToEvent(doc.id, doc.data() as EventFirestore)
    );
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
};

/**
 * Busca eventos próximos (útil para notificações)
 */
export const getUpcomingEvents = async (
  petId: string,
  hoursAhead: number = 24
): Promise<Event[]> => {
  const allEvents = await getAllEventsForPet(petId);
  const now = new Date();
  const futureLimit = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  return allEvents
    .filter((event) => {
      if (!event.nextDate) return false;
      return event.nextDate >= now && event.nextDate <= futureLimit;
    })
    .sort((a, b) => {
      if (!a.nextDate || !b.nextDate) return 0;
      return a.nextDate.getTime() - b.nextDate.getTime();
    });
};
