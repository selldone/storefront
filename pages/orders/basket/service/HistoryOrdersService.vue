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
  <orders-history-list-template :type="ProductType.SERVICE">
  </orders-history-list-template>
</template>

<script>
import { ProductType } from "@core/enums/product/ProductType";
import OrdersHistoryListTemplate from "../../OrdersHistoryListTemplate.vue";

export default {
  name: "HistoryOrdersService",
  components: { OrdersHistoryListTemplate },
  props: {},

  data: function () {
    return {
      ProductType: ProductType,
    };
  },
  computed: {},

  watch: {},
  created() {},

  methods: {},
};
</script>
<style scoped lang="scss"></style>
