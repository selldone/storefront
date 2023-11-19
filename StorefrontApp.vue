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
    <!-- ――――――――――――――――――――― Campaign banner ――――――――――――――――――――― -->
    <s-top-banner :shop="shop" />

    <!-- ――――――――――――――――――――― Main router view ――――――――――――――――――――― -->
    <router-view v-if="!is_private || customer_has_access" :shop="shop" />

    <!-- ――――――――――――――――――――― Private / Restricted Shop ――――――――――――――――――――― -->
    <s-shop-private-access-check-view
      v-else
      :shop="shop"
    ></s-shop-private-access-check-view>

    <!-- ――――――――――――――――――――― Social links (Floating) ――――――――――――――――――――― -->
    <s-shop-social-buttons
      v-if="shop"
      :shop="shop"
      class="social-stick"
      vertical
      active-only
    ></s-shop-social-buttons>

    <!-- ――――――――――――――――――――― Payment ――――――――――――――――――――― -->
    <s-shop-master-payment-dialog v-if="shop" :shop="shop" />

    <!-- ――――――――――――――――――――― Products Comparison ――――――――――――――――――――― -->
    <s-products-comparison-button v-if="has_comparison" />

    <!-- ――――――――――――――――――――― Need Login ――――――――――――――――――――― -->
    <s-need-login-dialog />

    <!-- ――――――――――――――――――――― Notifications (Small bottom-Right) ――――――――――――――――――――― -->
    <s-notifications-and-alerts />

    <!-- ――――――――――――――――――――― Application Shop Login ――――――――――――――――――――― -->
    <s-shop-application-login :shop="shop"></s-shop-application-login>

    <!-- ―――――――――――――――――― Select Address ―――――――――――――――――― -->
    <s-map-dialog></s-map-dialog>

    <!-- ――――――――――――――――――――― Cookie Agreement ――――――――――――――――――――― -->
    <cookie-dialog v-if="has_gdpr"></cookie-dialog>

    <!-- ――――――――――――――――――――― PWA Update Snackbar ――――――――――――――――――――― -->
    <s-pwa-update-snackbar
      :style="$vuetify.breakpoint.smAndDown ? 'margin-top:-42px' : ''"
    ></s-pwa-update-snackbar>

    <!-- ――――――――――――――――――――― Bottom navigation bar ――――――――――――――――――――― -->
    <s-shop-bottom-navigation v-if="isMobile"></s-shop-bottom-navigation>

    <!-- ――――――――――――――――――――― Popup ――――――――――――――――――――― -->
    <s-popup
      v-if="popup && show_popup"
      :popup="popup"
      @close="show_popup = false"
    ></s-popup>

    <!-- ―――――――――――――――――― Open fullscreen images ―――――――――――――――――― --->
    <s-fullscreen-view-animator></s-fullscreen-view-animator>

    <!-- ――――――――――――――――――――― Retrieve basket from secure links ――――――――――――――――――――― -->
    <s-retrieve-share-order v-if="shop" :shop="shop"></s-retrieve-share-order>

    <!-- ―――――――――――――――――― Webapp debug view ―――――――――――――――――― --->
    <s-webapp-debug-view></s-webapp-debug-view>
  </v-app>
</template>

<script>
import _ from "lodash-es";
import SShopMasterPaymentDialog from "@components/storefront/payment/SShopMasterPaymentDialog.vue";
import { FirebaseNotificationCategories } from "@core/enums/push-notification/FirebaseNotificationCategories";
import SNeedLoginDialog from "@components/storefront/login/SNeedLoginDialog.vue";
import SNotificationsAndAlerts from "@components/ui/notification/SNotificationsAndAlerts.vue";
import { Language } from "@core/enums/language/Language";
import CookieDialog from "@components/storefront/gdpr/CookieDialog.vue";
import SPwaUpdateSnackbar from "@components/ui/snackbar/SPwaUpdateSnackbar.vue";
import SShopBottomNavigation from "@components/storefront/footer/SShopBottomNavigation.vue";
import SetupService from "@core/server/SetupService";
import SPopup from "@components/storefront/popup/SPopup.vue";
import { FontHelper } from "@core/helper/font/FontHelper";
import SFullscreenViewAnimator from "@components/ui/image/SFullscreenViewAnimator.vue";
import SShopSocialButtons from "@components/storefront/social/SShopSocialButtons.vue";
import STopBanner from "@components/storefront/banner/campaign-top-banner/STopBanner.vue";
import { ShopRestriction } from "@core/enums/shop/ShopRestriction";
import SShopPrivateAccessCheckView from "@components/storefront/access/SShopPrivateAccessCheckView.vue";
import SRetrieveShareOrder from "@components/storefront/order/share-order/SRetrieveShareOrder.vue";
import SProductsComparisonButton from "@components/storefront/comparison/button/SProductsComparisonButton.vue";
import { EventName } from "@core/events/EventBus";
import SShopApplicationLogin from "@components/storefront/login/SShopApplicationLogin.vue";
import SMapDialog from "@components/map/SMapDialog.vue";
import SWebappDebugView from "@components/debug/SWebappDebugView.vue";

export default {
  name: "StorefrontApp",
  components: {
    SWebappDebugView,
    SMapDialog,
    SShopApplicationLogin,
    SProductsComparisonButton,
    SRetrieveShareOrder,
    SShopPrivateAccessCheckView,
    STopBanner,
    SShopSocialButtons,
    SFullscreenViewAnimator,
    SPopup,
    SShopBottomNavigation,
    SPwaUpdateSnackbar,
    CookieDialog,
    SNotificationsAndAlerts,
    SNeedLoginDialog,
    SShopMasterPaymentDialog,
  },
  data: () => ({
    IconFontsLoaded: false,

    show_popup: false,
  }),

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
  watch: {
    $route(_new, _old) {
      this.$nextTick(function () {
        this.$vuetify.goTo(0, {
          duration:
            _old?.name === _new?.name ||
            (_old?.name === "ShopPage" &&
              _new?.name ===
                "ShopCategoryPage") /*First shop page is not category page! but same elements so we do not want to suddenly jump up!*/
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
          .catch(function (error) {
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
