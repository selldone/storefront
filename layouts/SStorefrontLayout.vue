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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="s--storefront-layout">
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Header ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <s-shop-main-header
      v-if="!headerMode || headerMode === 'normal'"
      :shop="shop"
      :searchmode="searchmode"
    ></s-shop-main-header>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Search Box ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <v-slide-y-reverse-transition leave-absolute>
      <shop-search-box
        v-if="showSearchBox && !isMobile"
        ref="search_box"
        class="s--storefront-layout-search-style me-2"
        :class="{
          'is-mobile': isMobile,
          'full-width': searchmode && isMobile,
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
        :expandInput.sync="searchmode"
        :negative-qr-margin="false"
      />
    </v-slide-y-reverse-transition>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Main ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->
    <v-main
      :style="{ 'max-width': max_width, 'margin-top': top_margin_content }"
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
      <router-view
        v-if="shop"
        :style="{ 'padding-bottom': bottom_padding_container }"
        :shop="shop"
        :class="{
          's--shop-card s--shadow-no-padding -hide1720 mb-16 bg-white position-relative':
            card,
        }"
        @update:menu-transparent="
          (val) => (transparentHeader = val) /*Update on custome pages*/
        "
        @update:menu-dark="
          (val) => (darkHeader = val) /*Update on custome pages*/
        "
        @update:header-mode="
          (val) => (headerMode = val) /*Update on custome pages*/
        "
      >
        <template v-slot:header="{ center }">
          <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Header ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

          <s-shop-main-header
            v-if="headerMode === 'overlay'"
            overlay
            :overlay-dark="!!darkHeader"
            :shop="shop"
            :searchmode="searchmode"
          ></s-shop-main-header>

          <s-shop-top-menu
            v-if="top_menu && !header_disabled"
            :shop="shop"
            flat
            :tabs="top_menu.menu"
            :transparent="transparentHeader"
            :force-dark="darkHeader"
            :center="center"
            :fullscreen="is_fullscreen"
            :style="{
              marginTop:
                headerMode === 'hidden'
                  ? '64px'
                  : 0 /*Cover -64px of main view of shop*/,
            }"
          ></s-shop-top-menu>
        </template>
      </router-view>
    </v-main>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Green bottom bar to show this product exist in basket! ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <s-shop-product-in-basket-indicator></s-shop-product-in-basket-indicator>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Footer ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <s-shop-footer
      v-if="!isMobile && !is_standalone && !isNative && shop && has_footer"
      class="m-0"
      :shop="shop"
      :dark="!is_light_footer"
    />

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Notifications ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <custom-notification
      v-if="notification"
      v-model="show_notification"
      :notification="notification"
      :page-name="banner ? banner.page_name : null"
    ></custom-notification>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Customer support ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <shop-contacts-chat-popup
      v-if="show_support_chat && has_support"
      :shop="shop"
      :bottom="isMobile ? 96 : 12"
      class="zoomIn"
    ></shop-contacts-chat-popup>
  </div>
</template>

<script>
import ShopSearchBox from "@components/storefront/search/ShopSearchBox.vue";
import SShopFooter from "@components/storefront/footer/SShopFooter.vue";
import ShopApplicationInterface from "@core/enums/application/ShopApplicationInterface";
import { ShopEventsName } from "@core/enums/application/ShopEventsName";

import CustomNotification from "@components/ui/notification/CustomNotification.vue";
import ShopContactsChatPopup from "@components/storefront/chat/ShopContactsChatPopup.vue";
import SShopTopMenu from "@components/storefront/menu/header/SShopTopMenu.vue";
import SShopMainHeader from "@components/storefront/header/SShopMainHeader.vue";
import SShopProductInBasketIndicator from "@components/storefront/product/in-basket/SShopProductInBasketIndicator.vue";

