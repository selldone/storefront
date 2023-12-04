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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="s--shop-card s--shadow-with-padding text-start px-2"
    style="margin-bottom: 20vh"
  >
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <slot name="header"></slot>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <s-progress-loading v-if="busy"></s-progress-loading>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Header ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-toolbar flat>
      <v-btn
        v-if="
          current_author || current_author_id || current_category || current_tag
        "
        text
        :to="to_home"
        class="flipInX"
        exact
        ><v-icon class="me-1">{{ $t("icons.arrow_back") }}</v-icon>
        {{ $t("global.actions.back") }}</v-btn
      >

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        append-icon="search"
        single-line
        solo
        flat
        hide-details
        clearable
        class="max-width-field-mini"
        :placeholder="$t('global.commons.search')"
      >
      </v-text-field>
    </v-toolbar>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-expand-transition>
      <v-container v-show="!in_search_mode" v-if="loaded_data" fluid>
        <v-row>
          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Last article ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col cols="12" sm="5" md="4">
            <router-link
              v-if="latest_article"
              :to="{
                name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                params: {
                  blog_id: latest_article.parent_id,
                  slug: latest_article.slug,
                },
              }"
              class="black--text"
              exact
            >
              <img
                :src="getShopImagePath(latest_article.image)"
                :alt="latest_article.title"
                width="100%"
                height="auto"
                class="rounded fadeIn"
              />
              <s-blog-user-category-view
                v-if="latest_article.parent"
                :user="latest_article.user"
                :categories="categories"
                :category-name="latest_article.parent.category_id"
                class="mt-4"
              ></s-blog-user-category-view>

              <h2 class="my-2 font-weight-black fadeInUp delay_200">
                {{ latest_article.title }}
              </h2>
              <p class="normal-text fadeInUp delay_300">
                {{ latest_article.description }}
              </p>
            </router-link>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Last 4 articles ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col cols="12" sm="7" md="4" class="px-0 px-sm-1 px-md-2 px-lg-3">
            <v-list>
              <v-list-item
                v-for="(article, i) in latest4_articles"
                :key="article.id"
                :to="{
                  name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                  params: { blog_id: article.parent_id, slug: article.slug },
                }"
                exact
                style="min-height: 136px"
                class="fadeInUp"
                :style="{ 'animation-delay': i * 100 + 'ms' }"
              >
                <v-list-item-avatar rounded size="100">
                  <img
                    :src="getShopImagePath(article.image, IMAGE_SIZE_BLOG)"
                    :alt="article.title"
                    style="object-fit: cover"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle>
                    <s-blog-user-category-view
                      :user="article.user"
                      :categories="categories"
                      :category-name="article.parent.category_id"
                    ></s-blog-user-category-view>
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <h2
                      class="my-1 font-weight-black line-height-normal font-size-16px"
                      style="white-space: normal; min-height: 50px"
                    >
                      {{ article.title }}
                    </h2>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-0">{{
                    getLocalTimeString(article.updated_at, true, false, true)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Categories ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <!-- Stared Categories -->
          <v-col cols="12" sm="12" md="4" class="d-flex flex-column">
            <p class="font-weight-bold">
              <v-icon class="me-1" small>photo_filter</v-icon>
              {{ $t("blogs.topics") }}
            </p>

            <!-- Current Category Page View -->

            <v-expand-transition>
              <div v-if="categoryObj" class="text-center position-relative">
                <v-btn icon :to="to_home" class="absolute-top-end" exact
                  ><v-icon>close</v-icon></v-btn
                >
                <v-avatar :size="64" class="zoomIn" rounded>
                  <img :src="getShopImagePath(categoryObj.icon)" />
                </v-avatar>
                <b class="d-block fadeInUp delay_200 mt-1"
                  >{{ categoryObj.category }}
                </b>
                <p class="my-2 fadeInUp delay_300">
                  {{ categoryObj.description }}
                </p>
              </div>
            </v-expand-transition>
            <!-- Current Author Page View -->
            <v-expand-transition>
              <div v-if="authorObj" class="text-center position-relative">
                <v-btn icon :to="to_home" class="absolute-top-end" exact
                  ><v-icon>close</v-icon></v-btn
                >
                <v-avatar :size="64" class="zoomIn">
                  <img :src="getUserAvatar(authorObj.id)" />
                </v-avatar>
                <b class="d-block fadeInUp delay_200 mt-1"
                  >{{ authorObj.name }}
                </b>
              </div>
            </v-expand-transition>

            <v-list class="border-between-vertical flex-grow-1">
              <v-list-item
                v-for="(category, i) in stared_categories"
                :key="category.category"
                :to="{
                  name: window.$storefront.routes.BLOGS_PAGE,
                  query: {
                    page: 1,
                    category: category.id,
                    scroll: false,
                  },
                }"
                exact
                class="flipInX"
                :style="{ 'animation-delay': 500 + i * 100 + 'ms' }"
              >
                <v-list-item-avatar rounded>
                  <img
                    v-if="category.icon"
                    :src="getShopImagePath(category.icon)"
                    :alt="category.category"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold list-item-bold line-height-normal"
                    style="white-space: normal"
                  >
                    {{ category.category }}
                    <small class="float-end">
                      {{ category.articles }}
                      {{ $t("global.commons.articles") }}</small
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    category.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <div v-if="category_pages > 1">
              <v-btn
                @click="category_page--"
                :disabled="category_page === 1"
                small
                icon
                class="fadeIn delay_2s"
                ><v-icon small>north</v-icon></v-btn
              >
              <v-btn
                @click="category_page++"
                :disabled="category_page === category_pages"
                small
                icon
                class="fadeIn delay_2s"
                ><v-icon small>south</v-icon></v-btn
              >
            </div>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Trends ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" small>trending_up</v-icon>
              {{ $t("blogs.popular") }}
            </p>
          </v-col>

          <v-col
            v-for="(article, index) in popular"
            :key="article.id"
            cols="12"
            sm="6"
            md="4"
            class="p-0 p-sm-1 p-md-2 p-lg-3 slideInUp"
            :style="{ 'animation-delay': index * 100 + 'ms' }"
          >
            <v-list-item
              :to="{
                name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                params: { blog_id: article.parent_id, slug: article.slug },
              }"
              exact
            >
              <v-list-item-avatar
                class="display-1 op-0-2 not-selectable font-weight-black"
              >
                {{ index + 1 }}
              </v-list-item-avatar>

              <v-list-item-content>
                <s-blog-user-category-view
                  :user="article.user"
                  :categories="categories"
                  :category-name="
                    article.parent ? article.parent.category_id : null
                  "
                ></s-blog-user-category-view>
                <v-list-item-title
                  class="font-weight-bold list-item-bold line-height-normal my-1"
                  style="white-space: normal; min-height: 40px"
                >
                  {{ article.title }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  getLocalTimeString(article.updated_at, true, false, true)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Interest ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col v-if="show_interested_blogs" cols="12">
            <hr />
            <p class="font-weight-bold fadeIn delay_500">
              <v-icon class="me-1" small>assistant</v-icon>
              {{ $t("blogs.suggestions") }}
            </p>
          </v-col>

          <v-col
            v-if="show_interested_blogs"
            cols="12"
            class="fadeInUp delay_1s"
          >
            <v-carousel
              light
              hide-delimiter-background
              show-arrows-on-hover
              cycle
              :interval="8000 * chunk_size"
              height="600px"
            >
              <v-carousel-item v-for="(chunk, i) in chunks" :key="i">
                <v-container fluid style="padding-top: 32px">
                  <v-row class="fill-height" align="stretch" justify="center">
                    <v-col
                      v-for="article in chunk"
                      :key="article.id"
                      cols="12"
                      sm="6"
                      md="4"
                      lg="3"
                    >
                      <s-shop-blog-card
                        :article="article"
                        :categories="categories"
                      ></s-shop-blog-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Skeleton Loader ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <v-container v-show="!in_search_mode" v-else fluid class="mt-16">
        <v-row>
          <!-- Last article -->
          <v-col cols="12" sm="6" md="4">
            <v-skeleton-loader
              class="mx-auto"
              type="card, text@3"
            ></v-skeleton-loader>
          </v-col>

          <!-- Last 4 articles -->

          <v-col cols="12" sm="6" md="4">
            <v-skeleton-loader
              v-for="i in 4"
              :key="i"
              type="list-item-three-line"
            ></v-skeleton-loader>
          </v-col>
          <!-- Stared Categories -->
          <v-col cols="12" sm="12" md="4">
            <p class="font-weight-bold">
              <v-icon class="me-1" small>photo_filter</v-icon>
              {{ $t("blogs.topics") }}
            </p>

            <v-skeleton-loader
              v-for="i in 3"
              :key="i"
              type="list-item-avatar,list-item-two-line"
            ></v-skeleton-loader>
          </v-col>

          <!-- Trends -->

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" small>trending_up</v-icon>
              {{ $t("blogs.popular") }}
            </p>
          </v-col>

          <v-col v-for="index in 9" :key="index" cols="12" sm="6" md="4">
            <v-skeleton-loader
              type="image"
              width="100%"
              height="100"
            ></v-skeleton-loader>
          </v-col>

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" small>school</v-icon>
              {{ $t("blogs.title") }}
            </p>
          </v-col>

          <v-col
            v-for="j in $vuetify.breakpoint.smAndDown
              ? 2
              : $vuetify.breakpoint.md
              ? 3
              : 4"
            :key="'j' + j"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </v-expand-transition>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Articles list ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-container v-if="articles.length > 0" fluid>
      <hr class="my-16" />
      <p class="font-weight-bold fadeIn delay_500">
        <v-icon class="me-1" small>school</v-icon>
        {{ $t("blogs.title") }}
      </p>

      <v-row id="first" justify="center" align="start">
        <v-col cols="12" lg="8" xl="9" :order="1" :order-md="2" class="p-0">
          <v-data-iterator
            :items="articles"
            :search="search"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            hide-default-footer
            :server-items-length="totalItems"
            :options.sync="options"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            :no-data-text="$t('global.commons.no_data')"
          >
            <template v-slot:header> </template>

            <template v-slot:default="props">
              <v-list>
                <v-list-item
                  v-for="article in props.items"
                  :key="article.id"
                  :to="{
                    name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                    params: { blog_id: article.parent_id, slug: article.slug },
                  }"
                  exact
                  style="min-height: 136px"
                  class="article-card-extra"
                  :class="{
                    'is-draft': !article.published && !article.schedule_at,
                    'is-private': article.published && article.private,
                    'is-schedule-at': !article.published && article.schedule_at,
                  }"
                  :caption="
                    article.schedule_at
                      ? getFromNowString(article.schedule_at)
                      : null
                  "
                >
                  <v-list-item-avatar
                    rounded
                    :width="$vuetify.breakpoint.smAndDown ? 100 : 200"
                    :height="$vuetify.breakpoint.smAndDown ? 100 : 137"
                  >
                    <img
                      :src="getShopImagePath(article.image, IMAGE_SIZE_BLOG)"
                      :alt="article.title"
                      style="object-fit: cover"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      <s-blog-user-category-view
                        v-if="article.parent"
                        :user="article.user"
                        :categories="categories"
                        :category-name="article.parent.category_id"
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

                    <v-list-item-subtitle class="mt-2">{{
                      getLocalTimeString(article.updated_at, true, false, true)
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>

            <template v-slot:footer>
              <div class="text-center pt-2 mt-3">
                <v-pagination
                  :value="page"
                  circle
                  :length="pageCount"
                  @input="
                    (val) => {
                      page = val;
                      $router.replace({
                        query: { page: val, 'no-scroll': true, scroll: true },
                      });
                    }
                  "
                />
              </div>
            </template>
          </v-data-iterator>
        </v-col>
      </v-row>
    </v-container>

    <div style="min-height: 5vh"></div>
  </v-card>
</template>

<script>
import SShopBlogCard from "@components/storefront/blog/SShopBlogCard.vue";
import SBlogUserCategoryView from "@components/storefront/blog/SBlogUserCategoryView.vue";
import _ from "lodash-es";

export default {
  name: "SStorefrontBlogsPage",
  components: {
    SBlogUserCategoryView,
    SShopBlogCard,
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    to_home: {
      name: window.$storefront.routes.BLOGS_PAGE,
      query: {
        page: 1,
        category: undefined,
        author: undefined,
        author_id: undefined,
        search: undefined,
        scroll: false,
        tags: undefined,
      },
    },

    //----------------------------------

    articles: [],
    last_articles: [],
    popular: [],
    categories: [],
    interest: [],
    //----------------------------------

    busy: false,

    search: "",
    filter: {},
    sortDesc: true,
    sortBy: null,

    // Pagination:
    page: 1,
    pageCount: 0,
    itemsPerPage: 12,
    totalItems: 0,
    options: { sortDesc: [true] },

    //---------------------------
    first_start: true,
    category_old: null,
    author_old: null,
    author_id_old: null,
    tag_old: null,

    loaded_data: false,

    //----------------------------------

    category_page: 1,
  }),
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Computed
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {

    // ......................... Headline .........................

    latest_article() {
      return this.last_articles[0];
    },
    latest4_articles() {
      return this.last_articles.slice(1, 5);
    },
    // ......................... Categories .........................

    stared_categories() {
      return this.categories
        .filter((it) => it.star)
        .slice((this.category_page - 1) * 8, this.category_page * 8);
    },
    category_pages() {
      return Math.ceil(this.categories.length / 8);
    },

    // ......................... Query values .........................
    current_category() {
      return this.$route.query.category;
    },
    current_author_id() {
      return this.$route.params.author_id;
    },
    current_author() {
      return this.$route.params.author;
    },
    current_tag() {
      return this.$route.query.tags;
    },
    // .................................................................

    in_search_mode() {
      return this.search;
    },

    show_interested_blogs() {
      return this.chunks.length > 0;
      /*  return (
              !this.current_category &&
              !this.current_author_id &&
              !this.current_author
      );*/
    },

    // ......................... Category page mode .........................

    categoryObj() {
      return this.categories.find(
        (it) => "" + it.id === "" + this.current_category
      );
    },
    // ......................... Author page mode .........................

    authorObj() {
      return (
        (this.current_author_id || this.current_author) &&
        this.blogs &&
        this.blogs.length &&
        this.blogs[0].article.user
      );
    },

    // ......................... Interest .........................

    chunk_size() {
      return this.$vuetify.breakpoint.lgAndUp
        ? 4
        : this.$vuetify.breakpoint.mdAndUp
        ? 3
        : this.$vuetify.breakpoint.smAndUp
        ? 2
        : 1;
    },

    loops() {
      return Math.ceil(this.interest.length / this.chunk_size);
    },
    chunks() {
      const out = [];
      for (let i = 0; i < this.loops; i++) {
        out.push(
          this.interest.slice(i * this.chunk_size, (i + 1) * this.chunk_size)
        );
      }
      return out;
    },
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  watch: {
    "$route.query"(query) {
      // Set page by query if exist:
      this.page = parseInt(this.$route.query.page ? this.$route.query.page : 1);
      this.search = this.$route.query.search ? this.$route.query.search : "";

      this.fetchBlogs(
        this.page,
        query.scroll === true || query.scroll === "true"
      );
    },

    search: _.throttle(function () {
      this.fetchBlogs(1, false);
    }, window.SERACH_THROTTLE),
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  created() {
    // Set page by query if exist:
    this.page = parseInt(this.$route.query.page ? this.$route.query.page : 1);
    this.search = this.$route.query.search ? this.$route.query.search : "";

    this.fetchBlogs(this.page, false);

    this.first_start = false;
  },
  mounted() {},
  destroyed() {},

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Methods
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  methods: {
    fetchBlogs(page, scroll = true) {
      // Each category and author page has its publication full page!
      const need_extra =
        this.first_start ||
        this.category_old !== this.current_category ||
        this.author_old !== this.current_author ||
        this.author_id_old !== this.current_author_id ||
        this.tag_old !== this.current_tag;
      this.busy = true;

      //const t = this;
      axios
        .get(window.XAPI.GET_SHOP_BLOGS(this.shop_name), {
          params: {
            extra: need_extra, // Load full data (latest, popular & ...)

            category: this.current_category,
            author: this.current_author,
            author_id: this.current_author_id,

            tags: this.current_tag ? [this.current_tag] : undefined,

            offset: (page - 1) * this.itemsPerPage,
            limit: this.itemsPerPage,
            //sortBy: sortBy,
            //  sortDesc: sortDesc,
            search: this.search,
          },
        })
        .then(({ data }) => {
          if (data.error) {
            this.showErrorAlert(null, data.error_msg);
            return;
          }
          this.loaded_data = true;

          this.articles = data.articles;

          if (data.last_articles) this.last_articles = data.last_articles;

          if (data.popular) this.popular = data.popular;

          if (data.categories) this.categories = data.categories;

          if (data.interest) this.interest = data.interest;

          this.totalItems = data.total;
          this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage); //set by event not work!!!
        })
        .catch((error) => {
          this.showLaravelError(error);
        })

        .finally(() => {
          this.busy = false;
          if (scroll)
            this.$vuetify.goTo("#first", {
              duration: 800,
              offset: 200,
              easing: "easeInOutQuad",
            });
        });

      this.category_old = this.current_category;
      this.author_old = this.current_author;
      this.author_id_old = this.current_author_id;
      this.tag_old = this.current_tag;
    },
  },
};
</script>
