export interface Pet {
  id: string;
  name: string;
  type: "cat" | "dog";
  gender: "male" | "female";
  birthDate: Date;
  weight?: number;
  iconUrl?: string;
  castrated: boolean;
}

// calculate age from birthDate
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// get pet icon, return default if not set
export function getPetIcon(pet: Pet) {
  return pet.iconUrl || require("@/assets/icons/default_icon.png");
}

export function getPetGenderSymbol(pet: Pet) {
  if (pet.gender === "male") {
    return require("@/assets/images/profiles/male_gender.png");
  } else {
    return require("@/assets/images/profiles/female_gender.png");
  }
}
