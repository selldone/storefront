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
  name: "UserPagesLayout",
  props: {
    shop: {
      require: true,
    },
  },
  components: {

  },
  data: () => ({
    mode: "",
  }),
  computed: {},

  watch: {},

  created() {
  },
  methods: {},
};
</script>

<style scoped lang="scss"></style>
