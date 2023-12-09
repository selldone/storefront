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
  <v-card class="s--shop-card mb-16 s--shadow-no-padding -hide1720 pb-4" :style="{'--background':SaminColorDarkDeep}">
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
            ? { name: window.$storefront.routes.USER_RETURN_REQUESTS, params: { STATE: RETURN } }
            : { name: history_list_page_name, params: { STATE: RETURN } }
        "
      />

      <v-spacer></v-spacer>

      <status-stepper
        v-if="orders_states"
        :states="orders_states"
        :state="basket.delivery_state"
        style="min-width: 250px; width: 20%"
        dark
        :has-subscription="isSubscription"
        :is-subscribed="isSubscription && basket.status==='Payed'"
      />
      <s-loading v-else css-mode></s-loading>

      <v-spacer></v-spacer>

      <v-toolbar-title v-if="type" class="text-uppercase small mt-3 d-flex flex-column align-center">
        <img :src="type.basket" width="28" height="28" class="mx-1 mb-1" />
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
import { ProductType } from "@core/enums/product/ProductType";
import StatusStepper from "@components/storefront/order/order-status/StatusStepper.vue";
import { PhysicalOrderStates } from "@core/enums/basket/PhysicalOrderStates";
import { VirtualOrderStates } from "@core/enums/basket/VirtualOrderStates";
import { FileOrderStates } from "@core/enums/basket/FileOrderStates";
import { ServiceOrderStates } from "@core/enums/basket/ServiceOrderStates";
import { LocalStorages } from "@core/helper/local-storage/LocalStorages";
import {SubscriptionOrderStates} from "@core/enums/basket/SubscriptionOrderStates";

export default {
  name: "SStorefrontBasketOrderDetailMasterLayout",
  components: { StatusStepper },

  props: {},

  data: function () {
    return {
      basket: null,

      busy: false,

      RETURN: this.$route.params.RETURN,
    };
  },

  computed: {
    isSubscription() {
      return this.basket && this.basket.type === ProductType.SUBSCRIPTION.code;
    },

    type() {
      if (!this.basket) return null;
      return Object.values(ProductType).find(
        (item) => item.code === this.basket.type
      );
    },
    history_list_page_name() {
      let page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      if (this.type === ProductType.PHYSICAL) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      } else if (this.type === ProductType.VIRTUAL) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_VIRTUAL;
      } else if (this.type === ProductType.FILE) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_FILE;
      } else if (this.type === ProductType.SERVICE) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SERVICE;
      } else if (this.type === ProductType.SUBSCRIPTION) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SUBSCRIPTION;
      }
      return page_name;
    },

    orders_states() {
      if (this.type === ProductType.PHYSICAL) {
        return PhysicalOrderStates;
      } else if (this.type === ProductType.VIRTUAL) {
        return VirtualOrderStates;
      } else if (this.type === ProductType.FILE) {
        return FileOrderStates;
      } else if (this.type === ProductType.SERVICE) {
        return ServiceOrderStates;
      }else if (this.type === ProductType.SUBSCRIPTION) {
        return SubscriptionOrderStates;
      }
      return null;
    },


  },

  watch: {
    type(type) {
      if (type)
        this.setPageTitle(
          `Order ${type.basket_code}-` + this.$route.params.basket_id
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
        .get(window.XAPI.GET_ORDER_BASKET_INFO(shop_name, basket_id), {
          params: {
            code: !this.USER()
              ? LocalStorages.GetShopHistoryGuestCodeOfOrder(
                  this.$route.params.basket_id
                ) /*🥶 Guest*/
              : undefined,
          },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.basket = data.basket;

            if (this.basket.status === BasketStatus.Payed.code)
              GtagEcommerce.MeasuringPurchasesBasket( this.basket);
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
