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
  <div class="insta-card">
    <instagram-view
      v-if="instagram"
      :shop="shop"
      :instagram="instagram"
    ></instagram-view>
    <v-container v-else> Not exist! </v-container>
  </div>
</template>

<script>
import InstagramView from "@components/storefront/instagram/InstagramView.vue";
export default {
  name: "SStorefrontInstagramPage",
  components: { InstagramView },

  computed: {
    shop() {
      return this.getShop();
    },
    instagram() {
      return this.shop.instagram;
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.insta-card {
  background-color: #fafafa;
  border-top: 1px solid #dee2e6;

  @media only screen and (min-width: 1720px) {
    //background-color: #fff;
    border-top: none;
    border-radius: 24px;
  }
}
</style>
