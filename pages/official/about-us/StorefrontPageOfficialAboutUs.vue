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
        {{ $t("official_pages.about_us") }}
      </h1>
      <u-loading-progress v-if="busy"></u-loading-progress>

      <div class="text-start px-lg-5 px-md-4 px-3 master-article-container">
        <s-article-editor
          v-if="profile"
          :body="profile.body"
          :edit="false"
          :enableTitle="false"
          :only-view="true"
          class="p-lg-5 p-md-4 p-3 article"
        />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SArticleEditor from "@selldone/components-vue/article/SArticleEditor.vue";

export default {
  name: "StorefrontPageOfficialAboutUs",
  components: { SArticleEditor },
  inject: ["$shop"],
  data: () => ({
    profile: null,
    busy: false,
  }),

  computed: {},
  watch: {},
  created() {
    this.setPageTitle("About us"); // Set Page Title!

    this.fetchProfile();
  },

  methods: {
    fetchProfile() {
      this.busy = true;

      axios
        .get(window.XAPI.GET_SHOP_PROFILE(this.$shop.name, "about-us"))
        .then(({ data }) => {
          if (data.error) return NotificationService.showErrorAlert(null, data.error_msg);
          this.profile = data.profile;
        })
        .catch((error) => {
          NotificationService.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style scoped></style>
