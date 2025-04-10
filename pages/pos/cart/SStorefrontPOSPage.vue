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
  <div class="px-2">
    <v-container class="c-pos">
      <div style="min-height: 65vh">
        <v-progress-linear
          v-if="busy && !basket"
          class="loader-to-bar"
          color="success"
          indeterminate
        ></v-progress-linear>
        <div v-else class="py-3 max-width-field-large mx-auto">
          <div>
            <img
              class="me-1 zoomIn delay_500"
              height="32"
              src="../assets/pos-basket.png"
              width="32"
            />
            <img
              class="flipInX delay_300"
              height="48"
              src="@selldone/components-vue/assets/selldone-logo/logo-box.svg"
            />
          </div>

          <div class="d-flex mt-16 align-items-center" dir="ltr">
            <h1 v-if="basket" class="text-left flex-grow-1">
              {{ getBasketOrderCode(basket) }}
            </h1>

            <v-btn
              v-if="USER()"
              :loading="busy"
              class="m-1 flex-grow-0"
              color="blue"
              variant="text"
              @click="fetchBuyerPosOrderInfo()"
            >
              <v-icon>refresh</v-icon>
              {{ $t("global.actions.refresh") }}
            </v-btn>
          </div>

          <b-pos-cart-items v-if="basket" :basket="basket" view-only />

          <s-pos-bill-view v-if="bill" :bill="bill"></s-pos-bill-view>

          <!------------ Bill View ------------>

          <v-card-actions v-if="show_bill" class="px-4">
            <span class="text-uppercase"
              >{{ $t("global.commons.total") }}:</span
            >
            <v-spacer></v-spacer>
            <u-price
              :amount="bill.sum - bill.pay_by_giftcards"
              :currency="bill.currency"
              large
            ></u-price>
          </v-card-actions>

          <!------------ Pending Payments ------------>

          <template v-else-if="show_pending_payment">
            <v-card-text
              v-for="(transaction_pending, index) in transactions_pending"
              :key="index"
              :class="{
                '': transaction_pending.status === 'RequireAction',
                'bg-cyan text-white':
                  transaction_pending.status === 'Processing',
                'bg-red text-white': transaction_pending.status === 'Canceled',
              }"
              class="text-start"
            >
              <div>
                <img
                  :src="getShopImagePath(transaction_pending.logo)"
                  class="mx-2"
                  height="24"
                />
                {{ transaction_pending.name }}
                <b class="ms-2 small"
                  >({{ $t("global.commons.payment_not_settled") }})</b
                >

                <i
                  v-if="transaction_pending.status === 'Processing'"
                  class="fa fa-spinner fa-spin fa-fw mx-2"
                ></i>

                <p class="my-1">
                  {{ $t("global.commons.issued_at") }}:
                  {{ getLocalTimeString(transaction_pending.issued_at) }}
                </p>
                <p class="my-1">
                  {{ $t("global.commons.last_status") }}:
                  <b>{{
                    getTransactionStatusName(transaction_pending.status)
                  }}</b>
                </p>
              </div>
              <div class="py-2">
                <u-price
                  :amount="transaction_pending.amount"
                  :currency="transaction_pending.currency"
                  x-large
                ></u-price>
              </div>

              <div>
                <v-btn
                  v-if="
                    transaction_pending.status === 'RequireAction' &&
                    !transaction_pending.expired &&
                    !transaction_pending.cod &&
                    !transaction_pending.cash
                  "
                  class="mx-2 my-4"
                  color="success"
                  variant="flat"
                  size="x-large"
                  @click="
                    TryToPayOrder(
                      transaction_pending.gateway_code,
                      transaction_pending.id,
                      null,
                    )
                  "
                  >{{ $t("global.actions.pay_now") }}
                </v-btn>
              </div>
            </v-card-text>
          </template>

          <!------------ Payment ------------>

          <v-card-text v-else-if="payment" class="px-4 text-start">
            <div>
              <img
                :src="getShopImagePath(gateway.icon)"
                class="mx-2"
                height="24"
              />
              {{ gateway.name }}
            </div>
            <div class="py-2">
              <u-price
                :amount="payment.amount"
                :currency="payment.currency"
                large
              ></u-price>
            </div>
            <v-row class="align-items-center">
              <div>
                <u-payment-card
                  v-if="payment.card"
                  :card="payment.card"
                  :currency="payment.currency"
                  :method="payment.method"
                  horizontal
                ></u-payment-card>
                <span v-else-if="payment.cod">{{
                  $t("process_center.payment_widget.cod")
                }}</span>

                {{ getLocalTimeString(payment.payment_at) }}
                <u-payment-billing-details
                  v-if="payment.billing_details"
                  :billing-detail="payment.billing_details"
                  class="min-width-200"
                ></u-payment-billing-details>
              </div>

              <u-map-countries-single
                v-if="payment.card && payment.card.country"
                :country="payment.card.country"
                class="min-width-200 flex-grow-1 m-1"
              ></u-map-countries-single>
            </v-row>
          </v-card-text>
        </div>
      </div>
      <!------------ Footer ------------>

      <div class="-footer">
        Powered by
        <a href="/Applications/Storefront/public" target="_blank">
          <img
            height="10"
            src="@selldone/components-vue/assets/selldone-logo/logo-mini-dark.svg"
            width="10"
          />
          Selldone</a
        >
        | The Future Commerce Platform
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import BPosCartItems from "@selldone/components-vue/storefront/pos/cart-items/BPosCartItems.vue";
import SPosBillView from "@selldone/components-vue/storefront/pos/bill-view/SPosBillView.vue";
import UPaymentCard from "@selldone/components-vue/ui/payment/card/UPaymentCard.vue";
import UPaymentBillingDetails from "@selldone/components-vue/ui/payment/billing-details/UPaymentBillingDetails.vue";
import UMapCountriesSingle from "@selldone/components-vue/ui/map/countries/single/UMapCountriesSingle.vue";
import { TransactionStatus } from "@selldone/core-js/enums/payment/TransactionStatus";
import { Basket } from "@selldone/core-js";
import DateMixin from "@selldone/components-vue/mixin/date/DateMixin.ts";
import AuthMixin from "@selldone/components-vue/mixin/auth/AuthMixin.ts";

