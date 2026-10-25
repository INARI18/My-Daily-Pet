import { Language } from "@/i18n";

export type NewsSource = { name: string; url: string };

// RSS feeds by app language; all verified to answer with RSS 2.0
export const NEWS_SOURCES: Record<Language, NewsSource[]> = {
  en: [
    { name: "Veterinary Practice News", url: "https://www.veterinarypracticenews.com/feed/" },
    { name: "dvm360", url: "https://www.dvm360.com/rss" },
  ],
  pt: [
    { name: "Portal Cães & Gatos", url: "https://caesegatos.com.br/feed/" },
    { name: "Revista PetCenter", url: "https://revistapetcenter.com.br/feed/" },
  ],
};

export const CONTENT_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const NEWS_PER_SOURCE = 15;
export const ARTICLES_COUNT = 20;
