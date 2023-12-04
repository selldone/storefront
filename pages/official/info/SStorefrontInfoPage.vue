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
  <s-storefront-primary-footer
    v-if="isMobile"
    :shop="shop"
  ></s-storefront-primary-footer>
</template>

<script>
import SStorefrontPrimaryFooter from "@components/storefront/footer/SStorefrontPrimaryFooter.vue";
export default {
  name: "SStorefrontInfoPage",
  components: { SStorefrontPrimaryFooter },
  props: {
    shop: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
