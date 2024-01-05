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
  <div class="px-2">
    <v-container class="c-avocado">
      <img
        src="@components/assets/icons/hyper.svg"
        width="32"
        height="32"
        class="me-1 zoomIn delay_500"
      />
      <img
        class="flipInX delay_300"
        src="@components/assets/selldone-logo/selldone-text-draw.png"
        height="48"
      />

      <!-- ................ Back to buyer form (If login) ................ -->

      <v-btn
        v-if="USER()"
        class="absolute-top-start slideInDown"
        text
        :to="{ name: window.$storefront.routes.HYPER_PAGE }"
        exact
      >
        <v-icon class="ms-1">{{ $t("icons.chevron_back") }}</v-icon>
        {{ $t("global.actions.back") }}
      </v-btn>

      <v-row
        justify="center"
        align="center"
        style="min-height: 65vh"
        class="flex-column"
      >
        <s-loading v-if="busy" css-mode light></s-loading>

        <v-col v-if="shop && hyper" cols="12" class="flex-grow-1">
          <!-- ................ Show Hyper Details ................ -->
          <div class="text-start max-width-field mx-auto my-16 fadeIn">
            <h1>{{ getBasketOrderCode(hyper) }}</h1>

            <small :title="getLocalTimeString(hyper.created_at)">
              {{ getFromNowString(hyper.created_at) }}

              |
              {{ getBasketOrderCode(hyper) }}
            </small>

            <p class="mb-0 mt-4 subtitle-2">
              {{ $t("global.commons.cart_list") }}
            </p>
            <s-shop-hyper-items-list :hyper="hyper" :items="items" class="my-3">
            </s-shop-hyper-items-list>

            <hr />

            <div class="d-flex">
              <p class="flex-grow-1">{{ $t("global.commons.net_price") }}</p>

              <price-view
                :amount="hyper.price"
                :currency="hyper.currency"
                not-show-zero
              >
              </price-view>
            </div>

            <div class="d-flex">
              <p class="flex-grow-1">{{ $t("global.commons.tax") }}</p>

              <price-view
                :amount="hyper.tax"
                :currency="hyper.currency"
                :line-through="hyper.tax_included"
                not-show-zero
              >
              </price-view>
            </div>

            <div v-if="isPayed" class="subtitle-2">
              <v-icon color="success" class="me-1">check_circle</v-icon>
              {{ $t("global.status.paid") }}
              {{ getLocalTimeString(hyper.pay_at) }}
            </div>
            <div v-else-if="isCanceled" class="subtitle-2">
              <v-icon color="red" class="me-1">cancel</v-icon>
              {{ $t("global.status.canceled") }}
              {{ getLocalTimeString(hyper.reject_at) }}
            </div>

            <hr />

            <div class="py-3">
              <price-view
                large
                :amount="sum"
                :currency="hyper.currency"
                not-show-zero
              >
              </price-view>
              <stamp v-if="isPayed" is-approved class="float-end">
                {{ $t("global.status.paid") }}
              </stamp>
              <stamp v-if="isCanceled" is-declined class="float-end">
                {{ $t("global.status.canceled") }}
              </stamp>
            </div>
          </div>
        </v-col>
      </v-row>

      <!------------ Pending Payments ------------>
      <div v-if="hyper && isReserved">
        <s-shop-row-customer-pending-payment
          class="d-flex align-center justify-space-around px-2 py-4 my-3 rounded"
          v-for="(transaction_pending, index) in transactions_pending"
          :key="'pp' + index"
          :transaction="transaction_pending"
        >
        </s-shop-row-customer-pending-payment>
      </div>
      <!-- ................ Footer ................ -->

      <div class="-footer">
        Powered by
        <a href="/public" target="_blank">
          <img
            src="@components/assets/selldone-logo/logo-mini-dark.svg"
            width="10"
            height="10"
          />
          Selldone</a
        >
        | The Future Commerce Platform
      </div>

      <v-progress-linear
        v-if="busy_save"
        indeterminate
        class="loader-to-bar"
        color="success"
      ></v-progress-linear>
    </v-container>
  </div>
</template>

<script>
import { BasketStatus } from "@core/enums/basket/BasketStatus";
import Stamp from "@components/ui/stamp/Stamp.vue";
import SShopHyperItemsList from "@components/storefront/hyper/SShopHyperItemsList.vue";
import SShopRowCustomerPendingPayment from "@components/storefront/order/payment/rows/SShopRowCustomerPendingPayment.vue";

export default {
  name: "SStorefrontHyperOrderPage",
  components: { SShopRowCustomerPendingPayment, SShopHyperItemsList, Stamp },

  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data: () => ({
    hyper: null,
    busy: false,
    //-----------------------
    startup_mode_map_dialog: "default",
    center: { lat: 35.715298, lng: 51.404343 },
    map_location: {},
    //-----------------------
    busy_save: false,
  }),

  computed: {
    transactions_pending() {
      return this.hyper.transactions_pending;
    },

    sum() {
      return (
        this.hyper.price + // delivery_price included in price!
        (this.hyper.tax_included ? 0 : this.hyper.tax)
      );
    },

    can_pay() {
      return this.isReserved;
    },

    items() {
      return this.hyper.items;
    },
    isOpen() {
      return this.hyper.status === BasketStatus.Open.code;
    },
    isReserved() {
      return this.hyper.status === BasketStatus.Reserved.code;
    },
    isPayed() {
      return this.hyper.status === BasketStatus.Payed.code;
    },
    isCanceled() {
      return this.hyper.status === BasketStatus.Canceled.code;
    },
  },
  created() {
    this.fetchHyper();
  },
  mounted() {},

  methods: {
    fetchHyper() {
      this.busy = true;
      axios
        .get(
          window.XAPI.GET_CUSTOMER_INFO_FOR_HYPER(
            this.shop_name,
            this.$route.params.basket_id
          )
        )
        .then(({ data }) => {
          if (!data.error) {
            this.hyper = data.hyper;
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
