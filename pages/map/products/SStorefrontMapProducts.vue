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
  <div class="map-con text-start">
    <div v-if="!$vuetify.breakpoint.xsOnly" class="map-items thin-scroll">
      <!-- ▂▂▂▂▂▂▂▂▂▂▂▂▂▂ Products List > Desktop ▂▂▂▂▂▂▂▂▂▂▂▂▂▂ -->

      <s-storefront-products-listing
        v-if="bounds"
        :shop="getShop()"
        has-sort
        has-filter
        has-breadcrumb
        route-mode
        load-more
        free-mode
        :location-bounds="bounds"
        @fetch-products="onfetchProducts"
        @product-hover:enter="(p) => productHover(p, true)"
        @product-hover:leave="(p) => productHover(p, false)"
      ></s-storefront-products-listing>
    </div>
    <div class="map-viewer" :class="{ '-full': $vuetify.breakpoint.xsOnly }">
      <!-- Pre loading -->
      <s-loading
        css-mode
        light
        v-if="!map_box"
        class="center-absolute"
      ></s-loading>
      <!-- MAP -->
      <div :id="`map_box${map_id}`" class="-map"></div>

      <!-- ▄▄▄▄▄▄▄▄▄▄▄ Search ▄▄▄▄▄▄▄▄▄▄▄ -->
      <div class="map-search-box">
        <s-address-input
          v-model="address"
          @select:address="(it) => onSelectAddress(it)"
          :center="center"
          bottom
          rounded
          solo
          hide-details
          :rows="1"
          prepend-icon="near_me"
          prepend-icon-color="#222"
        ></s-address-input>

        <div style="text-shadow: 1px 1px 3px #fff" class="pt-1 pen usn">
          <flag v-if="country" :iso="country" :squared="false" />
          <span v-if="state" class="mx-1">
            <v-icon>{{ $t("icons.chevron_next") }}</v-icon>
            {{ state }}
          </span>

          <span v-if="state">
            <v-icon class="mx-1">{{ $t("icons.chevron_next") }}</v-icon>
            {{ city }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="$vuetify.breakpoint.xsOnly"
      class="bottom-sheet overflow-auto"
      ref="bsheet"
    >
      <v-card class="-card">
        <div
          class="pa-3 pp"
          @click="
            scrollBottomSheet(
              $refs.bsheet.scrollTop > 300 ? 0 : window.innerHeight * 0.8
            )
          "
        >
          <div
            style="
              background-color: #eee;
              border-radius: 2px;
              height: 4px;
              width: 120px;
              margin: auto;
            "
          ></div>
        </div>
        <v-card-text style="padding-bottom: 20vh" class="px-0">
          <!-- ▂▂▂▂▂▂▂▂▂▂▂▂▂▂ Products List > Mobile ▂▂▂▂▂▂▂▂▂▂▂▂▂▂ -->

          <s-storefront-products-listing
            v-if="bounds"
            :shop="getShop()"
            has-sort
            has-filter
            has-breadcrumb
            route-mode
            load-more
            free-mode
            :location-bounds="bounds"
            @fetch-products="onfetchProducts"
            @product-hover:enter="(p) => productHover(p, true)"
            @product-hover:leave="(p) => productHover(p, false)"
          ></s-storefront-products-listing>
        </v-card-text>
      </v-card>
    </div>

    <!-- ██████████████████████ Dialog > Share ██████████████████████ -->

    <v-bottom-sheet
      v-model="share_sheet"
      inset
      max-width="860"
      width="98%"
      dark
      scrollable
      content-class="rounded-t-xl overflow-hidden"
    >
      <v-card color="#111" class="text-start position-relative" tile>
        <v-btn @click="share_sheet = false" class="absolute-top-end" icon
          ><v-icon>close</v-icon></v-btn
        >

        <v-card-title class="font-weight-bold">
          <v-icon class="me-1">share</v-icon> {{ share_title }}
        </v-card-title>

        <v-card-text>
          <v-carousel
            v-if="share_products && share_products.length"
            cycle
            height="500"
            hide-delimiter-background
            show-arrows-on-hover
            class="py-12"
          >
            <v-carousel-item
              v-for="product in share_products"
              :key="product.id"
            >
              <v-sheet height="100%" class="py-5" color="transparent">
                <s-shop-product-card
                  :product="product"
                  class="max-w-400 mx-auto d-block"
                  rounded
                  :to="{
                    name: window.$storefront.routes.PRODUCT_PAGE,
                    params: {
                      shop_name: shop_name,
                      product_id: product.id,
                    },
                  }"
                  target="_blank"
                ></s-shop-product-card>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>

          <s-value-copy-box
            :value="share_url"
            small-width-mode
            background-color="#111"
            color="#1976D2"
            class="my-7"
          ></s-value-copy-box>
          <div style="min-height: 72px" class="d-sm-none d-block"></div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import Mapbox from "@components/map/plugins/MapBox";
