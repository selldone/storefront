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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="s--shop-card s--shadow-with-padding text-start px-2"
    style="margin-bottom: 20vh"
  >
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <slot name="header"></slot>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <u-loading-progress v-if="busy"></u-loading-progress>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Header ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-toolbar
      flat
      color="transparent"
      class="t-all-400"
      :height="in_search_mode ? 120 : 64"
    >
      <template v-if="!in_search_mode">
        <v-btn
          v-if="
            current_author ||
            current_author_id ||
            current_category ||
            current_tag
          "
          :to="to_home"
          class="flipInX"
          exact
          variant="text"
        >
          <v-icon class="me-1">{{ $t("icons.arrow_back") }}</v-icon>

          <v-avatar
            v-if="categoryObj"
            start
            class="zoomIn avatar-gradient -thin -category mx-1"
            size="24"
          >
            <img :src="getShopImagePath(categoryObj.icon)" />
          </v-avatar>

          {{ $t("global.actions.back") }}
        </v-btn>
      </template>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        :placeholder="$t('global.commons.search')"
        append-inner-icon="search"
        :class="{
          'max-width-field-mini': !in_search_mode,
          'max-width-field-large mt-12': in_search_mode,
        }"
        clearable
        :flat="!in_search_mode"
        hide-details
        single-line
        variant="solo"
        class="t-all-400"
        rounded="xl"
      >
        <template v-slot:prepend-inner>
          <v-slide-x-reverse-transition>
            <v-chip
              v-if="categoryObj && in_search_mode"
              class="me-2"
              variant="text"
              closable
              @click:close="current_category = null"
            >
              <v-avatar start class="zoomIn">
                <img :src="getShopImagePath(categoryObj.icon)" />
              </v-avatar>
              {{ categoryObj.category }}
            </v-chip>
          </v-slide-x-reverse-transition>
        </template>
      </v-text-field>
      <v-spacer v-if="in_search_mode"></v-spacer>
    </v-toolbar>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-expand-transition>
      <v-container v-if="loaded_data" v-show="!in_search_mode" fluid>
        <v-row>
          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Last article ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col cols="12" md="4" sm="5">
            <router-link
              v-if="latest_article"
              :to="{
                name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                params: {
                  blog_id: latest_article.parent_id,
                  slug: latest_article.slug,
                },
              }"
              class="text-black"
              exact
            >
              <img
                :alt="latest_article.title"
                :src="getShopImagePath(latest_article.image)"
                class="rounded fadeIn"
                height="auto"
                width="100%"
              />
              <s-blog-card-author-category
                v-if="latest_article.parent"
                :categories="categories"
                :category-name="latest_article.parent.category_id"
                :user="latest_article.user"
                class="mt-4"
              ></s-blog-card-author-category>

              <h2 class="my-2 font-weight-black fadeInUp delay_200">
                {{ latest_article.title }}
              </h2>
              <p class="normal-text fadeInUp delay_300">
                {{ latest_article.description }}
              </p>
            </router-link>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Last 4 articles ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col class="px-0 px-sm-1 px-md-2 px-lg-3" cols="12" md="4" sm="7">
            <v-list class="overflow-visible">
              <v-list-item
                v-for="(article, i) in latest4_articles"
                :key="article.id"
                :style="{ 'animation-delay': i * 100 + 'ms' }"
                :to="{
                  name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                  params: { blog_id: article.parent_id, slug: article.slug },
                }"
                class="fadeInUp rounded-xl"
                exact
                style="min-height: 136px"
              >
                <template v-slot:prepend>
                  <v-avatar rounded size="100">
                    <img
                      :alt="article.title"
                      :src="getShopImagePath(article.image, IMAGE_SIZE_BLOG)"
                      style="object-fit: cover"
                    />
                  </v-avatar>
                </template>

                <v-list-item-subtitle class="op-1-0">
                  <s-blog-card-author-category
                    :categories="categories"
                    :category-name="article.parent.category_id"
                    :user="article.user"
                  ></s-blog-card-author-category>
                </v-list-item-subtitle>
                <v-list-item-title>
                  <h2
                    class="my-1 font-weight-black line-height-normal font-size-16px"
                    style="white-space: normal; min-height: 50px"
                  >
                    {{ article.title }}
                  </h2>
                </v-list-item-title>
                <v-list-item-subtitle class="my-0"
                  >{{
                    getLocalTimeString(article.updated_at, true, false, true)
                  }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Headlines > Categories ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <!-- Stared Categories -->
          <v-col class="d-flex flex-column" cols="12" md="4" sm="12">
            <p class="font-weight-bold">
              <v-icon class="me-1" size="small">photo_filter</v-icon>
              {{ $t("blogs.topics") }}
            </p>

            <!-- Current Category Page View -->

            <v-expand-transition>
              <div v-if="categoryObj" class="text-center position-relative">
                <v-btn
                  :to="to_home"
                  class="absolute-top-end"
                  exact
                  icon
                  variant="text"
                >
                  <v-icon>close</v-icon>
                </v-btn>
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
                <v-btn
                  :to="to_home"
                  class="absolute-top-end"
                  exact
                  icon
                  variant="text"
                >
                  <v-icon>close</v-icon>
                </v-btn>
                <v-avatar :size="64" class="zoomIn">
                  <img :src="getUserAvatar(authorObj.id)" />
                </v-avatar>
                <b class="d-block fadeInUp delay_200 mt-1"
                  >{{ authorObj.name }}
                </b>
              </div>
            </v-expand-transition>

            <v-list
              class="border-between-vertical flex-grow-1 overflow-visible"
            >
              <v-list-item
                v-for="(category, i) in stared_categories"
                :key="category.category"
                :style="{ 'animation-delay': 500 + i * 100 + 'ms' }"
                :to="{
                  name: window.$storefront.routes.BLOGS_PAGE,
                  query: {
                    page: 1,
                    category: category.id,
                    scroll: false,
                  },
                }"
                class="flipInX"
                exact
              >
                <template v-slot:prepend>
                  <v-avatar rounded class="border">
                    <img
                      v-if="category.icon"
                      :alt="category.category"
                      :src="getShopImagePath(category.icon)"
                      class="x-small"
                    />
                  </v-avatar>
                </template>

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
                <v-list-item-subtitle
                  >{{ category.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-if="category_pages > 1">
              <v-btn
                :disabled="category_page === 1"
                class="fadeIn delay_2s"
                icon
                variant="text"
                size="small"
                @click="category_page--"
              >
                <v-icon size="small">north</v-icon>
              </v-btn>
              <v-btn
                :disabled="category_page === category_pages"
                class="fadeIn delay_2s"
                icon
                variant="text"
                size="small"
                @click="category_page++"
              >
                <v-icon size="small">south</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Trends ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" size="small">trending_up</v-icon>
              {{ $t("blogs.popular") }}
            </p>
          </v-col>

          <v-col
            v-for="(article, index) in popular"
            :key="article.id"
            :style="{ 'animation-delay': index * 100 + 'ms' }"
            class="p-0 p-sm-1 p-md-2 p-lg-3 slideInUp"
            cols="12"
            md="4"
            sm="6"
          >
            <v-list-item
              :to="{
                name: window.$storefront.routes.SHOP_BLOG_PAGE_SLUG,
                params: { blog_id: article.parent_id, slug: article.slug },
              }"
              exact
            >
              <template v-slot:prepend>
                <v-avatar
                  class="text-h4 op-0-2 not-selectable font-weight-black"
                >
                  {{ index + 1 }}
                </v-avatar>
              </template>

              <s-blog-card-author-category
                :categories="categories"
                :category-name="
                  article.parent ? article.parent.category_id : null
                "
                :user="article.user"
              ></s-blog-card-author-category>
              <v-list-item-title
                class="font-weight-bold list-item-bold line-height-normal my-1"
                style="white-space: normal; min-height: 40px"
              >
                {{ article.title }}
              </v-list-item-title>
              <v-list-item-subtitle
                >{{ getLocalTimeString(article.updated_at, true, false, true) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Interest ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

          <v-col v-if="show_interested_blogs" cols="12">
            <hr />
            <p class="font-weight-bold fadeIn delay_500">
              <v-icon class="me-1" size="small">assistant</v-icon>
              {{ $t("blogs.suggestions") }}
            </p>
          </v-col>

          <v-col
            v-if="show_interested_blogs"
            class="fadeInUp delay_1s"
            cols="12"
          >
            <v-carousel
              :interval="8000 * chunk_size"
              cycle
              height="600px"
              hide-delimiter-background
              show-arrows="hover"
            >
              <v-carousel-item v-for="(chunk, i) in chunks" :key="i">
                <v-container fluid style="padding-top: 32px">
                  <v-row align="stretch" class="fill-height" justify="center">
                    <v-col
                      v-for="article in chunk"
                      :key="article.id"
                      cols="12"
                      lg="3"
                      md="4"
                      sm="6"
                    >
                      <s-blog-card
                        :article="article"
                        :categories="categories"
                        rounded="xl"
                      ></s-blog-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Skeleton Loader ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <v-container v-else v-show="!in_search_mode" class="mt-16" fluid>
        <v-row>
          <!-- Last article -->
          <v-col cols="12" md="4" sm="6">
            <v-skeleton-loader
              class="mx-auto"
              :type="['card', 'text@3']"
            ></v-skeleton-loader>
          </v-col>

          <!-- Last 4 articles -->

          <v-col cols="12" md="4" sm="6">
            <v-skeleton-loader
              v-for="i in 4"
              :key="i"
              type="list-item-three-line"
            ></v-skeleton-loader>
          </v-col>
          <!-- Stared Categories -->
          <v-col cols="12" md="4" sm="12">
            <p class="font-weight-bold">
              <v-icon class="me-1" size="small">photo_filter</v-icon>
              {{ $t("blogs.topics") }}
            </p>

            <v-skeleton-loader
              v-for="i in 3"
              :key="i"
              :type="['list-item-avatar', 'list-item-two-line']"
            ></v-skeleton-loader>
          </v-col>

          <!-- Trends -->

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" size="small">trending_up</v-icon>
              {{ $t("blogs.popular") }}
            </p>
          </v-col>

          <v-col v-for="index in 9" :key="index" cols="12" md="4" sm="6">
            <v-skeleton-loader
              height="100"
              type="image"
              width="100%"
            ></v-skeleton-loader>
          </v-col>

          <v-col cols="12">
            <hr />
            <p class="font-weight-bold">
              <v-icon class="me-1" size="small">school</v-icon>
              {{ $t("blogs.title") }}
            </p>
          </v-col>

          <v-col
            v-for="j in $vuetify.display.smAndDown
              ? 2
              : $vuetify.display.md
                ? 3
                : 4"
            :key="'j' + j"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </v-expand-transition>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Articles list ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-container v-if="articles.length > 0" fluid>
      <template v-if="!in_search_mode">
        <hr class="my-16" />
        <p class="font-weight-bold fadeIn delay_500">
          <v-icon class="me-1" size="small">school</v-icon>
          {{ $t("blogs.title") }}
        </p>
      </template>

      <v-row id="first" align="start" justify="center">
        <v-col :order="1" :order-md="2" class="p-0" cols="12" lg="8" xl="9">
          <v-data-iterator
            :items="articles"
            :items-length="totalItems"
            :items-per-page="itemsPerPage"
            :no-data-text="$t('global.commons.no_data')"
            :search="search"
            hide-default-footer
            item-value="id"
          >
            <template v-slot:header></template>

            <template v-slot:default="props">
              <v-list>
                <s-blog-row
                  v-for="item in props.items"
                  :key="item.id"
                  :article="item.raw"
                  :categories="categories"
                >
                </s-blog-row>
              </v-list>
            </template>

            <template v-slot:bottom>
              <div class="text-center pt-2 mt-3">
                <v-pagination
                  :length="pageCount"
                  :model-value="page"
                  rounded
                  @update:model-value="
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
import SBlogCard from "@components/storefront/blog/card/SBlogCard.vue";
import SBlogCardAuthorCategory from "@components/storefront/blog/card/author-category/SBlogCardAuthorCategory.vue";
import _ from "lodash-es";
import ScrollHelper from "@core/utils/scroll/ScrollHelper";
import SBlogRow from "@app-storefront/components/blog/row/SBlogRow.vue";

export default {
  name: "StorefrontPageBlogsList",
  components: {
    SBlogRow,
    SBlogCardAuthorCategory,
    SBlogCard,
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
    sortBy: [{ key: null, order: "desc" }],

    // Pagination:
    page: 1,
    itemsPerPage: 12,
    totalItems: 0,
    options: {},

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
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
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
        (it) => "" + it.id === "" + this.current_category,
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
      return this.$vuetify.display.lgAndUp
        ? 4
        : this.$vuetify.display.mdAndUp
          ? 3
          : this.$vuetify.display.smAndUp
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
          this.interest.slice(i * this.chunk_size, (i + 1) * this.chunk_size),
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
        query.scroll === true || query.scroll === "true",
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
        })
        .catch((error) => {
          this.showLaravelError(error);
        })

        .finally(() => {
          this.busy = false;
          if (scroll) ScrollHelper.scrollToElement("#first", 200, "smooth");
        });

      this.category_old = this.current_category;
      this.author_old = this.current_author;
      this.author_id_old = this.current_author_id;
      this.tag_old = this.current_tag;
    },
  },
};
</script>
