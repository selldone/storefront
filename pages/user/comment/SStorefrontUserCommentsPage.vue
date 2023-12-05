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
    <div class="widget-box -x-large min-height-50vh">
      <s-widget-header :title="$t('user_comments.title')" icon="chat_bubble">
      </s-widget-header>

      <s-progress-loading v-if="busy_fetch"></s-progress-loading>

      <v-data-iterator
        :items="comments"
        :search="search"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        hide-default-footer
        :server-items-length="totalItems"
        :options.sync="options"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        class="bg-transparent dense-padding"
        no-data-text=""
      >
        <template v-slot:header>
          <s-data-iterator-toolbar
            :sort-keys="keys"
            :search.sync="search"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items-per-page.sync="itemsPerPage"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default="">
          <v-row no-gutters class="m-2">
            <v-col
              v-for="comment in comments"
              :key="comment.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="p-2"
            >
              <router-link
                :to="{
                  name: window.$storefront.routes.PRODUCT_PAGE,
                  params: { product_id: comment.product.id },
                }"
              >
                <div class="comment-card widget-hover">
                  <v-img
                    height="136"
                    :src="getShopImagePath(comment.product.icon)"
                    class="rounded-18px border"
                  >
                  </v-img>

                  <div class="-ti">
                    <p class="font-weight-bold mt-2 mb-0">
                      {{ comment.product.title }}
                    </p>
                    <small>{{ comment.product.title_en }}</small>
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

                  <hr class="mx-6" />
                  <p class="pt-3 subtitle-2">
                    {{ comment.body }}
                  </p>
                </div>
              </router-link>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" circle :length="pageCount" />
          </div>
        </template>
      </v-data-iterator>
    </div>
  </v-container>
</template>

<script>
import SDataIteratorToolbar from "@components/ui/toolbar/SDataIteratorToolbar.vue";
import _ from "lodash-es";

export default {
  name: "SStorefrontUserCommentsPage",
  components: { SDataIteratorToolbar },
  data: () => ({
    comments: [],

    search: "",
    filter: {},
    sortDesc: true,
    sortBy: null,

    busy_fetch: false,
    // Pagination:
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
    totalItems: 0,
    options: { sortDesc: [true] },
  }),

  computed: {
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
        this.fetchData(page, sortBy ? sortBy[0] : null, sortDesc[0]);
      },
      deep: true,
    },

    search: _.throttle(function () {
      const { sortBy, sortDesc } = this.options;
      this.fetchData(1, sortBy ? sortBy[0] : null, sortDesc[0]);
    }, window.SERACH_THROTTLE),
  },

  created() {
    this.setPageTitle("My comments"); // Set Page Title!
  },

  methods: {
    fetchData(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;

      axios
        .get(window.XAPI.GET_MY_COMMENTS(this.shop_name), {
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
          this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage); //set by event not work!!!
        })

        .catch(() => {})
        .then(() => {
          this.busy_fetch = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.comment-card {
  height: 100%;
  border-radius: 18px;
  padding: 12px;
  cursor: pointer;
  background-color: #fafafa;
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
