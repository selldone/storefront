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

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Return requests  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <s-backoffice-return-requests-list
        :url="window.XAPI.GET_MY_BASKET_ITEM_RETURNS(shop_name)"
        @select="handleSelected"
      />
    </div>
  </v-container>
</template>

<script>
import SBackofficeReturnRequestsList from "@components/order/return-request/SBackofficeReturnRequestsList.vue";
export default {
  name: "SStorefrontUserReturnRequests",
  components: { SBackofficeReturnRequestsList },

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

<style scoped lang="scss"></style>
