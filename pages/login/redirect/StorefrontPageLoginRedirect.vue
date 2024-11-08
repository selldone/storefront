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
  <div class="s--page-login-redirect">
    <div class="text-h1 font-weight-thin fadeInDown">
      {{ $t("login.welcome") }}
    </div>
    <div class="my-5 fadeIn delay_300" style="max-width: 420px; width: 100%">
      <v-progress-linear
        bg-color="#333"
        rounded
        rounded-bar
        :model-value="loadingProgress"
        height="3"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import { delay } from "lodash-es";

export default {
  name: "StorefrontPageLoginRedirect",

  data() {
    return {
      loadingProgress: 0, // Initialize loading progress
    };
  },

  computed: {},
  created() {
    // Increment the loading progress over 2 seconds
    const interval = setInterval(() => {
      if (this.loadingProgress >= 100) {
        clearInterval(interval); // Stop the interval once 100% is reached
      } else {
        this.loadingProgress += 50 / 2; // Increment to reach 100% in 2 seconds
      }
    }, 100); // Update every 100ms

    let path = sessionStorage.getItem("after-login-path");

    delay(() => {
      if (path) {
        sessionStorage.removeItem("after-login-path");
        this.$router.push({ path: path });
      } else {
        this.$router.push({ name: window.$storefront.routes.SHOP_PAGE });
      }
    }, 2000);
  },
};
</script>

<style scoped lang="scss">
.s--page-login-redirect {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8%;
  user-select: none;

  .text-h1 {
    color: #888;
  }
}
</style>