export default {
  name: "SStorefrontLayout",
  components: {
    SShopProductInBasketIndicator,
    SShopMainHeader,

    SShopTopMenu,
    ShopContactsChatPopup,
    CustomNotification,
    SShopFooter,
    ShopSearchBox,
  },

  props: {
    shop: {
      required: true,
      type: Object,
    },
  },

  data: () => ({
    prevScrollpos: 0,

    show_notification: false,
    show_notification_previously: false,

    searchmode: false,

    //----------------------
    elapsed_support_delay: false,

    // Dynamic header style:
    transparentHeader: null,
    darkHeader: null,
    headerMode: null, // can be: null, normal, overlay, hidden
  }),

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    profile() {
      return this.user && this.user.profile;
    },

    card() {
      // show card shadow on main route view
      return this.$route.matched.some((record) => record.meta.card);
    },

    campaign() {
      return this.shop ? this.shop.campaign : null;
    },
    notification() {
      return this.campaign &&
        this.campaign.notification &&
        !Array.isArray(this.campaign.notification)
        ? this.campaign.notification
        : null;
    },
    banner() {
      return this.campaign ? this.campaign.banner : null;
    },

    showSearchBox() {
      return (
        this.shop && this.$route.matched.some((record) => record.meta.search)
      );
    },

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

    theme() {
      if (!this.shop) return null;
      return this.shop.theme;
    },

    // --------------------------------------------------------------------------------

    has_footer() {
      return this.$route.matched.some((record) => record.meta.footer);
    },

    has_support() {
      return this.$route.matched.some((record) => record.meta.support);
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
    // --------------------------------------------------------------------------------

    shop_main_banner() {
      return this.$store.getters.getShopMainBanner;
    },

    max_width() {
      if (this.is_fullscreen) {
        return "100%";
      } else {
        return "1720px";
      }
    },
  },

  watch: {
    $route(to, from) {
      this.setMainMenuWidth();
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
        this.$route.name !== "PageRender" &&
        this.$route.name !== "CustomHomePage" &&
        this.$route.name !== "IncludePageRender"
      ) {
        this.transparentHeader = null;
        this.darkHeader = null; // Default value is null!
        this.headerMode = null;
      }
    },

    notification(notification) {
      if (this.show_notification_previously) return;
      this.show_notification = notification.enable;
      this.show_notification_previously = this.show_notification;
    },

    // user(user) {},

    showSearchBox(showSearchBox) {
      if (!showSearchBox) this.searchmode = false;
    },
  },

  created() {
    this.setMainMenuWidth();

    this.prevScrollpos = window.pageYOffset;

    setTimeout(() => {
      this.elapsed_support_delay = true;
    }, 10000);
  },

  mounted() {},
  beforeDestroy() {},

  methods: {
    onSearch(event) {
      this.$router.push({
        name: "ShopPage",
        params: { shop_name: this.shop.shop_name },
        query: { search: event.search, search_type: event.search_type },
      });
    },

    onClear() {
      if (this.$route.name === "ShopPage")
        //Only in shop page clear => show all products!
        this.$router.push({
          name: "ShopPage",
          params: { shop_name: this.shop.shop_name },
        });
    },

    setMainMenuWidth() {},

    handleScroll(event) {
      if (!this.showSearchBox || !this.$refs.search_box) return;

      let currentScrollPos = window.pageYOffset;

      if (this.prevScrollpos > currentScrollPos) {
        this.$refs.search_box.$el.classList.remove("go-hide");
        //   console.log('go-hide')
        this.ScrollUp(this.prevScrollpos - currentScrollPos);
      } else {
        this.$refs.search_box.$el.classList.add("go-hide");
        //  console.log('go-hide remove')
        this.ScrollDown(this.prevScrollpos - currentScrollPos);
      }
      this.prevScrollpos = currentScrollPos;
    },

    goToShopInfoPage() {
      if (this.$route.name === "ShopInfoPageMobile")
        this.$router.push({ name: "ShopPage" });
      else this.$router.push({ name: "ShopInfoPageMobile" });
    },

    //―――――――――――――――――――――― Event Bus ――――――――――――――――――――

    ScrollDown(dy) {
      this.EventBus.$emit("user-scroll-down", dy);
    },
    ScrollUp(dy) {
      this.EventBus.$emit("user-scroll-up", dy);
    },
  },
};
</script>

<!-- ━━━━━━━━━━━━━━━━━━━ 🦄 Style ● Global ━━━━━━━━━━━━━━━━━━━-->

<style lang="scss">
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
