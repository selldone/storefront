<!--
  - Copyright (c) 2023. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->

<!--
  🍉 This view will be shown in the HTML ▶ BODY ▶ <div id="app">.

  Banner
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Campaign Banner            ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Main Content
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ router-view                ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  Absolute/Fixed widgets
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Private / Restricted Shop  ┃
  ┃ Social links (Floating)    ┃
  ┃ Payment                    ┃
  ┃ Products Comparison        ┃
  ┃ Need Login                 ┃
  ┃ ...                        ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

-->
<template>
  <div id="banners-placeholder"></div>
  <v-app
    v-if="shop"
    :class="[
      {
        'is-mobile': isMobile,
        'before-load-icon-font': !IconFontsLoaded,
        blurred: blur,
      },
    ]"
    :style="[
      {
        /* Global theme variable of the storefront */
        '--theme-dark': ThemeColorDark,
        '--theme-light': ThemeColorLight,
        '--theme-deep-dark': ThemeColorDeepDark,
        '--theme-info': ThemeColorInfo,
        '--theme-btn-color': color_buy_button,

        '--background': page_background_color,
      },
      page_bg,
    ]"
    class="s--shop blur-animate"
    :key="unique_key_shop"
  >
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Campaign banner ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <Teleport to="#banners-placeholder">
      <s-campaign-banner />
    </Teleport>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Main router view ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <router-view v-if="!is_private || customer_has_access" :shop="shop" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Private / Restricted Shop ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-access-private-check v-else></s-access-private-check>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Social links (Floating) ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-social-buttons
      active-only
      class="social-stick"
      vertical
    ></s-storefront-social-buttons>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Payment ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-master-payment-dialog />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Products Comparison ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-comparison-button v-if="has_comparison" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Need Login ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-need-login-dialog />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Notifications (Small bottom-Right) ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <u-notification-side />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Application Shop Login ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-application-login></s-storefront-application-login>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Select Address ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <u-map-dialog></u-map-dialog>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Cookie Agreement ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-cookie-consent v-if="has_gdpr"></s-cookie-consent>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ PWA Update Snackbar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-pwa-version-check
      :style="$vuetify.display.smAndDown ? 'margin-top:-42px' : ''"
    ></s-pwa-version-check>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Bottom navigation bar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-footer-navigation v-if="isMobile"></s-footer-navigation>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Popup ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-popup></s-storefront-popup>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Open fullscreen images ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-fullscreen-view-animator></s-fullscreen-view-animator>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Retrieve basket from secure links ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-retrieve-share-order></s-storefront-retrieve-share-order>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Webapp debug view ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-debugger></s-debugger>
  </v-app>
</template>

<script lang="ts">
import { debounce } from "lodash-es";
import { FirebaseNotificationCategories } from "@selldone/core-js/enums/push-notification/FirebaseNotificationCategories";
import { Language } from "@selldone/core-js/enums/language/Language";
import { SetupService } from "@selldone/core-js/server/SetupService";
import { FontHelper } from "@selldone/core-js/helper/font/FontHelper";
import SFullscreenViewAnimator from "@selldone/components-vue/ui/image/SFullscreenViewAnimator.vue";
import { ShopRestriction } from "@selldone/core-js/enums/shop/options/ShopRestriction";
import SAccessPrivateCheck from "@selldone/components-vue/storefront/access/private/check/SAccessPrivateCheck.vue";
import SStorefrontRetrieveShareOrder from "@selldone/components-vue/storefront/order/share-order/SStorefrontRetrieveShareOrder.vue";
import SComparisonButton from "@selldone/components-vue/storefront/comparison/button/SComparisonButton.vue";
import { EventBus, EventName } from "@selldone/core-js/events/EventBus";
import ScrollHelper from "@selldone/core-js/utils/scroll/ScrollHelper";
import { inArray } from "jquery";
import { StorefrontShopHealthCheck } from "@app-storefront/helpers/StorefrontShopHealthCheck";
import { computed, defineAsyncComponent } from "vue";
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin";
import UNotificationSide from "@selldone/components-vue/ui/notification/side/UNotificationSide.vue";
import SStorefrontNeedLoginDialog from "@selldone/components-vue/storefront/login/SStorefrontNeedLoginDialog.vue";
import SCookieConsent from "@selldone/components-vue/storefront/cookie/consent/SCookieConsent.vue";
import SFooterNavigation from "@selldone/components-vue/storefront/footer/navigarion/SFooterNavigation.vue";
import SStorefrontApplicationLogin from "@selldone/components-vue/storefront/login/SStorefrontApplicationLogin.vue";
import AuthMixin from "@selldone/components-vue/mixin/auth/AuthMixin.ts";

