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
  <div>
    <v-card
      class="s--shop-card s--shadow-no-padding -hide1720 pb-16"
      :flat="isMobile"
    >
      <!-- ━━━━━━━ Top Shop Menu ━━━━━━━ -->

      <div
        style="transition: all 400ms ease;"
        :class="{
          'add-marginal-side-menu-open':
            show_filter_menu && $vuetify.breakpoint.smAndUp,
        }"
      >
        <slot name="header"></slot>
      </div>

      <!-- ━━━━━━━ Show Vendor Info ━━━━━━━ -->
      <s-shop-vendor-header
        :shop="shop"
        :vendor-id="vendor_id"
      ></s-shop-vendor-header>

      <!-- ━━━━━━━ Products Listing ━━━━━━━ -->

      <s-shop-products-listing
        :shop="getShop()"
        has-sort
        has-filter
        has-breadcrumb
        route-mode
        update-route
        @update:title="setPageTitle"
        load-more
        :vendor-id="vendor_id"
      ></s-shop-products-listing>
    </v-card>
  </div>
</template>

<script>
import SShopProductsListing from "@components/storefront/products-listing/SShopProductsListing.vue";
import SShopVendorHeader from "@components/storefront/vendor/SShopVendorHeader.vue";

export default {
  name: "ShopPage",
  components: {
    SShopVendorHeader,
    SShopProductsListing,
  },
  data: () => ({
    vendor_id: null /*Show only for this vendor! */,
  }),

  computed: {
    shop() {
      return this.getShop();
    },
    show_filter_menu() {
      return this.$store.getters.getShowFilterMenu;
    },
  },
  watch: {},
  created() {
    /*First load keep vendor ID to show products for this vendor.*/
    this.vendor_id = this.$route.params?.vendor_id
      ? this.$route.params?.vendor_id
      : this.$route.query?.vendor_id;

    this.setPageTitle(); // Set Page Title!
  },
  methods: {},
};
</script>

<style scoped lang="scss">
/*
━━━━━━━━━━━━━━━━━━━━ 🎺 Variables ━━━━━━━━━━━━━━━━━━━━
 */

/*
━━━━━━━━━━━━━━━━━━━━ 🪅 Classes ━━━━━━━━━━━━━━━━━━━━
 */
</style>
