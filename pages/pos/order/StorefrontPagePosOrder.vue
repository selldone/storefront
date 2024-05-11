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
  <v-card
    class="s--shop-card s--shadow-no-padding pb-4 mb-16"
    :color="SaminColorDarkDeep"
  >
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Order > Toolbar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <v-toolbar
      :color="SaminColorDarkDeep"
      dark
      extended
      extension-height="64px"
      flat
      style="overflow-x: auto"
    >
      <template v-slot:extension>
        <div style="height: 64px"></div>
      </template>

      <!-- ⦿ Back -->

      <u-button-circle
        :icon="$t('icons.arrow_back')"
        :to="
          buildReturnRoute(
            $route.query.return_id
              ? window.$storefront.routes.USER_RETURN_REQUESTS
              : window.$storefront.routes.HISTORY_ORDERS_POS,
          )
        "
        :tooltip="$t('global.actions.back')"
      />

      <v-spacer></v-spacer>

      <u-loading-ellipsis v-if="busy" css-mode></u-loading-ellipsis>

      <v-spacer></v-spacer>

      <div class="d-flex flex-column align-center px-3">
        {{ $t("global.commons.order_detail") }}
        <div v-if="USER()" class="small mt-1">
          {{ USER().name }}
        </div>
      </div>
      <img
        :src="require('@selldone/core-js/assets/order-types/basket-pos.svg')"
        class="me-5"
        height="28"
        width="28"
      />
    </v-toolbar>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Order > Card ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <v-card class="s--card-window-content" flat style="min-height: 80vh">
      <router-view
        v-if="basket"
        :basket="basket"
        @request:refresh="fetchOrderInfo()"
      />
    </v-card>
  </v-card>
</template>

<script>
import { GtagEcommerce } from "@components/plugins/gtag/GtagEcommerce";
import { BasketStatus } from "@selldone/core-js/enums/basket/status/BasketStatus";
import { RouteMixin } from "@components/mixin/RouteMixin";

export default {
  name: "SStorefrontPOSOrderDetailMasterLayout",
  mixins: [RouteMixin],

  components: {},

  props: {},

  data: function () {
    return {
      basket: null,

      busy: false,
    };
  },

  computed: {},

  watch: {},
  created() {
    this.setPageTitle(`Order POS-` + this.$route.params.basket_id);
    this.fetchOrderInfo();
  },
  mounted() {
    this.EventBus.$on("on-payment-completed", ({ order_type, order_id }) => {
      console.log("on-payment-completed", order_type, order_id);
      if (this.basket && this.basket.id === order_id) this.fetchOrderInfo();
    });
  },
  beforeUnmount() {
    this.EventBus.$off("on-payment-completed");
  },

  methods: {
    fetchOrderInfo() {
      const shop_name = this.shop_name;
      const basket_id = this.$route.params.basket_id;

      this.busy = true;
      axios
        .get(window.XAPI.GET_ORDER_POS_BASKET_INFO(shop_name, basket_id))
        .then(({ data }) => {
          if (!data.error) {
            this.basket = data.basket;

            if (this.basket.status === BasketStatus.Payed.code)
              GtagEcommerce.MeasuringPurchasesBasket(this.basket);
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
  },
};
</script>

<style lang="scss" scoped></style>
