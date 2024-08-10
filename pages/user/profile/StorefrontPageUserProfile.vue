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
  <v-container v-if="USER()" fluid>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Image ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <div class="text-center d-flex flex-column">
        <v-avatar
          class="my-2 mx-auto avatar-gradient -thin"
          color="#fff"
          size="96"
        >
          <v-img :src="getUserAvatar(USER().id)" />
        </v-avatar>

        <h2 class="text-uppercase font-weight-light my-3">
          {{ customer ? customer.name : USER().name }}
        </h2>
        <p class="text-subtitle-2">
          {{ customer ? customer.email : USER().email }}
          <v-icon
            v-if="USER().email_verified"
            class="ms-1"
            color="success"
            size="small"
          >
            check_circle
          </v-icon>
        </p>

        <v-btn
          :loading="busy_logout"
          class="mb-3"
          variant="text"
          @click="
            busy_logout = true;
            Logout(() => (busy_logout = false));
          "
        >
          <v-icon class="me-1" size="small">logout</v-icon>
          {{ $t("global.actions.logout") }}
        </v-btn>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Profile ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <template v-if="customer">
        <hr class="my-4" />

        <s-widget-header
          :title="'My Buyer Profile'"
          icon="perm_identity"
          add-icon="edit"
          :add-caption="'Edit My Profile'"
          @click:add="showEditProfile"
        >
        </s-widget-header>

        <v-list-subheader>
          It's my customer profile information in the store.
        </v-list-subheader>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">badge</v-icon>

              {{ $t("global.commons.name") }}
            </v-list-subheader>
          </template>
          <b>{{ customer.name }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">phone</v-icon>

              {{ $t("global.commons.phone") }}
            </v-list-subheader>
          </template>
          <b>{{ customer.phone }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">email</v-icon>

              {{ $t("global.commons.email") }}
            </v-list-subheader>
          </template>
          <b>{{ customer.email }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed v-if="customer.birthday">
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">cake</v-icon>
              {{ $t("global.commons.birthday") }}
            </v-list-subheader>
          </template>
          <b>{{ getLocalDateString(customer.birthday) }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">currency_exchange</v-icon>
              {{ $t("global.commons.currency") }}
            </v-list-subheader>
          </template>

          <u-currency-icon
            v-if="customer.currency"
            :currency="customer.currency"
            flag-only
            class="mx-1"
          ></u-currency-icon>
          <b>
            {{ customer.currency }}
          </b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">map</v-icon>

              {{ $t("global.commons.country") }}
            </v-list-subheader>
          </template>
          <flag
            v-if="customer.country"
            :iso="customer.country"
            :squared="false"
            class="ms-1 me-2"
          />

          <b>{{ customer.country }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">delivery_dining</v-icon>

              {{ $t("global.commons.address") }}
            </v-list-subheader>
          </template>
          <b>{{
            MapHelper.GenerateFullAddressFromMapInfo(customer.address)
          }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">person_add</v-icon>

              {{ $t("global.commons.register_at") }}
            </v-list-subheader>
          </template>
          <b>{{ getLocalDateString(customer.created_at) }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed v-if="customer.purchase_at">
          <template v-slot:label>
            <v-list-subheader>
              <v-icon class="me-1">local_mall</v-icon>

              {{ $t("global.commons.order") }}
            </v-list-subheader>
          </template>
          <b>{{ getLocalDateString(customer.purchase_at) }}</b>
        </u-text-value-dashed>
      </template>

      <hr class="my-4" />

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

      <u-text-value-dashed>
        <template v-slot:label>
          <v-list-subheader>
            <v-icon class="me-1">mail_outline</v-icon>

            {{ $t("user_profile.subscription") }}
          </v-list-subheader>
        </template>

        <v-btn
          :color="!isSubscribed ? 'primary' : 'success'"
          :loading="busy_subscribe"
          :variant="isSubscribed ? 'elevated' : 'text'"
          size="small"
          @click="toggleSubscribe"
          class="tnt"
        >
          <v-icon v-if="isSubscribed" start>check_circle</v-icon>
          {{
            isSubscribed
              ? $t("global.commons.subscribed")
              : $t("global.commons.unsubscribed")
          }}
        </v-btn>
      </u-text-value-dashed>

      <v-list-subheader>
        {{
          isSubscribed
            ? "I will receive the latest news and promotions by email."
            : "I don't want to receive any news or promotions by email."
        }}
      </v-list-subheader>
    </div>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Club ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div v-if="club" class="widget-box mb-5">

      <s-widget-header
          :title="$t('global.commons.club')"
          icon="groups"

      >
      </s-widget-header>

      <v-list-subheader>
    My club level and benefits.
      </v-list-subheader>
      <div class="text-center">
        <img
          :src="getCustomerClubLevel(club.level).icon"
          :title="$t('user_profile.club')"
          class="mx-auto d-block"
          height="48"
          width="48"
        />
        <p class="font-weight-bold">
          {{ $t(getCustomerClubLevel(club.level).name) }}
        </p>
        <p class="">
          {{ club.description }}
        </p>

        <div class="d-flex border-between py-2">
          <div class="flex-grow-1">
            <small class="d-block">{{
              $t("user_profile.club_table.discount")
            }}</small>
            <p class="font-weight-bold">%{{ club.percent }}</p>
          </div>

          <div class="flex-grow-1">
            <small class="d-block">{{
              $t("user_profile.club_table.limit")
            }}</small>
            <u-price
              :amount="club.limit"
              :currency="club.currency"
            ></u-price>
          </div>

          <div v-if="club.free_shipping" class="flex-grow-1">
            <small class="d-block">{{
                $t("user_profile.club_table.free_shipping")
              }}</small>
            <v-icon color="success" size="small"
              >fa:fas fa-shipping-fast
            </v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ KYC ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <s-widget-header
        :title="$t('user_profile.title')"
        icon="fingerprint"
        :href="kyc_url"
        add-icon="edit"
        :add-caption="$t('user_profile.edit_personal_info')"
        add-text
      >
      </s-widget-header>
      <v-list-subheader>
        It's my global identification information.
      </v-list-subheader>

      <u-text-value-dashed>
        <template v-slot:label>
          <v-list-subheader>
            {{ $t("user_profile.tel") }}
          </v-list-subheader>
        </template>
        <b>{{ USER().phone }}</b>
      </u-text-value-dashed>

      <u-text-value-dashed>
        <template v-slot:label>
          <v-list-subheader>
            {{ $t("user_profile.identity") }}
          </v-list-subheader>
        </template>
        <v-chip
          v-if="USER().personal_information_verified"
          color="green"
          variant="tonal"
          pill
          size="small"
        >
          {{ $t("user_profile.success_kyc") }}
        </v-chip>
        <v-chip v-else color="#333" variant="tonal" pill size="small">
          {{ $t("user_profile.no_kyc") }}
        </v-chip>
      </u-text-value-dashed>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Leave ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5" style="border-top: red solid 4px">

      <p class="text-start text-subtitle-2">
        <v-icon class="me-1">report_problem</v-icon>
        {{ $t("user_profile.leave_shop") }}
      </p>

      <div class="widget-buttons">
        <v-btn
          class="m-2"
          color="#D32F2F"
          size="large"
          variant="text"
          @click="LeaveShop"
        >
          <v-icon class="me-1" size="small">block</v-icon>
          {{ $t("user_profile.leave_shop_action") }}
        </v-btn>
      </div>
    </div>

    <v-dialog
      v-model="dialog_profile"
      scrollable
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title></v-card-title>

        <v-card-text v-if="clone_customer">
          <div class="widget-box mb-5">
            <s-widget-header :title="'My Buyer Profile'" icon="perm_identity">
            </s-widget-header>

            <v-text-field
              prepend-inner-icon="badge"
              :label="$t('global.commons.name')"
              variant="underlined"
              v-model="clone_customer.name"
            >
            </v-text-field>

            <v-text-field
              prepend-inner-icon="phone"
              :label="$t('global.commons.phone')"
              variant="underlined"
              v-model="clone_customer.phone"
            >
            </v-text-field>

            <v-text-field
              prepend-inner-icon="email"
              :label="$t('global.commons.email')"
              variant="underlined"
              v-model="clone_customer.email"
            >
            </v-text-field>
            <!-- TODO: We can add verify email and phone as an option for sellers here -->

            <u-date-input
              v-model="clone_customer.birthday"
              variant="underlined"
              :label="$t('global.placeholders.birthday')"
              :max="new Date()"
              :placeholder="'Select your birthday...'"
              clearable
              date-only
              type="date"
              prepend-inner-icon="cake"
            />

            <u-currency-input
              prepend-inner-icon="currency_exchange"
              :title="$t('global.commons.currency')"
              v-model="clone_customer.currency"
              variant="underlined"
            >
            </u-currency-input>

            <s-country-select
              v-model="clone_customer.country"
              prepend-inner-icon="map"
              :title="$t('global.commons.country')"
              variant="underlined"
              item-value="alpha2"
            ></s-country-select>

            <v-textarea
              prepend-inner-icon="delivery_dining"
              :title="$t('global.commons.address')"
              variant="underlined"
              :model-value="
                MapHelper.GenerateFullAddressFromMapInfo(clone_customer.address)
              "
              readonly
              @click="showSelectLocation()"
              placeholder="Enter your address..."
              :rows="2"
              auto-grow
            >
            </v-textarea>
          </div>
        </v-card-text>

        <v-card-actions>
          <div class="widget-buttons">
            <v-btn
              size="x-large"
              variant="text"
              @click="dialog_profile = false"
            >
              <v-icon start>close</v-icon>
              {{ $t("global.actions.close") }}
            </v-btn>

            <v-btn
              size="x-large"
              variant="elevated"
              :loading="busy_save"
              @click="saveProfile"
              color="primary"
            >
              <v-icon start>save</v-icon>
              {{ $t("global.actions.save") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { SetupService } from "@selldone/core-js/server/SetupService";
import UTextValueDashed from "@selldone/components-vue/ui/text/value-dashed/UTextValueDashed.vue";
import { MapHelper } from "@selldone/core-js";
import UCurrencyIcon from "@selldone/components-vue/ui/currency/icon/UCurrencyIcon.vue";
import SWidgetHeader from "@selldone/components-vue/ui/widget/header/SWidgetHeader.vue";
import UDateInput from "@selldone/components-vue/ui/date/input/UDateInput.vue";
import UCurrencyInput from "@selldone/components-vue/ui/currency/input/UCurrencyInput.vue";
import SCountrySelect from "@selldone/components-vue/ui/country/select/SCountrySelect.vue";
import UTelInput from "@selldone/components-vue/ui/tel-input/UTelInput.vue";

export default {
  name: "StorefrontPageUserProfile",
  components: {
    UDateInput,
    UTextValueDashed,
    UCurrencyIcon,
    SWidgetHeader,
    UCurrencyInput,
    SCountrySelect,
  },
  props: {
    shop: {
      require: true,
    },
  },
  data: () => {
    return {
      MapHelper: MapHelper,

      busy_subscribe: false,
      busy_logout: false,

      clone_customer: null,
      dialog_profile: false,
      busy_save: false,
    };
  },
  computed: {
    isSubscribed() {
      return this.USER()?.subscribed;
    },

    kyc_url() {
      return SetupService.MainServiceUrl() + "/shuttle/kyc";
    },

    customer() {
      return this.USER().customer;
    },

    club(){
      return this.getClub()
    }
  },
  methods: {
    showEditProfile() {
      this.dialog_profile = true;
      this.clone_customer = JSON.parse(JSON.stringify(this.customer));
    },

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

    saveProfile() {
      this.busy_save = true;

      axios
        .post(
          window.XAPI.POST_SAVE_MY_CUSTOMER_PROFILE(this.shop_name),
          this.clone_customer,
        )
        .then(({ data }) => {
          if (!data.error) {
            this.USER().customer = data.customer;
            this.dialog_profile = false;

            this.showSuccessAlert(null, "My profile updated successfully.");
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_save = false;
        });
    },

    showSelectLocation() {
      let center = { lat: 0, lng: 0 };
      if (this.clone_customer?.address?.location)
        center = this.clone_customer.address.location;

      this.showMap(
        center,
        null,
        this.clone_customer.address,
        (info) => {
          Object.assign(this.clone_customer.address, info);
          this.closeMap();
        },
        false,
      );
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
