import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/lang-*.js", "**/*.json"],
}, ...compat.extends("plugin:vue/vue3-essential", "@vue/prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            $: true,
            jQuery: true,
        },

        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            parser: "@typescript-eslint/parser",
        },
    },

    rules: {
        "no-console": "off",
        "no-debugger": "off",
        "vue/valid-v-slot": "off",
        "vue/no-mutating-props": "off",
        "vue/no-v-text-v-html-on-component": "off",
    },
}];