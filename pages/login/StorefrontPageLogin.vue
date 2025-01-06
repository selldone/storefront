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
<div>

  <v-card class="mx-auto my-5" variant="outlined" rounded="xl" max-width="640" :loading="busy_user || user" :class="{disabled:busy_user || user}">
    <s-shop-login></s-shop-login>
  </v-card>
</div>
</template>

<script lang="ts">
import LandingRender from "@selldone/page-builder/LandingRender.vue";
import SShopLogin from "@selldone/components-vue/storefront/login/SShopLogin.vue";
import {StorefrontRoutesName} from "@selldone/core-js/enums/route/StorefrontRoutesName.ts";

export default {
  name: "StorefrontPageLogin",
  components: {SShopLogin, LandingRender },

  computed: {
user(){
  return this.USER()
},
    busy_user() {
      return this.$store.getters.getBusyUser;
    },

  },
  watch: {
    user(user){
      if(user){
        this.$router.push({name: StorefrontRoutesName.USER_PROFILE_PAGE});
      }
    }
  },
  created() {
    if(this.user){
      this.$router.push({name: StorefrontRoutesName.USER_PROFILE_PAGE});
    }
  },
};
</script>

<style lang="scss" scoped></style>
