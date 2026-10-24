import {
  ARTICLES_COUNT,
  CONTENT_CACHE_TTL_MS,
  NEWS_PER_SOURCE,
  NEWS_SOURCES,
} from "@/constants/content";
import { Language } from "@/i18n";
import { PubMedArticle, parseSearch, parseSummary, searchUrl, summaryUrl } from "@/utils/pubmed";
import { RssItem, parseRss } from "@/utils/rss";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type NewsItem = RssItem & { source: string };

type Cached<T> = { at: number; data: T };

async function withCache<T>(key: string, force: boolean, fetcher: () => Promise<T>): Promise<T> {
  const storageKey = `content.${key}`;
  if (!force) {
    const raw = await AsyncStorage.getItem(storageKey);
    if (raw) {
      const cached = JSON.parse(raw) as Cached<T>;
      if (Date.now() - cached.at < CONTENT_CACHE_TTL_MS) return cached.data;
    }
  }
  const data = await fetcher();
  await AsyncStorage.setItem(storageKey, JSON.stringify({ at: Date.now(), data } as Cached<T>));
  return data;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { Accept: "application/rss+xml, application/xml, text/xml, */*" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Newest items across the language's feeds; a failing feed is skipped, all failing throws.
export const fetchNews = async (lang: Language, force = false): Promise<NewsItem[]> =>
  withCache(`news.${lang}`, force, async () => {
    const results = await Promise.allSettled(
      NEWS_SOURCES[lang].map(async (source) => {
        const items = parseRss(await fetchText(source.url));
        return items.slice(0, NEWS_PER_SOURCE).map((i) => ({ ...i, source: source.name }));
      })
    );
    const ok = results.filter((r) => r.status === "fulfilled") as PromiseFulfilledResult<NewsItem[]>[];
    if (ok.length === 0) throw new Error("No feed could be loaded");
    return ok
      .flatMap((r) => r.value)
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  }).then((items) => items.map((i) => ({ ...i, date: i.date ? new Date(i.date) : null })));

export const fetchArticles = async (force = false): Promise<PubMedArticle[]> =>
  withCache("articles", force, async () => {
    const ids = parseSearch(await (await fetch(searchUrl(ARTICLES_COUNT))).json());
    if (ids.length === 0) return [];
    return parseSummary(await (await fetch(summaryUrl(ids))).json());
  });
