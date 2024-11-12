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
  <div>
    <u-loading-progress v-if="busy_fetch"></u-loading-progress>
    <v-data-table-server
      :mobile="$vuetify.display.xs"
      v-model:options="options"
      v-model:page="page"
      v-model:sort-by="sortBy"
      :header-props="{ sortByText: $t('global.commons.sort_by') }"
      :headers="headers"
      :items="return_requests"
      :items-length="totalItems"
      :items-per-page="itemsPerPage"
      :loading-text="$t('global.commons.waiting_load_data')"
      :row-props="
        (_data) => {
          return { class: 'row-hover' };
        }
      "
      class="bg-transparent min-height-60vh"
      density="compact"
      hide-default-footer
      item-key="id"
      @click:row="(_, r) => $emit('select', r.item)"
    >
      <!--  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ Empty View ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ -->
      <template v-slot:no-data>
        <div v-if="!busy_fetch" class="py-5 usn text-center fadeIn">
          <img
            :src="
              require('@selldone/components-vue/assets/guides/returned-orders-empty.png')
            "
            class="m-3 op-0-3"
            style="max-height: 400px; object-fit: contain"
            width="85%"
          />
          <h2 class="text-h4 font-weight-thin">List of returned orders...</h2>
        </div>
        <div v-else class="text-center px-3 py-5 text-muted">
          <v-icon class="me-1">sentiment_dissatisfied</v-icon>
          {{ $t("global.commons.no_data") }}
        </div>
      </template>
      <!--  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ -->

      <template v-slot:item.product_id="{ item }">
        <v-img
          :aspect-ratio="1"
          :height="48"
          :src="getProductImage(item.basket_item.product_id)"
          :width="48"
          class="rounded ma-2"
        />
      </template>

      <template v-slot:item.basket_id="{ item }">
        {{ getBasketOrderCode(item.basket_item?.basket) }}
      </template>

      <template v-slot:item.product_name="{ item }">
        <div class="min-width-200">
          <p class="m-0 font-weight-bold">
            {{ item.basket_item.product.title }}
            <i
              v-if="item.basket_item.product.original"
              class="fas fa-certificate text-primary"
            />
          </p>
          <small>{{ item.basket_item.product.title_en }}</small>
          <variant-item-view-micro
            v-if="item.basket_item.variant"
            :product-variant="item.basket_item.variant"
          />
        </div>
      </template>

      <template v-slot:item.delivery_at="{ item }">
        <div class="min-width-200">
          {{ getFromNowString(item.basket_item.basket.delivery_at) }}<br />
          <small>
            {{ getLocalTimeString(item.basket_item.basket.delivery_at) }}
          </small>
        </div>
      </template>

      <template v-slot:item.state="{ item }">
        <p class="m-1">
          <v-icon
            :color="getReturnRequestStateObject(item.state).color"
            size="small"
          >
            {{ getReturnRequestStateObject(item.state).icon }}
          </v-icon>
          {{ $t(getReturnRequestStateObject(item.state).name) }}
        </p>
      </template>

      <template v-slot:item.reason="{ item }">
        <div class="min-width-200">
          <p class="m-0">
            {{ $t(getReturnBasketItemReasonObject(item.reason).title) }}
          </p>
          <small
            >{{ $t("global.return_request_list.count") }}:
            {{ numeralFormat(item.count, "0,0") }}
          </small>
        </div>
      </template>

      <template v-slot:item.return_warranty="{ item }">
        <div class="text-center min-width-150">
          <p class="m-0">
            <small>
              {{ $t("global.return_request_list.return_warranty") }}
              :
            </small>
            {{ item.basket_item.product.return_warranty }}
            {{ $t("global.return_request_list.return_warranty_unit") }}
          </p>

          <small>{{ item.basket_item.product.warranty }}</small>
        </div>
      </template>

      <template v-slot:bottom>
        <v-pagination v-model="page" :length="pageCount" rounded />
      </template>
    </v-data-table-server>
  </div>
</template>

<script lang="ts">
import VariantItemViewMicro from "@selldone/components-vue/storefront/product/variant/VariantItemViewMicro.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import { BasketItemReturn } from "@selldone/core-js";
import DateMixin from "@selldone/components-vue/mixin/date/DateMixin.ts";

export default {
  name: "SOrderReturnRequests",
  mixins: [DateMixin],

  components: { VariantItemViewMicro },
  inject: ["$shop"],
  emits: ["select"],
  props: {},

  data: function () {
    return {
      busy_fetch: false,

      return_requests: [],

      // Pagination:
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      options: {},
      sortBy: [{ key: null, order: "desc" }],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    headers() {
      return [
        {
          title: "",
          align: "center",
          sortable: false,
          value: "product_id",
        },
        {
          title: this.$t("global.return_request_list.table.code"),
          align: "center",
          sortable: false,
          value: "basket_id",
        },
        {
          title: this.$t("global.return_request_list.table.product"),
          align: "start",
          sortable: false,
          value: "product_name",
        },
        {
          title: this.$t("global.return_request_list.table.delivery_at"),
          align: "start",
          sortable: false,
          value: "delivery_at",
        },
        {
          title: this.$t("global.return_request_list.table.state"),
          align: "center",
          value: "state",
          sortable: false,
        },
        {
          title: this.$t("global.return_request_list.table.reason"),
          align: "start",
          value: "reason",
          sortable: false,
        },

        {
          title: this.$t(
            "global.return_request_list.table.return_warranty_period",
          ),
          align: "center",
          value: "return_warranty",
          sortable: false,
        },
      ];
    },
  },
  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, page, itemsPerPage } = this.options;
        this.fetchData(page, sortBy[0]?.key, sortBy[0]?.order === "desc");
      },
      deep: true,
    },
  },
  created() {},

  methods: {
    getType(basket_item) {
      return ProductType[basket_item.basket.type];
    },

    fetchData(page = 0, sortBy = null, sortDesc = true) {
      this.busy_fetch = true;

      axios
        .get(this.window.XAPI.GET_MY_BASKET_ITEM_RETURNS(this.$shop.name), {
          params: {
            offset: (page - 1) * this.itemsPerPage,
            limit: this.itemsPerPage,
            sortBy: sortBy,
            sortDesc: sortDesc,
          },
        })
        .then(({ data }) => {
          if (data.error) {
            return this.showErrorAlert(null.error_msg);
          }
          this.return_requests = data.return_requests;
          this.totalItems = data.total;
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    getReturnRequestStateObject(state) {
      return BasketItemReturn.States[state];
    },

    getReturnBasketItemReasonObject(code) {
      return BasketItemReturn.Reason.physical.find(
        (item) => item.value === code,
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
