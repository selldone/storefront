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
    <div class="widget-box -x-large">
      <v-toolbar
        color="transparent"
        extended
        extension-height="18px"
        flat
        style="overflow-x: auto"
      >
        <template v-slot:extension>
          <div style="height: 18px"></div>
        </template>

        <u-button-circle
          v-for="type in types"
          :key="type.code"
          :badge-number="getBadgeCount(type.code)"
          :disabled="!type.enable"
          :outline="$route.name === page_name(type)"
          :src="type.image"
          :tooltip="$t(type.name)"
          has-badge
          persist-badge
          tile
          @click="goToHistoryPage(type)"
        />

        <u-button-circle
          v-if="USER()"
          key="pos"
          :src="require('@selldone/components-vue/assets/icons/pos-order-type.svg')"
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_POS }"
          :tooltip="$t('global.commons.pos')"
          exact
          has-badge
          tile
        />

        <u-button-circle
          v-if="USER()"
          key="avo"
          :badge-number="getBadgeCount('AVO')"
          :src="require('@selldone/components-vue/assets/icons/avocado.svg')"
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_AVOCADO }"
          :tooltip="$t('global.commons.avocado')"
          exact
          has-badge
          persist-badge
          tile
        />
        <div style="min-width: 46px; height: 100%"></div>

        <v-spacer />
      </v-toolbar>

      <!-- ======================= Container ======================= -->
      <router-view />
    </div>
  </v-container>
</template>

<script lang="ts">
import { ProductType } from "@selldone/core-js/enums/product/ProductType";

export default {
  name: "StorefrontPageUserOrders",
  components: {},
  data: function () {
    return {
      types: ProductType,
    };
  },

  computed: {},
  watch: {},
  created() {
    this.setPageTitle("My orders"); // Set Page Title!
  },

  methods: {
    getBadgeCount(type) {
      let out = 0;
      if (this.getOrdersState())
        this.getOrdersState()
          .filter((it) => it.type === type)
          .forEach((item) => {
            out += item.count;
          });

      return out;
    },

    page_name(type) {
      let page_name = null;
      if (type.code === ProductType.PHYSICAL.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      } else if (type.code === ProductType.VIRTUAL.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_VIRTUAL;
      } else if (type.code === ProductType.FILE.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_FILE;
      } else if (type.code === ProductType.SERVICE.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SERVICE;
      } else if (type.code === ProductType.SUBSCRIPTION.code) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SUBSCRIPTION;
      } else if (type === "POS") {
        page_name = window.$storefront.routes.HISTORY_ORDERS_POS;
      }
      return page_name;
    },

    goToHistoryPage(type) {
      this.$router.replace({
        name: this.page_name(type),
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
