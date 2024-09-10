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

  <div v-if="has_pickup">
    <div class="font-weight-bold mt-5">
      <template v-if="selectedPickup?.address">
        <v-icon class="me-1 zoomIn" color="success" size="small"
          >check_circle
        </v-icon>
        {{$t('global.commons.pickup_selected')}}
      </template>
      <template v-else
        >{{$t('global.commons.pickup_options')}}
        <v-icon class="ms-1" size="small">expand_more</v-icon>
      </template>
    </div>

    <v-list
      class="border-between-vertical bg-transparent overflow-visible"
      lines="three"
    >
      <v-list-item
        v-for="(pickup, i) in pickups"
        :key="i"
        class="row-hover pp"
        @click="selectPickup(pickup)"
        lines="two"
      >
        <template v-slot:prepend>
          <v-list-item-action start>
            <v-icon
              v-if="
                selectedPickup?.address && selectedPickup?.address === pickup.address
              "
              color="info"
              >circle
            </v-icon>
            <v-icon v-else :color="light_checkout ? '#333' : '#fafafa'"
              >radio_button_unchecked
            </v-icon>
          </v-list-item-action>
        </template>

        <v-list-item-title class="text-wrap text-subtitle-2">
          <flag
            v-if="pickup.country"
            :iso="pickup.country"
            :squared="false"
            class="me-1"
          />
          {{
            pickup.address
              ? generateFullAddress(pickup)
              : $t("global.commons.empty")
          }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon class="me-1" size="x-small"> phone</v-icon>
          {{ pickup.phone ? pickup.phone : $t("global.commons.empty") }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ShopTransportations } from "@selldone/core-js/enums/logistic/ShopTransportations.ts";
import { ProductType } from "@selldone/core-js/enums/product/ProductType.ts";

export default defineComponent({
  name: "SCartShippingPickups",
  emits: ["pickupSelected"],
  inject: ["$shop"],
  props: {
    basket: {
      require: true,
      type: Object,
    },
    transportations: {
      require: true,
      type: Array,
    },
    selectedPickup:{
      type: Object,

    },

  },
  computed: {

    light_checkout() {
      return  this.$shop.theme?.light_checkout;
    },

    isPhysical() {
      return this.basket.type === ProductType.PHYSICAL.code;
    },

    pickup_transportation() {
      return (
        this.transportations &&
        this.transportations.find(
          (t) => t.type === ShopTransportations.Pickup.code,
        )
      );
    },

    pickups() {
      return this.pickup_transportation && this.pickup_transportation.pickups;
    },

    has_pickup() {
      return this.pickups && this.pickups.length && this.isPhysical;
    },

  },

  methods:{
    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ Pickup ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    selectPickup(pickup) {
      this.$emit('pickupSelected', {pickup:pickup,transportation:this.pickup_transportation});
    },
  }
});
</script>

<style scoped lang="scss"></style>
