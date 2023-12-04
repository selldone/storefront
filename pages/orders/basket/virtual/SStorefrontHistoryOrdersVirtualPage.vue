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
  <s-storefront-orders-list :type="ProductType.VIRTUAL">
  </s-storefront-orders-list>
</template>

<script>
import { VirtualOrderStates } from "@core/enums/basket/VirtualOrderStates";
import { ProductType } from "@core/enums/product/ProductType";
import SStorefrontOrdersList from "../../SStorefrontOrdersList.vue";

export default {
  name: "SStorefrontHistoryOrdersVirtualPage",
  components: { SStorefrontOrdersList },
  props: {},

  data: () => ({
    ProductType: ProductType,

    virtualOrderStates: VirtualOrderStates,

    orders: [],

    busy_fetch: false,

    // Pagination:
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    totalItems: 0,
    options: {},
  }),

  computed: {
    headers() {
      return [];
    },
  },

  watch: {},
  created() {},

  methods: {},
};
</script>

<style scoped lang="scss"></style>
