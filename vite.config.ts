/*
 * Copyright (c) 2024. Selldone® Business OS™
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

import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vitePluginRequire from "vite-plugin-require";
import basicSsl from "@vitejs/plugin-basic-ssl";

const manifest = require("./manifest.json");

/**
 * Storefront layout version. This unique identifier is used for naming each app version published on Selldone.
 * @type {string}
 */
const VERSION_DIR = manifest.version;

let IS_PRODUCTION: boolean;
let DEV_HOST: string;
let DEV_PORT: number;
let IS_HTTPS: boolean;

// ▃▃▃▃▃▃▃▃▃▃▃▃ Storefront Web App ▃▃▃▃▃▃▃▃▃▃▃▃
export default ({mode}: any) => {
  const env = loadEnv(mode, process.cwd());

  IS_PRODUCTION = mode === "production";
  DEV_HOST = env.VITE_APP_DEV_SERVER_HOST || "localhost";
  DEV_PORT = env.VITE_APP_DEV_SERVER_PORT
      ? parseInt(env.VITE_APP_DEV_SERVER_PORT)
      : 8080;
  IS_HTTPS =
      !!env.VITE_APP_DEV_SERVER_HTTPS && env.VITE_APP_DEV_SERVER_HTTPS === "TRUE";

  // Calculate base URL
  const baseURL = IS_PRODUCTION
      ? fixPath(
          `${manifest.deploy_server}/${manifest.deploy_path}/${manifest.package}/${manifest.version}`,
      )
      : `${IS_HTTPS ? "https" : "http"}://${DEV_HOST}:${DEV_PORT}/`;

  console.log("Build base URL:", baseURL);

  printDevServerConfig();

  return defineConfig({
    base: baseURL,

    plugins: [
      vue(),
      //@ts-ignore
      vitePluginRequire.default(),
      ...(IS_HTTPS
          ? [
            basicSsl({name: "selldone-test-cert"}), // Enable if you want to use https
          ]
          : []),
    ],
    resolve: {
      alias: {
        // ━━━━━━━━━━━━ Define fix path for modules ━━━━━━━━━━━━
        "@app-page-builder": path.resolve(__dirname, "src/Applications/PageBuilder/",),
        "@app-storefront": path.resolve(__dirname, ""),
        "@app-vendor": path.resolve(__dirname, "src/Applications/Vendor/"),
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      },
    },
    server: {
      // open: `${root}/index.html`,
      origin: `http://${DEV_HOST}:${DEV_PORT}`, // Ensure this matches your Vite server
      // Additional Vite server configuration...
      host: "localhost",
      port: DEV_PORT as number,
      cors: true, // Enable CORS
      fs: {
        strict: false, // Load files from nested packages inside node-modules

        // Allow all folders under the project root
        allow: [
          // Use path.resolve with an empty string to resolve to the project root directory
          path.resolve(""),
        ],
      },
    },

    build: {
      outDir: "dist/",
      rollupOptions: {
        input: {
          shop: "index.html",
        },
        output: {
          // Entry and chunk naming patterns
          entryFileNames: `${VERSION_DIR}/[name].js`,
          chunkFileNames: `${VERSION_DIR}/js/[name].[hash].js`,
          // For assets
          assetFileNames: (assetInfo) => {
            if (assetInfo!.name!.endsWith(".css")) {
              return ["shop.css"].includes(assetInfo.name!)
                  ? `${VERSION_DIR}/[name].[ext]`
                  : `${VERSION_DIR}/css/[name].[hash].[ext]`;
            }
            return `${VERSION_DIR}/assets/[name].[hash].[ext]`;
          },
        },
      },
    },
    assetsInclude: ["**/*.m4v"],
  });
};

function fixPath(str: string) {
  return str.replace(/\/{2,}/g, "/");
}

function printDevServerConfig() {
  console.log("");
  console.log(
      "███████╗███████╗██╗     ██╗     ██████╗  ██████╗ ███╗   ██╗███████╗",
  );
  console.log(
      "██╔════╝██╔════╝██║     ██║     ██╔══██╗██╔═══██╗████╗  ██║██╔════╝",
  );
  console.log(
      "███████╗█████╗  ██║     ██║     ██║  ██║██║   ██║██╔██╗ ██║█████╗  ",
  );
  console.log(
      "╚════██║██╔══╝  ██║     ██║     ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ",
  );
  console.log(
      "███████║███████╗███████╗███████╗██████╔╝╚██████╔╝██║ ╚████║███████╗",
  );
  console.log(
      "╚══════╝╚══════╝╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝",
  );
  console.log("");

  console.log("▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆");
  console.log("⬤ Vue Build Selldone® Business OS™ Storefront Project ⬤ ");
  console.log("The #1 operating system for fast-growing companies.");
  console.log("▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆");
  console.log("");

  const tableRow = (key: string, value: any) =>
      `┃ ${key.padEnd(20)} ┃ ${value.toString().padEnd(20)} ┃`;

  console.log("┏━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┓");
  console.log("┃    Configuration     ┃       Value          ┃");
  console.log("┣━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━┫");

  console.log(tableRow("ENVIRONMENT", process.env.NODE_ENV));

  if (IS_PRODUCTION) {
  } else {
    console.log(tableRow("DEV_HOST", DEV_HOST));
    console.log(tableRow("DEV_PORT", DEV_PORT));
    console.log(tableRow("IS_HTTPS", IS_HTTPS));
  }
  console.log("┗━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━┛");

  console.log("");
}
