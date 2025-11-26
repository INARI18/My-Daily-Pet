import { useLocalSearchParams, useRouter } from "expo-router";

export default function PetPlanner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
}
