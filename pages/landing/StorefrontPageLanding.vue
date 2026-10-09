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
  <landing-render :key="$route.fullPath" @onFetch:data="updatePageSeo">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <template v-slot:header>
      <slot name="header"></slot>
    </template>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
  </landing-render>
</template>

<script lang="ts">
import LandingRender from "@selldone/page-builder/LandingRender.vue";
import {StorefrontSeo} from "../../helpers/StorefrontSeo";

export default {
  name: "StorefrontPageLanding",
  components: { LandingRender },
  inject: ["$shop"],
  data: () => ({
    seoNavigation: StorefrontSeo.captureNavigation(),
  }),
  watch: {
    "$route.fullPath"() {
      this.seoNavigation = StorefrontSeo.captureNavigation();
    },
  },
  methods: {
    updatePageSeo(data) {
      StorefrontSeo.updatePage(data.page, this.$shop, this.seoNavigation, data);
    },
  },
};
</script>

<style lang="scss" scoped></style>
