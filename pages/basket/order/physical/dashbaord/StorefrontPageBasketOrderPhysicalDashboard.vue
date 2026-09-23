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
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL }"
          class="text-uppercase"
        >
          <img :src="orderType.image" class="me-1" height="20" width="20" />
          {{ $t("global.commons.orders_list") }}
        </router-link>

        <!-- 🎗️ Created by a subscription basket -->
        <span
          v-if="basket.subscription_id"
          title="This order created by a subscription."
        >
          <span class="mx-1 text-muted">/</span>
          <img :src="ProductType.SUBSCRIPTION.image" height="20" width="20" />
          <router-link
            :to="{
              name: 'MySubscriptionOrderInfoPage',
              params: { basket_id: basket.subscription_id },
            }"
          >
            SN-{{ basket.subscription_id }}
          </router-link>
        </span>

        <span class="mx-1 text-muted">/</span>
        <b>{{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        :aria-label="$t('global.commons.invoice')"
        :loading="busy_invoice"
        class="me-2"
        prepend-icon="download"
        variant="text"
        @click="downloadInvoice"
      >
        <span class="d-none d-sm-inline">
          {{ $t("global.commons.invoice") }}
        </span>
        <v-tooltip activator="parent">
          {{ $t("global.commons.download") }}
        </v-tooltip>
      </v-btn>
      <!-- Share order - Secure link generator -->
      <s-shop-share-order-button
        :basket="basket"
        class="me-5"
      ></s-shop-share-order-button>
    </v-toolbar>

    <v-container class="px-0">
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Status ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-order-delivery-state v-if="basket" :basket="basket" />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Chat ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-order-chat-widget :basket="basket"></s-order-chat-widget>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Payment ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-shop-customer-order-payment-widget
        v-if="basket"
        :order="basket"
        @request:refresh="$emit('request:refresh')"
      ></s-shop-customer-order-payment-widget>


      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Vendor Orders (In marketplace with direct shipping mode) ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-basket-vendor-orders
          v-if="basket"
          :basket="basket"
      ></s-basket-vendor-orders>



      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Delivery ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-shop-customer-delivery-info-widget
        v-if="basket"
        :basket="basket"
      ></s-shop-customer-delivery-info-widget>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Items ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-shop-basket-items-list
        v-if="basket"
        :basket="basket"
        :items="basket.items"
      />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Return Requests ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-order-basket-return v-if="basket" :basket="basket" class="mt-4" />
    </v-container>
  </div>
</template>

<script lang="ts">
import SShopBasketItemsList from "@selldone/components-vue/storefront/order/basket/SShopBasketItemsList.vue";
import SOrderDeliveryState from "@selldone/components-vue/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SOrderBasketReturn from "@selldone/components-vue/storefront/order/basket/return/SOrderBasketReturn.vue";
import SShopCustomerOrderPaymentWidget from "@selldone/components-vue/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopCustomerDeliveryInfoWidget from "@selldone/components-vue/storefront/order/delivery/SShopCustomerDeliveryInfoWidget.vue";

import SShopShareOrderButton from "@selldone/components-vue/storefront/order/share-order/SShopShareOrderButton.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import SOrderChatWidget from "@selldone/components-vue/storefront/order/chat/widget/SOrderChatWidget.vue";
import SBasketVendorOrders from "@selldone/components-vue/storefront/order/vendor-order/SBasketVendorOrders.vue";
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

export default {
  name: "StorefrontPageBasketOrderPhysicalDashboard",
  components: {
    SBasketVendorOrders: SBasketVendorOrders,
    SOrderChatWidget,
    SShopShareOrderButton,
    SShopCustomerDeliveryInfoWidget,
    SShopCustomerOrderPaymentWidget,
    SOrderBasketReturn,
    SOrderDeliveryState,
    SShopBasketItemsList,
  },

  props: {
    basket: {
      type: Object,
      require: true,
    },
  },

  data: function () {
    return {
      ProductType: ProductType,

      orderType: ProductType.PHYSICAL,
      busy_invoice: false,
    };
  },
  computed: {
    shop() {
      return this.getShop();
    },
  },
  created() {},
  methods: {
    downloadInvoice() {
      this.busy_invoice = true;

      axios
        .get(
          window.XAPI.GET_ORDER_BASKET_RECEIPT(
            this.shop.name,
            this.basket.id,
          ),
          {
            params: {
              code: this.basket.code || undefined,
              signature: this.$route.query.signature,
              timestamp: this.$route.query.timestamp,
            },
            responseType: "blob",
          },
        )
        .then(({ data }) => {
          const download_url = window.URL.createObjectURL(
            new Blob([data], { type: "application/pdf" }),
          );
          const link = document.createElement("a");
          link.href = download_url;
          link.download = `${this.getBasketOrderCode(this.basket)}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.setTimeout(
            () => window.URL.revokeObjectURL(download_url),
            0,
          );
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy_invoice = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
