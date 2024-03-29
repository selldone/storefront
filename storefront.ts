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

//█████████████████████████████████████████████████████████████
//―――――――――――――――― Imports ――――――――――――――――
//█████████████████████████████████████████████████████████████
import "@core/utils/service-worker/registerServiceWorker"; // Register service worker:
import { createApp } from "vue";
import App from "./StorefrontApp.vue";
import router from "./router/StorefrontRouter";
import store from "./store/StorefrontStore";
import VueCookies from "vue-cookies";
import { i18n } from "./lang/i18n_shop";
import { Language } from "@core/enums/language/Language";
import { ShopApplicationInterface } from "@core/enums/application/ShopApplicationInterface";
import { StorefrontSDK } from "@sdk-storefront/StorefrontSDK";
import StorefrontMixin from "./mixin/StorefrontMixin";
import { CapiCommunity } from "@sdk-community/CapiCommunity"; // Register the service worker.
import { VuetifyInstance } from "@components/plugins/vuetify/vuetify";
//█████████████████████████████████████████████████████████████
//―――――――――――― Selldone® Components ――――――――――――
//█████████████████████████████████████████████████████████████
import { createComponents } from "@components/components";
import { SetupPageBuilder } from "@app-page-builder/page-builder";

const vuetify = VuetifyInstance(i18n);

//█████████████████████████████████████████████████████████████
//―――――――――――――― Global Types ―――――――――――――――
//█████████████████████████████████████████████████████████████

// ━━━ Global Language ━━━
window.$language = Language[i18n.locale] ? Language[i18n.locale] : Language.en;

//━━━  Multi languages support ━━━
window.$i18n_global = i18n.global; // Important! used by styler!
//━━━  Globally keep store ━━━
window.$global_store = store; // Important! used in page builder!
//━━━  Globally keep route ━━━
window.$global_router = router; // Important! used by styler!
//━━━  Globally keep vuetify ━━━
window.$global_vuetify = vuetify; // Important! used by page build dynamic component generator!  USE THIS NOW: vuetify=Vue.prototype.$vuetify

// ━━━ App Interface ━━━
window.AppInterface = new ShopApplicationInterface();
// ━━━ Override language packs ━━━
window.OverrideShopLanguagePacks = {};

//█████████████████████████████████████████████████████████████
//――――――――――――― Initialize Vue App ―――――――――――――
//█████████████████████████████████████████████████████████████
const app = createApp(App);

const components = createComponents({});
app.use(components);

//█████████████████████████████████████████████████████████████
//――――――――――― Selldone® Storefront SDK ―――――――――――
//█████████████████████████████████████████████████████████████

// ━━━ Storefront SDK (xapi) ━━━
StorefrontSDK.Setup(); // Set up the Shop SDK.

// ━━━ Community SDK (capi) ━━━
CapiCommunity.Setup(); // Setup community.

//█████████████████████████████████████████████████████████████
//―――――――――――――――― Cookie ―――――――――――――――――
//█████████████████████████████████████████████████████████████
/**
 * Sets a token in the cookies and the Authorization header. Also fetches user and shop info.
 *
 * @param token - The token to set.
 * @param expire_date - The expiration date for the token cookie.
 */
window.SetToken = function (
  token: string,
  expire_date: Date | null = null,
): void {
  window.$cookies.set(
    "access_token",
    token,
    expire_date ? expire_date.toUTCString() : "",
    window.$storefront.prefix_url,
    null,
    false,
  );
  window.axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  (storefrontVueApp as InstanceType<typeof StorefrontMixin>).UpdateUserInfo();
  (
    storefrontVueApp as InstanceType<typeof StorefrontMixin>
  ).fetchBasketAndShop();
};

//█████████████████████████████████████████████████████████████
//―――――――――――――――――― Vue ―――――――――――――――――
//█████████████████████████████████████████████████████████████

// ━━━ Global Mixin ━━━
app.mixin(StorefrontMixin); // Mixin with global helper methods.
app.use(VueCookies); // Use Vue Cookies.

// ━━━ Native App Interface ━━━
require("@components/plugins/native/NativeAppInterface");

// ━━━ Vue Instance ━━━

app.use(i18n);
app.use(router);
app.use(store);
app.use(vuetify);

// Mount the application
const storefrontVueApp = app.mount("#app");
/*
const storefrontVueApp = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
  vuetify,
}).$mount("#app");*/

//――――――――――――――――――――――――― Page Builder ―――――――――――――――――――――――――
SetupPageBuilder(app, {
  mode: "view",
});
