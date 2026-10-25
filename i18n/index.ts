import en from "@/locales/en.json";
import pt from "@/locales/pt.json";
import { getLocales } from "expo-localization";
import { I18n, TranslateOptions } from "i18n-js";
import { LocaleConfig } from "react-native-calendars";

export type Language = "en" | "pt";

export const LANGUAGE_STORAGE_KEY = "preferences.language";

export const i18n = new I18n({ en, pt });
i18n.enableFallback = true;
i18n.defaultLocale = "en";

// month and weekday names for react-native-calendars
LocaleConfig.locales.en = LocaleConfig.locales[""];
LocaleConfig.locales.pt = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};

// single place that switches every locale-aware library
export function applyLanguage(lang: Language) {
  i18n.locale = lang;
  LocaleConfig.defaultLocale = lang;
}

// pt for any pt-* device locale, en for everything else
export function deviceLanguage(): Language {
  return getLocales()[0]?.languageCode === "pt" ? "pt" : "en";
}

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "pt";
}

export type Translate = (key: string, options?: TranslateOptions) => string;

// Intl locale for date formatting
export const INTL_LOCALES: Record<Language, string> = { en: "en-US", pt: "pt-BR" };
