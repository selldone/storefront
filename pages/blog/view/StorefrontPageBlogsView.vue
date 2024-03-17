<!--
  - Copyright (c) 2023-2024. Selldone® Business OS™
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
  <v-card
    class="s--shop-card s--shadow-with-padding"
    style="margin-bottom: 20vh"
  >
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <slot name="header"></slot>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-toolbar color="transparent" flat>
      <u-button-circle
        :icon="$t('icons.arrow_back')"
        :to="{ name: 'Blogs' }"
        :tooltip="$t('global.actions.back')"
      />
    </v-toolbar>

    <article-viewer
      :article-type="article_type.code"
      :shop="getShop()"
      :shop-id="getShop().id"
      :target-id="$route.params.blog_id"
      auto-page-title
      class="blog-container p-3"
      show-comments
      show-user-feedback-buttons
    >
      <template v-slot:tags="{ article }">
        <v-btn
          v-for="tag in article.tags"
          :key="tag"
          :to="{
            name: window.$storefront.routes.BLOGS_PAGE,
            query: { tags: tag },
          }"
          class="m-1"
          color="blue"
          rounded
          variant="text"
        >
          {{ tag }}
        </v-btn>
      </template>
      <template v-slot:login>
        <!-- Shop Login -->
        <s-shop-login  class="mt-16 rounded-16px"></s-shop-login>
      </template>
    </article-viewer>

    <div style="min-height: 5vh"></div>
  </v-card>
</template>

<script>
import { ArticleTypes } from "@core/enums/article/ArticleTypes";
import ArticleViewer from "@components/article/ArticleViewer.vue";
import SShopLogin from "@components/storefront/login/SShopLogin.vue";

export default {
  name: "StorefrontPageBlogsView",

  components: {
    SShopLogin,
    ArticleViewer,
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    article_type: ArticleTypes.Blog,
  }),
};
</script>

<style scoped></style>
