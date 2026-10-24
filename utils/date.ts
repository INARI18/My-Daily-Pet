import { INTL_LOCALES, Language } from "@/i18n";

export function formatDate(date: Date, lang: Language = "en"): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[lang], {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// e.g. "Friday, October 24" / "sexta-feira, 24 de outubro"
export function formatLongDate(date: Date, lang: Language = "en"): string {
  const text = new Intl.DateTimeFormat(INTL_LOCALES[lang], {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatTime(date: Date, lang: Language = "en"): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[lang], {
    hour: "numeric",
    minute: "2-digit",
    hour12: lang === "en",
  }).format(date);
}

export function toYMD(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}
