import { auth } from "@/firebase-config";
import { deleteUser, sendPasswordResetEmail, signOut } from "firebase/auth";
import { deletePet, getPets } from "./pets";

export const sendPasswordReset = async (): Promise<void> => {
  const email = auth.currentUser?.email;
  if (!email) throw new Error("Usuário não autenticado");
  await sendPasswordResetEmail(auth, email);
};

// Removes every pet (and their events) before deleting the Firebase user.
// Firebase may reject with auth/requires-recent-login; the caller handles it.
export const deleteAccount = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const pets = await getPets();
  await Promise.all(pets.map((pet) => deletePet(pet.id)));
  await deleteUser(user);
};

export const logOut = (): Promise<void> => signOut(auth);
