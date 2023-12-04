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
  <v-card
    class="s--shop-card s--shadow-no-padding -hide1720 mb-16"
    :flat="isMobile"
  >
    <v-toolbar
      extended
      color="#fff"
      flat
      extension-height="20px"
      style="overflow-x: auto"
    >
      <!-- ⦿ Back -->

      <!-- ⦿ Orders History -->

      <s-circle-button
        icon="history"
        :tooltip="$t('user_page.menu.orders')"
        :to="{ name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL }"
        :auto-disabled-route-name="window.$storefront.routes.ORDERS_PAGE"
      />

      <!-- ⦿ Address -->

      <s-circle-button
        v-if="USER()"
        icon="near_me"
        :tooltip="$t('user_page.menu.addresses')"
        :to="{ name: window.$storefront.routes.USER_ADDRESSES_PAGE }"
        :auto-disabled-route-name="window.$storefront.routes.USER_ADDRESSES_PAGE"
      />
      <!-- ⦿ Return request -->

      <s-circle-button
        v-if="USER()"
        icon="keyboard_return"
        :tooltip="$t('user_page.menu.return_requests')"
        :to="{ name: window.$storefront.routes.USER_RETURN_REQUESTS }"
        :auto-disabled-route-name="window.$storefront.routes.USER_RETURN_REQUESTS"
      />
      <!-- ⦿ Favorites -->

      <s-circle-button
        v-if="USER()"
        icon="star"
        :tooltip="$t('user_page.menu.favorites')"
        :to="{ name: window.$storefront.routes.USER_FAVORITES_PAGE }"
        :auto-disabled-route-name="window.$storefront.routes.USER_FAVORITES_PAGE"
      />
      <!-- ⦿ Comments -->

      <s-circle-button
        v-if="USER()"
        icon="comment"
        :tooltip="$t('user_page.menu.comments')"
        :to="{ name: window.$storefront.routes.USER_COMMENTS_PAGE }"
        :auto-disabled-route-name="window.$storefront.routes.USER_COMMENTS_PAGE"
      />

      <!-- ⦿ Gift cards -->

      <s-circle-button
        v-if="USER()"
        icon="card_giftcard"
        :tooltip="$t('user_page.menu.gift_card')"
        :to="{ name: window.$storefront.routes.USER_GIFTCARDS_PAGE }"
        :auto-disabled-route-name=" window.$storefront.routes.USER_GIFTCARDS_PAGE"
      />

      <!-- ⦿ Profile -->

      <s-circle-button
        icon="person"
        :tooltip="$t('user_page.menu.profile')"
        :to="{ name: window.$storefront.routes.USER_PROFILE_PAGE }"
        :auto-disabled-route-name="window.$storefront.routes.USER_PROFILE_PAGE"
      />

      <v-spacer />
    </v-toolbar>

    <!-- ======================= Container ======================= -->
    <router-view
      class="mx-0 mx-sm-3 overflow-hidden"
      style="min-height: 60vh"
      :shop="shop"
    />
  </v-card>
</template>

<script>
export default {
  name: "SStorefrontUserPagesLayout",
  props: {
    shop: {
      require: true,
    },
  },
  components: {},
  data: () => ({
    mode: "",
  }),
  computed: {},

  watch: {},

  created() {},
  methods: {},
};
</script>

<style scoped lang="scss"></style>
