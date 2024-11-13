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
  <v-container fluid>
    <div class="widget-box -x-large min-height-60vh">
      <u-widget-header :title="$t('user_favorites.title')" icon="favorite">
      </u-widget-header>
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ User favorites  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <u-loading-progress v-if="busy_fetch"></u-loading-progress>

      <v-data-iterator
        v-model:options="options"
        v-model:page="page"
        :items="products"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :search="search"
        :sort-by="sortBy"
        class="bg-transparent"
        density="compact"
        hide-default-footer
        no-data-text=""
      >
        <template v-slot:no-results></template>

        <template v-slot:header>
          <s-data-iterator-toolbar
            v-model:items-per-page="itemsPerPage"
            v-model:search="search"
            v-model:sort-key="sortBy[0].key"
            v-model:sort-order="sortBy[0].order"
            :sort-keys="keys"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default>
          <v-row class="m-2" no-gutters>
            <v-col
              v-for="product in products"
              :key="product.id"
              class="p-2"
              cols="12"
              lg="3"
              md="4"
              sm="6"
            >
              <s-shop-product-card
                :product="product"
                :quick-buy="false"
                :to="{
                  name: window.$storefront.routes.PRODUCT_PAGE,
                  params: {
                    shop_name: $shop.name,
                    product_id: product.id,
                  },
                }"
                rounded
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:bottom>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" :length="pageCount" rounded />
          </div>
        </template>
      </v-data-iterator>
    </div>
  </v-container>
</template>

<script lang="ts">
import SShopProductCard from "@selldone/components-vue/storefront/product/card/SShopProductCard.vue";
import SDataIteratorToolbar from "@selldone/components-vue/ui/toolbar/SDataIteratorToolbar.vue";
import { throttle } from "lodash-es";

export default {
  name: "StorefrontPageUserWishlist",
  components: { SDataIteratorToolbar, SShopProductCard },
  inject: ["$shop"],
  data: () => ({
    products: [],

    busy_add: false,

    search: "",
    filter: {},
    sortBy: [{ key: null, order: "desc" }],

    busy_fetch: false,
    // Pagination:
    page: 1,
    itemsPerPage: 8,
    totalItems: 0,
    options: {},
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },

    keys() {
      return [
        { label: this.$t("global.sort.product_type"), value: "type" },
        { label: this.$t("global.sort.title"), value: "title" },
        { label: this.$t("global.sort.discount"), value: "discount" },
        { label: this.$t("global.sort.rate"), value: "rate" },
        { label: this.$t("global.sort.rate_count"), value: "rate_count" },
        { label: this.$t("global.sort.category"), value: "category_id" },
      ];
    },
  },

  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, sortDesc, page } = this.options;
        this.fetchData(page, sortBy[0]?.key, sortBy[0]?.order === "desc");
      },
      deep: true,
    },

    search: throttle(function () {
      //   console.log("search", newVal);
      const { sortBy, sortDesc } = this.options;
      this.fetchData(1, sortBy[0]?.key, sortBy[0]?.order === "desc");
    }, window.SERACH_THROTTLE),
  },

  created() {
    this.setPageTitle("My favorites"); // Set Page Title!
  },

  methods: {
    fetchData(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;

      const handleSuccessResponse = ({ products, total }) => {
        this.products = products;

        this.totalItems = total;
      };

      window.$storefront.products
        .optimize(60)
        .list("*", (page - 1) * this.itemsPerPage, this.itemsPerPage, {
          sortBy: sortBy,
          sortDesc: sortDesc,
          search: this.search,

          dir: "*",
          only_in_wishlist: true, /// OLD: only_stared
          products_only: true,

          with_total: true,
        })
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)

        .catch((error) => {
          NotificationService.showLaravelError(error);
        })

        .then(() => {
          this.busy_fetch = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
