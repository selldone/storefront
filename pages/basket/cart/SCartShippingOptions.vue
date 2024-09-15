<!--
  - Copyright (c) 2024. Selldone® Business OS™
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
  <!-- ════════════════════════ Shipping options ════════════════════════ -->
  <div
    v-if="warehouse"
    class="text-subtitle-2 single-line"
    :title="warehouse_address"
  >
    <span class="small min-width-50 d-inline-block">{{
      $t("global.commons.origin")
    }}</span>
    <v-icon class="flip-rtl me-2">arrow_right</v-icon>

    <b v-if="warehouse.title" class="me-2">{{ warehouse.title }}</b>

    <flag
      v-if="warehouse.country"
      :iso="warehouse.country"
      :squared="false"
      class="me-2"
    />
    {{ warehouse_address }}
  </div>
  <div class="d-flex align-center my-2">
    <span class="small min-width-50 d-inline-block">{{
      $t("global.commons.shipping")
    }}</span>
    <v-icon class="flip-rtl">arrow_right</v-icon>
    <products-dense-images-circles
      :ids="
        basket.items
          .filter((i) => itemIds?.includes(i.id))
          .map((i) =>
            getShopImagePath(
              i.variant?.image ? i.variant.image : i.product.icon,
              128,
            ),
          )
      "
      inline
      border
      raw-images-path
    ></products-dense-images-circles>
    <v-spacer></v-spacer>
    <span v-if="cost!==null && cost!==undefined" class="text-subtitle-2">
      <u-price v-if="cost > 0" :amount="cost"></u-price>

      <span v-else-if="cost === 0">
        {{ $t("basket_page.free_shipping") }}
      </span>

      <span v-else>
        {{ $t("basket_page.shipping_not_pay") }}
      </span>
    </span>
  </div>
  <!-- ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Select Shipping Method (Except Pickup) ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  -->

  <u-smart-select
    v-if="transportation_exclude_pickup?.length"
    :background-color="!light_checkout ? SaminColorDark : '#fafafa'"
    :dark="!light_checkout"
    :item-image="
      (item) =>
        item.logo
          ? getShopImagePath(item.logo)
          : getShopTransportationObject(item.type).icon
    "
    :item-text="
      (item) =>
        item.title
          ? item.title
          : $t(getShopTransportationObject(item.type).name)
    "
    :items="transportation_exclude_pickup"
    :model-value="transportation?.type"
    force-show-all
    item-description="message"
    item-value="type"
    rounded
    @update:model-value="
      (_type) => {
        $emit(
          'update:transportation',
          transportation_exclude_pickup.find((x) => x.type === _type),
        );
        $nextTick(() => {
          setBasketConfig();
        });
      }
    "
    class="mb-2"
    gray-unselected
  >
    <template v-slot:description="{ item }">
    <v-row no-gutters >
        <span v-if="item.cod && cod_payment_exists" class="me-4 small"
        >● {{ $t("global.commons.cod") }}</span
        >
      <span v-if="item.sod" class="me-4 small"
      >● {{ $t("global.commons.sod") }}
      </span>

      <span v-if="item.free_shipping" class="me-2  small">
        ● {{ $t("global.commons.free_shipping") }}
        {{ item.free_shipping_limit ? `${$t('global.commons.for')} + ` : "" }}
        <u-price
            :amount="item.free_shipping_limit"
            :currency="item.currency"
        ></u-price>
      </span>
    </v-row>
    </template>
  </u-smart-select>

  <!-- ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Select Pickup Address ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  -->

  <s-cart-shipping-pickups
    :basket="basket"
    :transportations="transportations"
    @pickupSelected="
      ({ pickup,transportation }) => {
        $emit('pickupSelected', { pickup,transportation });
      }
    "
    :selectedPickup="selectedPickup"
  ></s-cart-shipping-pickups>

  <!-- ════════════════════════ Delivery time ════════════════════════ -->
  <div v-if="showCustomDeliveryTimeButton" class="font-weight-medium data-row">
    <!-- ━━━━━━━━━━━━━━━━━━ Select preferred arrival time button ━━━━━━━━━━━━━━━━━━ -->

    <u-text-value-dashed wrap>
      <template v-slot:label>
        <i class="fas fa-calendar-check me-1" />
        {{ $t("basket_page.receive_time") }}

        <v-btn
          v-if="weight > 0 || (volume && volume.width > 0) || distance > 0"
          class="ms-1"
          icon
          variant="text"
          size="24"
          title="Show package and distance info."
          @click="show_package_info = !show_package_info"
        >
          <v-icon size="small">info</v-icon>
        </v-btn>
      </template>

      <span v-if="transportation" class="mx-auto me-0">
        <v-btn
          :color="customDeliveryTimes ? 'primary' : '#fafafa'"
          class="select-time-button mx-1 animated-all-normal tnt"
          variant="flat"
          height="48"
          rounded="s-xl e-lg"
          @click.stop="customDeliveryTimes = !customDeliveryTimes"
        >
          <v-avatar
            v-if="transportation"
            :image="
              transportation.logo
                ? getShopImagePath(transportation.logo)
                : getShopTransportationObject(transportation.type).icon
            "
            class="me-1 ms-n2 avatar-gradient -thin -gray"
            size="32"
            start
          />
          <div>
            <div>
              {{
                customDeliveryTimes
                  ? $t("basket_page.select_time")
                  : $t("basket_page.no_select_time")
              }}
            </div>

            <div
              v-if="max_lead_time > 0"
              :style="{
                color: customDeliveryTimes ? '#8BC34A' : '#b22a2a ',
              }"
              class="text-capitalize small mt-1"
            >
              {{
                $t("global.commons.from_lead_time", {
                  hours: max_lead_time,
                })
              }}
            </div>
          </div>
        </v-btn>
      </span>
      <span v-else>
        {{ $t("basket_page.no_select_time") }}
      </span>
    </u-text-value-dashed>

    <!-- ━━━━━━━━━━━━━━━━━━ Show package and distance info ━━━━━━━━━━━━━━━━━━ -->

    <v-expand-transition>
      <div v-if="show_package_info">
        <div
          class="d-flex justify-content-between align-items-center text-center fadeIn py-2 mb-2"
        >
          <span
            v-if="weight > 0"
            :class="{ 'text-success': weight > 0 }"
            class="small"
            ><i class="fas fa-weight-hanging me-1" /> {{ weight }}
            {{ mass_unit }}
          </span>

          <span
            v-if="volume && volume.width > 0"
            :class="{ 'text-success': volume.width > 0 }"
            class="small"
          >
            <i class="fas fa-ruler-combined me-1" />
            {{ volume.width }}
            <i class="fas fa-times mx-2" />{{ volume.length }}
            <i class="fas fa-times mx-2" />{{ volume.height }}
            {{ size_unit }}
          </span>

          <span
            v-if="distance > 0"
            :class="{ 'text-success': distance > 0 }"
            class="small"
            ><i class="fas fa-location-arrow me-1" />
            {{ Math.round(distance) }}
            {{ distance_unit }}
          </span>
        </div>
      </div>
    </v-expand-transition>

    <!-- ━━━━━━━━━━━━━━━━━━ Lead time ━━━━━━━━━━━━━━━━━━ -->

    <div class="font-weight-medium data-row">
      <u-text-value-dashed>
        <template v-slot:label>
          <i class="fas fa-clock me-1" />
          {{ $t("basket_page.lead_time") }}
        </template>
        <span>
          {{ max_lead_time + (transportation?.etd ? transportation.etd : 0) }}
          {{ $t("basket_page.lead_time_unit") }}
        </span>
      </u-text-value-dashed>
    </div>

    <!-- ════════════════════════ Custom delivery time ════════════════════════ -->
    <v-expand-transition>
      <div v-if="customDeliveryTimes" class="font-weight-regular">
        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Weekdays ━━━━━━━━━━━━━━━━━━ -->
        <template
          v-if="
            [ETA.weekday_timeframe.code, ETA.weekday.code].includes(
              transportation?.eta,
            )
          "
        >
          <v-list-subheader>
            {{ $t("basket_page.days_input") }}
          </v-list-subheader>
          <v-select
            v-model="deliveryInfo.days"
            :hint="$t('basket_page.days_input_label')"
            :item-title="(item) => $t(item.name)"
            :items="dayItems"
            :no-data-text="$t('basket_page.days_input_no_data')"
            prepend-inner-icon="fa:fas fa-calendar-week"
            chips
            class="mx-2 mt-3"
            closable-chips
            item-value="value"
            multiple
            variant="outlined"
            @update:model-value="setBasketConfig"
          >
            <template v-slot:chip="{ item, props }">
              <v-chip v-bind="props" color="#0061e0" variant="elevated">
                <span>{{ $t(item.raw.name) }}</span>
              </v-chip>
            </template>
          </v-select>
        </template>

        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Timeframe ━━━━━━━━━━━━━━━━━━ -->

        <template
          v-if="
            [ETA.weekday_timeframe.code, ETA.timeframe.code].includes(
              transportation?.eta,
            )
          "
        >
          <v-list-subheader>
            {{ $t("basket_page.time_input") }}
          </v-list-subheader>

          <v-select
            v-model="deliveryInfo.time_spans"
            :hint="$t('basket_page.time_input_label')"
            :item-title="(it) => $t(it.name)"
            :items="timeItems"
            :no-data-text="$t('basket_page.time_input_label_no_data')"
            prepend-inner-icon="fa:fas fa-clock"
            chips
            :return-object="false"
            class="mx-2 mt-3"
            closable-chips
            item-value="value"
            multiple
            variant="outlined"
            @update:model-value="setBasketConfig"
          >
            <template v-slot:chip="{ item, props }">
              <v-chip v-bind="props" color="#0061e0" variant="elevated">
                <img :src="item.raw.icon" class="me-1" width="14px" />

                <span>{{ $t(item.raw.name) }}</span>
              </v-chip>
            </template>
          </v-select>
        </template>

        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Date ━━━━━━━━━━━━━━━━━━ -->
        <template v-if="need_ask_shipping_date && transportation">
          <v-list-subheader> Receive date</v-list-subheader>
          <u-date-input
            v-model="deliveryInfo.date"
            :date-only="[ETA.date.code].includes(transportation.eta)"
            :min="
              new Date().addHours(
                transportation.etd + (max_lead_time > 0 ? max_lead_time : 0),
              )
            "
            class="mx-2 mt-3"
            outlined
            placeholder="Select a date to receive order..."
            return-utc
            @change="setBasketConfig"
          >
            <template v-slot:prepend-inner>
              <v-icon v-if="deliveryInfo.date" color="green"
                >check_circle
              </v-icon>
              <v-icon v-else class="blink-me-linear" color="red"
                >warning
              </v-icon>
            </template>
          </u-date-input>
        </template>
      </div>
    </v-expand-transition>
    <div class="mb-3 mt-4" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UTextValueDashed from "@selldone/components-vue/ui/text/value-dashed/UTextValueDashed.vue";
