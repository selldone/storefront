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

    <s-storefront-primary-header
      v-if="
        !header_mode ||
        header_mode === 'normal' /*Show primary header in top of page!*/
      "
      :shop="shop"
      :search-mode="search_mode"
    ></s-storefront-primary-header>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Search Box ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- This is the main search bar for the shop. -->
    <v-slide-y-reverse-transition leave-absolute>
      <s-storefront-search-box
        v-if="show_search_box && !isMobile"
        ref="search_box"
        class="s--storefront-layout-search-style me-2"
        :class="{
          'is-mobile': isMobile,
          'full-width': search_mode && isMobile,
          'has-banner-offset': shop_main_banner,
        }"
        :title="$t('layout_shop.search_title', { shop_name: shop.title })"
        :shop-name="shop.name"
        @onSearch="onSearch"
        @onClear="onClear"
        color="transparent"
        :dark="false"
        solo
        flat
        :expandInput.sync="search_mode"
        :negative-qr-margin="false"
      />
    </v-slide-y-reverse-transition>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Main ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- It's the main view of the storefront. -->
    <v-main
      :style="{
        'max-width': max_width,
        'margin-top':
          top_margin_content /*The 's-storefront-primary-header' comes with a default height of 128px, and the use of negative margin contributes to creating an overlay effect on the storefront's main view. */,
      }"
      fluid
      fill-height
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
      <router-view
        v-if="shop"
        :style="{ 'padding-bottom': bottom_padding_container }"
        :shop="shop"
        :class="{
          's--shop-card s--shadow-no-padding -hide1720 mb-16 bg-white position-relative':
            is_view_card_mode,
        }"
        @update:menu-transparent="
          (val) => (transparent_header = val) /*Update on custome pages*/
        "
        @update:menu-dark="
          (val) => (dark_header = val) /*Update on custome pages*/
        "
        @update:header-mode="
          (val) => (header_mode = val) /*Update on custome pages*/
        "
      >
        <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Content Header ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
        <!-- This header appears at the top of the content view in the storefront, such as on product listing pages, individual product pages, and other similar sections. -->
        <template v-slot:header="{ center }">
          <s-storefront-primary-header
            v-if="
              header_mode ===
              'overlay' /*Show primary header with overlay effect (used in landing pages)!*/
            "
            overlay
            :overlay-dark="!!dark_header"
            :shop="shop"
            :search-mode="search_mode"
          ></s-storefront-primary-header>

          <!-- The storefront menu customized and set up by the merchant. -->
          <s-storefront-top-menu
            v-if="top_menu && !header_disabled"
            :shop="shop"
            flat
            :tabs="top_menu.menu"
            :transparent="transparent_header"
            :force-dark="dark_header"
            :center="center"
            :fullscreen="is_fullscreen"
            :style="{
              marginTop:
                header_mode === 'hidden'
                  ? '64px'
                  : 0 /*Cover -64px of main view of shop*/,
            }"
          ></s-storefront-top-menu>
        </template>
      </router-view>
    </v-main>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Primary Footer ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <!-- Primary footer of the storefront. -->
    <s-storefront-primary-footer
      v-if="!isMobile && !is_standalone && !isNative && shop && has_footer"
      class="m-0"
      :shop="shop"
      :dark="!is_light_footer"
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
    <s-storefront-chat-popup
      v-if="show_support_chat && has_support"
      :shop="shop"
      :bottom="isMobile ? 96 : 12"
      class="zoomIn"
    ></s-storefront-chat-popup>
  </div>
</template>

<script>
import SStorefrontSearchBox from "@components/storefront/search/SStorefrontSearchBox.vue";
import SStorefrontPrimaryFooter from "@components/storefront/footer/SStorefrontPrimaryFooter.vue";
import { ShopApplicationInterface } from "@core/enums/application/ShopApplicationInterface";
import { ShopEventsName } from "@core/enums/application/ShopEventsName";

