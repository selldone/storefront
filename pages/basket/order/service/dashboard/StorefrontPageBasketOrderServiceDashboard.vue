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
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_SERVICE }"
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
        <b> {{ getBasketOrderCode(basket) }}</b>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- Share order - Secure link generator -->
      <s-shop-share-order-button
        :basket="basket"
        :shop="shop"
      ></s-shop-share-order-button>
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
          <v-btn color="primary" size="x-large" @click="dialog_chat = true">
            <v-icon class="me-1">chat</v-icon>
            {{
              last_chat
                ? $t("global.actions.continue_chat")
                : $t("global.actions.add_message")
            }}
          </v-btn>
        </div>
      </div>

      <s-shop-customer-order-payment-widget
        v-if="basket"
        :order="basket"
        @request:refresh="$emit('request:refresh')"
      ></s-shop-customer-order-payment-widget>

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

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Service > Tasks ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-shop-service-tasks :basket="basket" :items="basket.items">
      </s-shop-service-tasks>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Return Requests ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-order-basket-return v-if="basket" :basket="basket" class="mt-4" />
    </v-container>

    <!-- ██████████████████████ Dialog > Chat ██████████████████████ -->
    <v-dialog
      v-model="dialog_chat"
      fullscreen
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card class="text-start">
        <v-card-title>
          <v-avatar class="m-2" size="24">
            <v-img :src="getShopImagePath(shop.icon, IMAGE_SIZE_SMALL)" />
          </v-avatar>

          {{ $t("global.commons.chat") }}
        </v-card-title>
        <v-card-text>
          <s-order-chat-box :basket="basket" :shop="shop"></s-order-chat-box>
        </v-card-text>
        <v-card-actions>
          <div class="widget-buttons">
            <v-btn variant="text" size="x-large" @click="dialog_chat = false">
              <v-icon start>close</v-icon>
              {{ $t("global.actions.close") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SShopBasketItemsList from "@selldone/components-vue/storefront/order/basket/SShopBasketItemsList.vue";
import SOrderDeliveryState from "@selldone/components-vue/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SOrderBasketReturn from "@selldone/components-vue/storefront/order/basket/return/SOrderBasketReturn.vue";
import SShopCustomerOrderPaymentWidget from "@selldone/components-vue/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopCustomerDeliveryInfoWidget from "@selldone/components-vue/storefront/order/delivery/SShopCustomerDeliveryInfoWidget.vue";
import SShopServiceTasks from "@selldone/components-vue/storefront/product/service/SShopServiceTasks.vue";
import SOrderChatBox from "@selldone/components-vue/storefront/order/chat/box/SOrderChatBox.vue";
import SShopShareOrderButton from "@selldone/components-vue/storefront/order/share-order/SShopShareOrderButton.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";

export default {
  name: "StorefrontPageBasketOrderServiceDashboard",
  components: {
    SShopShareOrderButton,
    SOrderChatBox,
    SShopServiceTasks,

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
      orderType: ProductType.SERVICE,

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

<style lang="scss" scoped></style>
