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
  <v-autocomplete
    v-model:search="search"
    :customFilter="() => true"
    :disabled="disabled || IS_VENDOR_PANEL"
    :items="pricings"
    :loading="busy"
    :messages="
      selected_pricing?.description ? selected_pricing?.description : undefined
    "
    :model-value="modelValue"
    :return-object="false"
    :variant="variant"
    clearable
    item-title="title"
    item-value="id"
    label="Pricing model"
    persistent-placeholder
    placeholder="Select a pricing model ... (opt)"
    @update:model-value="
      (val) => {
        $emit('update:modelValue', val);
      }
    "
    @click:clear="
      $emit('click:clear');
      getPricings();
    "
  >
    <template v-slot:selection="{}">
      <template v-if="selected_pricing">
        <b>{{ selected_pricing.title }}</b>

        <b class="mx-2">{{ selected_pricing.commission }}%</b>
      </template>
      <small v-else-if="modelValue">Loading...</small>
    </template>

    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props">
        <template v-slot:title>
          <v-row align="center" no-gutters>
            {{ item.raw.title }}
            <v-spacer></v-spacer>
            <b class="mx-2">{{ item.raw.commission }}%</b>
          </v-row>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import _ from "lodash-es";

export default {
  name: "VPricingInput",
  components: {},
  emits: ["update:modelValue", "click:clear"],
  props: {
    shop: {
      require: true,
      type: Object,
    },

    modelValue: {},
    defaultPricing: {}, // Default value object

    disabled: {
      default: false,
      type: Boolean,
    },

    variant: {
      default: "underlined",
    },
  },

  data() {
    return {
      // Pricings:
      pricings: [],
      total: false,

      busy: false,
      search: null,
    };
  },

  computed: {
    IS_VENDOR_PANEL() {
      /*🟢 Vendor Panel 🟢*/
      return (
        this.$route.params.vendor_id &&
        this.$route.matched.some((record) => record.meta.vendor)
      );
    },

    selected_pricing() {
      let out = this.pricings.find((vendor) => vendor.id === this.modelValue);
      if (!out && this.modelValue) return this.defaultPricing; // Return default value object
      return out;
    },
  },

  watch: {
    search: _.throttle(function (newVal, oldVal) {
      if (!newVal && !oldVal) return;
      this.getPricings();
    }, window.SERACH_THROTTLE),

    selected_pricing(val) {
      this.$emit("update:defaultPricing", val);
    },
  },

  created() {
    if (!this.IS_VENDOR_PANEL) {
      // Just marketplace has access to list of vendors!
      this.getPricings();
    }
  },

  methods: {
    getPricings() {
      this.busy = true;
      axios
        .get(window.API.GET_SHOP_VENDOR_PRICINGS(this.shop.id), {
          params: {
            // Must contain this id:
            contain:
              this.modelValue && this.isObject(this.modelValue)
                ? this.modelValue.id
                : this.modelValue,
            search: this.search,

            offset: 0,
            count: 20,
          },
        })
        .then(({ data }) => {
          this.pricings = data.pricings;
          this.total = data.total;
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
