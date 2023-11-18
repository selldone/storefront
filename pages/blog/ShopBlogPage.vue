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
  <v-card class="s--shop-card s--shadow-with-padding" style="margin-bottom: 20vh">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <slot name="header"></slot>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-toolbar flat color="transparent">
      <circle-button
        :icon="$t('icons.arrow_back')"
        :tooltip="$t('global.actions.back')"
        :to="{ name: 'Blogs' }"
      />
    </v-toolbar>

    <s-article-view
      :shop="getShop()"
      class="blog-container p-3"
      :article-type="article_type.code"
      :target-id="$route.params.blog_id"
      show-comments
      show-user-feedback-buttons
      auto-page-title
      :shop-id="getShop().id"
    >
      <template v-slot:tags="{ article }">
        <v-btn
          v-for="tag in article.tags"
          :key="tag"
          color="blue"
          class="m-1"
          rounded
          text
          link
          :to="{ name: 'Blogs', query: { tags: tag } }"
        >
          {{ tag }}
        </v-btn>
      </template>
    </s-article-view>

    <div style="min-height: 5vh"></div>
  </v-card>
</template>

<script>
import { ArticleTypes } from "@core/enums/article/ArticleTypes";
import SArticleView from "@components/article/SArticleView.vue";
import CircleButton from "@components/ui/button/CircleButton.vue";

export default {
  name: "ShopBlogPage",
  components: {
    CircleButton,
    SArticleView,
  },
  data: () => ({
    article_type: ArticleTypes.Blog,
  }),
};
</script>

<style scoped></style>
