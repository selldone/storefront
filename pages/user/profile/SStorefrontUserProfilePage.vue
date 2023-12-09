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
  <v-container fluid >
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Image ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5 d-flex align-center flex-column">
      <v-avatar
        color="#fff"
        size="96"
        class="my-2 mx-auto avatar-gradient -thin"
      >
        <v-img :src="getUserAvatar(USER().id)" />
      </v-avatar>

      <h2 class="text-uppercase font-weight-light my-3">
        {{ USER().name }}
      </h2>
      <p class="subtitle-2">
        {{ USER().email }}
        <v-icon v-if="USER().email_verified" color="success" small class="ms-1">
          check_circle
        </v-icon>
      </p>

      <v-btn
        text
        @click="
          busy_logout = true;
          Logout(() => (busy_logout = false));
        "
        :loading="busy_logout"
        class="mb-3"
      >
        <v-icon small class="me-1">logout</v-icon
        >{{ $t("global.actions.logout") }}
      </v-btn>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <h2>
        <v-icon class="me-1">mail_outline</v-icon
        >{{ $t("user_profile.subscription") }}
      </h2>
      <v-subheader> </v-subheader>

      <div class="widget-buttons">
        <v-btn
          :color="!isSubscribed ? 'primary' : 'success'"
          depressed
          @click="toggleSubscribe"
          :loading="busy_subscribe"
          x-large
          :text="isSubscribed"
        >
          <v-icon v-if="isSubscribed" small class="me-1">check</v-icon>
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
        <v-icon class="me-1">fingerprint</v-icon>{{ $t("user_profile.title") }}
      </h2>

      <s-value-dashed>
        <template v-slot:label>
          <v-subheader>
            {{ $t("user_profile.tel") }}
          </v-subheader></template
        >
        <b>{{ USER().phone }}</b>
      </s-value-dashed>

      <s-value-dashed>
        <template v-slot:label>
          <v-subheader>
            {{ $t("user_profile.identity") }}
          </v-subheader></template
        >
        <div class="text-success">
          <check
            :value="USER().personal_information_verified"
            class="me-1"
          ></check>
          <span v-if="USER().personal_information_verified">
            {{ $t("user_profile.success_kyc") }}</span
          >
        </div>
      </s-value-dashed>

      <div class="widget-buttons">
        <v-btn color="primary" text large :href="kyc_url" target="_blank">
          <v-icon small class="me-1">edit</v-icon>
          {{ $t("user_profile.edit_personal_info") }}
        </v-btn>
      </div>

      <template v-if="getClub()">
        <hr class="my-4" />

        <v-subheader>
          {{ $t("user_profile.club") }}
        </v-subheader>
        <div class="text-center">
          <img
            :src="getCustomerClubLevel(getClub().level).icon"
            width="48"
            height="48"
            class="mx-auto d-block"
            :title="$t('user_profile.club')"
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
              <v-icon color="success" small>fas fa-shipping-fast</v-icon>
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
        <v-btn color="#D32F2F" class="m-2" text @click="LeaveShop" large>
          <v-icon small class="me-1">block</v-icon>
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
                  this.$t("user_profile.notifications.leave_success")
                );
                this.LogoutProcess();
              } else {
                this.showErrorAlert(null, data.error_msg);
              }
            })
            .catch((error) => {
              this.showLaravelError(error);
            });
        }
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
                : "Unsubscribe successfully."
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

<style scoped lang="scss">
.widget {
  min-height: 150px;
}
</style>
