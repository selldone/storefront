<!--
  - Copyright (c) 2024. Selldone® Business OS™
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
  <v-list-item
    :caption="
      article.schedule_at ? getFromNowString(article.schedule_at) : null
    "
    :class="{
      'is-draft': !article.published && !article.schedule_at,
      'is-private': article.published && article.private,
      'is-schedule-at': !article.published && article.schedule_at,
    }"
    :to="{
      name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
      params: { blog_id: article.parent_id, slug: article.slug },
    }"
    class="article-card-extra"
    exact
    style="min-height: 136px"
  >
    <template v-slot:prepend>
      <v-img
        :height="$vuetify.display.smAndDown ? 100 : 137"
        :width="$vuetify.display.smAndDown ? 100 : 200"
        rounded="lg"
        cover
        class="me-3"
        :alt="article.title"
        :src="getShopImagePath(article.image, IMAGE_SIZE_BLOG)"
      >
      </v-img>
    </template>

    <v-list-item-subtitle class="op-1-0">
      <s-blog-user-category-view
        v-if="article.parent"
        :categories="categories"
        :category-name="article.parent.category_id"
        :user="article.user"
      ></s-blog-user-category-view>
    </v-list-item-subtitle>
    <v-list-item-title>
      <h2
        class="my-1 font-weight-black line-height-normal font-size-16px"
        style="white-space: normal"
      >
        {{ article.title }}
      </h2>
    </v-list-item-title>
    <v-list-item-subtitle class="normal-text hide-on-small-900">
      {{ article.description }}
    </v-list-item-subtitle>

    <v-list-item-subtitle class="mt-2"
      >{{ getLocalTimeString(article.updated_at, true, false, true) }}
    </v-list-item-subtitle>
  </v-list-item>
</template>
<script>
import { defineComponent } from "vue";
import SBlogUserCategoryView from "@components/storefront/blog/SBlogUserCategoryView.vue";

export default defineComponent({
  name: "SBlogRow",
  components: { SBlogUserCategoryView },
  props: {
    article: {
      type: Object,
      require: true,
    },
    categories: {
      type: Array,
    },
  },
});
</script>

<style scoped lang="scss"></style>