export default {
  name: "SStorefrontPOSPage",
  mixins: [DateMixin, AuthMixin],

  components: {
    UMapCountriesSingle,
    UPaymentBillingDetails,
    UPaymentCard,
    SPosBillView,
    BPosCartItems,
  },
  inject: ["$shop"],
  data: () => ({
    busy: false,
    basket: null,
    bill: null,
  }),
  computed: {
    show_bill() {
      return (
        this.bill &&
        this.basket &&
        this.basket.status === Basket.Status.Open.code
      );
    },
    show_pending_payment() {
      return (
        this.basket &&
        (this.basket.status === Basket.Status.Reserved.code ||
          this.basket.status === Basket.Status.COD.code) &&
        this.transactions_pending &&
        this.transactions_pending.length
      );
    },

    transactions_pending() {
      if (!this.basket) return null;

      return this.basket.transactions_pending;
    },

    payment() {
      if (!this.basket) return null;
      return this.basket.payment;
    },
    gateway() {
      if (!this.payment) return null;
      return this.payment.gateway;
    },
    isPayed() {
      if (!this.basket) return false;

      return this.basket.status === "Payed";
    },
    shop() {
      return this.getShop();
    },
  },
  watch: {
    "$store.getters.getUser"() {
      this.fetchBuyerPosOrderInfo();
    },
  },

  created() {
    if (!this.USER()) this.NeedLogin();
    else this.fetchBuyerPosOrderInfo();

    if (this.$route.query.signature) {
      // 1. Save signature (Available when user not login and redirected by Selldone to shop)
      localStorage.setItem(
        "POS-LAST-SCAN-SIGNATURE",
        this.$route.query.signature,
      );
    }
  },
  mounted() {},
  methods: {
    fetchBuyerPosOrderInfo() {
      this.busy = true;

      const signature = localStorage.getItem("POS-LAST-SCAN-SIGNATURE");

      axios
        .get(
          window.XAPI.GET_ORDER_POS_BASKET_INFO(
            this.$shop.name,
            this.$route.params.basket_id,
          ),
          {
            params: {
              signature: signature,
              // 2. Call API assign POS basket to user:
            },
          },
        )
        .then(({ data }) => {
          if (!data.error) {
            this.basket = data.basket;
            this.bill = data.bill;

            // Remove item:
            localStorage.removeItem("POS-LAST-SCAN-SIGNATURE");
          } else {
            this.basket = null;
            NotificationService.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => (this.busy = false));
    },

    getTransactionStatusName(status) {
      if (!TransactionStatus[status]) return "NOT FOUND!";
      return this.$t(TransactionStatus[status].name);
    },
  },
};
</script>

<style lang="scss" scoped>
.c-pos {
  background: #fff;
  box-shadow:
    inset 0 -3em 3em rgba(0, 0, 0, 0.01),
    0 5px 50px 4px rgba(166, 166, 166, 0.37) !important;
  border-radius: 16px !important;
  transition: all 0.7s ease-in;
  z-index: 1;
  position: relative;
  overflow: hidden;

  .-footer {
    font-size: 10px;
    font-weight: 500;
    text-align: right;
    direction: ltr;

    a {
      color: #1976d2;

      &:hover {
        color: #03a9f4;
      }

      img {
        margin-bottom: 2px;
      }
    }
  }
}
</style>
