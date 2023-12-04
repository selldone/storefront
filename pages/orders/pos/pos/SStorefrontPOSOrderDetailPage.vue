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
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="body-title">
        <router-link
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_POS }"
          class="text-uppercase"
        >
          <img
            :src="require('@components/assets/icons/pos-order-type.svg')"
            width="20"
            height="20"
            class="me-1"
          />
          {{ $t("global.commons.orders_list") }}</router-link
        >
        <span class="mx-1 text-muted">/</span>
        <b>{{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>
    </v-toolbar>
    <v-container class="px-0">
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Delivery > State ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-shop-customer-order-payment-widget
        v-if="basket"
        :order="basket"
        @request:refresh="$emit('request:refresh')"
      ></s-shop-customer-order-payment-widget>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Items ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-shop-basket-items-list
        v-if="basket"
        :basket="basket"
        :items="basket.items"
      />
    </v-container>
  </div>
</template>

<script>
import SShopCustomerOrderPaymentWidget from "@components/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopBasketItemsList from "@components/storefront/order/basket/SShopBasketItemsList.vue";

export default {
  name: "SStorefrontPOSOrderDetailPage",
  components: {
    SShopCustomerOrderPaymentWidget,
    SShopBasketItemsList,
  },

  props: {
    basket: {
      type: Object,
      require: true,
    },
  },

  data: function () {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
