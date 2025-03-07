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
  <v-container fluid>
    <div class="widget-box -x-large min-height-60vh">
      <u-widget-header :title="$t('user_comments.title')" icon="chat_bubble">
      </u-widget-header>

      <u-loading-progress v-if="busy_fetch"></u-loading-progress>

      <v-data-iterator
        v-model:options="options"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :items="comments"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :search="search"
        class="bg-transparent"
        density="compact"
        hide-default-footer
        no-data-text=""
      >
        <template v-slot:header>
          <s-data-iterator-toolbar
            v-model:items-per-page="itemsPerPage"
            v-model:search="search"
            v-model:sort-key="sortBy[0].key"
            v-model:sort-order="sortBy[0].order"
            :sort-keys="keys"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default="">
          <v-row class="m-2" no-gutters>
            <v-col
              v-for="comment in comments"
              :key="comment.id"
              class="p-2"
              cols="12"
              lg="3"
              md="4"
              sm="6"
            >
              <router-link
                :to="{
                  name: window.$storefront.routes.PRODUCT_PAGE,
                  params: { product_id: comment.product.id },
                }"
              >
                <div class="comment-card widget-hover">
                  <v-img
                    :src="getShopImagePath(comment.product.icon)"
                    class="rounded-18px border"
                    height="136"
                    cover
                  >
                  </v-img>

                  <div class="-ti">
                    <p class="font-weight-bold mt-2 mb-0">
                      {{ comment.product.title?.limitWords(12) }}
                    </p>
                    <small>{{
                      comment.product.title_en?.limitWords(24)
                    }}</small>
                  </div>

                  <p
                    v-if="comment.created_at !== comment.updated_at"
                    class="small"
                  >
                    <small>{{ $t("user_comments.last_edit") }} :</small>
                    {{ getLocalTimeString(comment.updated_at) }}
                  </p>
                  <p v-else class="small">
                    <small>{{ $t("user_comments.first_post") }} :</small>
                    {{ getLocalTimeString(comment.created_at) }}
                  </p>

                  <hr class="mx-6 my-2" />
                  <p class="text-subtitle-2">
                    {{ comment.body?.limitWords(24) }}
                  </p>
                </div>
              </router-link>
            </v-col>
          </v-row>
        </template>

        <template v-slot:bottom>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" :length="pageCount" rounded />
          </div>
        </template>
      </v-data-iterator>
    </div>
  </v-container>
</template>

<script lang="ts">
import SDataIteratorToolbar from "@selldone/components-vue/ui/toolbar/SDataIteratorToolbar.vue";
import { throttle } from "lodash-es";
import DateMixin from "@selldone/components-vue/mixin/date/DateMixin.ts";

export default {
  name: "StorefrontPageUserComments",
  mixins: [DateMixin],

  components: { SDataIteratorToolbar },

  inject: ["$shop"],
  data: () => ({
    comments: [],

    search: "",
    filter: {},
    sortBy: [{ key: null, order: "desc" }],

    busy_fetch: false,
    // Pagination:
    page: 1,
    itemsPerPage: 8,
    totalItems: 0,
    options: {},
  }),

  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    keys() {
      return [
        { label: this.$t("global.sort.product"), value: "article_id" },
        { label: this.$t("global.sort.body"), value: "body" },
        { label: this.$t("global.sort.created_at"), value: "created_at" },
        { label: this.$t("global.sort.updated_at"), value: "updated_at" },
      ];
    },
  },

  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, sortDesc, page } = this.options;
        this.fetchData(page, sortBy[0]?.key, sortBy[0]?.order === "desc");
      },
      deep: true,
    },

    search: throttle(function () {
      const { sortBy, sortDesc } = this.options;
      this.fetchData(1, sortBy[0]?.key, sortBy[0]?.order === "desc");
    }, window.SERACH_THROTTLE),
  },

  created() {
    this.setPageTitle("My comments"); // Set Page Title!
  },

  methods: {
    fetchData(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;

      axios
        .get(window.XAPI.GET_MY_COMMENTS(this.$shop.name), {
          params: {
            offset: (page - 1) * this.itemsPerPage,
            limit: this.itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
            search: this.search,
          },
        })
        .then(({ data }) => {
          this.comments = data.comments;

          this.totalItems = data.total;
        })

        .catch(() => {})
        .then(() => {
          this.busy_fetch = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-card {
  height: 100%;
  border-radius: 18px;
  padding: 12px;
  cursor: pointer;
  background-color: #fff;
  text-align: start;

  p {
    margin: 2px;
  }

  color: #333;

  .-ti {
    min-height: 42px;
  }

  &:hover {
    color: #333;
  }
}
</style>
