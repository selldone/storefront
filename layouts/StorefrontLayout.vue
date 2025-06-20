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
  🍉 This view will be shown in the StorefrontApp.vue ▶ <router-view> component.

  Primary Header 
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Primary Header             ┃
  ┃ + Search Box               ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

   Main Content 
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Main                       ┃
  ┃ ┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
  ┃ ┃ router-view              ┃
  ┃ ┃ + Content Header         ┃
  ┃ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┫
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  
  Primary Footer
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Primary Footer             ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  
  Absolute/Fixed widgets
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Basket Indicator           ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Notifications              ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃ Customer Support           ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  -->

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="s--storefront-layout">
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Primary Header ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- This is the primary header at the top of the website, where you can display your site's name, logo, user avatar, and navigation menu. -->

    <s-header-section
      v-if="
        !globalStyle.header_mode ||
        globalStyle.header_mode ===
          'normal' /*Show primary header in top of page!*/
      "
    ></s-header-section>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Search Box ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- This is the main search bar for the shop. -->
    <v-slide-y-reverse-transition leave-absolute>
      <s-storefront-search-box
        v-if="show_search_box && !isMobile && !custom_header_code"
        ref="search_box"
        v-model:expand-input="globalStyle.search_mode"

        :dark="false"
        :negative-qr-margin="false"
        :title="$t('layout_shop.search_title', { shop_name: $shop.title })"
        class="s--storefront-layout-search-style me-2"
        color="transparent"
        flat
        variant="solo"
        persistent-placeholder
        @onClear="onClear"
        @onSearch="onSearch"
        no-qr

      />
    </v-slide-y-reverse-transition>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Main ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- It's the main view of the storefront. -->
    <v-main
      :style="{
        'max-width': max_width,
        '--v-layout-bottom': 0, // Remove Vuetify bottom layout (by v-bottom-navigation)
        //  'margin-top': top_margin_content /*The 's-storefront-primary-header' comes with a default height of 128px, and the use of negative margin contributes to creating an overlay effect on the storefront's main view. */,
      }"
      class="d-block"
      style="
        z-index: 0;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        min-height: 60vh;
        transition: none;
      "
    >
      <!-- The 'router-view' will display the content of children components as defined in the Router. -->
      <router-view v-if="$shop" v-slot="{ Component }">
        <component
          :is="Component"
          :class="{
            's--shop-card s--shadow-no-padding -hide1720 mb-16 bg-white position-relative':
              is_view_card_mode,
          }"
          :shop="$shop"
          :style="{ 'padding-bottom': bottom_padding_container }"
        >
          <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Content Header ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
          <!-- This header appears at the top of the content view in the storefront, such as on product listing pages, individual product pages, and other similar sections. -->
          <template v-slot:header="{ center }">
            <s-header-section
              v-if="
                globalStyle.header_mode ===
                'overlay' /*Show primary header with overlay effect (used in landing pages)!*/
              "
              :overlay-dark="!!globalStyle.dark_header"
              overlay
              border
            ></s-header-section>

            <!-- The storefront menu customized and set up by the merchant. -->
            <s-storefront-top-menu
              v-if="top_menu && !header_disabled"
              :center="center"
              :force-dark="globalStyle.dark_header"
              :fullscreen="is_fullscreen"

              :tabs="top_menu.menu"
              :transparent="globalStyle.transparent_header"
              :color="globalStyle.header_color"
              flat
              :border="in_product_page"
              :class="{
                's--custom-top-menu-transparent':
                  globalStyle.transparent_header ||
                  globalStyle.header_mode === 'overlay',
              }"
            ></s-storefront-top-menu>
          </template>
        </component>
      </router-view>
    </v-main>

    <template v-if="delay_loaded">
      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Primary Footer ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <!-- Primary footer of the storefront. -->
      <s-footer-section
        v-if="!isMobile && !isStandalone && $shop && has_footer"
        :dark="!is_light_footer"
        class="m-0"
      />

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Basket Indicator ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <!-- Display a green stripe at the bottom of product pages to indicate that the product has been added to the basket. -->
      <s-storefront-product-in-basket-indicator></s-storefront-product-in-basket-indicator>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Notifications ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <!-- Show notifications to user. -->
      <s-storefront-campaign-notification
        v-if="notification"
        v-model="show_notification"
        :notification="notification"
        :page-name="banner ? banner.page_name : null"
      ></s-storefront-campaign-notification>

      <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Customer support ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
      <!-- Storefront chat box. -->
      <s-contacts-popup
        v-if="show_support_chat && has_support"
        :bottom="isMobile ? 96 : 12"
        class="zoomIn"
      ></s-contacts-popup>
    </template>
  </div>
