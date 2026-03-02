import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ja from "./translations/ja";
import en from "./translations/en";

const LANGUAGE_KEY = "app_language";
export type AppLanguage = "ja" | "en";

export async function getLanguage(): Promise<AppLanguage> {
  const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (saved === "ja" || saved === "en") return saved;
  // Default to device locale
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
  return deviceLocale === "ja" ? "ja" : "en";
}

export async function saveLanguage(lang: AppLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18next.changeLanguage(lang);
}

export async function initI18n(): Promise<void> {
  const lang = await getLanguage();

  await i18next.use(initReactI18next).init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18next;
