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
  <v-container fluid>
    <div class="widget-box -x-large min-height-60vh">
      <u-widget-header
        :add-caption="$t('user_gift_cards.add_card_dialog.title')"
        :title="$t('user_gift_cards.title')"
        add-icon="card_giftcard"
        icon="card_giftcard"
        @click:add="showAddCardDialog"
      >
      </u-widget-header>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ My Gift cards  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <u-loading-progress v-if="busy_fetch"></u-loading-progress>

      <v-data-iterator
        v-model:options="options"
        v-model:page="page"
        :items="giftcards"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :search="search"
        :sort-by="sortBy"
        class="bg-transparent"
        density="compact"
        hide-default-footer
      >
        <template v-slot:loading>
          <u-loading-ellipsis css-mode light></u-loading-ellipsis>
        </template>

        <template v-slot:header>
          <s-data-iterator-toolbar
            v-model:items-per-page="itemsPerPage"
            v-model:search="search"
            v-model:sort-key="sortBy[0].key"
            v-model:sort-order="sortBy[0].order"
            :base-items-count="8"
            :sort-keys="keys"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default="">
          <v-row>
            <v-fade-transition group hide-on-leave>
              <v-col
                v-for="gift_card in giftcards"
                :key="gift_card.id"
                cols="12"
                lg="3"
                md="4"
                sm="6"
              >
                <s-giftcard-view :gift-card="gift_card" />
              </v-col>
            </v-fade-transition>
          </v-row>
        </template>

        <template v-slot:no-data>
          <div class="text-center p-4">
            <h2 class="font-weight-thin text-h4">
              {{ $t("user_gift_cards.add_card_dialog.title") }}...
            </h2>
            <v-list-subheader
              >{{ $t("user_gift_cards.add_card_dialog.message") }}
            </v-list-subheader>
          </div>
        </template>

        <template v-slot:bottom>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" :length="pageCount" rounded />
          </div>
        </template>
      </v-data-iterator>
    </div>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Add card  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <s-giftcard-add
      v-model="dialog"
      @add="
        (gift_card) => {
          AddOrUpdateItemByID(giftcards, gift_card);
          totalItems++;
          dialog = false;
        }
      "
    ></s-giftcard-add>
  </v-container>
</template>

<script lang="ts">
import SGiftcardView from "@selldone/components-vue/storefront/giftcard/view/SGiftcardView.vue";
import SDataIteratorToolbar from "@selldone/components-vue/ui/toolbar/SDataIteratorToolbar.vue";
import SGiftcardAdd from "@selldone/components-vue/storefront/giftcard/add/SGiftcardAdd.vue";
import { throttle } from "lodash-es";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";

export default {
  name: "StorefrontPageUserGiftcards",
  components: {
    ULoadingEllipsis,
    SGiftcardAdd,
    SDataIteratorToolbar,
    SGiftcardView,
  },
  inject: ["$shop"],
  data: () => ({
    giftcards: [],
    balances: [],

    dialog: false,

    search: "",
    filter: {},
    sortBy: [{ key: null, order: "desc" }],

    busy_fetch: false,
    // Pagination:
    page: 1,
    itemsPerPage: 7,
    totalItems: 0,
    options: {},
  }),
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    keys() {
      return [
        { label: this.$t("global.sort.card_type"), value: "type_id" },
        { label: this.$t("global.sort.card_number"), value: "number" },
        { label: this.$t("global.sort.balance"), value: "balance" },
        { label: this.$t("global.sort.paid"), value: "payed" },
        { label: this.$t("global.sort.currency"), value: "currency" },
        { label: this.$t("global.sort.expire_at"), value: "expire_at" },
      ];
    },
  },

  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, sortDesc, page } = this.options;
        this.fetchCards(page, sortBy[0]?.key, sortBy[0]?.order === "desc");
      },
      deep: true,
    },

    search: throttle(function () {
      //  console.log("search", newVal);
      const { sortBy, sortDesc } = this.options;
      this.fetchCards(1, sortBy[0]?.key, sortBy[0]?.order === "desc");
    }, window.SERACH_THROTTLE),
  },

  created() {
    this.setPageTitle("My gift cards"); // Set Page Title!
  },

  methods: {
    fetchCards(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;

      axios
        .get(window.XAPI.GET_MY_GIFT_CARDS(this.$shop.name), {
          params: {
            offset: (page - 1) * this.itemsPerPage,
            limit: this.itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
            search: this.search,
          },
        })
        .then(({ data }) => {
          this.giftcards = data.giftcards;
          this.balances = data.balances;

          this.totalItems = data.total;
        })

        .catch(() => {})
        .then(() => {
          this.busy_fetch = false;
        });
    },

    showAddCardDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
