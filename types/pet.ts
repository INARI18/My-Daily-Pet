export interface Pet {
  id?: string; // Tornado opcional
  name: string;
  type: "cat" | "dog";
  gender: "male" | "female";
  birthDate: Date;
  weight?: number;
  iconUrl?: string;
  castrated: boolean;
}
