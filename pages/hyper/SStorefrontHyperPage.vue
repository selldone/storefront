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
  <div class="px-2">
    <v-container class="c-avocado">
      <v-progress-linear
        v-if="busy_fetch || busy"
        indeterminate
        class="loader-to-bar"
        color="#C2185B"
      ></v-progress-linear>

      <img
        src="@components/assets/icons/hyper.svg"
        width="32"
        height="32"
        class="me-1 zoomIn delay_500"
      />
      <img
        class="flipInX delay_300"
        src="@components/assets/selldone-logo/selldone-text-draw.png"
        height="48"
      />

      <!-- ................ Not enabled info ................ -->
      <div
        v-if="!is_enable"
        style="min-height: 65vh"
        class="display-1 font-weight-thin"
      >
        {{ $t("hyper.not_enable") }}
      </div>

      <!-- ................ Back button ................ -->

      <v-btn
        v-if="add_mode"
        @click="add_mode = false"
        class="absolute-top-start slideInDown"
        text
      >
        <v-icon class="ms-1">{{ $t("icons.chevron_back") }}</v-icon>
        {{ $t("global.actions.back") }}
      </v-btn>

      <div v-if="is_enable && !add_mode" style="min-height: 65vh">
        <!-- ................ Orders history ................ -->

        <div class="my-14 fadeIn">
          <s-shop-hyper-customer-orders-list
            :orders="orders"
            class="mx-auto mb-4 my-3"
            style="max-width: 420px"
          ></s-shop-hyper-customer-orders-list>

          <v-pagination
            v-if="pages > 1"
            v-model="page"
            :length="pages"
            @input="fetchOrders()"
            circle
            :total-visible="6"
          ></v-pagination>
        </div>

        <!-- ................ Add button ................ -->

        <v-btn
          v-if="open_hyper && is_enable"
          class="mx-auto zoomIn p-2"
          style="max-width: 420px"
          min-height="72"
          color="success"
          dark
          @click="add_mode = true"
          width="100%"
          height="auto"
          x-large
          depressed
          :loading="busy"
        >
          <div>
            <v-icon class="me-1">shopping_bag</v-icon>
            {{
              open_hyper_items && open_hyper_items.length
                ? $t("hyper.continue_order")
                : $t("hyper.add_new_order")
            }}

            <products-dense-images-circles
              v-if="open_hyper_items && open_hyper_items.length"
              :ids="getProductsIDs(open_hyper)"
              class="d-block"
            ></products-dense-images-circles>
          </div>
        </v-btn>
      </div>

      <!-- ................ Add order (By customer) ................ -->

      <s-storefront-hyper-add-order-form
        v-if="add_mode && open_hyper"
        class="mx-auto my-16 fadeIn"
        style="max-width: 420px"
        :shop="shop"
        :hyper.sync="open_hyper"
        @add="
          (order) => {
            AddOrUpdateItemByID(orders, order, 'id', false);
            add_mode = false;
            getOpenHyper();
          }
        "
      ></s-storefront-hyper-add-order-form>

      <!-- ................ Footer ................ -->

      <div class="-footer">
        Powered by
        <a href="/" target="_blank">
          <img
            src="@components/assets/selldone-logo/logo-mini-dark.svg"
            width="10"
            height="10"
          />
          Selldone</a
        >
        | The Future Commerce Platform
      </div>
    </v-container>
  </div>
</template>

<script>
import { AvocadoOrderStates } from "@core/enums/avocado/AvocadoOrderStates";

import SStorefrontHyperAddOrderForm from "@components/storefront/hyper/SStorefrontHyperAddOrderForm.vue";
import SShopHyperCustomerOrdersList from "@components/storefront/hyper/SShopHyperCustomerOrdersList.vue";
import ProductsDenseImagesCircles from "@components/product/products-dense-images-circles/ProductsDenseImagesCircles.vue";

export default {
  name: "SStorefrontHyperPage",
  components: {
    ProductsDenseImagesCircles,
    SShopHyperCustomerOrdersList,
    SStorefrontHyperAddOrderForm,
  },

  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data: () => ({
    deliveryStates: AvocadoOrderStates,

    open_hyper: null,
    busy: false,

    orders: [],

    add_mode: false,

    total_orders: 0,

    page: 1,
    busy_fetch: false,
  }),

  computed: {
    is_enable() {
      return true;
    },

    pages() {
      return Math.ceil(this.total_orders / 5);
    },
    user() {
      return this.$store.getters.getUser;
    },
    shop_avocado() {
      return this.shop.avocado ? this.shop.avocado : {};
    },

    open_hyper_items() {
      return this.open_hyper && this.open_hyper.items;
    },
  },
  created() {
    if (!this.USER()) this.NeedLogin();
    else this.getOpenHyper();
  },

  watch: {
    user(user) {
      if (user) this.getOpenHyper();
    },
  },

  mounted() {},

  methods: {
    getOpenHyper() {
      // console.log("*******************************************");
      this.busy = true;
      axios
        .get(window.XAPI.GET_CUSTOMER_OPEN_HYPER(this.shop_name), {
          params: { currency: this.GetUserSelectedCurrency().code },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.open_hyper = data.hyper;
            this.orders = data.orders;
            this.total_orders = data.total;
            this.page = 1;

            // Check if in add mode:
            if (this.$route.query.product_id) {
              this.add_mode = true;
            }
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    fetchOrders() {
      //  console.log("***************fetchOrders****************", this.page);
      this.busy_fetch = true;
      axios
        .get(window.XAPI.GET_CUSTOMER_HISTORY_HYPERS(this.shop_name), {
          params: {
            sortDesc: true,
            offset: (this.page - 1) * 5,
            limit: 5,
          },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.orders = data.orders;
            this.total_orders = data.total;
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    getProductsIDs(basket) {
      const out = [];
      basket.items.forEach((item) => {
        if (!out.includes("" + item.product_id)) out.push("" + item.product_id);
      });
      return out;
    },
  },
};
</script>
