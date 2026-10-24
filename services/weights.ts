import { auth, db } from "@/firebase-config";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

export type WeightEntry = { id: string; value: number; date: Date };

function weightsRef(petId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return collection(doc(db, "users", user.uid, "pets", petId), "weights");
}

export const getWeights = async (petId: string): Promise<WeightEntry[]> => {
  const snapshot = await getDocs(query(weightsRef(petId), orderBy("date", "asc")));
  return snapshot.docs.map((d) => ({
    id: d.id,
    value: d.data().value as number,
    date: (d.data().date as Timestamp).toDate(),
  }));
};

// Logs a measurement; the pet's weight follows the most recent entry by date.
export const addWeight = async (petId: string, value: number, date: Date): Promise<void> => {
  await addDoc(weightsRef(petId), { value, date: Timestamp.fromDate(date) });
  await syncPetWeight(petId);
};

export const deleteWeight = async (petId: string, entryId: string): Promise<void> => {
  await deleteDoc(doc(weightsRef(petId), entryId));
  await syncPetWeight(petId);
};

async function syncPetWeight(petId: string) {
  const entries = await getWeights(petId);
  const latest = entries[entries.length - 1];
  if (!latest) return;
  const user = auth.currentUser!;
  await updateDoc(doc(db, "users", user.uid, "pets", petId), { weight: latest.value });
}
