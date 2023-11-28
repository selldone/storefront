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

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true, // if your code runs in a browser environment, you should add this
    //  es2022: true, // 👈 add this
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-console": "off", //process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": "off", //process.env.NODE_ENV === "production" ? "error" : "off"
    "vue/valid-v-slot": "off", // To ignore errors on <template v-slot:item.icon="{ item }">
    "vue/no-mutating-props": "off", // The ESLint rule 'vue/no-mutating-props' isn't limited to just nested mutations. It will warn/error whenever any prop is mutated directly, whether it's a nested property or a top-level property. The idea behind this rule is that props should be considered immutable within a component.
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    parser: "@typescript-eslint/parser",
  },
  plugins: [
    "@typescript-eslint", // Uses the typescript-specific linting rules
  ],

  ignorePatterns: ["**/lang-*.js", "**/*.json"],

  // New for jquery:
  globals: {
    $: true,
    jQuery: true,
  },
};