import { SetupService } from "@core/server/SetupService";
import SStorefrontProductsListing from "@components/storefront/products-listing/SStorefrontProductsListing.vue";
import SAddressInput from "@components/ui/input/address/SAddressInput.vue";
import SValueCopyBox from "@components/ui/text/SValueCopyBox.vue";
import SShopProductCard from "@components/product/card/SShopProductCard.vue";
import _ from "lodash-es";

export default {
  name: "SStorefrontMapProducts",
  components: {
    SShopProductCard,
    SValueCopyBox,
    SAddressInput,
    SStorefrontProductsListing,
  },

  data() {
    return {
      map_box: null,
      map_id: Math.round(Math.random() * 999999),

      center: null,
      zoom: 13,
      hideLocationButtons: false,

      expand: false,

      bounds: null,

      markers: [],

      products: [],
      // ▄▄▄▄▄ Search ▄▄▄▄▄
      address: null,
      country: null,
      state: null,
      city: null,

      // ▄▄▄▄▄ Share ▄▄▄▄▄
      share_sheet: false,
      share_url: null,
      share_title: null,
      share_products: [],
    };
  },

  computed: {
    shop() {
      return this.getShop();
    },
    map() {
      return this.shop.map;
    },
  },

  watch: {
    center(center) {
      this.zoom = this.map_box.getZoom();
      localStorage.setItem(
        "map:keeper",
        JSON.stringify({
          center: center,
          zoom: this.zoom,
        })
      ); // Keep last location on the map
    },
  },
  created() {},

  mounted() {
    // Make sure all animation ends:
    _.delay(() => {
      this.initialize();
    }, 1000);
  },

  methods: {
    initialize() {
      let auto_go_my_location = true;

      if (localStorage.getItem("map:keeper")) {
        try {
          const keeper = JSON.parse(localStorage.getItem("map:keeper"));
          this.center = keeper.center;
          this.zoom = keeper.zoom;
          if (this.zoom > 20 || this.zoom < 2) this.zoom = 13;
          auto_go_my_location = false;
        } catch (e) {
          console.error(e);
        }
      }

      if (!this.center) {
        this.center = this.$store.getters.getInitialLocation;
      }

      // Override by location query (Share location url)
      if (this.$route.query.lat && this.$route.query.lng) {
        this.center = {
          lat: this.$route.query.lat,
          lng: this.$route.query.lng,
        };
        this.zoom = 11;
      }

      this.map_box = new Mapbox.Map({
        container: "map_box" + this.map_id,
        style: SetupService.MapStyle(),
        center: [this.center.lng, this.center.lat],
        zoom: this.zoom,
      });

      //--------------------------------------------------
      // Add onClick listener to markers:

      // Override internal functionality
      Mapbox.Marker.prototype.onClick = function (handleClick) {
        this._handleClick = handleClick;
        return this;
      };
      Mapbox.Marker.prototype._onMapClick = function (t) {
        const targetElement = t.originalEvent.target;
        const element = this._element;
        if (
          this._handleClick &&
          (targetElement === element || element.contains(targetElement))
        ) {
          this.togglePopup();
          this._handleClick();
        }
      };
      //--------------------------------------------------

      if (!this.hideLocationButtons) {
        // Add geolocation control to the map.

        this.locateControl = new Mapbox.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: false,
        });
        this.map_box.addControl(this.locateControl);

        // Add zoom and rotation controls to the map.
        if (this.$vuetify.breakpoint.mdAndUp) {
          this.map_box.addControl(new Mapbox.NavigationControl());

          this.map_box.addControl(new Mapbox.FullscreenControl());
        }
      }

      this.map_box.on("load", () => {
        console.log("🗺 Map loaded!");

        if (auto_go_my_location) this.goToMyLocation();

        const b = this.map_box.getBounds();
        this.bounds = [b._ne.lng, b._ne.lat, b._sw.lng, b._sw.lat];
      });

      this.map_box.on("move", () => {
        this.center = this.map_box.getCenter();
        const b = this.map_box.getBounds();
        this.bounds = [b._ne.lng, b._ne.lat, b._sw.lng, b._sw.lat];
      });
    },

    goToMyLocation() {
      navigator.geolocation.getCurrentPosition((location, error) => {
        if (error) {
          console.error("Get current location", error);
          return;
        }

        console.log("🗺 My location.");

        if (location) {
          this.center = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          this.map_box.jumpTo({
            center: [this.center.lng, this.center.lat],
            zoom: this.zoom,
          });

          this.zoom = 13;
        }
      });
    },

    scrollBottomSheet(val) {
      $(this.$refs.bsheet).animate(
        {
          scrollTop: val,
        },
        1000
      );
    },
    // ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ On Fetch Products ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆

    onfetchProducts({ products, folders, total }) {
      this.products = products;

      if (!this.map_box) return; // Not initialized yet!

      const map_tags = [];

      // Remove previous markers: (keep last 100 pins)
      this.markers.slice(100).forEach((marker) => {
        marker.remove();
        this.markers.remove(marker);
      });
      // this.markers = [];

      products.forEach((product) => {
        if (!product.map) return;

        const found = map_tags.find((i) => i.id === product.map.id);
        if (found) {
          // Just some updates!
          ++found.count;
          return;
        }

        // Add new tag:
        map_tags.push(
          Object.assign(
            { price: product.price, currency: product.currency, count: 1 },
            product.map
          )
        );
      });

      map_tags.forEach((map_tag) => {
        // Make sure not added before:
        if (this.markers.some((i) => i.map_tag.id === map_tag.id)) return;

        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "loc-pin";
        el.append(
          `${map_tag.price} ${map_tag.currency}` +
            (map_tag.count > 1 ? ` (${map_tag.count})` : "")
        );

        const marker = new Mapbox.Marker({
          color: "#FFFFFF",
          element: el,
          anchor: "bottom",
        })
          .setLngLat([map_tag.lng, map_tag.lat])
          .onClick(() => {
            console.log("🗺  Click on map tag", map_tag);
            this.showShare(map_tag);
            //map.setCenter([lon, lat]);
          })
          .addTo(this.map_box);

        marker.map_tag = map_tag; // Add extra data!

        this.markers.unshift(marker);

        // console.log("marker", marker);
      });
    },

    // ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ On Hover Product ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆
    productHover(product, enter) {
      // 1. find corresponding marker:
      const marker = this.markers.find((i) => i.map_tag.id === product.map.id);
      if (!marker) return;
      // 2. Set scale:

      if (enter) {
        const image = this.getShopImagePath(product.icon, 128);
        marker.setPopup(
          new Mapbox.Popup({ offset: 32, maxWidth: 120 }).setHTML(
            `<div class="text-center"><img class="mb-1 rounded-16px" style="object-fit: cover" src='${image}' width="84" height="84"><div class="small font-weight-bold max-w-120 single-line">${product.title}</div></div>`
          )
        ); // add popup
        marker.togglePopup();
        //console.log("marker > add popup");
      } else {
        marker.getPopup()?.remove(); // clear popup
        //console.log("marker > remove popup", marker.getPopup());
      }
    },
    // ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ On Select address ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆

    onSelectAddress(item) {
      console.log("🗺 Select Address", item);

      if (item.geometry && item.geometry.type === "Point") {
        this.center = {
          lat: item.geometry.coordinates[1],
          lng: item.geometry.coordinates[0],
        };

        this.address = item.address;

        // Set country:
        this.country = item.country;
        this.state = item.state;
        this.city = item.city;

        if (!this.map_box) return;
        this.map_box.flyTo({
          center: [this.center.lng, this.center.lat],
          zoom: this.zoom,
        });
      }
    },

    // ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆ Share map tag ▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆
    showShare(map_tag) {
      this.share_title = `${this.shop.title} | ${this.$t(
        "global.commons.map"
      )}`;
      this.share_products = this.products?.filter(
        (p) => p.map_id === map_tag.id
      );
      this.share_url =
        this.getShopMainUrl(this.shop) +
        `/map?lat=${map_tag.lat}&lng=${map_tag.lng}`;
      this.share_sheet = true;
    },
  },
};
</script>