import ProductsDenseImagesCircles from "@selldone/components-vue/storefront/product/products-dense-images-circles/ProductsDenseImagesCircles.vue";
import UDateInput from "@selldone/components-vue/ui/date/input/UDateInput.vue";
import USmartSelect from "@selldone/components-vue/ui/smart/select/USmartSelect.vue";
import { ShopTransportations } from "@selldone/core-js/enums/logistic/ShopTransportations.ts";
import { ETA } from "@selldone/core-js/enums/logistic/ETA.ts";
import { MapHelper, ShopOptionsHelper } from "@selldone/core-js/helper";
import { ProductType } from "@selldone/core-js/enums/product/ProductType.ts";
import { WeekDays } from "@selldone/core-js/enums/logistic/WeekDays.ts";
import { TimeSpans } from "@selldone/core-js/enums/logistic/TimeSpans.ts";
import SCartShippingPickups from "@app-storefront/pages/basket/cart/SCartShippingPickups.vue";

export default defineComponent({
  name: "SCartShippingOptions",
  components: {
    SCartShippingPickups,
    USmartSelect,
    UDateInput,
    ProductsDenseImagesCircles,
    UTextValueDashed,
  },
  emits: ["update:transportation", "set-basket-config", "pickupSelected"],
  props: {
    shop: {
      require: true,
    },
    basket: {
      require: true,
    },

    transportations: {},
    transportation: {},

    deliveryInfo: {},
    /**
     * Included item ids in this shipping option
     */
    itemIds: { type: Array },
    weight: {},
    volume: {},
    distance: {},
    cost: {},
    warehouse: {
      type: Object,
    },

    selectedPickup: {},
  },
  data: () => ({
    ETA: ETA,

    show_package_info: false,

    customDeliveryTimes: false,
  }),

  computed: {
    cod_payment_exists(){
      return this.shop.gateways?.some(gateway=>gateway.currency===this.basket.currency && gateway.cod)
    },
    warehouse_address() {
      return MapHelper.GenerateFullAddressFromMapInfo(this.warehouse);
    },
    // transport_types -> transportations
    //delivery_info->deliveryInfo

    no_map() {
      return !ShopOptionsHelper.HasMap(this.shop);
    },

    size_unit() {
      return ShopOptionsHelper.GetSizeUnit(this.shop);
    },

    mass_unit() {
      return ShopOptionsHelper.GetMassUnit(this.shop);
    },
    distance_unit() {
      return ShopOptionsHelper.GetDistanceUnit(this.shop);
    },

    isService() {
      return this.type === ProductType.SERVICE.code;
    },

    max_lead_time() {
      if (!this.basket) return 0;
      let max_lead = 0;
      this.basket.items.forEach((item) => {
        let lead = this.leadProduct(item.product, item.variant,item.vendor_product);
        if (lead) max_lead = Math.max(max_lead, lead);
      });

      return max_lead;
    },

    light_checkout() {
      return this.shop.theme && this.shop.theme.light_checkout;
    },

    receiver_info() {
      return this.basket.receiver_info;
    },

    has_delivery() {
      return ShopOptionsHelper.AskShippingAddress(this.shop, this.basket.type);
      /*
      if (this.isPhysical || this.isService) {
        return true;
      }
      return false;*/
    },

    showCustomDeliveryTimeButton() {
      return (
        this.has_delivery &&
        this.receiver_info &&
        this.receiver_info.address &&
        this.is_valid_location
      );
    },

    is_valid_location() {
      if (this.no_map) return !!this.receiver_info.address; // Only enter address!
      return (
        this.receiver_info.location &&
        !!this.receiver_info.location.lat &&
        !!this.receiver_info.location.lng
      );
    },

    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ Pickup ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅

    pickup_transportation() {
      return (
        this.transportations &&
        this.transportations.find(
          (t) => t.type === ShopTransportations.Pickup.code,
        )
      );
    },
    transportation_exclude_pickup() {
      return (
        this.transportations &&
        this.transportations.filter(
          (t) => t.type !== ShopTransportations.Pickup.code,
        )
      );
    },

    need_ask_shipping_date() {
      return (
        this.transportation &&
        [ETA.date.code, ETA.date_time.code].includes(this.transportation.eta)
      );
    },

    /**
     * Generates a list of day items based on the transportation days.
     * Each day item corresponds to a day in the WeekDays object.
     *
     * @returns {Array} - An array of day items.
     */
    dayItems() {
      const out = [];

      // If transportation is not defined, return an empty array
      if (!this.transportation) return out;

      // Iterate over each item in transportation.days
      this.transportation.days.forEach((item) => {
        // Check if the day exists in WeekDays
        if (WeekDays[item]) {
          out.push(Object.assign({}, WeekDays[item]));
        } else {
          out.push({
            value: item,
            name: `Invalid ${item}`,
            icon: null,
            props: { disabled: true },
          });
        }
      });

      return out;
    },

    /**
     * Generates a list of time items with their properties.
     * Time items are marked as disabled if they are not included in the transportation time spans.
     * Additionally, invalid time spans (not in TimeSpans) are marked as disabled.
     *
     * @returns {{name,value,icon,props}[]} - An array of time items with properties.
     */
    timeItems() {
      let out = [];

      // If transportation is not defined, return an empty array
      if (!this.transportation) return out;

      // Iterate over each item in transportation.time_spans
      this.transportation.time_spans.forEach((item) => {
        // Check if the time_span exists in TimeSpans
        if (TimeSpans[item]) {
          out.push(Object.assign({}, TimeSpans[item]));
        } else {
          out.push({
            value: item,
            name: `Invalid ${item}`,
            icon: null,
            props: { disabled: true },
          });
        }
      });


      return out;
    },
  },

  watch: {
    timeItems(timeItems){

      // FIX MISS MATCH ISSUES:  Filter time_spans based on the values in the out array
      this.deliveryInfo.time_spans = this.deliveryInfo.time_spans?.filter(timeSpan =>
          timeItems.some(it => it.value === timeSpan)
      );
    },
    dayItems(dayItems){
      // FIX MISS MATCH ISSUES:  Filter days based on the values in the out array
      this.deliveryInfo.days = this.deliveryInfo.days?.filter(day =>
          dayItems.some(it => it.value === day)
      );
    },


    transportation(transportation) {
      if (!this.has_delivery) return;

      this.deliveryInfo.type = transportation ? transportation.type : null;

    },

    transportations() {
      this.autoSelectTransportationType();
    },

    customDeliveryTimes(custom) {
      // this.deliveryInfo.days = [];
      //  this.deliveryInfo.time_spans = [];

      if (custom && this.transportation) {
        // Set all times for default custom delivery time!
        this.deliveryInfo.days = this.transportation.days.slice(0);
        this.deliveryInfo.time_spans = this.transportation.time_spans.slice(0);
      }

      this.deliveryInfo.custom = custom;

      if (this.deliveryInfo.custom !== this.deliveryInfo?.custom) {
        //console.log("🧨 watch ===> customDeliveryTimes : setBasketConfig (customDeliveryTimes)");
        this.setBasketConfig();
      }
    },

    //------------- Force Show Date & Time inputs -----------
    need_ask_shipping_date(value) {
      if (value) {
        // We should ask user to select a date!
        this.customDeliveryTimes = true;
      }
    },
  },
  mounted() {
    this.customDeliveryTimes = this.need_ask_shipping_date || this.deliveryInfo.custom;
    this.autoSelectTransportationType();
  },

  methods: {
    getShopTransportationObject(type) {
      return ShopTransportations[type];
    },

    autoSelectTransportationType() {
      if (!this.has_delivery || this.isService || !this.deliveryInfo) return; // Service has address (destination) but not need transportation type and delivery!
      /*  console.log(
        "%cautoSelectTransportationType: START",
        "background: #0097A7; color: #fff"
      );*/

      // Return if delivery type selected and valid (exist in acceptable transportations)
      console.log(
        "autoSelectTransportationType | autoSelectTransportationType > type: ",
        this.deliveryInfo.type,
      );
      if (this.deliveryInfo.type) {
        const found = this.transportations?.find(
          (it) => it.type === this.deliveryInfo.type,
        );
        if (found) {
          this.$emit("update:transportation", found);
          /* console.log(
            "autoSelectTransportationType",
            "Found transportation : ",
            found
          );*/
          return;
        }
      }

      if (!this.transportations?.length) {
        //console.log("autoSelectTransportationType", "transportations is null!");

        this.$emit("update:transportation", null);
        return null;
      }

      // Do not auto select pickup!
      const eligible_transportations = this.transportations?.filter(
        (x) => x.type !== "Pickup",
      );

      if (eligible_transportations.length) {
        this.$emit("update:transportation", eligible_transportations[0]);

        console.log(
          "%cautoSelectTransportationType: SELECT :::" +
            this.transportation?.type,
          "background: #0097A7; color: #fff",
        );
      }
    },

    setBasketConfig() {
      this.$emit("set-basket-config");
    },
  },
});
</script>

<style scoped lang="scss"></style>
