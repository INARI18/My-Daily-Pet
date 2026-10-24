import { auth, db } from "@/firebase-config";
import { Pet, PetInput } from "@/types/pet";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ImageSourcePropType } from "react-native";

// add new pet
export const addPet = async (petData: PetInput): Promise<void> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petsCollectionRef = collection(userRef, "pets");

    await addDoc(petsCollectionRef, petData);
  } catch (error) {
    console.error("Erro ao adicionar pet:", error);
    throw error;
  }
};

// get pet by id
export const getPetById = async (petId: string): Promise<Pet | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const petRef = doc(db, "users", user.uid, "pets", petId);
    const petDoc = await getDoc(petRef);

    if (petDoc.exists()) {
      const data = petDoc.data();

      return {
        id: petDoc.id,
        name: data.name || "",
        type: data.type || "dog",
        gender: data.gender || "male",
        birthDate: data.birthDate?.toDate
          ? data.birthDate.toDate()
          : undefined,
        weight: data.weight || 0,
        castrated: data.castrated || false,
        iconUrl: data.iconUrl || undefined,
        userId: data.userId,
      } as Pet;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar pet:", error);
    return null;
  }
};

// update pet; birthDate accepts deleteField() to clear an unknown birthdate
export type PetUpdate = Partial<Omit<PetInput, "birthDate">> & {
  birthDate?: Date | FieldValue;
};

export const updatePet = async (
  petId: string,
  petData: PetUpdate
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  try {
    const petRef = doc(db, "users", user.uid, "pets", petId);
    await updateDoc(petRef, petData);
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    throw error;
  }
};

// list pets
export const getPets = async (): Promise<Pet[]> => {
  const user = auth.currentUser;

  if (!user) {
    console.log("Nenhum usuário autenticado, retornando lista vazia");
    return [];
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petsCollectionRef = collection(userRef, "pets");
    const petsSnapshot = await getDocs(petsCollectionRef);

    return petsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pet[];
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    return [];
  }
};

// delete pet
export const deletePet = async (petId: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  try {
    const userRef = doc(db, "users", user.uid);
    const petDocRef = doc(userRef, "pets", petId);
    // subcollections are not deleted with the parent doc
    const eventsSnapshot = await getDocs(collection(petDocRef, "events"));
    await Promise.all(eventsSnapshot.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(petDocRef);
    console.log("Pet deletado com sucesso:", petId);
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
  }
};

// calculate age from birthDate; null when unknown
export function calculateAge(
  birthDate?: Date | string | number | { toDate?: () => Date } | null
): number | null {
  if (!birthDate) return null;

  const today = new Date();
  const birth =
    typeof (birthDate as any).toDate === "function"
      ? (birthDate as any).toDate()
      : new Date(birthDate as any);

  if (isNaN(birth.getTime())) {
    // invalid date input
    return null;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// get pet icon; without a chosen one, fall back to the first icon of the pet's type
export function getPetIcon(pet: Pet): ImageSourcePropType {
  if (pet.iconUrl) return { uri: pet.iconUrl };
  return pet.type === "cat"
    ? require("@/assets/icons/cats/1.png")
    : require("@/assets/icons/dogs/1.png");
}

export function getPetGenderSymbol(pet: Pet): ImageSourcePropType {
  return pet.gender === "male"
    ? require("@/assets/images/profiles/male_gender.png")
    : require("@/assets/images/profiles/female_gender.png");
}
