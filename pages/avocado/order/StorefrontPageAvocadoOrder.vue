<!--
  - Copyright (c) 2023-2024. Selldone® Business OS™
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
        :to="buildReturnRoute(window.$storefront.routes.HISTORY_ORDERS_AVOCADO)"
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
        :src="
          require('@selldone/core-js/assets/order-types/basket-avocado.svg')
        "
        class="me-5"
        height="28"
        width="28"
      />
    </v-toolbar>

    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Order > Card ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <v-card class="s--card-window-content" flat style="min-height: 80vh">
      <router-view v-if="basket" :basket="basket" />
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";
import { RouteMixin } from "@selldone/components-vue/mixin/RouteMixin";
import { Basket } from "@selldone/core-js";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";

export default {
  name: "StorefrontPageAvocadoOrder",
  mixins: [RouteMixin],
  inject: ["$shop"],
  components: {ULoadingEllipsis},

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
    this.setPageTitle(`Order AVO-` + this.$route.params.basket_id);
    this.fetchOrderInfo();
  },
  methods: {
    fetchOrderInfo() {
      this.busy = true;
      axios
        .get(
          window.XAPI.GET_ORDER_AVOCADO_BASKET_INFO(
            this.$shop.name,
            this.$route.params.basket_id,
          ),
        )
        .then(({ data }) => {
          if (!data.error) {
            this.basket = data.basket;

            if (this.basket.status === Basket.Status.Payed.code)
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
