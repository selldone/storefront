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
  <v-app
    v-if="shop"
    class="s--shop"
    :class="[
      {
        'is-mobile': isMobile,
        'before-load-icon-font': !IconFontsLoaded,
      },
      `lang-${$i18n.locale}`,
    ]"
    @keyup.ctrl="SwitchLanguage"
    :style="[
      {
        /* Global theme variable of the storefront */
        '--theme-dark': SaminColorDark,
        '--theme-light': SaminColorLight,
        '--theme-deep-dark': SaminColorDarkDeep,
        '--theme-info': SaminInfoColor,
        '--theme-btn-color': color_buy_button,

        '--background': page_background_color,
      },
      page_bg,
    ]"
  >
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Campaign banner ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-campaign-banner :shop="shop" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Main router view ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <router-view v-if="!is_private || customer_has_access" :shop="shop" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Private / Restricted Shop ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-private-access-check-view
      v-else
      :shop="shop"
    ></s-storefront-private-access-check-view>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Social links (Floating) ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-social-buttons
      v-if="shop"
      :shop="shop"
      class="social-stick"
      vertical
      active-only
    ></s-storefront-social-buttons>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Payment ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-master-payment-dialog v-if="shop" :shop="shop" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Products Comparison ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-products-comparison-button v-if="has_comparison" />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Need Login ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-need-login-dialog />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Notifications (Small bottom-Right) ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-notifications-and-alerts />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Application Shop Login ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-application-login :shop="shop"></s-storefront-application-login>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Select Address ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-map-dialog></s-map-dialog>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Cookie Agreement ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-cookie-dialog v-if="has_gdpr"></s-storefront-cookie-dialog>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ PWA Update Snackbar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-pwa-update-snackbar
      :style="$vuetify.breakpoint.smAndDown ? 'margin-top:-42px' : ''"
    ></s-pwa-update-snackbar>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Bottom navigation bar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-bottom-navigation v-if="isMobile"></s-storefront-bottom-navigation>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Popup ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-popup
      v-if="popup && show_popup"
      :popup="popup"
      @close="show_popup = false"
    ></s-storefront-popup>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Open fullscreen images ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-fullscreen-view-animator></s-fullscreen-view-animator>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Retrieve basket from secure links ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-retrieve-share-order v-if="shop" :shop="shop"></s-storefront-retrieve-share-order>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Webapp debug view ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <s-storefront-webapp-debug-view></s-storefront-webapp-debug-view>
  </v-app>
</template>

<script>
import _ from "lodash-es";
import SStorefrontMasterPaymentDialog from "@components/storefront/payment/SStorefrontMasterPaymentDialog.vue";
import { FirebaseNotificationCategories } from "@core/enums/push-notification/FirebaseNotificationCategories";
import SStorefrontNeedLoginDialog from "@components/storefront/login/SStorefrontNeedLoginDialog.vue";
import SNotificationsAndAlerts from "@components/ui/notification/SNotificationsAndAlerts.vue";
import { Language } from "@core/enums/language/Language";
import SStorefrontCookieDialog from "@components/storefront/gdpr/SStorefrontCookieDialog.vue";
import SPwaUpdateSnackbar from "@components/ui/snackbar/SPwaUpdateSnackbar.vue";
import SStorefrontBottomNavigation from "@components/storefront/footer/SStorefrontBottomNavigation.vue";
import { SetupService } from "@core/server/SetupService";
import SStorefrontPopup from "@components/storefront/popup/SStorefrontPopup.vue";
import { FontHelper } from "@core/helper/font/FontHelper";
import SFullscreenViewAnimator from "@components/ui/image/SFullscreenViewAnimator.vue";
import SStorefrontSocialButtons from "@components/storefront/social/SStorefrontSocialButtons.vue";
import SStorefrontCampaignBanner from "@components/storefront/campaign/banner/SStorefrontCampaignBanner.vue";
import { ShopRestriction } from "@core/enums/shop/options/ShopRestriction";
import SStorefrontPrivateAccessCheckView from "@components/storefront/access/SStorefrontPrivateAccessCheckView.vue";
import SStorefrontRetrieveShareOrder from "@components/storefront/order/share-order/SStorefrontRetrieveShareOrder.vue";
import SStorefrontProductsComparisonButton from "@components/storefront/comparison/button/SStorefrontProductsComparisonButton.vue";
import { EventName } from "@core/events/EventBus";
import SStorefrontApplicationLogin from "@components/storefront/login/SStorefrontApplicationLogin.vue";
import SMapDialog from "@components/map/map-dialog/SMapDialog.vue";
import SStorefrontWebappDebugView from "@components/debug/SStorefrontWebappDebugView.vue";