export default {
  name: "StorefrontApp",
  mixins: [TemplateMixin, AuthMixin],
  components: {
    SComparisonButton,
    SStorefrontRetrieveShareOrder,
    SAccessPrivateCheck,
    SFullscreenViewAnimator,
    UNotificationSide,
    SStorefrontNeedLoginDialog,
    SCookieConsent,
    SFooterNavigation,
    SStorefrontApplicationLogin,

    SDebugger: defineAsyncComponent(
      () => import("@selldone/components-vue/storefront/debuger/SDebugger.vue"),
    ),
    UMapDialog: defineAsyncComponent(
      () => import("@selldone/components-vue/ui/map/dialog/UMapDialog.vue"),
    ),

    SCampaignBanner: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/campaign/banner/SCampaignBanner.vue"
        ),
    ),
    SStorefrontSocialButtons: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/social/SStorefrontSocialButtons.vue"
        ),
    ),
    SStorefrontPopup: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/popup/SStorefrontPopup.vue"
        ),
    ),

    SStorefrontMasterPaymentDialog: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/payment/SStorefrontMasterPaymentDialog.vue"
        ),
    ),

    SPwaVersionCheck: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/system/pwa/version-check/SPwaVersionCheck.vue"
        ),
    ),
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Provide
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  provide() {
    return {
      $shop: computed(() => this.shop),
    };
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    IconFontsLoaded: false,

    blur: false,
  }),

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Compute Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    shop() {
      return this.getShop();
    },

    isMobile() {
      return this.$vuetify.display.smAndDown;
    },

    /**
     * We use it to force update entire app.
     * @return {string}
     */
    unique_key_shop() {
      console.log(
        "🔵 Update App Global Status",
        `${this.shop?.id}-${window.$storefront.currency?.code}-${this.language}`,
      );
      return `${this.shop?.id}-${window.$storefront.currency?.code}-${this.language}`;
    },
    language() {
      return this.getCurrentLanguage()?.code;
    },

    theme() {
      return this.shop?.theme;
    },
    color_buy_button() {
      return this.theme?.color_buy ? this.theme.color_buy : "#0061e0";
    },

    is_private() {
      return (
        this.shop && this.shop.restriction === ShopRestriction.PRIVATE.code
      );
    },
    user() {
      return this.USER();
    },
    customer_has_access() {
      return this.user && this.user.access;
    },

    has_gdpr() {
      return (
        SetupService.GetGDPREnable() &&
        this.shop &&
        this.shop.options &&
        this.shop.options.some((e) => e.code === "gdpr" && e.value === true)
      );
    },

    // --------------------------------------------------------------------------------

    has_comparison() {
      return this.$route.matched.some((record) => record.meta.comparison);
    },

    // --------------------------------------------------------------------------------

    page_background_color() {
      const custom_bg_meta = [...this.$route.matched]
        .reverse()
        .find((record) => record.meta.bg_color);
      if (custom_bg_meta) return custom_bg_meta.meta.bg_color;
      return "#fff";
    },

    page_bg() {
      const meta_bg = this.$route.matched.find(
        (record) => record.meta.page_background,
      );
      // console.log("page_background", meta_bg);
      if (meta_bg) {
        return meta_bg.meta.page_background;
      }
      return "";
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    $route(_new, _old) {
      this.blur = false; // Reset blur!

      // Do not scroll if only query parameters have changed
      if (_old.path === _new.path) return;

      if (_new.query["no-scroll"]) return; // Do not scroll if no-scroll query exist!

      this.$nextTick(function () {
        /*First shop page is not category page! but same elements so we do not want to suddenly jump up!*/
        const smooth =
          _old?.name === _new?.name ||
          (inArray(
            [
              window.$storefront.routes.SHOP_PAGE,
              window.$storefront.routes.SHOP_CATEGORY_PAGE,
            ],
            _old?.name,
          ) &&
            inArray(
              [
                window.$storefront.routes.SHOP_PAGE,
                window.$storefront.routes.SHOP_CATEGORY_PAGE,
              ],
              _new?.name,
            ));

        //console.log("🔵 Scroll to top", smooth ? "smooth" : "instant", _old?.name, _new?.name,);

        ScrollHelper.scrollToTop(0, smooth ? "smooth" : "instant");
      });
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  beforeCreate() {
    /**
     * Creates and dispatches an event called "selldone-app-loaded".
     * External systems or scripts can listen for this event to know when the
     * Selldone app has been loaded and take necessary actions, like hiding a
     * loading view.
     *
     * Example Usage:
     *
     * ```javascript
     * document.addEventListener("selldone-app-loaded", function (event) {
     *     document.getElementById('first_loading_view').style.display = "none";
     * });
     * ```
     */
    const event = new Event("selldone-app-loaded");
    document.dispatchEvent(event); // Dispatch the event.
  },

  created() {
    // Set initial language by meta tags: (Better user experience)
    if (
      SetupService.GetInitialLanguage() /*Serverside set initial language*/ &&
      !window.$storefront.database.language.getLanguage() /*User not set any language locally*/
    )
      this.setCurrentLanguage(SetupService.GetInitialLanguage());

    //this.$vuetify.locale.isRtl = this.getCurrentLanguage().dir === "rtl";

    /**
     * Auto RTL/LTR set by linked i18n to vuetify instance. {@see VuetifyInstance}
     */

    //――――――――――――――――――――――――― Save Entry Channel ―――――――――――――――――――――――――
    const route_channel = this.$route.matched.find(
      (record) => record.meta.channel,
    );
    if (route_channel) {
      console.log("⚡ Load sales channel mode:", route_channel.meta.channel);
      this.$store.commit("setChannelEntry", route_channel.meta.channel);
    }

    //█████████████████████████████████████████████████████████████
    //――――――――――――――――――――――――― Event Bus ―――――――――――――――――――――――――
    //█████████████████████████████████████████████████████████████

    EventBus.$on(EventName.FIREBASE_RECEIVE_MESSAGE, (payload) => {
      // Show only if user is being in shop:
      if (payload.data.shop && payload.data.shop.name === this.shop.name) {
        if (payload.notification) {
          const category =
            FirebaseNotificationCategories[payload.notification.tag];
          let icon = category ? category.icon : "done";
          let color = category ? category.color : this.TemplateColorDark;
          const img = payload.notification ? payload.notification.icon : null;

          this.showNotificationAlert(
            payload.notification.title,
            payload.notification.body,
            icon,
            color,
            img,
          );
        }
      }
    });

    EventBus.$on(EventName.FIREBASE_GET_TOKEN, (token) => {
      if (!window.axios.defaults.headers.common["Authorization"]) return; // User not authorized! FCM added only for authorized users.

      const fun = debounce((token) => {
        // Debounce: Speed up first load!
        window.$storefront.user
          .setFcmToken(token)
          .then(({}) => {})
          .catch((error) => {
            console.error(error);
          });
      }, 5000);

      fun(token);
    });

    //▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆  Blur App ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆

    EventBus.$on(EventName.BLUR_APP, (blur) => {
      // console.log("🔵 BLUR_APP", blur);
      this.blur = blur;
    });

    //█████████████████████████████████████████████████████████████
    //―――――――――――――――――――――――― Get User Info ――――――――――――――――――――――――
    //█████████████████████████████████████████████████████████████

    this.UpdateUserInfo();

    //――――――――――――――――――――――  Font loader listener ――――――――――――――――――――
    FontHelper.ListenOnFontIconsLoaded(() => {
      this.IconFontsLoaded = true;
    });

    // Load shop info fast:
    if (window.shop) {
      // 🧿 Auto fix Shop:
      StorefrontShopHealthCheck.Check(this.$router, window.shop);

      this.$store.commit("setShop", window.shop);
      // 🞧 Header: Language (Important to load content - product article - in selected language) ASAP!
      const local_save_lang =
        window.$storefront.database.language.getLanguage();

      window.axios.defaults.headers.common["X-Localization"] = local_save_lang
        ? local_save_lang.code /*user selected language*/
        : this.shop.language /*shop default language*/;
    }

    this.fetchBasketAndShop();
  },
  mounted() {
    //――――――――――――――――――――――  Server Message ――――――――――――――――――――
    if (window.server_message) this.showMessage(null, window.server_message);

    //――――――――――――――――――――――  Global key listener ――――――――――――――――――――

    document.addEventListener("keyup", (e) => {
      // Register your global hot keys for the shop here:
      if (e.ctrlKey && e.key === "q") this.SwitchLanguage(e);
    });

    // ――――――――――――――――――――― Auto update rates every 5 minutes if some exchange rates are auto mode ―――――――――――――――――――――
    // Update shop exchange rates by interval if auto mode in rates exist:
    this.update_exchange_rates_interval = setInterval(() => {
      this.UpdateExchangeRates();
    }, 5 * 60000); // every 5 minutes
  },

  beforeUnmount() {
    EventBus.$off(EventName.FIREBASE_RECEIVE_MESSAGE);
    EventBus.$off(EventName.FIREBASE_GET_TOKEN);
    EventBus.$off(EventName.BLUR_APP);

    if (this.update_exchange_rates_interval)
      clearInterval(this.update_exchange_rates_interval);
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Methods
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  methods: {
    /**
     * Just for testing RTL/LTR!
     * Hot key to change language instantly!
     * @constructor
     */
    SwitchLanguage() {
      let new_lang =
        this.getCurrentLanguage() === Language.en ? Language.fa : Language.en;
      this.setCurrentLanguage(new_lang.code);
      console.log("🌐 SwitchLanguage", new_lang.code);
    },
  },
};
</script>

<!-- ━━━━━━━━━━━━━━━━━━━ 🦄 Style ● Global ━━━━━━━━━━━━━━━━━━━-->
<style lang="scss" src="./style/storefront.scss"></style>

<style lang="scss">
/*
━━━━━━━━━━━━━━━━━━━━ 🎺 Variables ━━━━━━━━━━━━━━━━━━━━
 */
.s--shop {
  --background: #fff;

  --products-filter-width: 300px;
}

/*
━━━━━━━━━━━━━━━━━━━━ 🪅 Classes ━━━━━━━━━━━━━━━━━━━━
 */

.s--shop {
  background: var(--background) !important;
  font-weight: 400;
  overflow: hidden;
}
</style>
