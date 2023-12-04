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
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_SUBSCRIPTION }"
          class="text-uppercase"
        >
          <img :src="orderType.image" width="20" height="20" class="me-1" />
          {{ $t("global.commons.orders_list") }}</router-link
        >
        <span class="mx-1 text-muted">/</span>
        <b> {{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>
    </v-toolbar>
    <v-container class="px-0">
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Status ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-order-delivery-state v-if="basket" :basket="basket" />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Chat ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <div class="widget shadow my-3 mx-0 mx-md-3 text-start">
        <template v-if="last_chat">
          <div class="d-flex align-center py-3 my-3">
            <v-avatar :size="32" class="avatar-gradient -thin -staff me-2">
              <v-img
                v-if="last_chat.user_id"
                :src="getUserAvatar(last_chat.user_id)"
              />
              <v-icon v-else>account_circle</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <b>{{ last_chat.user_name }}</b>
              <small class="d-block"
                >{{ getFromNowString(last_chat.date) }} ●
                {{ getLocalDateString(last_chat.date) }}</small
              >
            </div>
          </div>
          <div class="typo-body my-2">
            {{ last_chat.body }}
          </div>
        </template>

        <div class="widget-buttons">
          <v-btn x-large color="primary" @click="dialog_chat = true">
            <v-icon class="me-1">chat</v-icon
            >{{
              last_chat
                ? $t("global.actions.continue_chat")
                : $t("global.actions.add_message")
            }}</v-btn
          >
        </div>
      </div>
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Payment ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-shop-customer-order-payment-widget
        v-if="basket"
        :order="basket"
        @request:refresh="$emit('request:refresh')"
      ></s-shop-customer-order-payment-widget>

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

      <s-basket-return-items-list v-if="basket" class="mt-4" :basket="basket" />
    </v-container>

    <!-- ██████████████████████ Dialog > Chat ██████████████████████ -->
    <v-dialog
      v-model="dialog_chat"
      fullscreen
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <v-avatar size="24" class="m-2">
            <v-img :src="getShopImagePath(shop.icon, IMAGE_SIZE_SMALL)" />
          </v-avatar>

          {{ $t("global.commons.chat") }}
        </v-card-title>
        <v-card-text>
          <order-chat-widget :shop="shop" :basket="basket"></order-chat-widget>
        </v-card-text>
        <v-card-actions>
          <div class="widget-buttons">
            <v-btn text @click="dialog_chat = false" x-large>
              <v-icon class="me-1">close</v-icon>
              {{ $t("global.actions.close") }}</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SShopBasketItemsList from "@components/storefront/order/basket/SShopBasketItemsList.vue";
import SOrderDeliveryState from "@components/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SBasketReturnItemsList from "@components/order/return-orders/SBasketReturnItemsList.vue";
import SShopCustomerOrderPaymentWidget from "@components/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopCustomerDeliveryInfoWidget from "@components/storefront/order/delivery/SShopCustomerDeliveryInfoWidget.vue";
import OrderChatWidget from "@components/storefront/order/chat/OrderChatWidget.vue";
import { ProductType } from "@core/enums/product/ProductType";

export default {
  name: "SStorefrontSubscriptionOrderDetailPage",
  components: {
    OrderChatWidget,

    SShopCustomerDeliveryInfoWidget,
    SShopCustomerOrderPaymentWidget,
    SBasketReturnItemsList,
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
      orderType: ProductType.SUBSCRIPTION,
      dialog_chat: false,
    };
  },
  computed: {
    shop() {
      return this.getShop();
    },
    chat() {
      return this.basket.chat;
    },
    last_chat() {
      return this.chat && this.chat.length && this.chat[this.chat.length - 1];
    },
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
