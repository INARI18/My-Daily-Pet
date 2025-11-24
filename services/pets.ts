import { auth, db } from "@/firebase-config";
import { Pet } from "@/types/pet";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ImageSourcePropType } from "react-native";

// add pet
export const addPet = async (petData: Pet): Promise<Pet[]> => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const petsCollectionRef = collection(userRef, "pets");
    const petRef = await addDoc(petsCollectionRef, petData);
    console.log("Pet adicionado com ID:", petRef.id);

    // Recarregar a lista de pets após adicionar
    const petsSnapshot = await getDocs(petsCollectionRef);
    return petsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pet[];
  } catch (error) {
    console.error("Erro ao adicionar pet:", error);
    throw error;
  }
};

// list pets
export const getPets = async (): Promise<Pet[]> => {
  const user = auth.currentUser;

  if (!user) {
    console.log("Nenhum usuário autenticado, retornando lista vazia");
    return []; // Retorna array vazio sem lançar erro
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
    await deleteDoc(petDocRef);
    console.log("Pet deletado com sucesso:", petId);
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
  }
};

// calculate age from birthDate
export function calculateAge(
  birthDate: Date | string | number | { toDate?: () => Date }
): number {
  const today = new Date();
  const birth =
    birthDate && typeof (birthDate as any).toDate === "function"
      ? (birthDate as any).toDate()
      : new Date(birthDate as any);

  if (isNaN(birth.getTime())) {
    // invalid date input
    return 0;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// get pet icon, return default if not set
export function getPetIcon(pet: Pet): ImageSourcePropType {
  // prefer stored icon URL, fallback to a static asset path
  return pet.iconUrl
    ? { uri: pet.iconUrl }
    : require("@/assets/icons/default_icon.png");
}

export function getPetGenderSymbol(pet: Pet): ImageSourcePropType {
  return pet.gender === "male"
    ? require("@/assets/images/profiles/male_gender.png")
    : require("@/assets/images/profiles/female_gender.png");
}
