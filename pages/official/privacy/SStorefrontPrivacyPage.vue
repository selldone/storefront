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
    <v-container>
      <h1 class="text-start display-3 font-weight-black text-capitalize">
        {{ $t("official_pages.privacy") }}
      </h1>
      <s-progress-loading v-if="busy"></s-progress-loading>

      <div class="text-start px-lg-5 px-md-4 px-3 master-article-container">
        <s-article-editor
          v-if="profile"
          class="p-lg-5 p-md-4 p-3 article"
          :only-view="true"
          :edit="false"
          :body="profile.body"
          :enableTitle="false"
        />
      </div>

      <s-storefront-cookie-preferences
        :shop="shop"
        class="s--shadow-no-padding text-start my-16"
      ></s-storefront-cookie-preferences>
    </v-container>
  </div>
</template>

<script>
import SArticleEditor from "@components/article/SArticleEditor.vue";
import SStorefrontCookiePreferences from "@components/storefront/cookie/SStorefrontCookiePreferences.vue";
export default {
  name: "SStorefrontPrivacyPage",
  components: { SStorefrontCookiePreferences, SArticleEditor },
  data: () => ({
    state: "editing",
    profile: null,
    busy: false,
  }),
  computed: {
    shop() {
      return this.getShop();
    },
  },
  watch: {},
  created() {
    this.setPageTitle("Privacy"); // Set Page Title!

    this.fetchProfile();
  },
  methods: {
    fetchProfile() {
      this.busy = true;

      axios
        .get(window.XAPI.GET_SHOP_PROFILE(this.shop_name, "privacy"))
        .then(({ data }) => {
          if (data.error) return this.showErrorAlert(null, data.error_msg);
          this.profile = data.profile;
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style scoped></style>
