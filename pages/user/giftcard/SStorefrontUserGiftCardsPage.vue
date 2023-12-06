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
    <div class="widget-box -x-large min-height-50vh">
      <s-widget-header
        :title="$t('user_gift_cards.title')"
        icon="card_giftcard"
        :add-caption="$t('user_gift_cards.add_card_dialog.title')"
        @click:add="showAddCardDialog"
        add-icon="card_giftcard"
      >
      </s-widget-header>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ My Gift cards  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <s-progress-loading v-if="busy_fetch"></s-progress-loading>

      <v-data-iterator
        :items="giftcards"
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
      >
        <template v-slot:loading>
          <s-loading css-mode light></s-loading>
        </template>

        <template v-slot:header>
          <s-data-iterator-toolbar
            :sort-keys="keys"
            :search.sync="search"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :items-per-page.sync="itemsPerPage"
            :base-items-count="8"
          ></s-data-iterator-toolbar>
        </template>

        <template v-slot:default="">
          <v-fade-transition group tag="v-row" class="mx-0" hide-on-leave>
            <v-col
              v-for="gift_card in giftcards"
              :key="gift_card.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="p-2"
            >
              <s-storefront-giftcard-view :gift-card="gift_card" />
            </v-col>
          </v-fade-transition>
        </template>

        <template v-slot:no-data>
          <div class="text-center p-4">
            <h2 class="font-weight-thin display-1">
              {{ $t("user_gift_cards.add_card_dialog.title") }}...
            </h2>
            <v-subheader>{{
              $t("user_gift_cards.add_card_dialog.message")
            }}</v-subheader>
          </div>
        </template>

        <template v-slot:footer>
          <div class="text-center pt-2 mt-3">
            <v-pagination v-model="page" circle :length="pageCount" />
          </div>
        </template>
      </v-data-iterator>
    </div>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Add card  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <s-storefront-giftcard-add-dialog
      v-model="dialog"
      @add="
        (gift_card) => {
          AddOrUpdateItemByID(giftcards, gift_card);
          totalItems++;
          dialog = false;
        }
      "
    ></s-storefront-giftcard-add-dialog>
  </v-container>
</template>

<script>
import SStorefrontGiftcardView from "@components/storefront/giftcard/view/SStorefrontGiftcardView.vue";
import SDataIteratorToolbar from "@components/ui/toolbar/SDataIteratorToolbar.vue";
import SStorefrontGiftcardAddDialog from "@components/storefront/giftcard/add-dialog/SStorefrontGiftcardAddDialog.vue";
import _ from "lodash-es";

export default {
  name: "SStorefrontUserGiftCardsPage",
  components: {
    SStorefrontGiftcardAddDialog,
    SDataIteratorToolbar,
    SStorefrontGiftcardView,
  },
  data: () => ({
    giftcards: [],
    balances: [],

    dialog: false,

    search: "",
    filter: {},
    sortDesc: true,
    sortBy: null,

    busy_fetch: false,
    // Pagination:
    page: 1,
    pageCount: 0,
    itemsPerPage: 7,
    totalItems: 0,
    options: { sortDesc: [true] },
  }),
  computed: {
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
        this.fetchCards(page, sortBy ? sortBy[0] : null, sortDesc[0]);
      },
      deep: true,
    },

    search: _.throttle(function () {
      //  console.log("search", newVal);
      const { sortBy, sortDesc } = this.options;
      this.fetchCards(1, sortBy ? sortBy[0] : null, sortDesc[0]);
    }, window.SERACH_THROTTLE),
  },

  created() {
    this.setPageTitle("My gift cards"); // Set Page Title!
  },

  methods: {
    fetchCards(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;

      axios
        .get(window.XAPI.GET_MY_GIFT_CARDS(this.shop_name), {
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
          this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage); //set by event not work!!!
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

<style scoped lang="scss"></style>
