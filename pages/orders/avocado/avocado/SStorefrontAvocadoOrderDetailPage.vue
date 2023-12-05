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
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="body-title">
        <router-link
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_AVOCADO }"
          class="text-uppercase"
        >
          <img
            :src="require('@components/assets/icons/avocado.svg')"
            width="20"
            height="20"
            class="me-1"
          />
          {{ $t("global.commons.orders_list") }}</router-link
        >
        <span class="mx-1 text-muted">/</span>
        <b> {{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>
    </v-toolbar>
    <v-container class="px-0">
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Delivery > State ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-order-delivery-state v-if="basket" :basket="basket" is-avocado />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Items ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-widget>
        <s-shop-avocado-customer-order-items
          :avocado="basket"
          :items="basket.items"
          view-only
          class="max-width-field-large mx-auto w-100"
        ></s-shop-avocado-customer-order-items>
      </s-widget>

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

<script>
import SShopCustomerOrderPaymentWidget from "@components/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";

import { PhysicalOrderStates } from "@core/enums/basket/PhysicalOrderStates";
import SShopCustomerDeliveryInfoWidget from "@components/storefront/order/delivery/SShopCustomerDeliveryInfoWidget.vue";
import SOrderDeliveryState from "@components/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SShopAvocadoCustomerOrderItems from "@components/storefront/order/avocado/SShopAvocadoCustomerOrderItems.vue";

export default {
  name: "SStorefrontAvocadoOrderDetailPage",
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
      PhysicalOrderStates: PhysicalOrderStates,
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
