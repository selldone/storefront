<!--
  - Copyright (c) 2023-2024. Selldone® Business OS™
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
    :flat="isMobile"
    class="s--shop-card s--shadow-no-padding -hide1720 mb-16"
  >
    <v-toolbar
      color="#fff"
      extended
      extension-height="20px"
      flat
      style="overflow-x: auto"
    >
      <template v-slot:extension>
        <div style="height: 20px"></div>
      </template>
      <!-- ⦿ Back -->

      <!-- ⦿ Orders History -->

      <u-button-circle
        :auto-disabled-route-name="window.$storefront.routes.ORDERS_PAGE"
        :to="{ name: window.$storefront.routes.HISTORY_ORDERS_PHYSICAL }"
        :tooltip="$t('user_page.menu.orders')"
        icon="history"
      />

      <!-- ⦿ Address -->

      <u-button-circle
        v-if="USER()"
        :auto-disabled-route-name="
          window.$storefront.routes.USER_ADDRESSES_PAGE
        "
        :to="{ name: window.$storefront.routes.USER_ADDRESSES_PAGE }"
        :tooltip="$t('user_page.menu.addresses')"
        icon="near_me"
      />
      <!-- ⦿ Return request -->

      <u-button-circle
        v-if="USER()"
        :auto-disabled-route-name="
          window.$storefront.routes.USER_RETURN_REQUESTS
        "
        :to="{ name: window.$storefront.routes.USER_RETURN_REQUESTS }"
        :tooltip="$t('user_page.menu.return_requests')"
        icon="keyboard_return"
      />
      <!-- ⦿ Favorites -->

      <u-button-circle
        v-if="USER()"
        :auto-disabled-route-name="
          window.$storefront.routes.USER_FAVORITES_PAGE
        "
        :to="{ name: window.$storefront.routes.USER_FAVORITES_PAGE }"
        :tooltip="$t('user_page.menu.favorites')"
        icon="star"
      />
      <!-- ⦿ Comments -->

      <u-button-circle
        v-if="USER()"
        :auto-disabled-route-name="window.$storefront.routes.USER_COMMENTS_PAGE"
        :to="{ name: window.$storefront.routes.USER_COMMENTS_PAGE }"
        :tooltip="$t('user_page.menu.comments')"
        icon="comment"
      />

      <!-- ⦿ Gift cards -->

      <u-button-circle
        v-if="USER()"
        :auto-disabled-route-name="
          window.$storefront.routes.USER_GIFTCARDS_PAGE
        "
        :to="{ name: window.$storefront.routes.USER_GIFTCARDS_PAGE }"
        :tooltip="$t('user_page.menu.gift_card')"
        icon="card_giftcard"
      />

      <!-- ⦿ Profile -->

      <u-button-circle
        :auto-disabled-route-name="window.$storefront.routes.USER_PROFILE_PAGE"
        :to="{ name: window.$storefront.routes.USER_PROFILE_PAGE }"
        :tooltip="$t('user_page.menu.profile')"
        icon="person"
      />

      <v-spacer />
    </v-toolbar>

    <!-- ======================= Container ======================= -->
    <router-view
      :shop="shop"
      class="overflow-hidden"
      style="min-height: 60vh"
    />
  </v-card>
</template>

<script>
export default {
  name: "StorefrontPageUser",
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

<style lang="scss" scoped></style>
