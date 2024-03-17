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
      <h1 class="text-start text-h2 font-weight-black text-capitalize">
        {{ $t("official_pages.terms") }}
      </h1>
      <u-loading-progress v-if="busy"></u-loading-progress>

      <div class="text-start px-lg-5 px-md-4 px-3 master-article-container">
        <s-article-editor
          v-if="profile"
          :body="profile.body"
          :edit="false"
          :enable-title="false"
          :only-view="true"
          class="p-lg-5 p-md-4 p-3 article"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import SArticleEditor from "@components/article/SArticleEditor.vue";

export default {
  name: "StorefrontPageOfficialTerms",
  components: { SArticleEditor },
  data: () => ({
    state: "editing",
    profile: null,
    busy: false,
  }),
  watch: {},
  created() {
    this.setPageTitle("Terms of use"); // Set Page Title!

    this.fetchProfile();
  },
  methods: {
    fetchProfile() {
      this.busy = true;
      axios
        .get(window.XAPI.GET_SHOP_PROFILE(this.shop_name, "terms"))
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