export default {
  name: "StorefrontApp",
  components: {
    SStorefrontWebappDebugView,
    SMapDialog,
    SStorefrontApplicationLogin,
    SStorefrontProductsComparisonButton,
    SStorefrontRetrieveShareOrder,
    SStorefrontPrivateAccessCheckView,
    SStorefrontCampaignBanner,
    SStorefrontSocialButtons,
    SFullscreenViewAnimator,
    SStorefrontPopup,
    SStorefrontBottomNavigation,
    SPwaUpdateSnackbar,
    SStorefrontCookieDialog,
    SNotificationsAndAlerts,
    SStorefrontNeedLoginDialog,
    SStorefrontMasterPaymentDialog,
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    IconFontsLoaded: false,

    show_popup: false,
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

    popup() {
      return this.shop && this.shop.popup;
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
        (record) => record.meta.page_background
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

      if (_new.query["no-scroll"]) return; // Do not scroll if no-scroll query exist!

      this.$nextTick(function () {
        this.$vuetify.goTo(0, {
          duration:
            _old?.name === _new?.name ||
            (_old?.name === window.$storefront.routes.SHOP_PAGE &&
              _new?.name ===
                window.$storefront.routes.SHOP_CATEGORY_PAGE) /*First shop page is not category page! but same elements so we do not want to suddenly jump up!*/
              ? 800
              : 0, // Can be 800ms,...
          offset: 0,
          easing: "easeInOutQuad",
        });
      });
    },

    popup(popup) {
      if (!popup) return;

      console.style("<b>🛸 You have a popup </b>");

      setTimeout(() => {
        this.show_popup = true;

        // Auto hide:
        if (popup.hide)
          setTimeout(() => {
            this.show_popup = false;
          }, popup.hide * 1000);
      }, popup.delay * 1000);
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

    this.$vuetify.rtl = this.getCurrentLanguage().dir === "rtl";

    //――――――――――――――――――――――――― Save Entry Channel ―――――――――――――――――――――――――
    const route_channel = this.$route.matched.find(
      (record) => record.meta.channel
    );
    if (route_channel) {
      console.log("⚡ Load sales channel mode:", route_channel.meta.channel);
      this.$store.commit("setChannelEntry", route_channel.meta.channel);
    }

    //█████████████████████████████████████████████████████████████
    //――――――――――――――――――――――――― Event Bus ―――――――――――――――――――――――――
    //█████████████████████████████████████████████████████████████

    this.EventBus.$on(EventName.FIREBASE_RECEIVE_MESSAGE, (payload) => {
      // Show only if user is being in shop:
      if (payload.data.shop && payload.data.shop.name === this.shop_name) {
        if (payload.notification) {
          const category =
            FirebaseNotificationCategories[payload.notification.tag];
          let icon = category ? category.icon : "done";
          let color = category ? category.color : this.SaminColorDark;
          const img = payload.notification ? payload.notification.icon : null;

          this.showNotificationAlert(
            payload.notification.title,
            payload.notification.body,
            icon,
            color,
            img
          );
        }
      }
    });

    this.EventBus.$on(EventName.FIREBASE_GET_TOKEN, (token) => {
      if (!window.axios.defaults.headers.common["Authorization"]) return; // User not authorized! FCM added only for authorized users.

      const fun = _.debounce((token) => {
        // Debounce: Speed up first load!
        window.$storefront.user
          .setFcmToken(token)
          .then(({}) => {})
             .catch( (error) =>{
            console.error(error);
          });
      }, 5000);

      fun(token);
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

  beforeDestroy() {
    this.EventBus.$off(EventName.FIREBASE_RECEIVE_MESSAGE);
    this.EventBus.$off(EventName.FIREBASE_GET_TOKEN);

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
