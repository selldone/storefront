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
      <s-widget-header
        :title="$t('return_requests.title')"
        icon="assignment_return"
      >
      </s-widget-header>

      <v-list-subheader>{{ $t("return_requests.subtitle") }}</v-list-subheader>
      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Return requests  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-order-return-requests @select="handleSelected" />
    </div>
  </v-container>
</template>

<script lang="ts">
import SOrderReturnRequests from "@app-storefront/components/orders/return-request/SOrderReturnRequests.vue";

export default {
  name: "StorefrontPageUserReturns",
  components: { SOrderReturnRequests },

  props: {},

  data: function () {
    return {};
  },

  methods: {
    handleSelected(return_request) {
      this.$router.push({
        name: "MyPhysicalOrderInfoPage",
        params: {
          basket_id: return_request.basket_item.basket_id,
        },
        query: {
          return_id: return_request.id,
        },
      });
    },
  },
  created() {
    this.setPageTitle("My return requests"); // Set Page Title!
  },
};
</script>

<style lang="scss" scoped></style>