<style scoped lang="scss">
.map-con {
  height: calc(100vh - 64px);
  display: flex;
  position: relative;
  background-color: #fff;
  padding: 0 !important;

  .map-items {
    flex-grow: 1;
    height: 100%;
    overflow: auto;
    position: relative;
  }
  .map-viewer {
    position: relative;
    flex-grow: 0.4;

    height: 100%;
    min-width: 40%;
    display: flex;

    &.-full {
      min-width: 100%;
      flex-grow: 1;
      .-map {
        margin: 12px 0 0 0;
        border-radius: 0;
      }
    }

    .-map {
      flex-grow: 1;
      margin: 12px;
      background-color: #e6e4e0;
      border-radius: 20px;
      overflow: hidden;
    }
  }

  .map-search-box {
    position: absolute;
    left: 64px;
    right: 64px;
    top: 24px;
    z-index: 11;
    //background-color: #fff;
  }
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;
  transition: all 0.4s;
  padding-top: 80vh;
  pointer-events: none;
  z-index: 10;

  .-card {
    padding: 0 4px 84px 4px;
    pointer-events: auto;

    background-color: #fff;
    border-radius: 20px 20px 0 0;
    min-height: 30px;
    width: 100%;
    contain: none;
    will-change: unset;
  }
}
</style>

<style lang="scss">
.loc-pin {
  background-color: #222;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 8px;
}
</style>
