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
  <v-card class="s--shop-card s--shadow-with-padding">
    <v-toolbar
      :color="SaminColorDarkDeep"
      dark
      extended
      flat
      extension-height="64px"
      style="overflow-x: auto"
    >
      <!-- ⦿ Back -->

      <s-circle-button
        :icon="$t('icons.arrow_back')"
        :tooltip="$t('global.actions.back')"
        :to="
          $route.query.return_id
            ? {
                name: window.$storefront.routes.USER_RETURN_REQUESTS,
                params: { STATE: RETURN },
              }
            : {
                name: window.$storefront.routes.HISTORY_ORDERS_POS,
                params: { STATE: RETURN },
              }
        "
      />

      <v-spacer></v-spacer>

      <s-loading v-if="busy" css-mode></s-loading>

      <v-spacer></v-spacer>

      <v-toolbar-title
        class="text-uppercase small mt-3 d-flex flex-column align-center"
      >
        <img
          :src="
            require('@core/assets/order-types/basket-pos.svg')
          "
          width="28"
          height="28"
          class="mx-1 mb-1"
        />
        {{ $t("global.commons.order_detail") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card
      class="card--flex-toolbar mx-0 mx-sm-3"
      style="min-height: 80vh"
      flat
    >
      <!-- ======================= Container ======================= -->
      <router-view
        v-if="basket"
        :basket="basket"
        @request:refresh="fetchOrderInfo()"
      />
    </v-card>
  </v-card>
</template>

<script>
import {GtagEcommerce} from "@components/plugins/gtag/GtagEcommerce";
import { BasketStatus } from "@core/enums/basket/BasketStatus";

export default {
  name: "SStorefrontPOSOrderDetailMasterLayout",
  components: {},

  props: {},

  data: function () {
    return {
      basket: null,

      busy: false,

      RETURN: this.$route.params.RETURN,
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
  beforeDestroy() {
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

<style scoped lang="scss"></style>
