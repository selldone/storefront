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
        src="@components/assets/icons/avocado.svg"
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
        :to="{ name: 'AvocadoPage' }"
        exact
      >
        <v-icon class="me-1">{{ $t("icons.chevron_back") }}</v-icon>
        {{ $t("global.actions.back") }}
      </v-btn>

      <v-row
        justify="center"
        align="center"
        style="min-height: 65vh"
        class="flex-column"
      >
        <s-loading v-if="busy" css-mode light></s-loading>

        <v-col v-if="shop && avocado" cols="12" class="flex-grow-1">
          <!-- ................ Progress ................ -->

          <div v-if="isPayed" class="pt-3 d-flex flex-column">
            <status-stepper
              :states="deliveryStates"
              :state="avocado.delivery_state"
              style="min-width: 250px; width: 20%"
              class="mx-auto fadeInUp"
            />
            <v-progress-linear
              v-if="avocado.progress"
              :value="avocado.progress"
              class="mt-4 max-width-field mx-auto d-block fadeInUp delay_200"
              height="8"
              color="#9eb644"
              striped
              rounded
            ></v-progress-linear>
          </div>

          <!-- ................ Show Avocado Details ................ -->
          <div class="text-start max-width-field mx-auto my-16 fadeIn">
            <h1>{{ avocado.title ? avocado.title : "AVO-" + avocado.id }}</h1>
            <p class="subtitle-2 my-1">{{ avocado.message }}</p>

            <small :title="getLocalTimeString(avocado.created_at)">
              {{ getFromNowString(avocado.created_at) }}

              |
              {{ "AVO-" + avocado.id }}
            </small>

            <p class="mb-0 mt-4 subtitle-2">
              {{ $t("avocado.items_list") }}
            </p>
            <s-shop-avocado-customer-order-items
              :avocado="avocado"
              :items="items"
              class="my-3"
            >
            </s-shop-avocado-customer-order-items>

            <hr />

            <div class="d-flex">
              <p class="flex-grow-1">{{ $t("global.commons.net_price") }}</p>

              <price-view
                :amount="
                  avocado.price -
                  (avocado.delivery ? avocado.delivery_price : 0)
                "
                :currency="avocado.currency"
                not-show-zero
              >
              </price-view>
            </div>

            <div class="d-flex">
              <p class="flex-grow-1">
                {{ $t("global.commons.delivery_price") }}
              </p>

              <price-view
                :amount="avocado.delivery_price"
                :currency="avocado.currency"
                not-show-zero
              >
              </price-view>
            </div>

            <div class="d-flex">
              <p class="flex-grow-1">{{ $t("global.commons.tax") }}</p>

              <price-view
                :amount="avocado.tax"
                :currency="avocado.currency"
                :line-through="avocado.tax_included"
                not-show-zero
              >
              </price-view>
            </div>

            <div v-if="isPayed" class="subtitle-2">
              <v-icon color="success" class="me-1">check_circle</v-icon>
              {{ $t("global.status.paid") }}
              {{ getLocalTimeString(avocado.pay_at) }}
            </div>
            <div v-else-if="isCanceled" class="subtitle-2">
              <v-icon color="red" class="me-1">cancel</v-icon>
              {{ $t("global.status.canceled") }}
              {{ getLocalTimeString(avocado.reject_at) }}
            </div>

            <hr />

            <div class="py-3">
              <price-view
                large
                :amount="sum"
                :currency="avocado.currency"
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

            <div v-if="avocado.delivery" class="mb-4">
              <div v-if="need_address">
                <div class="widget-buttons">
                  <v-btn
                    color="#03A9F4"
                    class="-delivery-btn"
                    dark
                    rounded
                    x-large
                    @click="showMapSelect"
                    :loading="busy_save"
                  >
                    <v-icon small class="me-1 blink-me">lens</v-icon>
                    {{ $t("global.commons.select_address") }}
                  </v-btn>
                </div>

                <div class="my-2">
                  <v-icon class="me-1">tips_and_updates</v-icon>
                  {{ $t("avocado.select_address_message") }}
                </div>
              </div>

              <div v-else>
                <s-shop-customer-receiver-info-widget
                  :receiver-info="avocado.receiver_info"
                  @show:detail="
                    () => {
                      startup_mode_map_dialog = 'detail';
                      showMapSelect();
                    }
                  "
                  @show:map="
                    startup_mode_map_dialog = 'default';
                    showMapSelect();
                  "
                ></s-shop-customer-receiver-info-widget>
              </div>
            </div>

            <div v-if="isReserved && !need_address" class="pt-4">
              <div class="widget-buttons">
                <v-btn
                  color="#90a60f"
                  class="-pay-btn"
                  dark
                  rounded
                  x-large
                  @click="goToPaymentAvocado"
                  :class="{ disabled: !can_pay }"
                >
                  <v-icon v-if="pricing_completed" small class="me-1 blink-me"
                    >lens</v-icon
                  >

                  {{ $t("avocado.pay_online") }}
                </v-btn>
              </div>
              <p v-if="!pricing_completed" class="my-5 subtitle-2">
                <v-icon color="blue" class="blink-me" size="10">lens</v-icon>

                {{ $t("avocado.pricing_not_completed_message") }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

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
        | The Business OS
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
import SShopCustomerReceiverInfoWidget from "@components/storefront/order/delivery/SShopCustomerReceiverInfoWidget.vue";
import { BasketStatus } from "@core/enums/basket/BasketStatus";
import {GtagEcommerce} from "@components/plugins/gtag/GtagEcommerce";
import Stamp from "@components/ui/stamp/Stamp.vue";
import StatusStepper from "@components/storefront/order/order-status/StatusStepper.vue";
import { AvocadoOrderStates } from "@core/enums/avocado/AvocadoOrderStates";
import SShopAvocadoCustomerOrderItems from "@components/storefront/order/avocado/SShopAvocadoCustomerOrderItems.vue";
import { AvocadoItemStatus } from "@core/enums/avocado/AvocadoItemStatus";

export default {
  name: "SStorefrontAvocadoOrderPage",
  components: {
    SShopAvocadoCustomerOrderItems,
    StatusStepper,
    Stamp,
    SShopCustomerReceiverInfoWidget,
  },

  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data: () => ({
    deliveryStates: AvocadoOrderStates,

    avocado: null,
    busy: false,
    //-----------------------
    startup_mode_map_dialog: "default",
    center: { lat: 35.715298, lng: 51.404343 },
    map_location: {},
    //-----------------------
    busy_save: false,
  }),

  computed: {
    sum() {
      return (
        this.avocado.price + // delivery_price included in price!
        (this.avocado.tax_included ? 0 : this.avocado.tax)
      );
    },
    need_address() {
      return (
        this.avocado.delivery &&
        (!this.avocado.receiver_info || !this.avocado.receiver_info.address)
      );
    },
    can_pay() {
      return (
        this.isReserved &&
        (!this.avocado.delivery ||
          (this.avocado.receiver_info &&
            this.avocado.receiver_info.address &&
            this.avocado.receiver_info.phone)) &&
        this.pricing_completed
      );
    },
    pricing_completed() {
      if (this.avocado.price <= 0) return false;
      if (!this.items.length) return true; // no items mode!

      const has_pending = this.items.some(
        (it) =>
          it.status === AvocadoItemStatus.PENDING.code ||
          (!it.price && it.status === AvocadoItemStatus.ACCEPTED.code)
      ); // Pending or not have price!

      return !has_pending;
    },

    items() {
      return this.avocado.items;
    },
    isOpen() {
      return this.avocado.status === BasketStatus.Open.code;
    },
    isReserved() {
      return this.avocado.status === BasketStatus.Reserved.code;
    },
    isPayed() {
      return this.avocado.status === BasketStatus.Payed.code;
    },
    isCanceled() {
      return this.avocado.status === BasketStatus.Canceled.code;
    },
  },
  created() {
    this.fetchAvocado();
  },
  mounted() {},

  methods: {
    fetchAvocado() {
      this.busy = true;

      const handleSuccessResponse = ({ avocado }) => {
        this.avocado = avocado;
      };

      window.$storefront.avocado
        .force()
        .getOrder(this.$route.params.hash)
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    showMapSelect() {
      if (this.avocado.receiver_info && this.avocado.receiver_info.location) {
        this.center = {
          lat: this.avocado.receiver_info.location.lat,
          lng: this.avocado.receiver_info.location.lng,
        };
      }
      if (this.avocado.receiver_info) {
        this.map_location = Object.assign({}, this.avocado.receiver_info);
      }

      this.showMap(
        this.center,
        this.startup_mode_map_dialog,
        this.map_location,
        this.onClickSetLocation,
        false
      );
    },
    onClickSetLocation(info) {

      if (!info.phone && this.USER()) info.phone = this.USER().phone; // Auto fill phone!

      this.avocado.receiver_info = info;
      this.closeMap();
      this.saveInfo();
    },
    saveInfo() {
      this.busy_save = true;

      window.$storefront.avocado
        .updateReceiverInfo(this.$route.params.hash, this.avocado.receiver_info)

        .then(({ avocado }) => {
          this.avocado.receiver_info = avocado.receiver_info;
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_save = false;
        });
    },

    //―――――――――――――――――――――― Final Step > Go to payment bill (Service) ――――――――――――――――――――

    goToPaymentAvocado() {
      this.ShowPaymentDialogAvocado(this.avocado, () => {
        this.fetchAvocado(); // Refresh order info...
      });

      GtagEcommerce.MeasuringCheckoutSteps(this.avocado, 2, null);
    },
  },
};
</script>
