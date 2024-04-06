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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="py-10">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Add  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div class="widget-box mb-5">
      <s-widget-header
        :title="$t('addresses_page.title')"
        icon="fmd_good"
      ></s-widget-header>

      <v-list-subheader></v-list-subheader>

      <u-loading-progress v-if="busy"></u-loading-progress>
      <div class="widget-buttons">
        <v-btn
          color="success"
          variant="flat"
          size="x-large"
          @click="dialog_add_to_address_book = true"
        >
          <v-icon class="me-1">add_location</v-icon>
          {{ $t("addresses_page.new_action") }}
        </v-btn>
      </div>
    </div>

    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Address  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-fade-transition group hide-on-leave>
      <div
        v-for="address in addresses"
        :key="address.id"
        class="widget-box mb-5 address-card"
      >
        <s-widget-header
          :title="address.title"
          add-text
          :add-caption="$t('global.actions.edit')"
          add-icon="edit"
          @click:add="editAddress(address)"
        ></s-widget-header>
        <v-list-subheader></v-list-subheader>

        <u-text-value-dashed>
          <template v-slot:label>{{ $t("addresses_page.receiver") }}</template>
          <b class="max-w-300"> {{ address.name }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>{{ $t("addresses_page.address") }}</template>
          <b class="max-w-300"> {{ address.address }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label
            >{{ $t("addresses_page.building_no") }}
          </template>
          <b> {{ address.no }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label
            >{{ $t("addresses_page.building_unit") }}
          </template>
          <b> {{ address.unit }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>{{ $t("addresses_page.postcode") }}</template>
          <b> {{ address.postal }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label>{{ $t("addresses_page.tel") }}</template>
          <b> {{ address.phone }}</b>
        </u-text-value-dashed>

        <u-text-value-dashed>
          <template v-slot:label
            >{{ $t("addresses_page.description") }}
          </template>
          <b> {{ address.message }}</b>
        </u-text-value-dashed>

        <div class="position-relative">
          <div class="position-relative map-circle ma-auto">
            <img
              :src="`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${address.location.lng},${address.location.lat},13.96,0,0/200x200?access_token=pk.eyJ1IjoicGFqdWhhYW4iLCJhIjoiY2sxaHNtbnU3MDFjcjNta2V0OTZ0d2ExYiJ9.YKRh0EP7NnhbmuSil7AvSw`"
              class="map-image"
            />
            <u-map-view-pin class="map-pointer"></u-map-view-pin>
          </div>
        </div>
      </div>
    </v-fade-transition>

    <!-- Select Address -->

    <v-dialog
      v-model="map_dialog"
      content-class="bg-map"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <u-map-view
        v-if="dialog_pre"
        ref="map_view_dialog"
        v-model="map_location"
        :address-type="$t('addresses_page.map.address_type')"
        :center="center"
        :color="SaminColorDark"
        :confirm-text="$t('addresses_page.map.confirm')"
        :new-address-title="new_address_title"
        :receptor-type="$t('addresses_page.map.receptor_type')"
        :selected-address-id="selected_address_from_list_id"
        :selected-address-title="selected_address_from_list_title"
        :startup-mode="startup_mode_map_dialog"
        :title="$t('addresses_page.map.title')"
        :zoom="17"
        can-select-address
        has-address-book
        has-bottom-bar
        has-top-bar
        style="width: 100%; height: 100%"
        @clickSetLocation="onClickSetLocation"
        @close="map_dialog = false"
      />
    </v-dialog>

    <v-dialog
      v-model="dialog_add_to_address_book"
      :max-width="640"
      content-class="rounded-xl"
    >
      <v-card class="text-start">
        <v-card-title>
          {{ $t("addresses_page.add_dialog.title") }}
        </v-card-title>
        <v-card-subtitle>
          {{ $t("addresses_page.add_dialog.message") }}
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="new_address_title"
            :color="SaminColorLight"
            :label="$t('addresses_page.add_dialog.address_name_input')"
            class="text-right mx-2"
            prepend-inner-icon="fa:fas fa-tag"
            variant="outlined"
          >
            <template v-slot:append-inner>
              <v-fade-transition leave-absolute>
                <v-icon v-if="new_address_title" color="success">
                  check_circle
                </v-icon>
              </v-fade-transition>
            </template>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <div class="widget-buttons">
            <v-btn
              color="default"
              variant="text"
              size="x-large"
              @click="dialog_add_to_address_book = false"
            >
              {{ $t("global.actions.cancel") }}
            </v-btn>
            <v-btn
              :class="{ disabled: !new_address_title }"
              color="primary"
              variant="flat"
              size="x-large"
              @click="addNewLocation()"
            >
              {{ $t("global.actions.accept") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UMapViewPin from "@components/ui/map/view/market/UMapViewPin.vue";
import UTextValueDashed from "@components/ui/text/value-dashed/UTextValueDashed.vue";
import SWidgetHeader from "@components/ui/widget/header/SWidgetHeader.vue";

export default {
  name: "StorefrontUserAddresses",
  components: { SWidgetHeader, UTextValueDashed, UMapViewPin },
  data() {
    return {
      addresses: [],
      busy: false,

      // Map

      map_dialog: false,
      dialog_pre: false,

      center: { lat: 35.715298, lng: 51.404343 },
      startup_mode_map_dialog: "default", // detail

      map_location: {},

      isNewAddress: false,

      // New address:
      dialog_add_to_address_book: false,
      new_address_title: null,
      selected_address_from_list_id: null,
      selected_address_from_list_title: null,
    };
  },

  created() {
    this.setPageTitle("My address book"); // Set Page Title!

    this.fetchAddressBook();
  },

  methods: {
    editAddress(address) {
      this.isNewAddress = false;

      this.selected_address_from_list_id = address.id;
      this.selected_address_from_list_title = address.title;

      this.map_location = address;
      this.center.lat = address.location.lat;
      this.center.lng = address.location.lng;

      this.dialog_pre = false;
      this.$nextTick(() => {
        this.dialog_pre = true;
        this.$nextTick(() => {
          this.map_dialog = true;
        });
      });
    },

    addNewLocation() {
      this.isNewAddress = true;

      this.selected_address_from_list_id = null;

      this.dialog_add_to_address_book = false;

      this.map_location = {};

      this.dialog_pre = false;
      this.$nextTick(() => {
        this.dialog_pre = true;
        this.$nextTick(() => {
          this.map_dialog = true;
        });
      });
    },

    fetchAddressBook() {
      this.busy = true;
      axios
        .get(window.ADDRESS_API.GET_MY_ADDRESSES())
        .then((response) => {
          if (!response.data.error) {
            this.addresses = response.data.addresses;
          } else {
            this.showErrorAlert(null, response.data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    onClickSetLocation() {
      if (this.isNewAddress) {
        this.$refs.map_view_dialog.saveCurrentPosition();
      } else {
        this.$refs.map_view_dialog.updateAddressBook();
      }
      this.map_dialog = false;
      this.fetchAddressBook();
    },
  },
};
</script>

<style lang="scss" scoped>
.address-card {
  &:hover {
    .map-image {
      transform: rotateX(55deg);
      box-shadow: 4px 15px 10px #0000001a;
    }
  }
}
</style>
