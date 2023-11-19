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

const webpack = require("webpack");
const manifest = require("./manifest.json");

/**
 * Storefront layout version. This unique identifier is used for naming each app version published on Selldone.
 * @type {string}
 */
const VERSION_DIR = manifest.version;

function PAGES() {
  const out = {
    // ▃▃▃▃▃▃▃▃▃▃▃▃ Storefront Web App ▃▃▃▃▃▃▃▃▃▃▃▃

    shop: {
      entry: "storefront.ts",
      template: "public/index.html",
      filename: "shop/shop.html",
    },
  };

  return out;
}

module.exports = {
  lintOnSave: false,

  /* pluginOptions: {
     webpackBundleAnalyzer: {
       openAnalyzer: false
     }
   },*/

  pwa: {
    name: manifest.name,
    themeColor: manifest.themeColor ? manifest.themeColor : "#222222",
    msTileColor: manifest.msTileColor ? manifest.msTileColor : "#222222",
    appleMobileWebAppStatusBarStyle: "black-translucent",

    workboxOptions: {
      exclude: [
        /^.*index\.html$/,
        /\.gif$/,
        /\.m4v$/,
        /\.mp4$/,
        /\.pdf$/,
        /\.zip$/,
        /\.rar$/,
        /\.xlsx$/,
        /\.csv$/,

        /lang-*.*.js/,

        /\.ttf$/,
        /\.woff2$/,
        /\.eot$/,
        /\.woff$/,
      ],
    },
  },

  publicPath: "/layers/",
  outputDir: "dist/", // If start  with /create in the root directory of hard!
  assetsDir: "",
  productionSourceMap: process.env.NODE_ENV !== "production",

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery",
        jQuery: "jquery",
      }),
    ],

    // Can import raw files: ex. import myModule from 'my-module?raw';
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: "asset/source",
        },

        // Add a rule for video files:
        {
          test: /\.(mp4|m4v|webm|ogv|flv|avi|mov|mkv|3gp|wmv)$/,
          type: "asset/resource",
          generator: {
            filename: "videos/[name].[hash:7][ext]",
          },
        },
      ],
    },

    output: {
      filename: (chunkData) => {
        return ["shop"].includes(chunkData.chunk.name)
          ? VERSION_DIR + "/[name].js"
          : VERSION_DIR + "/[name].[fullhash].js";
      },
      chunkFilename: VERSION_DIR + "/[name].[fullhash].js",
    },
    resolve: {
      extensions: [".js", ".vue"],
      alias: {
        "jquery-ui/widget": "blueimp-file-upload/js/vendor/jquery.ui.widget.js",
        "jquery-fileupload":
          "blueimp-file-upload/js/vendor/jquery.fileupload.js",
        "jquery-ui/ui/widget":
          "blueimp-file-upload/js/vendor/jquery.ui.widget.js", //vase versione jadid blueimp-file-upload!!!
      },
    },

    watchOptions: {
      ignored: /node_modules|google-cloud-build|docs|Backend|public/,
    },
  },

  chainWebpack: (config) => {
    if (config.plugins.has("extract-css")) {
      const extractCSSPlugin = config.plugin("extract-css");
      extractCSSPlugin &&
        extractCSSPlugin.tap(() => [
          {
            filename: VERSION_DIR + "/[name].css",
            chunkFilename: VERSION_DIR + "/[name].[fullhash].css",
          },
        ]);
    }

    config.optimization.splitChunks(false);
  },

  pages: PAGES(),
};