export type PetInput = {
  name: string;
  type: "dog" | "cat";
  gender: "male" | "female";
  birthDate?: Date; // optional: rescued pets may not have a known birthdate
  weight: number;
  castrated: boolean;
  iconUrl?: string;
  userId?: string;
};

// extends PetInput with an id field from Firestore document ID
export type Pet = PetInput & {
  id: string;
};
