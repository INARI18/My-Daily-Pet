import { auth } from "@/firebase-config";
import { i18n } from "@/i18n";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getAllEventsForPet } from "./events";
import { getPets } from "./pets";

// Builds a JSON backup of every pet and its events and hands it to the share sheet.
export const exportDataAsJson = async (): Promise<void> => {
  const pets = await getPets();
  const data = {
    app: "My Daily Pet",
    version: 1,
    exportedAt: new Date().toISOString(),
    account: auth.currentUser?.email ?? null,
    pets: await Promise.all(
      pets.map(async (pet) => {
        const events = await getAllEventsForPet(pet.id);
        return {
          ...pet,
          // Firestore Timestamps become ISO strings; dates stay dates
          birthDate: toIso(pet.birthDate),
          events: events.map((e) => ({
            ...e,
            inicialDate: toIso(e.inicialDate),
            nextDate: toIso(e.nextDate),
            createdAt: toIso(e.createdAt),
            lastCompletedAt: toIso(e.lastCompletedAt),
          })),
        };
      })
    ),
  };

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error(i18n.t("account.sharingUnavailable"));
  }

  const stamp = data.exportedAt.slice(0, 10);
  const file = new File(Paths.cache, `my-daily-pet-${stamp}.json`);
  file.write(JSON.stringify(data, null, 2));
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: i18n.t("account.exportDialogTitle"),
    UTI: "public.json",
  });
};

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const maybe = value as { toDate?: () => Date };
  return typeof maybe.toDate === "function" ? maybe.toDate().toISOString() : null;
}
