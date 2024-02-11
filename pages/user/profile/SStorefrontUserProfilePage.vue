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
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Image ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5 d-flex align-center flex-column">
      <v-avatar
        class="my-2 mx-auto avatar-gradient -thin"
        color="#fff"
        size="96"
      >
        <v-img :src="getUserAvatar(USER().id)" />
      </v-avatar>

      <h2 class="text-uppercase font-weight-light my-3">
        {{ USER().name }}
      </h2>
      <p class="subtitle-2">
        {{ USER().email }}
        <v-icon v-if="USER().email_verified" class="ms-1" color="success" small>
          check_circle
        </v-icon>
      </p>

      <v-btn
        :loading="busy_logout"
        class="mb-3"
        text
        @click="
          busy_logout = true;
          Logout(() => (busy_logout = false));
        "
      >
        <v-icon class="me-1" small>logout </v-icon>
        {{ $t("global.actions.logout") }}
      </v-btn>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <h2>
        <v-icon class="me-1">mail_outline </v-icon>
        {{ $t("user_profile.subscription") }}
      </h2>
      <v-list-subheader></v-list-subheader>

      <div class="widget-buttons">
        <v-btn
          :color="!isSubscribed ? 'primary' : 'success'"
          :loading="busy_subscribe"
          :text="isSubscribed"
          depressed
          x-large
          @click="toggleSubscribe"
        >
          <v-icon v-if="isSubscribed" class="me-1" small>check</v-icon>
          {{
            isSubscribed
              ? $t("global.commons.subscribed")
              : $t("global.commons.unsubscribed")
          }}
        </v-btn>
      </div>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Profile ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <h2>
        <v-icon class="me-1">fingerprint</v-icon>
        {{ $t("user_profile.title") }}
      </h2>

      <s-value-dashed>
        <template v-slot:label>
          <v-list-subheader>
            {{ $t("user_profile.tel") }}
          </v-list-subheader>
        </template>
        <b>{{ USER().phone }}</b>
      </s-value-dashed>

      <s-value-dashed>
        <template v-slot:label>
          <v-list-subheader>
            {{ $t("user_profile.identity") }}
          </v-list-subheader>
        </template>
        <div class="text-success">
          <s-check
            :value="USER().personal_information_verified"
            class="me-1"
          ></s-check>
          <span v-if="USER().personal_information_verified">
            {{ $t("user_profile.success_kyc") }}</span
          >
        </div>
      </s-value-dashed>

      <div class="widget-buttons">
        <v-btn :href="kyc_url" color="primary" large target="_blank" text>
          <v-icon class="me-1" small>edit</v-icon>
          {{ $t("user_profile.edit_personal_info") }}
        </v-btn>
      </div>

      <template v-if="getClub()">
        <hr class="my-4" />

        <v-list-subheader>
          {{ $t("user_profile.club") }}
        </v-list-subheader>
        <div class="text-center">
          <img
            :src="getCustomerClubLevel(getClub().level).icon"
            :title="$t('user_profile.club')"
            class="mx-auto d-block"
            height="48"
            width="48"
          />
          <p class="font-weight-bold">
            {{ $t(getCustomerClubLevel(getClub().level).name) }}
          </p>
          <p class="">
            {{ getClub().description }}
          </p>

          <div class="d-flex border-between py-2">
            <div class="flex-grow-1">
              <small class="d-block">{{
                $t("user_profile.club_table.discount")
              }}</small>
              <p class="font-weight-bold">%{{ getClub().percent }}</p>
            </div>

            <div class="flex-grow-1">
              <small class="d-block">{{
                $t("user_profile.club_table.limit")
              }}</small>
              <price-view
                :amount="getClub().limit"
                :currency="getClub().currency"
              ></price-view>
            </div>

            <div v-if="getClub().free_shipping" class="flex-grow-1">
              <small class="d-block">{{
                $t("user_profile.club_table.free_shipping")
              }}</small>
              <v-icon color="success" small>fa:fas fa-shipping-fast</v-icon>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Leave ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5" style="border-top: red solid 4px">
      <p class="text-start subtitle-2">
        <v-icon class="me-1">report_problem</v-icon>
        {{ $t("user_profile.leave_shop") }}
      </p>

      <div class="widget-buttons">
        <v-btn class="m-2" color="#D32F2F" large text @click="LeaveShop">
          <v-icon class="me-1" small>block</v-icon>
          {{ $t("user_profile.leave_shop_action") }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { SetupService } from "@core/server/SetupService";
import SValueDashed from "@components/ui/text/SValueDashed.vue";

export default {
  name: "SStorefrontUserProfilePage",
  components: { SValueDashed },
  props: {
    shop: {
      require: true,
    },
  },
  data: () => {
    return {
      busy_subscribe: false,
      busy_logout: false,
    };
  },
  computed: {
    isSubscribed() {
      return this.USER().subscribed;
    },

    kyc_url() {
      return SetupService.MainServiceUrl() + "/shuttle/kyc";
    },
  },
  methods: {
    LeaveShop() {
      this.openDangerAlert(
        this.$t("user_profile.leave_dialog.title"),
        this.$t("user_profile.leave_dialog.message"),
        this.$t("user_profile.leave_dialog.action"),
        () => {
          axios
            .post(window.XAPI.POST_LEAVE_SHOP(this.shop_name))
            .then(({ data }) => {
              if (!data.error) {
                this.showSuccessAlert(
                  null,
                  this.$t("user_profile.notifications.leave_success"),
                );
                this.LogoutProcess();
              } else {
                this.showErrorAlert(null, data.error_msg);
              }
            })
            .catch((error) => {
              this.showLaravelError(error);
            });
        },
      );
    },

    toggleSubscribe() {
      this.busy_subscribe = true;
      let subscribe = !this.isSubscribed;
      axios
        .post(window.XAPI.POST_SUBSCRIBE(this.shop_name), {
          subscribe: subscribe,
        })
        .then(({ data }) => {
          if (!data.error) {
            this.USER().subscribed = data.subscribed;

            this.showSuccessAlert(
              null,
              subscribe
                ? "Subscribe successfully."
                : "Unsubscribe successfully.",
            );
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_subscribe = false;
        });
    },
  },
  created() {
    this.setPageTitle("My profile"); // Set Page Title!
  },
};
</script>

<style lang="scss" scoped>
.widget {
  min-height: 150px;
}
</style>