import SStorefrontCampaignNotification from "@components/ui/notification/SStorefrontCampaignNotification.vue";
import SStorefrontChatPopup from "@components/storefront/chat/SStorefrontChatPopup.vue";
import SStorefrontTopMenu from "@components/storefront/menu/header/SStorefrontTopMenu.vue";
import SStorefrontPrimaryHeader from "@components/storefront/header/SStorefrontPrimaryHeader.vue";
import SStorefrontProductInBasketIndicator from "@components/storefront/product/in-basket/SStorefrontProductInBasketIndicator.vue";

export default {
  name: "SStorefrontLayout",
  components: {
    SStorefrontProductInBasketIndicator,
    SStorefrontPrimaryHeader,
    SStorefrontTopMenu,
    SStorefrontChatPopup,
    SStorefrontCampaignNotification,
    SStorefrontPrimaryFooter,
    SStorefrontSearchBox,
  },

  props: {
    shop: {
      required: true,
      type: Object,
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  data: () => ({
    /**
     * @property {boolean} show_notification - Controls the visibility of notifications. When true, notifications are shown.
     */
    show_notification: false,

    /**
     * @property {boolean} show_notification_previously - Tracks if notifications were shown previously. Useful for toggle states or animations.
     */
    show_notification_previously: false,

    /**
     * @property {boolean} search_mode - Indicates whether the search mode is active. When true, the component is in search mode.
     */
    search_mode: false,

    /**
     * @property {boolean} elapsed_support_delay - Flag to indicate if a certain delay has passed, typically used for support-related functionalities.
     */
    elapsed_support_delay: false,

    /**
     * @property {string|null} transparent_header - Manages the style of the header when it needs to be transparent. Null when not in use.
     */
    transparent_header: null,

    /**
     * @property {string|null} dark_header - Manages the style of the header when it needs to be dark-themed. Null when not in use.
     */
    dark_header: null,

    /**
     * @property {string|null} header_mode - Defines the current mode of the header. Can be 'null', 'normal', 'overlay', or 'hidden'.
     */
    header_mode: null,
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
      return this.shop ? this.shop.campaign : null;
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
        this.shop && this.$route.matched.some((record) => record.meta.search)
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
      return (
        this.shop &&
        this.shop.support &&
        this.shop.support.popup &&
        this.elapsed_support_delay
      );
    },

    top_menu() {
      return (
        this.$vuetify.breakpoint.mdAndUp &&
        this.shop &&
        this.shop.menus &&
        this.shop.menus.find((it) => it.type === "HEADER")
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
      if (!this.shop) return null;
      return this.shop.theme;
    },

    is_light_footer() {
      return (
        this.$route.matched.some((record) => record.meta.light_footer) ||
        (this.theme && this.theme.light_footer)
      );
    },

    is_fullscreen() {
      return this.$route.matched.some((record) => record.meta.fullscreen);
    },

    shop_main_banner() {
      return this.$store.getters.getShopMainBanner;
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

      ShopApplicationInterface.TriggerEvent(
        ShopEventsName.ChangePage,
        to,
        from
      );

      // transparent top menu: (reset in page change!)

      if (
        this.$route.name !== window.$storefront.routes.PAGE_RENDER &&
        this.$route.name !== "CustomHomePage" &&
        this.$route.name !== window.$storefront?.routes.INCLUDE_PAGE_RENDER
      ) {
        this.transparent_header = null;
        this.dark_header = null; // Default value is null!
        this.header_mode = null;
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
      if (!show_search_box) this.search_mode = false;
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
        params: { shop_name: this.shop.shop_name },
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
          params: { shop_name: this.shop.shop_name },
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
<style scoped lang="scss">
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

    top: 12px;
    left: 50%;
    transform: translateX(-50%);

    padding: 3px 14px;
    background: #fff;
    height: 52px;
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;

    @media only screen and (min-width: 1720px) {
      box-shadow: 0 -12px 8px 0px rgba(0, 0, 0, 0.03);
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

    &.has-banner-offset {
      margin-top: calc(var(--s--top-banner-heigh) + 4px);
    }
  }
}
</style>