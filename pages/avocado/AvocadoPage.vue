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
        color="success"
      ></v-progress-linear>

      <img
        src="@/Components/assets/icons/avocado.svg"
        width="32"
        height="32"
        class="me-1 zoomIn delay_500"
      />
      <img
        class="flipInX delay_300"
        src="../../../../Components/assets/selldone-logo/selldone-text-draw.png"
        height="48"
      />

      <!-- ................ Not enabled info ................ -->
      <div v-if="!is_enable" style="min-height: 65vh">
        <v-img
          :src="require('../../../Selldone/pages/avocado/assets/avocado-sleep.png')"
          width="100%"
          max-width="450"
          class="mx-auto"
        >
        </v-img>
        {{ $t("avocado.not_enable") }}
      </div>

      <!-- ................ Back button ................ -->

      <v-btn
        v-if="add_mode"
        @click="add_mode = false"
        class="absolute-top-start slideInDown"
        text
      >
        <v-icon class="me-1">{{ $t("icons.chevron_back") }}</v-icon>
        {{ $t("global.actions.back") }}
      </v-btn>

      <div v-if="is_enable && !add_mode" style="min-height: 65vh">
        <!-- ................ Orders history ................ -->

        <div class="my-14 fadeIn">
          <s-shop-avocado-customer-order-list
            :orders="orders"
            class="mx-auto mb-4 my-3"
            style="max-width: 420px"
          ></s-shop-avocado-customer-order-list>

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

        <div class="widget-buttons">
          <v-btn
            v-if="open_avocado && shop_avocado.enable"
            class="mx-auto zoomIn"
            style="max-width: 420px"
            min-height="72"
            color="success"
            dark
            @click="add_mode = true"
            width="100%"
            tile
            x-large
            depressed
            :loading="busy"
          >
            <v-icon class="me-1">shopping_bag</v-icon>
            {{ $t("avocado.add_new_order") }}
          </v-btn>

          <!-- ................ Login ................ -->

          <v-btn
            v-if="!USER()"
            @click="NeedLogin()"
            x-large
            color="primary"
            dark
          >
            <v-icon class="me-1" small>shopping_bag</v-icon>
            {{ $t("avocado.add_new_order") }}
          </v-btn>
        </div>
      </div>

      <!-- ................ Add order (By customer) ................ -->

      <s-shop-avocado-customer-order-form
        v-if="add_mode && open_avocado"
        class="mx-auto my-16 fadeIn"
        style="max-width: 420px"
        :shop="shop"
        :avocado="open_avocado"
        @add="
          (order) => {
            AddOrUpdateItemByID(orders, order, 'id', false);
            add_mode = false;
            getOpenAvocado();
          }
        "
      ></s-shop-avocado-customer-order-form>

      <!-- ................ Footer ................ -->

      <div class="-footer">
        Powered by
        <a href="/" target="_blank">
          <img
            src="../../../../Components/assets/selldone-logo/logo-mini-dark.svg"
            width="10"
            height="10"
          />
          Selldone</a
        >
        | The Business OS
      </div>
    </v-container>

    <div class="min-height-20vh"></div>
  </div>
</template>

<script>
import { AvocadoOrderStates } from "../../../../../core/enums/avocado/AvocadoOrderStates";

import SShopAvocadoCustomerOrderList from "../../../../Components/storefront/order/avocado/SShopAvocadoCustomerOrderList.vue";
import SShopAvocadoCustomerOrderForm from "../../../../Components/storefront/order/avocado/SShopAvocadoCustomerOrderForm.vue";

export default {
  name: "AvocadoPage",
  components: { SShopAvocadoCustomerOrderForm, SShopAvocadoCustomerOrderList },

  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data: () => ({
    deliveryStates: AvocadoOrderStates,

    open_avocado: null,
    busy: false,

    orders: [],

    add_mode: false,

    total_orders: 0,

    page: 1,
    busy_fetch: false,
  }),

  computed: {
    is_enable() {
      return this.shop_avocado.enable;
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
  },
  created() {
    if (!this.USER()) this.NeedLogin();
    else this.getOpenAvocado();
  },

  watch: {
    user(user) {
      if (user) this.getOpenAvocado();
    },
  },

  mounted() {},

  methods: {
    getOpenAvocado() {
      // console.log("*******************************************");
      this.busy = true;
      axios
        .get(window.XAPI.GET_CUSTOMER_OPEN_AVOCADO(this.shop_name), {
          params: { currency: this.GetUserSelectedCurrency().code },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.open_avocado = data.avocado;
            this.orders = data.orders;
            this.total_orders = data.total;
            this.page = 1;
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
        .get(window.XAPI.GET_CUSTOMER_HISTORY_AVOCADOS(this.shop_name), {
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
  },
};
</script>
