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

import Vue from "vue";
import VueI18n from "vue-i18n";

// @ts-ignore
import en from "./en";

Vue.use(VueI18n);

const messages = {
  en: en,
};

/**
 * Configuration for VueI18n instance.
 */
export const i18n = new VueI18n({
  locale: "en", // default locale
  fallbackLocale: "en", // fallback locale
  messages, // locale message object
  silentTranslationWarn: true, // suppress warning if translation for a key is not found
});

// Attach $t to the window object
window.$t = (key: VueI18n.Path, values?: VueI18n.Values) => i18n.t(key, values);

// List of pre-loaded languages.
const loadedLanguages: string[] = ["en" /*,'fa','de','sv'*/];

/**
 * Load new locale messages asynchronously and set the locale.
 *
 * @param lang - The language code to load and set.
 * @param setI18nLanguage - A function that sets the current language in the app.
 * @returns Promise resolved with the set language code.
 */
export function loadLanguageAsyncShop(
  lang: string,
  setI18nLanguage: (value: string) => void
): Promise<any> {
  // If the requested language is already the current language or If the requested language is already the current language or has been loaded
  if (i18n.locale === lang || loadedLanguages.includes(lang)) {
    setI18nLanguage(lang);
    return Promise.resolve();
  }

  // If the language hasn't been loaded yet, import it
  return import(
    /* webpackChunkName: "locals/shop/lang-[request]" */ `./${lang}`
  ).then((messages) => {
    console.log("✔ language pack loaded successfully.");
    i18n.setLocaleMessage(lang, messages.default);
    loadedLanguages.push(lang);
    return setI18nLanguage(lang);
  });
}
