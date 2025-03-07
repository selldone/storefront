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
    :color="ThemeColorDeepDark"
    class="s--shop-card s--shadow-no-padding -hide1720 pb-4 mb-16"
  >
    <!-- ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Order > Toolbar ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ -->

    <v-toolbar
      :color="ThemeColorDeepDark"
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
              : history_list_page_name,
          )
        "
        :tooltip="$t('global.actions.back')"
      />

      <v-spacer></v-spacer>

      <s-order-delivery-status-stepper
        v-if="orders_states"
        :has-subscription="isSubscription"
        :is-subscribed="isSubscription && basket.status === 'Payed'"
        :state="basket.delivery_state"
        :states="orders_states"
        dark
        style="min-width: 250px; width: 20%"
      />
      <u-loading-ellipsis v-else css-mode></u-loading-ellipsis>

      <v-spacer></v-spacer>

      <template v-if="type">
        <div class="d-flex flex-column align-center px-3">
          {{ $t("global.commons.order_detail") }}
          <div v-if="USER()" class="small mt-1">
            {{ USER().name }}
          </div>
        </div>
        <img :src="type.basket" class="me-5" height="28" width="28" />
      </template>
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

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import SOrderDeliveryStatusStepper from "@selldone/components-vue/storefront/order/shipping/stepper/SOrderDeliveryStatusStepper.vue";
import { StorefrontLocalStorages } from "@selldone/core-js/helper/local-storage/StorefrontLocalStorages";
import { RouteMixin } from "@selldone/components-vue/mixin/route/RouteMixin.ts";
import { Basket } from "@selldone/core-js";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import {EventBus} from "@selldone/components-vue/utils/events/EventBus.ts";

export default {
  name: "StorefrontPageBasketOrder",
  mixins: [RouteMixin, TemplateMixin],

  components: { ULoadingEllipsis, SOrderDeliveryStatusStepper },
  inject: ["$shop"],
  props: {},

  data: function () {
    return {
      basket: null,

      busy: false,
    };
  },

  computed: {
    isSubscription() {
      return this.basket && this.basket.type === ProductType.SUBSCRIPTION.code;
    },

    type() {
      if (!this.basket) return null;
      return Object.values(ProductType).find(
        (item) => item.code === this.basket.type,
      );
    },
    history_list_page_name() {
      if (!this.type) return null;

      let page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      if (this.type.code === ProductType.PHYSICAL.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      } else if (this.type.code === ProductType.VIRTUAL.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_VIRTUAL;
      } else if (this.type.code === ProductType.FILE.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_FILE;
      } else if (this.type.code === ProductType.SERVICE.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SERVICE;
      } else if (this.type.code === ProductType.SUBSCRIPTION.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SUBSCRIPTION;
      }
      return page_name;
    },

    orders_states() {
      if (!this.type) return null;

      if (this.type.code === ProductType.PHYSICAL.code) {
        return Basket.PhysicalOrderStates;
      } else if (this.type.code === ProductType.VIRTUAL.code) {
        return Basket.VirtualOrderStates;
      } else if (this.type.code === ProductType.FILE.code) {
        return Basket.FileOrderStates;
      } else if (this.type.code === ProductType.SERVICE.code) {
        return Basket.ServiceOrderStates;
      } else if (this.type.code === ProductType.SUBSCRIPTION.code) {
        return Basket.SubscriptionOrderStates;
      }
      return null;
    },
  },

  watch: {
    type(type) {
      if (type)
        this.setPageTitle(
          `Order ${type.basket_code}-` + this.$route.params.basket_id,
        ); // Set Page Title!
    },
    "$route.params.basket_id"() {
      this.basket = null; // Force re-render page!
      this.fetchOrderInfo();
    },
  },

  created() {
    this.fetchOrderInfo();
  },
  mounted() {
    EventBus.$on("on-payment-completed", ({ order_type, order_id }) => {
      console.log("on-payment-completed", order_type, order_id);
      if (this.basket && this.basket.id === order_id) this.fetchOrderInfo();
    });
  },
  beforeUnmount() {
    EventBus.$off("on-payment-completed");
  },

  methods: {
    fetchOrderInfo() {
      this.busy = true;
      axios
        .get(
          window.XAPI.GET_ORDER_BASKET_INFO(
            this.$shop.name,
            this.$route.params.basket_id,
          ),
          {
            params: {
              code: !this.USER()
                ? StorefrontLocalStorages.GetShopHistoryGuestCodeOfOrder(
                    this.$route.params.basket_id,
                  ) /*🥶 Guest*/
                : undefined,
              /**
                   This property holds the signature from the URL query parameters.
                   The signature is a cryptographic hash that ensures the integrity and authenticity
                   of the URL, preventing tampering. It's typically generated by shop staff when creating
                   secure, time-limited URLs to display order details.
                   */

              signature: this.$route.query.signature,
              /**
                   This property holds the timestamp from the URL query parameters.
                   The timestamp indicates when the URL was created and is used to ensure the URL's validity
                   within a specific time frame. Like the signature, this is also generated by shop staff
                   when creating secure URLs to display order details.
                   */
              timestamp: this.$route.query.timestamp,
            },
          },
        )
        .then(({ data }) => {
          if (!data.error) {
            this.basket = data.basket;

            if (this.basket.status === Basket.Status.Payed.code)
              GtagEcommerce.MeasuringPurchasesBasket(this.basket);
          } else {
            NotificationService.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
