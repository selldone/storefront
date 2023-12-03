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
  <div />
</template>

<script>
export default {
  name: "SStorefrontLoginRedirect",
  created() {
    let path = sessionStorage.getItem("after-login-path");

    if (path) {
      sessionStorage.removeItem("after-login-path");
      this.$router.push({ path: path });
    } else {
      this.$router.push({ name: window.$storefront.routes.SHOP_PAGE });
    }
  },
};
</script>

<style scoped></style>
