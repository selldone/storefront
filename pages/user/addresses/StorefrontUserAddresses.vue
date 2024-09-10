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

    <div class="widget-box -large mb-5">
      <s-widget-header
        :title="$t('addresses_page.title')"
        icon="fmd_good"
        :add-caption="$t('addresses_page.new_action')"
        @click:add="showAdd"
        add-icon="add_location"
      ></s-widget-header>

      <v-list-subheader>{{ $t("addresses_page.subtitle") }}</v-list-subheader>

      <u-loading-progress v-if="busy"></u-loading-progress>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Address  ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <v-list
        lines="three"
        class="border-between-vertical"
        bg-color="transparent"
      >
        <v-list-item v-for="address in addresses" :key="address.id">
          <template v-slot:prepend>
            <u-avatar-folder
              elevated
              placeholder-icon="map"
              side-icon="place"
              is-gray
              :src="`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${address.location.lng},${address.location.lat},13.96,0,0/200x200?access_token=pk.eyJ1IjoicGFqdWhhYW4iLCJhIjoiY2sxaHNtbnU3MDFjcjNta2V0OTZ0d2ExYiJ9.YKRh0EP7NnhbmuSil7AvSw`"
            >
            </u-avatar-folder>
          </template>

          <v-list-item-title>
            <flag
              v-if="address.country"
              :iso="address.country"
              :squared="false"
              class="me-3"
            />
            <b>{{ address.title }}</b>
          </v-list-item-title>

          <v-list-item-subtitle class="mt-1">
            {{ getFullAddress(address) }}
          </v-list-item-subtitle>

          <v-list-item-subtitle v-if="address.message" class="mt-1">
            <v-icon class="me-1">textsms</v-icon>
            {{ address.message }}
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-list-item-action end>
              <v-btn
                @click="showEdit(address)"
                prepend-icon="edit"
                size="small"
              >
                {{ $t("global.actions.edit") }}
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </div>

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
        v-model:center="center"
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
              prepend-icon="close"
            >
              {{ $t("global.actions.cancel") }}
            </v-btn>
            <v-btn
              :class="{ disabled: !new_address_title }"
              color="primary"
              variant="elevated"
              size="x-large"
              @click="onSetAddressTitle()"
            >
              {{ $t("global.actions.next") }}
              <v-icon end>{{ $t("icons.chevron_next") }}</v-icon>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import UMapViewPin from "@selldone/components-vue/ui/map/view/market/UMapViewPin.vue";
import SWidgetHeader from "@selldone/components-vue/ui/widget/header/SWidgetHeader.vue";
import { MapHelper } from "@selldone/core-js/helper";
import UAvatarFolder from "@selldone/components-vue/ui/avatar/folder/UAvatarFolder.vue";

export default {
  name: "StorefrontUserAddresses",
  components: { UAvatarFolder, SWidgetHeader, UMapViewPin },
  data() {
    return {
      addresses: [],
      busy: false,

      // Map

      map_dialog: false,
      dialog_pre: false,

      center: { lat: 0, lng: 0 },
      startup_mode_map_dialog: "default", // detail

      map_location: {},

      // New address:
      dialog_add_to_address_book: false,
      new_address_title: null,
      selected_address: null,

      selected_address_from_list_id: null,
      selected_address_from_list_title: null,

      busy_save: false,
    };
  },

  created() {
    this.setPageTitle("My address book"); // Set Page Title!

    this.fetchAddressBook();
  },

  methods: {
    getFullAddress(address) {
      return MapHelper.GenerateFullAddressFromMapInfo(address);
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

    showAdd() {
      this.new_address_title = "";
      this.selected_address = null;
      this.dialog_add_to_address_book = true;
    },
    showEdit(address) {
      this.new_address_title = address.title;
      this.selected_address = address;
      this.dialog_add_to_address_book = true;
    },

    onSetAddressTitle() {
      this.dialog_add_to_address_book = false;
      if (this.selected_address) {
        this.editAddress(this.selected_address);
      } else {
        this.addNewLocation();
      }
    },

    editAddress(address) {
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

    onClickSetLocation(address) {
      if (this.selected_address) {
        this.updateAddress(address);
      } else {
        this.addAddress(address);
      }
    },

    addAddress(pack) {
      this.busy_save = true;

      axios
        .post(window.ADDRESS_API.POST_ADDRESS(), {
          title: this.new_address_title,

          country: pack.country,
          state: pack.state,
          state_code: pack.state_code,
          city: pack.city,
          address: pack.address,
          location: pack.location,
          no: pack.no,
          unit: pack.unit,
          name: pack.name,
          phone: pack.phone,
          message: pack.message,
          postal: pack.postal,
        })
        .then(({ data }) => {
          if (!data.error) {
            this.showSuccessAlert(
              null,
              this.$t("global.map_view.notifications.save_in_list"),
            );
            this.AddOrUpdateItemByID(this.addresses, data.address);
            this.$emit("update:modelValue", null);

            this.map_dialog = false;
            this.fetchAddressBook();
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

    updateAddress(pack) {
      this.busy_save = true;
      axios
        .put(window.ADDRESS_API.PUT_ADDRESS(this.selected_address.id), {
          title: this.new_address_title,

          country: pack.country,
          state: pack.state,
          state_code: pack.state_code,
          city: pack.city,
          address: pack.address,
          location: pack.location,
          no: pack.no,
          unit: pack.unit,
          name: pack.name,
          phone: pack.phone,
          message: pack.message,
          postal: pack.postal,
        })
        .then(({ data }) => {
          if (!data.error) {
            this.UpdateItemByID(this.addresses, data.address);
            this.showSuccessAlert(
              null,
              this.$t("global.map_view.notifications.edit_success", {
                title: data.address.title,
              }),
            );
            this.map_dialog = false;
            this.fetchAddressBook();
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
  },
};
</script>

<style lang="scss" scoped></style>
