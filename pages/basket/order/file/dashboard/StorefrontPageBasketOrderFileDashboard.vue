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

<template>
  <div>
    <v-toolbar color="transparent" flat class="text-start">
      <v-toolbar-title class="body-title">
        <router-link
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_FILE }"
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
      ></s-shop-customer-order-payment-widget>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Items ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-shop-basket-items-list
        v-if="basket"
        :basket="basket"
        :items="basket.items"
        @show-download-list="
          (item) => {
            files_show = true;
            selected_item = item;
          }
        "
      />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List > Return Requests ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-order-basket-return v-if="basket" :basket="basket" class="mt-4" />

      <!-- █████████████████ Dialog > Files List █████████████████ -->
      <v-dialog
        v-model="files_show"
        fullscreen
        scrollable
        transition="dialog-bottom-transition"
      >
        <v-card class="text-start">
          <v-card-title>
            <v-icon class="me-1" color="black">folder</v-icon>
            {{ $t("global.commons.files_list") }}
          </v-card-title>

          <v-card-text>
            <div class="widget-box mb-5">
              <v-list-subheader>
                <v-icon class="me-1" size="small">warning_amber</v-icon>
                After downloading files, check those with your antivirus.
              </v-list-subheader>

              <s-shop-product-files-list
                v-if="selected_item"
                :basket="basket"
                :files="selected_item.product.files"
                purchased
              ></s-shop-product-files-list>
            </div>
          </v-card-text>

          <v-card-actions>
            <div class="widget-buttons">
              <v-btn variant="text" size="x-large" @click="files_show = false">
                <v-icon start>close</v-icon>
                {{ $t("global.actions.close") }}
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import SShopCustomerOrderPaymentWidget from "@components/storefront/order/payment/SShopCustomerOrderPaymentWidget.vue";
import SShopBasketItemsList from "@components/storefront/order/basket/SShopBasketItemsList.vue";
import SOrderBasketReturn from "@components/storefront/order/basket/return/SOrderBasketReturn.vue";
import SOrderDeliveryState from "@components/storefront/order/delivery-state/SOrderDeliveryState.vue";
import SShopProductFilesList from "@components/storefront/product/file/SShopProductFilesList.vue";
import SOrderChatBox from "@components/storefront/order/chat/box/SOrderChatBox.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import SShopShareOrderButton from "@components/storefront/order/share-order/SShopShareOrderButton.vue";

export default {
  name: "StorefrontPageBasketOrderFileDashboard",
  components: {
    SShopShareOrderButton,
    SOrderChatBox,
    SShopProductFilesList,
    SOrderDeliveryState,
    SOrderBasketReturn,
    SShopBasketItemsList,
    SShopCustomerOrderPaymentWidget,
  },

  props: {
    basket: {
      type: Object,
      require: true,
    },
  },
  data: function () {
    return {
      orderType: ProductType.FILE,

      files_show: false,
      selected_item: null,

      dialog_chat: false,
    };
  },
  computed: {
    files() {
      if (!this.selected_item || !this.selected_item.product) return [];
      return this.selected_item.product.files;
    },

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
