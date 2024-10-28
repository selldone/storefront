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
  <div v-bind="$attrs" class="py-10">
    <div class="widget-box -large mb-5 min-height-50vh">
      <u-widget-header
        icon="wallet"
        :title="$t('user_wallets.title')"
      ></u-widget-header>
      <v-list-subheader>
        {{ $t("user_wallets.subtitle") }}
      </v-list-subheader>

      <u-loading-progress v-if="busy_fetch"></u-loading-progress>

      <v-list-item
        v-for="wallet in wallets"
        :key="wallet.id"
        variant="flat"
        base-color="#000"
        elevation="5"
        rounded="lg"
        lines="two"
        prepend-icon="wallet"
        class="my-2 max-widget-width mx-auto"
      >
        <template v-slot:title>
          <u-price
            :amount="wallet.balance"
            :currency="wallet.currency"
          ></u-price>
        </template>
        <template v-slot:subtitle>
          <div class="mt-1">{{ $t("wallet_input.my_wallet_balance") }}</div>
        </template>
        <template v-slot:append>
          <u-currency-icon
            :currency="wallet.currency"
            flag-only
          ></u-currency-icon>
        </template>
      </v-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import ULoadingProgress from "@selldone/components-vue/ui/loading/progress/ULoadingProgress.vue";
import UCurrencyIcon from "@selldone/components-vue/ui/currency/icon/UCurrencyIcon.vue";
import UPrice from "@selldone/components-vue/ui/price/UPrice.vue";

export default {
  name: "StorefrontPageUserWallets",
  components: {
    UPrice,
    UCurrencyIcon,

    ULoadingProgress,
  },
  inject: ["$shop"],
  props: {},
  data: () => ({
    wallets: [],
    busy_fetch: false,
  }),
  computed: {
    headers() {
      return [
        {
          title: this.$t("global.commons.currency"),
          align: "start",
          value: "currency",
          sortable: true,
        },

        {
          title: this.$t("global.commons.balance"),
          align: "start",
          value: "balance",
          sortable: true,
        },
      ];
    },
  },

  watch: {},

  created() {
    this.fetchWallets();
  },

  methods: {
    fetchWallets() {
      this.busy_fetch = true;

      axios
        .get(window.XAPI.GET_MY_WALLETS(this.$shop.name))
        .then(({ data }) => {
          if (data.error) {
            return this.showErrorAlert(null, data.error_msg);
          }

          this.wallets = data.wallets;
        })
        .catch((e) => {
          this.showLaravelError(e);
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
