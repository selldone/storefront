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
    <div class="widget-box -x-large min-height-50vh">
      <s-widget-header :title="$t('user_favorites.title')" icon="favorite">
      </s-widget-header>
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ User favorites  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-progress-loading v-if="busy_fetch"></s-progress-loading>

      <v-data-iterator
        :items="products"
        :search="search"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        hide-default-footer
        :server-items-length="totalItems"
        :options.sync="options"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        class="bg-transparent dense-padding"
        no-data-text=""
      >
        <template v-slot:no-results></template>

        <template v-slot:header>
          <s-data-iterator-toolbar
            :sort-keys="keys"
            :search.sync="search"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items-per-page.sync="itemsPerPage"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default>
          <v-row no-gutters class="m-2">
            <v-col
              v-for="product in products"
              :key="product.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="p-2"
            >
              <s-shop-product-card
                :product="product"
                :to="{
                  name: window.$storefront.routes.PRODUCT_PAGE,
                  params: {
                    shop_name: shop_name,
                    product_id: product.id,
                  },
                }"
                :quick-buy="false"
                rounded
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" circle :length="pageCount" />
          </div>
        </template>
      </v-data-iterator>
    </div>
  </v-container>
</template>

<script>
import SShopProductCard from "@components/product/card/SShopProductCard.vue";
import SDataIteratorToolbar from "@components/ui/toolbar/SDataIteratorToolbar.vue";
import _ from "lodash-es";
export default {
  name: "SStorefrontUserFavoritesPage",
  components: { SDataIteratorToolbar, SShopProductCard },
  data: () => ({
    products: [],

    busy_add: false,

    search: "",
    filter: {},
    sortDesc: true,
    sortBy: null,

    busy_fetch: false,
    // Pagination:
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
    totalItems: 0,
    options: { sortDesc: [true] },
  }),
  computed: {
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
        this.fetchData(page, sortBy ? sortBy[0] : null, sortDesc[0]);
      },
      deep: true,
    },

    search: _.throttle(function () {
      //   console.log("search", newVal);
      const { sortBy, sortDesc } = this.options;
      this.fetchData(1, sortBy ? sortBy[0] : null, sortDesc[0]);
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
        this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage); //set by event not work!!!
      };

      window.$storefront.products
        .optimize(60)
        .fetchProducts("*", (page - 1) * this.itemsPerPage, this.itemsPerPage, {
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
          this.showLaravelError(error);
        })

        .then(() => {
          this.busy_fetch = false;
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