</template>

<script lang="ts">
import SStorefrontSearchBox from "@selldone/components-vue/storefront/search/SStorefrontSearchBox.vue";
import SStorefrontTopMenu from "@selldone/components-vue/storefront/menu/header/SStorefrontTopMenu.vue";
import SHeaderSection from "@selldone/components-vue/storefront/header/section/SHeaderSection.vue";
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import { defineAsyncComponent } from "vue";
import { ApplicationExecutorStorefront } from "@selldone/core-js/models/application/executor/storefront/ApplicationExecutorStorefront.ts";
import { delay } from "lodash-es";

export default {
  name: "StorefrontLayout",
  components: {
    SStorefrontProductInBasketIndicator: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/product/in-basket/SStorefrontProductInBasketIndicator.vue"
        ),
    ),
    SContactsPopup: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/contact/popup/SContactsPopup.vue"
        ),
    ),
    SStorefrontCampaignNotification: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/campaign/notification/SStorefrontCampaignNotification.vue"
        ),
    ),
    SFooterSection: defineAsyncComponent(
      () =>
        import(
          "@selldone/components-vue/storefront/footer/section/SFooterSection.vue"
        ),
    ),

    SHeaderSection,
    SStorefrontTopMenu,

    SStorefrontSearchBox,
  },
  mixins: [TemplateMixin],

  inject: ["$shop"],
  props: {},

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  data: () => ({
    delay_loaded: false,

    /**
     * @property {boolean} show_notification - Controls the visibility of notifications. When true, notifications are shown.
     */
    show_notification: false,

    /**
     * @property {boolean} show_notification_previously - Tracks if notifications were shown previously. Useful for toggle states or animations.
     */
    show_notification_previously: false,

    /**
     * @property {boolean} elapsed_support_delay - Flag to indicate if a certain delay has passed, typically used for support-related functionalities.
     */
    elapsed_support_delay: false,
  }),

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Compute Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    profile() {
      return this.user && this.user.profile;
    },

    // ━━━━━━━━━━━━━━━━━━━━ Campaign Banner ━━━━━━━━━━━━━━━━━━━━
    /**
     * Get campaign from shop.
     * @return {*|null}
     */
    campaign() {
      return this.$shop?.campaign;
    },
    /**
     * Get notification from campaign.
     * @return {*|null}
     */
    notification() {
      return this.campaign?.notification &&
        !Array.isArray(this.campaign.notification)
        ? this.campaign.notification
        : null;
    },
    banner() {
      return this.campaign ? this.campaign.banner : null;
    },

    // ━━━━━━━━━━━━━━━━━━━━ Appearance ━━━━━━━━━━━━━━━━━━━━

    /**
     * show card shadow on main route view.
     * @return {boolean}
     */
    is_view_card_mode() {
      return this.$route.matched.some((record) => record.meta.card);
    },

    show_search_box() {
      return (
        this.$shop && this.$route.matched.some((record) => record.meta.search)
      );
    },

    /**
     * The 's-storefront-primary-header' is set to a default height of 128px, and to ensure the main storefront contents are displayed just 64px from the top of the page, we apply a top margin of -64px.
     * @return {string}
     */
    top_margin_content() {
      if (this.$store.getters.getIsNative) {
        return "0";
      } else {
        return "-64px";
      }
    },
    bottom_padding_container() {
      if (this.is_fullscreen) {
        return 0;
      } else {
        return "20vh";
      }
    },

    show_support_chat() {
      return this.$shop?.support?.popup && this.elapsed_support_delay;
    },

    top_menu() {
      return (
        this.$vuetify.display.mdAndUp &&
        this.$shop?.menus?.find((it) => it.type === "HEADER")
      );
    },
    header_disabled() {
      return this.top_menu && this.top_menu.enable === false;
    },

    has_footer() {
      return this.$route.matched.some((record) => record.meta.footer);
    },

    has_support() {
      return this.$route.matched.some((record) => record.meta.support);
    },

    theme() {
      return this.$shop?.theme;
    },

    custom_header_code(){
      return this.theme?.custom_header_code
    },

    is_light_footer() {
      return (
        this.$route.matched.some((record) => record.meta.light_footer) ||
        this.theme?.light_footer !== false // Default theme footer is light!
      );
    },

    is_fullscreen() {
      return this.$route.matched.some((record) => record.meta.fullscreen);
    },

    /**
     * Establish a maximum width for the content displayed in the storefront.
     * @return {string}
     */
    max_width() {
      if (this.is_fullscreen) {
        return "100%";
      } else {
        return "1720px";
      }
    },

    globalStyle() {
      return this.$store.getters.getGlobalStyle;
    },

    in_product_page(){
      return this.$route.name === window.$storefront.routes.PRODUCT_PAGE;
    }
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    $route(to, from) {
      /*
       * 💡 Google Analytic  Page view
       */
      //  if (this.$ga) this.$ga.page(to);

      ApplicationExecutorStorefront.TriggerEvent(
        ApplicationExecutorStorefront.EventsName.ChangePage,
        to,
        from,
      );

      // transparent top menu: (reset in page change!)

      if (
        this.$route.name !== window.$storefront.routes.PAGE_RENDER &&
        this.$route.name !== "CustomHomePage" &&
        this.$route.name !== window.$storefront?.routes.INCLUDE_PAGE_RENDER
      ) {
        this.$store.dispatch("resetGlobalStyle");
      }
    },

    /**
     * Watch notification and show notification to user.
     * @param notification
     */
    notification(notification) {
      if (this.show_notification_previously) return;
      this.show_notification = notification.enable;
      this.show_notification_previously = this.show_notification;
    },
    /**
     * Watch show_search_box and reset the search_mode.
     * @param show_search_box
     */
    show_search_box(show_search_box) {
      if (!show_search_box) {
        this.$store.commit("setGlobalStyle", { search_mode: false });
      }
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  created() {
    setTimeout(() => {
      this.elapsed_support_delay = true;
    }, 10000);
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  mounted() {
    // Delay load after 3 cycles!
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.$nextTick(() => {
          delay(() => {
            this.delay_loaded = true;
          }, 3000);
        });
      });
    });
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Methods
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  methods: {
    /**
     * This is the main search bar for the shop, allowing users to look up products and categories.
     * When a user searches for an item, the onSearch function is triggered, redirecting them to the product listing page to display the search results.
     * @param event
     */
    onSearch(event) {
      this.$router.push({
        name: window.$storefront.routes.SHOP_PAGE,
        params: { shop_name: this.$shop.name },
        query: { search: event.search, search_type: event.search_type },
      });
    },

    /**
     * Clears the search box and displays all products when called.
     * This method is typically invoked when the search box is cleared.
     * It checks if the current route is the shop page and, if so, navigates back to the shop page
     * to show all products for the selected shop.
     */
    onClear() {
      if (this.$route.name === window.$storefront.routes.SHOP_PAGE)
        //Only in shop page clear => show all products!
        this.$router.push({
          name: window.$storefront.routes.SHOP_PAGE,
          params: { shop_name: this.$shop.name },
        });
    },
  },
};
</script>

