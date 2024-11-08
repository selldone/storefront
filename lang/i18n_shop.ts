/*
 * Copyright (c) 2023. Selldone® Business OS™
 *
 * Author: M.Pajuhaan
 * Web: https://selldone.com
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
 * From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
 * Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
 * Our journey is not just about reaching a destination, but about creating a masterpiece.
 * Tread carefully, for you're treading on dreams.
 */

import {createI18n} from "vue-i18n";

// @ts-ignore
import en from "./en";

const messages = {
  en: en,
};

/**
 * Configuration for VueI18n instance.
 */
export const i18n = createI18n({
  legacy: false, // Specifies that Vue I18n should run in Composition API mode
  locale: "en", // Default locale
  fallbackLocale: "en", // Locale to use if a translation is not available in the current locale
  messages, // Locale messages
  silentTranslationWarn: true, // Suppress warnings when falling back to either fallbackLocale or root
  returnNull: true, // Configuration to allow null values as valid translations

  missingWarn: false, // Disable missing key warnings
  fallbackWarn: false, // Disable fallback warnings
  warnHtmlMessage: false, // Disable warnings for translations containing HTML (Make sure to sanitize translations)
});

// Extend the window object with a global translation function for convenience
window.$t = i18n.global.t;
window.$tm = i18n.global.tm;

// ---------------- Async Language Loading ----------------

// Preloaded default language(s)
const loadedLanguages = ["en"];

/**
 * Load new locale messages asynchronously and set the locale.
 *
 * @param lang - The language code to load and set.
 * @param setI18nLanguage - A function that sets the current language in the app.
 * @returns Promise resolved with the set language code.
 */
export function loadLanguageAsyncShop(
  lang: string,
  setI18nLanguage: (value: string) => void,
): Promise<any> {
  // If the requested language is already the current language or If the requested language is already the current language or has been loaded
  if (i18n.global.locale.value === lang || loadedLanguages.includes(lang)) {
    setI18nLanguage(lang);
    return Promise.resolve();
  }

  // If the language hasn't been loaded yet, import it
  return loadLanguagePack(lang).then((messages) => {
    console.log("✔ language pack loaded successfully.");
    i18n.global.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
}

const loadLanguagePack = (lang: string) => {
  switch (lang) {
    case "af":
      return import("./af");
    case "am":
      return import("./am");
    case "ar":
      return import("./ar");
    case "az":
      return import("./az");
    case "be":
      return import("./be");
    case "bg":
      return import("./bg");
    case "bn":
      return import("./bn");
    case "bs":
      return import("./bs");
    case "ca":
      return import("./ca");
    case "co":
      return import("./co");
    case "cs":
      return import("./cs");
    case "cy":
      return import("./cy");
    case "da":
      return import("./da");
    case "de":
      return import("./de");
    case "el":
      return import("./el");
    case "en":
      return import("./en");
    case "es":
      return import("./es");
    case "et":
      return import("./et");
    case "eu":
      return import("./eu");
    case "fa":
      return import("./fa");
    case "fi":
      return import("./fi");
    case "fr":
      return import("./fr");
    case "fy":
      return import("./fy");
    case "ga":
      return import("./ga");
    case "gl":
      return import("./gl");
    case "gu":
      return import("./gu");
    case "ha":
      return import("./ha");
    case "he":
      return import("./he");
    case "hi":
      return import("./hi");
    case "hr":
      return import("./hr");
    case "ht":
      return import("./ht");
    case "hu":
      return import("./hu");
    case "hy":
      return import("./hy");
    case "id":
      return import("./id");
    case "ig":
      return import("./ig");
    case "is":
      return import("./is");
    case "it":
      return import("./it");
    case "ja":
      return import("./ja");
    case "jv":
      return import("./jv");
    case "ka":
      return import("./ka");
    case "kk":
      return import("./kk");
    case "km":
      return import("./km");
    case "kn":
      return import("./kn");
    case "ko":
      return import("./ko");
    case "ku":
      return import("./ku");
    case "ky":
      return import("./ky");
    case "lb":
      return import("./lb");
    case "lo":
      return import("./lo");
    case "lt":
      return import("./lt");
    case "lv":
      return import("./lv");
    case "mg":
      return import("./mg");
    case "mi":
      return import("./mi");
    case "mk":
      return import("./mk");
    case "ml":
      return import("./ml");
    case "mn":
      return import("./mn");
    case "mr":
      return import("./mr");
    case "ms":
      return import("./ms");
    case "mt":
      return import("./mt");
    case "my":
      return import("./my");
    case "ne":
      return import("./ne");
    case "nl":
      return import("./nl");
    case "no":
      return import("./no");
    case "ny":
      return import("./ny");
    case "or":
      return import("./or");
    case "pa":
      return import("./pa");
    case "pl":
      return import("./pl");
    case "ps":
      return import("./ps");
    case "pt":
      return import("./pt");
    case "ro":
      return import("./ro");
    case "ru":
      return import("./ru");
    case "rw":
      return import("./rw");
    case "si":
      return import("./si");
    case "sk":
      return import("./sk");
    case "sl":
      return import("./sl");
    case "sn":
      return import("./sn");
    case "so":
      return import("./so");
    case "sq":
      return import("./sq");
    case "sr":
      return import("./sr");
    case "st":
      return import("./st");
    case "su":
      return import("./su");
    case "sv":
      return import("./sv");
    case "sw":
      return import("./sw");
    case "ta":
      return import("./ta");
    case "te":
      return import("./te");
    case "tg":
      return import("./tg");
    case "th":
      return import("./th");
    case "tk":
      return import("./tk");
    case "tr":
      return import("./tr");
    case "tt":
      return import("./tt");
    case "ug":
      return import("./ug");
    case "uk":
      return import("./uk");
    case "ur":
      return import("./ur");
    case "uz":
      return import("./uz");
    case "vi":
      return import("./vi");
    case "xh":
      return import("./xh");
    case "yi":
      return import("./yi");
    case "yo":
      return import("./yo");
    case "zh-tw":
      return import("./zh-tw");
    case "zh":
      return import("./zh");
    case "zu":
      return import("./zu");

    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
};
