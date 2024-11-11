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
  <div>
    <v-toolbar color="transparent" flat class="text-start">
      <v-toolbar-title class="body-title">
        <router-link
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_AVOCADO }"
          class="text-uppercase"
        >
          <img
            :src="require('@selldone/components-vue/assets/icons/avocado.svg')"
            class="me-1"
            height="20"
            width="20"
          />
          {{ $t("global.commons.orders_list") }}
        </router-link>
        <span class="mx-1 text-muted">/</span>
        <b> {{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>
    </v-toolbar>
    <v-container class="px-0">
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Delivery > State ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-order-delivery-state
        v-if="basket"
        :basket="basket"
        is-avocado
        class="mb-5"
      />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Items ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <div class="widget mx-0 mx-md-3">
        <s-shop-avocado-customer-order-items
          :avocado="basket"
          :items="basket.items"
          class="max-width-field-large mx-auto w-100"
          view-only
        ></s-shop-avocado-customer-order-items>
      </div>

      <s-shop-customer-order-payment-widget
        v-if="basket"
        :order="basket"
      ></s-shop-customer-order-payment-widget>

      <s-shop-customer-delivery-info-widget
        v-if="basket"
        :basket="basket"
      ></s-shop-customer-delivery-info-widget>
    </v-container>
  </div>
</template>

<script lang="ts">
import SShopCustomerOrderPaymentWidget from "@selldone/components-vue/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopCustomerDeliveryInfoWidget from "@selldone/components-vue/storefront/order/delivery/SShopCustomerDeliveryInfoWidget.vue";
import SOrderDeliveryState from "@selldone/components-vue/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SShopAvocadoCustomerOrderItems from "@selldone/components-vue/storefront/order/avocado/SShopAvocadoCustomerOrderItems.vue";
import { Basket } from "@selldone/core-js";

export default {
  name: "StorefrontPageAvocadoOrderDashboard",
  components: {
    SShopAvocadoCustomerOrderItems,
    SShopCustomerDeliveryInfoWidget,
    SShopCustomerOrderPaymentWidget,
    SOrderDeliveryState,
  },

  props: {
    basket: {
      type: Object,
      require: true,
    },
  },

  data: function () {
    return {
      PhysicalOrderStates: Basket.PhysicalOrderStates,
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
