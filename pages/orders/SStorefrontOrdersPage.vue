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
        flat
        color="transparent"
        style="overflow-x: auto"
        extended
        extension-height="18px"
      >
        <s-circle-button
          v-for="type in types"
          :key="type.code"
          :src="type.image"
          :tooltip="$t(type.name)"
          :disabled="!type.enable"
          :outline="$route.name === page_name(type)"
          has-badge
          :badge-number="getBadgeCount(type.code)"
          @click="goToHistoryPage(type)"
          persist-badge
          tile
        />

        <s-circle-button
          v-if="USER()"
          key="pos"
          :src="require('@components/assets/icons/pos-order-type.svg')"
          :tooltip="$t('global.commons.pos')"
          has-badge
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_POS }"
          exact
          tile
        />

        <s-circle-button
          v-if="USER()"
          key="avo"
          :src="require('@components/assets/icons/avocado.svg')"
          :tooltip="$t('global.commons.avocado')"
          :to="{ name: window.$storefront.routes.HISTORY_ORDERS_AVOCADO }"
          has-badge
          :badge-number="getBadgeCount('AVO')"
          persist-badge
          exact
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

<script>
import { ProductType } from "@core/enums/product/ProductType";
export default {
  name: "SStorefrontOrdersPage",
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
      if (type === ProductType.PHYSICAL) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_PHYSICAL;
      } else if (type === ProductType.VIRTUAL) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_VIRTUAL;
      } else if (type === ProductType.FILE) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_FILE;
      } else if (type === ProductType.SERVICE) {
        page_name = window.$storefront.routes.HISTORY_ORDERS_SERVICE;
      } else if (type === ProductType.SUBSCRIPTION) {
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

<style scoped lang="scss"></style>