<!-- ━━━━━━━━━━━━━━━━━━━ 🦄 Style ● Global ━━━━━━━━━━━━━━━━━━━-->

<style lang="scss">
/*
━━━━━━━━━━━━━━━━━━━━ 🎺 Variables ━━━━━━━━━━━━━━━━━━━━
 */

/*
━━━━━━━━━━━━━━━━━━━━ 🪅 Classes ━━━━━━━━━━━━━━━━━━━━
 */

html {
  height: 100vh !important;
  //overflow: scroll!important;
}

body {
  background: #f4f4f4 !important;
  height: unset !important;
  // text-align: start !important;
  text-align: center !important;
}

a {
  text-decoration: none !important;
}

.none_selectable {
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
</style>

<!-- ━━━━━━━━━━━━━━━━━━━ 🦜 Style ● Local ━━━━━━━━━━━━━━━━━━━-->
<style lang="scss" scoped>
/*
━━━━━━━━━━━━━━━━━━━━ 🎺 Variables ━━━━━━━━━━━━━━━━━━━━
 */

/*
━━━━━━━━━━━━━━━━━━━━ 🪅 Classes ━━━━━━━━━━━━━━━━━━━━
 */

.s--storefront-layout {
  .s--storefront-layout-search-style {
    position: absolute;

    transition: all 0.3s;

    z-index: 1;

    top: 10px;
    left: 50%;
    transform: translateX(-50%);

    padding: 0 14px;
    background: #fff;
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 420px;

    @media only screen and (max-width: 1280px) {
      position:relative;
      top:0;
      left: 0;
      transform: none;
    }

    @media only screen and (min-width: 1720px) {
      box-shadow: 0 -6px 8px 0px rgba(0, 0, 0, 0.03);
    }

    //min-width: 320px;

    &.go-hide {
      top: -56px;
    }

    &.is-mobile {
      top: 8px;
      position: relative;
      left: 0;
      transform: unset;
    }

    &.full-width {
      width: 100%;
    }
  }
}

.s--custom-top-menu-transparent {
  position: absolute;
  z-index: 10;
}
</style>
