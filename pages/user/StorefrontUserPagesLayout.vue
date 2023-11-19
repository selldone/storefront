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

      <circle-button
        icon="history"
        :tooltip="$t('user_page.menu.orders')"
        :to="{ name: 'HistoryOrdersPhysical' }"
        auto-disabled-route-name="OrdersPage"
      />

      <!-- ⦿ Address -->

      <circle-button
        v-if="USER()"
        icon="near_me"
        :tooltip="$t('user_page.menu.addresses')"
        :to="{ name: 'UserAddressesPage' }"
        auto-disabled-route-name="UserAddressesPage"
      />
      <!-- ⦿ Return request -->

      <circle-button
        v-if="USER()"
        icon="keyboard_return"
        :tooltip="$t('user_page.menu.return_requests')"
        :to="{ name: 'UserReturnRequests' }"
        auto-disabled-route-name="UserReturnRequests"
      />
      <!-- ⦿ Favorites -->

      <circle-button
        v-if="USER()"
        icon="star"
        :tooltip="$t('user_page.menu.favorites')"
        :to="{ name: 'UserFavoritesPage' }"
        auto-disabled-route-name="UserFavoritesPage"
      />
      <!-- ⦿ Comments -->

      <circle-button
        v-if="USER()"
        icon="comment"
        :tooltip="$t('user_page.menu.comments')"
        :to="{ name: 'UserCommentsPage' }"
        auto-disabled-route-name="UserCommentsPage"
      />

      <!-- ⦿ Gift cards -->

      <circle-button
        v-if="USER()"
        icon="card_giftcard"
        :tooltip="$t('user_page.menu.gift_card')"
        :to="{ name: 'UserGiftCardsPage' }"
        auto-disabled-route-name="UserGiftCardsPage"
      />

      <!-- ⦿ Profile -->

      <circle-button
        icon="person"
        :tooltip="$t('user_page.menu.profile')"
        :to="{ name: 'UserProfilePage' }"
        auto-disabled-route-name="UserProfilePage"
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
  name: "StorefrontUserPagesLayout",
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
