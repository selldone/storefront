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
  <div
    :style="{
      '--color-bg-1': theme?.color_bill ? theme.color_bill : SaminColorDarkDeep,
      '--color-bg-2': ShadeColor(
        theme?.color_bill ? theme.color_bill : SaminColorDarkDeep,
        -30
      ),
    }"
  >
    <v-card
      class="s--shop-card mb-16 s--shadow-no-padding -hide1720"
      :flat="isMobile"
      style="min-height: 80vh"
    >
      <v-toolbar flat color="transparent">
        <v-btn icon @click.stop="$router.go(-1)">
          <v-icon>{{ $t("icons.arrow_back") }}</v-icon>
        </v-btn>

        <v-toolbar-title class="body-title">
          {{ $t("basket_page.title") }}
        </v-toolbar-title>

        <v-spacer />
      </v-toolbar>

      <div class="text-center pt-2" v-if="filtered_types.length > 1">
        <s-circle-button
          v-for="item in filtered_types"
          :key="item.code"
          :src="item.image"
          @click="type = item.code"
          :tooltip="$t(item.name)"
          :disabled="!item.enable"
          :outline="type === item.code"
          has-badge
          :badge-number="getCount(item.code)"
          persist-badge
        />
      </div>

      <v-container
        v-if="basket && basket.items && basket.items.length"
        class="mt-4 blur-animate"
        style="max-width: 100%; overflow: hidden"
        :class="{ blured: busy_shop }"
      >
        <v-row dense>
          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
          <v-col lg="8" md="7" sm="6" cols="12" class="px-md-0 px-lg-3">
            <div
              class="widget-box -large mb-5 mt-2 min-height-50vh d-flex flex-column"
            >
              <s-shop-basket-items :items="items" :shop="shop" />

              <v-spacer></v-spacer>
              <!-- Share order - Secure link generator -->
              <s-shop-share-order-button
                :shop="shop"
                :basket="basket"
                class="mt-3 text-end"
              ></s-shop-share-order-button>
            </div>

            <!-- NOTE: In service all calculated by seller manually -->

            <s-storefront-coupons-list
              v-if="!isSubscription"
              force-show
              selectable
              v-model="basket.coupon"
              @input="selectCoupon"
              :basket="basket"
              return-object
              @loading="(val) => (refreshing_price = val)"
            ></s-storefront-coupons-list>

            <!-- NOTE: In service all calculated by seller manually -->

            <s-storefront-lottery-prizes-list
              v-if="!isSubscription"
              force-show
              selectable
              v-model="basket.lottery"
              @input="selectLottery"
              :basket="basket"
              return-object
              @loading="(val) => (refreshing_price = val)"
            >
            </s-storefront-lottery-prizes-list>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Receipt ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
          <v-col
            lg="4"
            md="5"
            sm="6"
            cols="12"
            class="receipt"
            :class="{ dark: !light_checkout }"
          >
            <v-sheet
              color="transparent"
              :dark="!light_checkout"
              class="receipt-bg m-0"
              :class="{
                success: canPayAndComplete,
                error: hasErrorInReceiverInfo,
              }"
            >
              <div class="receipt-container m-lg-2 m-md-1 position-relative">
                <s-progress-loading v-if="busy_save"></s-progress-loading>

                <div v-if="busy_bill" class="text-center">
                  <s-loading css-mode></s-loading>
                </div>
                <div v-else-if="bill">
                  <!-- START OF PRICES -->

                  <div class="font-weight-medium data-row">
                    <!-- SERVICE: Dont show price for service -->
                    <s-value-dashed>
                      <template v-slot:label>
                        {{ $t("basket_page.total_price") }}
                      </template>
                      <price-view :amount="raw_items_price" medium></price-view>
                    </s-value-dashed>
                  </div>

                  <!-- Delivery price -->

                  <div
                    v-if="!isService && receiver_info && is_valid_location"
                    class="font-weight-medium data-row"
                  >
                    <!-- SERVICE: Dont show price for service / Show shipping cost after user select address! -->
                    <s-value-dashed>
                      <template v-slot:label>
                        <i class="fas fa-shipping-fast me-1" />
                        {{ $t("basket_page.shipping") }}
                      </template>

                      <price-view
                        v-if="shipping_cost > 0"
                        :amount="shipping_cost"
                        medium
                      ></price-view>

                      <span v-else-if="shipping_cost === 0">
                        {{ $t("basket_page.free_shipping") }}
                      </span>

                      <span v-else>
                        {{ $t("basket_page.shipping_not_pay") }}
                      </span>
                    </s-value-dashed>
                  </div>

                  <!-- Products Discount -->

                  <div
                    v-if="total_items_discount"
                    class="data-row font-weight-medium"
                  >
                    <!-- SERVICE: Dont show price for service -->
                    <s-value-dashed>
                      <template v-slot:label>
                        <i class="fas fa-tags me-1" />
                        {{ $t("basket_page.total_discount") }}
                      </template>
                      <p class="text-success">
                        <price-view
                          :amount="-total_items_discount"
                          medium
                        ></price-view>

                        <span v-if="total_offers_amount">
                          <v-icon class="mx-1 align-baseline" small>add</v-icon>

                          <v-icon
                            small
                            color="#2ab27b"
                            class="align-baseline vertical-align-baseline me-1"
                            >fas fa-gift</v-icon
                          >
                          <price-view
                            :amount="-total_offers_amount"
                            medium
                          ></price-view>
                        </span>
                      </p>
                    </s-value-dashed>
                  </div>

                  <!-- Cross selling discount -->

                  <div
                    v-if="cross_selling_discount > 0"
                    class="data-row font-weight-medium"
                  >
                    <!-- SERVICE: Dont show price for service -->
                    <s-value-dashed>
                      <template v-slot:label>
                        <v-icon small class="me-1">whatshot</v-icon>
                        {{ $t("basket_page.cross_selling_discount") }}
                      </template>
                      <p class="text-success">
                        <price-view
                          :amount="-cross_selling_discount"
                          medium
                        ></price-view>
                      </p>
                    </s-value-dashed>
                  </div>

                  <!-- Discount Code -->
                  <div
                    v-if="!isSubscription"
                    class="data-row d-flex align-center"
                  >
                    <s-storefront-discount-code-input
                      v-model="basket.discount_code"
                      @input="selectDiscountCode"
                      :basket="basket"
                      :currency="basket.currency"
                      @loading="(val) => (refreshing_price = val)"
                    />
                    <v-spacer />

                    <price-view
                      v-if="discount_code_amount > 0 /*&& !isService*/"
                      class="text-success font-weight-medium"
                      :amount="-discount_code_amount"
                      medium
                    ></price-view>
                    <!-- SERVICE: Dont show price for service -->
                  </div>

                  <!-- Discount Code Info -->

                  <v-expand-transition>
                    <p v-if="discount_code" class="small">
                      <span class="font-weight-bold">
                        {{ discount_code.title }}</span
                      >
                      <br />
                      {{ discount_code.description }}
                    </p>
                  </v-expand-transition>

                  <!-- Customer Club Discount -->

                  <div v-if="getClub()">
                    <div class="text-center mt-2">
                      <v-img
                        :src="getCustomerClubLevel(getClub().level).icon"
                        width="48"
                        height="48"
                        class="mx-auto mb-1"
                      ></v-img>
                      <p>{{ $t("basket_page.customer_club") }}</p>
                      <p class="small m-0" v-text="getClub().description"></p>
                    </div>

                    <div
                      v-if="customer_club_discount > 0"
                      class="font-weight-medium data-row"
                    >
                      <!-- SERVICE: Dont show price for service -->
                      <s-value-dashed>
                        <template v-slot:label>
                          <i class="fas fa-heart me-1" />{{
                            $t("basket_page.customer_club_discount")
                          }}
                        </template>
                        <price-view
                          class="text-success"
                          :amount="-customer_club_discount"
                          medium
                        ></price-view>
                      </s-value-dashed>
                    </div>
                  </div>

                  <!-- Coupon -->

                  <v-expand-transition>
                    <div v-if="coupon">
                      <div class="text-center mt-2">
                        <img
                          src="@components/assets/icons/coupon.svg"
                          width="48"
                          height="48"
                          class="mx-auto mb-1"
                        />
                        <p>{{ coupon.title }}</p>
                        <p class="small m-0" v-text="coupon.description"></p>
                      </div>

                      <div class="font-weight-medium data-row">
                        <!-- SERVICE: Dont show price for service -->
                        <s-value-dashed>
                          <template v-slot:label>
                            <i class="fas fa-ticket-alt me-1" />{{
                              $t("global.commons.coupon")
                            }}
                          </template>
                          <price-view
                            class="text-success"
                            :amount="-coupon_discount"
                            medium
                          ></price-view>
                        </s-value-dashed>
                      </div>
                    </div>
                  </v-expand-transition>

                  <!-- Lottery -->

                  <v-expand-transition>
                    <div v-if="prize">
                      <div class="text-center mt-2">
                        <img
                          src="@components/assets/icons/lottery-win.svg"
                          width="48"
                          height="48"
                          class="mx-auto mb-1"
                        />
                        <p>{{ prize.title }}</p>
                        <p class="small m-0" v-text="prize.description"></p>
                      </div>

                      <div class="font-weight-medium data-row">
                        <!-- SERVICE: Dont show price for service -->
                        <s-value-dashed>
                          <template v-slot:label>
                            <i class="fas fa-dice me-1" />{{
                              $t("global.commons.prize")
                            }}
                          </template>
                          <price-view
                            v-if="prize.discount || prize.amount"
                            class="text-success"
                            :amount="-prize_discount"
                            medium
                          ></price-view>
                          <div v-else-if="prize.product">
                            <v-avatar
                              class="me-1 hover-scale-small pointer-pointer"
                              @click="goToProduct(prize.product.id)"
                              size="20"
                            >
                              <img
                                :src="getShopImagePath(prize.product.icon)"
                              />
                            </v-avatar>

                            {{ prize.product.title }}
                          </div>
                        </s-value-dashed>
                      </div>

                      <!-- Product has variant! User can select variant for prize. -->
                      <div
                        v-if="
                          prize_available_variants &&
                          lottery_win_selected_variant
                        "
                      >
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <div
                              v-on="on"
                              v-bind="attrs"
                              class="position-relative"
                            >
                              <variant-item-mini
                                class="m-2"
                                :product-variant="lottery_win_selected_variant"
                                selected
                                force-enable
                              />
                              <v-icon class="absolute-top-end" dark>
                                arrow_drop_down</v-icon
                              >
                            </div>
                          </template>
                          <v-sheet color="#fff" class="py-2">
                            <variant-item-mini
                              v-for="(
                                product_variant, index
                              ) in prize_available_variants"
                              :key="index"
                              class="m-2"
                              :product-variant="product_variant"
                              :selected="
                                product_variant === lottery_win_selected_variant
                              "
                              @select="
                                lottery_win_selected_variant = product_variant
                              "
                            />
                          </v-sheet>
                        </v-menu>
                      </div>
                    </div>
                  </v-expand-transition>

                  <template>
                    <!-- SERVICE: Dont show price for service -->

                    <!-- ========== Spacer ========== -->

                    <!-- ========== Tax ========== -->

                    <div class="font-weight-medium data-row">
                      <s-value-dashed>
                        <template v-slot:label>
                          {{ $t("global.commons.net_price") }}
                        </template>
                        <price-view :amount="net_price" medium></price-view>
                      </s-value-dashed>
                    </div>

                    <div v-if="bill.tax" class="font-weight-medium data-row">
                      <s-value-dashed>
                        <template v-slot:label>
                          {{ $t("global.commons.tax") }}
                        </template>
                        <price-view :amount="bill.tax" medium></price-view>
                      </s-value-dashed>
                    </div>

                    <div
                      v-if="bill.tax_shipping"
                      class="font-weight-medium data-row"
                    >
                      <s-value-dashed>
                        <template v-slot:label>
                          {{ $t("global.commons.shipping_tax") }}
                        </template>
                        <price-view
                          :amount="bill.tax_shipping"
                          medium
                        ></price-view>
                      </s-value-dashed>
                    </div>

                    <!-- ========== Spacer ========== -->

                    <!-- ====================================== TOTAL PRICE ================================= -->

                    <div class="total-price-after-discount">
                      <p class="label m-0">
                        {{ $t("basket_page.final_price") }}
                        :
                      </p>
                      <p class="value font-weight-black">
                        <s-loading v-if="refreshing_price" css-mode></s-loading>

                        <price-view
                          v-else
                          :amount="final_price"
                          x-large
                        ></price-view>

                        <span v-if="isSubscription && subscription_period_obj">
                          / {{ $t(subscription_period_obj.title) }}</span
                        >
                      </p>
                    </div>
                  </template>

                  <div v-if="has_delivery" class="spacer-line my-3" />
                </div>
                <!-- END OF PRICES -->
                <div v-else class="display-1 text-center p-3">
                  Sorry, Can not calculate the bill. contact us by :
                  info@selldone.com
                </div>

                <template v-if="!isService">
                  <!-- ════════════════════════ Connect Shipping Options ════════════════════════ -->

                  <s-shop-connect-shipping-options
                    :shop="shop"
                    :basket="basket"
                    :dark="!light_checkout"
                    @change="
                      (connect_shippings) => {
                        delivery_info.connect_shippings = connect_shippings;
                        setBasketConfig();
                      }
                    "
                    class="mb-6"
                  ></s-shop-connect-shipping-options>

                  <!-- ════════════════════════ Shipping options ════════════════════════ -->

                  <template
                    v-if="
                      transportation_exclude_pickup?.length &&
                      has_direct_delivery
                    "
                  >
                    <v-subheader class="my-2">
                      {{ $t("global.commons.shipping") }}
                      <products-dense-images-circles
                        inline
                        raw-images-path
                        :ids="
                          items
                            .filter((i) => !i.connect_id)
                            .map((i) =>
                              getShopImagePath(
                                i.variant?.image
                                  ? i.variant.image
                                  : i.product.icon,
                                128
                              )
                            )
                        "
                      ></products-dense-images-circles>
                    </v-subheader>

                    <s-smart-select
                      :value="transportation?.type"
                      :dark="!light_checkout"
                      :items="transportation_exclude_pickup"
                      item-description="message"
                      :item-text="
                        (item) =>
                          item.title
                            ? item.title
                            : $t(getShopTransportationObject(item.type).name)
                      "
                      force-show-all
                      :background-color="
                        !light_checkout ? SaminColorDark : '#fafafa'
                      "
                      item-value="type"
                      @input="
                        (_type) => {
                          transportation = transportation_exclude_pickup.find(
                            (x) => x.type === _type
                          );
                          $nextTick(() => {
                            setBasketConfig();
                          });
                        }
                      "
                      :item-image="
                        (item) =>
                          item.logo
                            ? getShopImagePath(item.logo)
                            : getShopTransportationObject(item.type).icon
                      "
                      rounded
                    >
                      <template v-slot:description="{ item }">
                        <span v-if="item.code" class="me-2"
                          >● {{ $t("global.commons.cod") }}</span
                        >
                        <span v-if="item.sod" class="me-2"
                          >● {{ $t("global.commons.sod") }}
                        </span>

                        <div v-if="item.free_shipping" class="me-2 green--text">
                          ● {{ $t("global.commons.free_shipping") }}
                          {{ item.free_shipping_limit ? `for + ` : "" }}
                          <price-view
                            :amount="item.free_shipping_limit"
                            :currency="item.currency"
                          ></price-view>
                        </div>
                      </template>
                    </s-smart-select>

                    <div class="spacer-line my-4" />
                  </template>

                  <!-- ════════════════════════ Delivery time ════════════════════════ -->

                  <div
                    v-if="showCustomDeliveryTimeButton && has_custom_delivery"
                    class="font-weight-medium data-row"
                  >
                    <!-- ━━━━━━━━━━━━━━━━━━ Select preferred arrival time button ━━━━━━━━━━━━━━━━━━ -->

                    <s-value-dashed>
                      <template v-slot:label>
                        <i class="fas fa-calendar-check me-1" />
                        {{ $t("basket_page.receive_time") }}

                        <v-btn
                          icon
                          small
                          class="ms-1"
                          @click="show_package_info = !show_package_info"
                          title="Show package and distance info."
                          ><v-icon small>info</v-icon></v-btn
                        >
                      </template>

                      <span>
                        <v-btn
                          class="select-time-button mx-1 animated-all-normal tnt"
                          rounded
                          :color="
                            customDeliveryTimes ? SaminColorDark : 'amber'
                          "
                          :dark="customDeliveryTimes"
                          :light="!customDeliveryTimes"
                          depressed
                          @click.stop="
                            customDeliveryTimes = !customDeliveryTimes
                          "
                          large
                          height="48"
                        >
                          <img
                            v-if="transportation"
                            width="24px"
                            class="me-1 circle-white p-1"
                            :src="
                              transportation.logo
                                ? getShopImagePath(transportation.logo)
                                : getShopTransportationObject(
                                    transportation.type
                                  ).icon
                            "
                          />
                          <div>
                            <div>
                              {{
                                customDeliveryTimes
                                  ? $t("basket_page.select_time")
                                  : $t("basket_page.no_select_time")
                              }}
                            </div>

                            <div
                              v-if="max_lead_time > 0"
                              class="text-capitalize small mt-1"
                              :style="{
                                color: customDeliveryTimes
                                  ? '#8BC34A'
                                  : '#b22a2a ',
                              }"
                            >
                              {{
                                $t("global.commons.from_lead_time", {
                                  hours: max_lead_time,
                                })
                              }}
                            </div>
                          </div>
                        </v-btn>
                      </span>
                    </s-value-dashed>

                    <!-- ━━━━━━━━━━━━━━━━━━ Show package and distance info ━━━━━━━━━━━━━━━━━━ -->

                    <v-expand-transition>
                      <div v-if="show_package_info">
                        <div
                          class="d-flex justify-content-between align-items-center text-center fadeIn py-2 mb-2"
                        >
                          <span
                            v-if="bill.weight > 0"
                            class="small"
                            :class="{ 'text-success': bill.weight > 0 }"
                            ><i class="fas fa-weight-hanging me-1" />
                            {{ bill.weight }} {{ mass_unit }}
                          </span>

                          <span
                            v-if="bill.volume && bill.volume.width > 0"
                            class="small"
                            :class="{ 'text-success': bill.volume.width > 0 }"
                          >
                            <i class="fas fa-ruler-combined me-1" />
                            {{ bill.volume.width }}
                            <i class="fas fa-times mx-2" />{{
                              bill.volume.length
                            }}
                            <i class="fas fa-times mx-2" />{{
                              bill.volume.height
                            }}
                            {{ size_unit }}
                          </span>

                          <span
                            v-if="bill.distance > 0"
                            class="small"
                            :class="{ 'text-success': bill.distance > 0 }"
                            ><i class="fas fa-location-arrow me-1" />
                            {{ Math.round(bill.distance) }}
                            {{ $t("global.distance.km") }}
                          </span>
                        </div>
                      </div>
                    </v-expand-transition>

                    <!-- ━━━━━━━━━━━━━━━━━━ Lead time ━━━━━━━━━━━━━━━━━━ -->

                    <div class="font-weight-medium data-row">
                      <s-value-dashed>
                        <template v-slot:label>
                          <i class="fas fa-clock me-1" />
                          {{ $t("basket_page.lead_time") }}
                        </template>
                        <span>
                          {{
                            max_lead_time +
                            (transportation?.etd ? transportation.etd : 0)
                          }}
                          {{ $t("basket_page.lead_time_unit") }}
                        </span>
                      </s-value-dashed>
                    </div>

                    <!-- ════════════════════════ Custom delivery time ════════════════════════ -->
                    <v-expand-transition>
                      <div
                        v-if="customDeliveryTimes"
                        class="font-weight-regular"
                      >
                        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Weekdays ━━━━━━━━━━━━━━━━━━ -->
                        <template
                          v-if="
                            [
                              ETA.weekday_timeframe.code,
                              ETA.weekday.code,
                            ].includes(transportation?.eta)
                          "
                        >
                          <v-subheader>
                            {{ $t("basket_page.days_input") }}
                          </v-subheader>

                          <v-select
                            v-model="delivery_info.days"
                            append-icon="fas fa-calendar-week"
                            class="mx-2 mt-3"
                            :items="dayItems"
                            outlined
                            chips
                            :hint="$t('basket_page.days_input_label')"
                            multiple
                            :no-data-text="$t('basket_page.days_input_no_data')"
                            :item-text="
                              (item) => {
                                return $t(item.name);
                              }
                            "
                            item-value="value"
                            deletable-chips
                            small-chips
                            @change="setBasketConfig"
                          >
                            <template v-slot:selection="{ item }">
                              <v-chip
                                close
                                @click:close="
                                  remove(delivery_info.days, item.value)
                                "
                                @click.stop
                                small
                                color="#0061e0"
                                dark
                              >
                                <span>{{ $t(item.name) }}</span>
                              </v-chip>
                            </template>
                          </v-select>
                        </template>

                        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Timeframe ━━━━━━━━━━━━━━━━━━ -->

                        <template
                          v-if="
                            [
                              ETA.weekday_timeframe.code,
                              ETA.timeframe.code,
                            ].includes(transportation?.eta)
                          "
                        >
                          <v-subheader>
                            {{ $t("basket_page.time_input") }}
                          </v-subheader>

                          <v-select
                            append-icon="fas fa-clock"
                            v-model="delivery_info.time_spans"
                            class="mx-2 mt-3"
                            :items="timeItems"
                            outlined
                            chips
                            :hint="$t('basket_page.time_input_label')"
                            multiple
                            :no-data-text="
                              $t('basket_page.time_input_label_no_data')
                            "
                            :item-text="(it) => $t(it.name)"
                            item-value="value"
                            deletable-chips
                            @change="setBasketConfig"
                          >
                            <template v-slot:selection="{ item }">
                              <v-chip
                                close
                                @click:close="
                                  remove(delivery_info.time_spans, item.value)
                                "
                                @click.stop
                                small
                                color="#0061e0"
                                dark
                              >
                                <img
                                  :src="item.icon"
                                  class="me-1"
                                  width="14px"
                                />

                                <span>{{ $t(item.name) }}</span>
                              </v-chip>
                            </template>
                          </v-select>
                        </template>

                        <!-- ━━━━━━━━━━━━━━━━━━ PTA > Custom delivery > Date ━━━━━━━━━━━━━━━━━━ -->
                        <template v-if="need_ask_shipping_date">
                          <v-subheader> Receive date </v-subheader>

                          <s-date-input
                            return-utc
                            v-model="delivery_info.date"
                            @change="setBasketConfig"
                            :min="
                              new Date().addHours(
                                transportation.etd +
                                  (max_lead_time > 0 ? max_lead_time : 0)
                              )
                            "
                            class="mx-2 mt-3"
                            outlined
                            :date-only="
                              [ETA.date.code].includes(transportation?.eta)
                            "
                            placeholder="Select a date to receive order..."
                          >
                            <template v-slot:prepend-inner>
                              <v-icon v-if="delivery_info.date" color="green"
                                >check_circle</v-icon
                              >
                              <v-icon v-else color="red" class="blink-me-linear"
                                >warning</v-icon
                              >
                            </template>
                          </s-date-input>
                        </template>
                      </div>
                    </v-expand-transition>
                    <div class="spacer-line mb-3 mt-4" />
                  </div>

                  <!-- ════════════════════════ Drop Shipping delivery ════════════════════════ -->
                  <div v-if="extra_shipping_counts" class="my-4">
                    <p class="text-center font-weight-bold">
                      <v-icon x-small class="blink-me me-1" color="green"
                        >lens</v-icon
                      >
                      {{
                        $t("basket_page.extra_shipping_count", {
                          count: has_custom_delivery
                            ? 1 + extra_shipping_counts
                            : extra_shipping_counts,
                        })
                      }}
                    </p>
                    <p class="text-start small">
                      <v-icon class="me-1" small>info</v-icon>
                      {{ $t("basket_page.extra_shipping_message") }}
                    </p>
                  </div>
                </template>

                <!-- ========== Alert ========== -->

                <p
                  v-if="error_message_payment"
                  class="bg-danger-match text-white text-center font-weight-medium mt-3 px-2 mx-n3 py-2"
                >
                  {{ error_message_payment }}
                  <v-icon class="mx-1 blink-me" dark small
                    >arrow_downward</v-icon
                  >
                </p>

                <!-- ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Select Receiver Address ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  -->
                <div v-if="has_delivery">
                  <div
                    style="min-height: 78px"
                    v-intersect="
                      (entries) => {
                        intersect_location_btn = entries[0].isIntersecting;
                      }
                    "
                  >
                    <div v-if="!is_valid_location" class="widget-buttons">
                      <v-btn
                        class="select-address-button"
                        :class="{
                          's--shop-basket-buy-button slideInUp':
                            !intersect_location_btn,
                          'is-mobile': isMobile,
                          '-up': bottom_nav_show,
                        }"
                        color="#4d90fe"
                        dark
                        @click.stop="showMap()"
                      >
                        <v-icon class="me-2"> near_me </v-icon>
                        {{
                          isService
                            ? $t("global.receiver_info.service_address")
                            : $t("global.receiver_info.receiver_address")
                        }}

                        <price-view
                          v-if="final_price > 0 && !intersect_location_btn"
                          :amount="final_price"
                          :currency="basket.currency"
                          class="ms-3 ps-3 border-start"
                        ></price-view>
                      </v-btn>
                    </div>

                    <s-shop-customer-receiver-info-widget
                      v-else
                      :receiver-info="receiver_info"
                      @show:detail="
                        () => {
                          startup_mode_map_dialog = 'detail';
                          showMap();
                        }
                      "
                      @show:map="
                        startup_mode_map_dialog = 'default';
                        showMap();
                      "
                      :dark="!light_checkout"
                      @update:country="setBasketConfig"
                      :noMap="no_map"
                    ></s-shop-customer-receiver-info-widget>
                  </div>
                </div>

                <!-- ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Select Pickup Address ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  -->
                <div v-if="has_pickup">
                  <div class="font-weight-bold mt-5 mb-3">
                    <template v-if="is_pickup_selected"
                      ><v-icon color="success" class="me-1 zoomIn" small
                        >check_circle</v-icon
                      >
                      Pickup selected.</template
                    >
                    <template v-else
                      >Or Pickup
                      <v-icon class="ms-1" small>expand_more</v-icon></template
                    >
                  </div>

                  <v-list
                    three-line
                    class="border-between-vertical bg-transparent"
                  >
                    <v-list-item
                      v-for="(pickup, i) in pickups"
                      :key="i"
                      class="row-hover pp"
                      @click="selectPickup(pickup)"
                    >
                      <v-list-item-action>
                        <v-icon
                          v-if="
                            is_pickup_selected &&
                            receiver_info.address === pickup.address
                          "
                          color="info"
                          >circle</v-icon
                        >
                        <v-icon
                          v-else
                          :color="light_checkout ? '#333' : '#fafafa'"
                          >radio_button_unchecked</v-icon
                        >
                      </v-list-item-action>

                      <v-list-item-content>
                        <v-list-item-title>
                          <b>{{ pickup.name }}</b>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <flag
                            v-if="pickup.country"
                            :iso="pickup.country"
                            :squared="false"
                            class="me-1"
                          />
                          {{
                            pickup.address
                              ? generateFullAddress(pickup)
                              : $t("global.commons.empty")
                          }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <v-icon x-small class="me-1"> phone</v-icon>
                          {{
                            pickup.phone
                              ? pickup.phone
                              : $t("global.commons.empty")
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </div>

                <!-- ========== Alert Not Click On Location!========== -->

                <p
                  v-if="
                    has_delivery && !error_message_payment && !is_valid_location
                  "
                  class="bg-danger-match text-white text-center font-weight-medium mt-3 px-2 mx-n3 py-2"
                >
                  <v-icon class="me-1 blink-me" dark small
                    >error_outline</v-icon
                  >
                  {{ $t("basket_page.select_location_error") }}
                </p>

                <!-- ============== Billing Info ============== -->
                <div v-if="canPayAndComplete" class="mt-5">
                  <s-shop-billing-address-form
                    v-model="billing"
                    :receiver-info="receiver_info"
                    :dark="!light_checkout"
                    @change="setBasketConfig"
                  ></s-shop-billing-address-form>
                </div>

                <!-- ============== User messages (by server) ============== -->

                <div
                  v-if="bill?.user_messages?.length"
                  class="py-2 border-between-vertical mt-5 display-1"
                >
                  <div
                    v-for="(msg, i) in bill.user_messages"
                    :key="i"
                    class="py-2"
                  >
                    <v-icon color="amber" large class="me-1">warning</v-icon>
                    <span v-html="msg"></span>
                  </div>
                </div>

                <!-- ********************************** Payment ********************************** -->

                <div
                  style="min-height: 78px"
                  class="d-flex"
                  v-intersect="
                    (entries) => {
                      intersect_payment_btn = entries[0].isIntersecting;
                    }
                  "
                >
                  <div class="widget-buttons">
                    <!-- Payment button (COD) -->

                    <v-btn
                      v-if="
                        canPayAndComplete &&
                        cod_check &&
                        deliverySupportCOD &&
                        !isService
                      "
                      class="select-address-button"
                      :class="{
                        's--shop-basket-buy-button slideInUp':
                          !intersect_payment_btn,
                        'is-mobile': isMobile,
                        '-up': bottom_nav_show,
                        disabled:
                          !can_pay /*System tell us that user can not pay! (on bill calculation step in server)*/,
                      }"
                      rounded
                      color="#16a085"
                      dark
                      @click.stop="goToPaymentBasket(null, deliverySupportCOD)"
                    >
                      <v-icon class="me-2"> fas fa-shopping-bag </v-icon>
                      {{ $t("basket_page.final_confirm_action") }}

                      <price-view
                        v-if="final_price > 0 && !intersect_payment_btn"
                        :amount="final_price"
                        :currency="basket.currency"
                        class="ms-3 ps-3 border-start"
                      ></price-view>
                    </v-btn>

                    <!-- Payment button (Online) -->

                    <template
                      v-if="
                        canPayAndComplete &&
                        (!cod_check || !deliverySupportCOD) &&
                        !is_service_need_pricing
                      "
                    >
                      <v-btn
                        :class="{
                          's--shop-basket-buy-button slideInUp':
                            !intersect_payment_btn,
                          'is-mobile': isMobile,
                          /*disabled: !bill,*/
                          '-up': bottom_nav_show,
                          disabled:
                            !can_pay /*System tell us that user can not pay! (on bill calculation step in server)*/,
                        }"
                        class="select-address-button"
                        rounded
                        color="#16a085"
                        dark
                        @click.stop="
                          goToPaymentBasket(null, deliverySupportCOD)
                        "
                      >
                        <v-icon class="me-2"> payment </v-icon>
                        {{ $t("basket_page.pay_and_complete_action") }}

                        <price-view
                          v-if="final_price > 0 && !intersect_payment_btn"
                          :amount="final_price"
                          :currency="basket.currency"
                          class="ms-3 ps-3 border-start"
                        ></price-view>
                      </v-btn>
                    </template>
                    <!-- Checkout without payment (Service) -->

                    <v-btn
                      v-if="canPayAndComplete && is_service_need_pricing"
                      :class="{
                        's--shop-basket-buy-button slideInUp':
                          !intersect_payment_btn,
                        'is-mobile': isMobile,
                        /*disabled: !bill,*/
                        '-up': bottom_nav_show,
                        disabled:
                          !can_pay /*System tell us that user can not pay! (on bill calculation step in server)*/,
                      }"
                      class="select-address-button"
                      rounded
                      color="#16a085"
                      dark
                      @click.stop="submitServiceOrder()"
                      :loading="busy_submit"
                    >
                      <v-icon class="me-2"> check_circle </v-icon>
                      {{ $t("basket_page.pre_confirm_service") }}

                      <price-view
                        v-if="final_price > 0 && !intersect_payment_btn"
                        :amount="final_price"
                        :currency="basket.currency"
                        class="ms-3 ps-3 border-start"
                      ></price-view>
                    </v-btn>
                  </div>
                </div>

                <!-- ******************************************************************************************** -->

                <template
                  v-if="
                    canPayAndComplete &&
                    (!cod_check || !deliverySupportCOD) &&
                    !isService
                  "
                >
                  <s-stripe-split-payment-info
                    :basket="basket"
                    :dark="!light_checkout"
                    :country-code="receiver_info?.country"
                  ></s-stripe-split-payment-info>
                </template>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

      <div
        v-else
        style="min-height: 60vh; padding-top: 15vh"
        class="blur-animate"
        :class="{ blured: busy_shop }"
      >
        <img
          src="@components/assets/icons/baskets.svg"
          height="120"
          class="m-5 img-grayscale"
        />
        <h1 class="text-uppercase text-muted">
          {{ $t("basket_page.basket_empty") }}
        </h1>
      </div>

      <div v-if="busy_shop" class="busy-overlay">
        <div class="display-1 font-weight-thin">
          <v-icon class="me-2" large>hourglass_empty</v-icon>

          {{ $t("global.commons.waiting") }}...
        </div>
      </div>
    </v-card>

    <!-- █████████████████████ Dialog > Map █████████████████████ -->

    <v-dialog
      v-if="has_delivery"
      v-model="map_dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      :content-class="no_map ? 'bg-gray' : 'bg-map'"
    >
      <!-- Shop Configuration ➡ Map enabled / disabled -->
      <s-map-view
        v-if="dialog_pre"
        v-model="receiver_info"
        :color="SaminColorDark"
        :center.sync="center"
        :hide="!map_dialog"
        :zoom="17"
        style="width: 100%; height: 100%"
        :startup-mode="startup_mode_map_dialog"
        has-top-bar
        can-select-address
        has-bottom-bar
        has-address-book
        :title="$t('global.receiver_info.map.title')"
        :confirm-text="$t('global.receiver_info.map.confirm')"
        :address-type="$t('global.receiver_info.map.address_type')"
        :receptor-type="$t('global.receiver_info.map.receptor_type')"
        @close="map_dialog = false"
        @clickSetLocation="onClickSetLocation"
        :delay-load="1000"
        :noMap="no_map"
        :availableCountries="
          shop.countries?.length ? shop.countries : undefined
        "
      />
    </v-dialog>
  </div>
</template>

<script>
import SShopBasketItems from "@components/storefront/order/basket/SShopBasketItems.vue";
import { WeekDays } from "@core/enums/logistic/WeekDays";
import { TimeSpans } from "@core/enums/logistic/TimeSpans";
import { ShopTransportations } from "@core/enums/logistic/ShopTransportations";
import SStorefrontDiscountCodeInput from "@components/storefront/discount-code/input/SStorefrontDiscountCodeInput.vue";
import {GtagEcommerce} from "@components/plugins/gtag/GtagEcommerce";
import SStorefrontCouponsList from "@components/storefront/coupon/list/SStorefrontCouponsList.vue";
import { ProductType } from "@core/enums/product/ProductType";
import SStorefrontLotteryPrizesList from "@components/storefront/lottery/prizes-list/SStorefrontLotteryPrizesList.vue";
import VariantItemMini from "@components/product/variant/VariantItemMini.vue";
import SShopCustomerReceiverInfoWidget from "@components/storefront/order/delivery/SShopCustomerReceiverInfoWidget.vue";
import { ShopOptionsHelper } from "@core/helper/shop/ShopOptionsHelper";
import SValueDashed from "@components/ui/text/SValueDashed.vue";
import { LocalStorages } from "@core/helper/local-storage/LocalStorages";
import SShopShareOrderButton from "@components/storefront/order/share-order/SShopShareOrderButton.vue";
import SShopBillingAddressForm from "@components/storefront/order/billing/SShopBillingAddressForm.vue";
import BillingPeriod from "@core/enums/subscription/BillingPeriod";
import SShopConnectShippingOptions from "@components/storefront/order/shipping/SShopConnectShippingOptions.vue";
import SSmartSelect from "@components/smart/SSmartSelect.vue";
import ProductsDenseImagesCircles from "@components/product/products-dense-images-circles/ProductsDenseImagesCircles.vue";
import { ETA } from "@core/enums/logistic/ETA";
import SDateInput from "@components/ui/calendar/date-input/SDateInput.vue";
import { ShadeColor } from "@core/helper/color/ColorGenerator";
import _ from "lodash-es";
import SStripeSplitPaymentInfo from "@components/payment/stripe/SStripeSplitPaymentInfo.vue";
import { BasketHelper } from "@core/helper/shop/BasketHelper";

export default {
  name: "SStorefrontBasketPage",
  components: {
    SStripeSplitPaymentInfo,
    SDateInput,
    ProductsDenseImagesCircles,
    SSmartSelect,
    SShopConnectShippingOptions,
    SShopBillingAddressForm,
    SShopShareOrderButton,

    SValueDashed,
    SShopCustomerReceiverInfoWidget,
    VariantItemMini,
    SStorefrontLotteryPrizesList,
    SStorefrontCouponsList,
    SStorefrontDiscountCodeInput,
    SShopBasketItems,
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Props
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  props: {
    shop: {
      require: true,
    },
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: () => ({
    ETA: ETA,

    types: ProductType,
    type: ProductType.PHYSICAL.code,

    center: null, //{ lat: 40.943397271692135, lng: -73.83711692458752 },

    map_dialog: false,
    dialog_pre: false,

    receiver_info: {},
    delivery_info: {},

    startup_mode_map_dialog: "default",

    customDeliveryTimes: false,

    cod_check: false,

    transportation: null,

    //-------------- Coupon ---------------

    // coupon_id: null,

    //-------------- Lottery Prize ---------------
    lottery_win_selected_variant: null,

    show_package_info: false,

    //-------------- Billing Info -------------
    busy_bill: false,

    same_billing: true,

    billing: null,

    busy_save: false,

    //-------------- Billing Info -------------

    refreshing_price: false,

    //-------------- Service -------------
    busy_submit: false,

    //-------------- Dynamic buttons -------------
    intersect_location_btn: false,
    intersect_payment_btn: false,
  }),
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Computed
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    theme() {
      return this.shop.theme;
    },
    busy_shop() {
      return this.$store.getters.getBusyShop;
    },

    isSubscription() {
      return this.type === ProductType.SUBSCRIPTION.code;
    },

    checkout() {
      return ShopOptionsHelper.GetCheckout(this.shop);
    },
    no_map() {
      return !ShopOptionsHelper.HasMap(this.shop);
    },

    size_unit() {
      return ShopOptionsHelper.GetSizeUnit(this.shop);
    },

    mass_unit() {
      return ShopOptionsHelper.GetMassUnit(this.shop);
    },

    bottom_nav_show() {
      return this.$store.getters.getBottomNavShow;
    },

    light_checkout() {
      return this.shop.theme && this.shop.theme.light_checkout;
    },
    //-------------- Lottery Prize ---------------
    prize() {
      if (!this.basket) return null;
      return this.basket.lottery;
    },

    //-------------- Discount Code ---------------
    discount_code() {
      return this.basket.discount_code;
    },

    basket() {
      return this.getBasket(this.type);
    },

    bill() {
      return this.basket ? this.basket.bill : null;
    },
    can_pay() {
      return this.bill?.can_pay; // IMPORTANT! If for any reason user can not pay this order then it should be false!
    },

    isPhysical() {
      return this.type === ProductType.PHYSICAL.code;
    },
    isVirtual() {
      return this.type === ProductType.VIRTUAL.code;
    },
    isFile() {
      return this.type === ProductType.FILE.code;
    },
    isService() {
      return this.type === ProductType.SERVICE.code;
    },
    is_service_need_pricing() {
      /**
       * It needs pricing by the seller after checkout.
       */
      return BasketHelper.IsServiceAndNeedPricing(this.basket);
    },

    net_price() {
      return this.bill.price - (this.bill.tax_included ? this.bill.tax : 0);
    },

    final_price() {
      return this.bill && this.bill.sum;
    },

    filtered_types() {
      return Object.values(ProductType).filter((type) => {
        return this.getCount(type.code);
      });
    },

    raw_items_price() {
      return this.bill.items_price;
    },

    //-------------- Coupon ---------------
    coupon() {
      return this.basket.coupon;
    },
    discount_code_amount() {
      return this.bill ? this.bill.discount_code : 0;
    },

    customer_club_discount() {
      return this.bill ? this.bill.club : 0;
    },

    coupon_discount() {
      return this.bill ? this.bill.coupon : 0;
    },

    prize_discount() {
      return this.bill ? this.bill.lottery : 0;
    },

    deliverySupportCOD() {
      return (
        this.transportation &&
        this.transportation.cod &&
        [ProductType.PHYSICAL.code, ProductType.SERVICE.code].includes(
          this.type
        )
      ); // Only for physical and service!
    },

    dayItems() {
      let out = [];
      if (!this.transportation) return out;

      this.transportation.days.forEach((day) => {
        out.push(WeekDays[day]);
      });
      return out;
    },

    timeItems() {
      let out = [];
      if (!this.transportation) return out;

      this.transportation.time_spans.forEach((time_span) => {
        out.push(TimeSpans[time_span]);
      });
      return out;
    },

    shipping_cost() {
      return this.bill ? this.bill.delivery_price : 0;
    },
    has_custom_delivery() {
      // True when at least one item deliver by this shop (Not selldone drop-shipping or connect)
      return this.bill && this.bill.has_custom_delivery;
    },
    extra_shipping_counts() {
      // Number of shops drop shop (Main sellers)
      return this.bill && this.bill.extra_shipping_counts;
    },

    calculated_weight() {
      return this.bill ? this.bill.weight : 0;
    },

    transport_types() {
      if (!this.bill) return [];
      return this.bill.transportations;
    },

    items() {
      if (!this.basket || !this.basket.items) return [];
      return this.basket.items;
    },

    max_lead_time() {
      if (!this.basket) return 0;
      let max_lead = 0;
      this.basket.items.forEach((item) => {
        let lead = this.leadProduct(item.product, item.variant);
        if (lead) max_lead = Math.max(max_lead, lead);
      });

      return max_lead;
    },

    total_price() {
      return this.bill ? this.bill.items_price : 0;
    },

    total_price_after_offer() {
      return this.total_price - this.total_offers_amount;
    },

    total_price_with_delivery() {
      let total = this.total_price_after_offer;
      if (this.shipping_cost > 0) total += this.shipping_cost;
      return total;
    },
    total_price_with_delivery_and_discount() {
      return this.total_price_with_delivery - this.discount_code_amount;
    },

    total_items_discount() {
      return this.bill ? this.bill.items_discount : 0;
    },

    cross_selling_discount() {
      return this.bill ? this.bill.cross_selling_discount : 0;
    },

    total_offers_amount() {
      return this.bill ? this.bill.offer : 0;
    },

    basketTypeCanCOD() {
      return this.type === ProductType.PHYSICAL.code;
    },

    canPayAndComplete() {
      if (this.isPhysical || this.isService || this.isSubscription) {
        if (!this.has_delivery) return true; // Seller select do not ask for shipping address.

        return (
          this.receiver_info &&
          this.receiver_info.address &&
          this.receiver_info.phone &&
          this.is_valid_location
        );
      } else if (this.isVirtual) {
        return true;
      } else if (this.isFile) {
        return true;
      }

      return false;
    },

    hasErrorInReceiverInfo() {
      if (this.isPhysical && this.has_delivery) {
        return (
          this.receiver_info &&
          this.receiver_info.address &&
          (!this.receiver_info.phone || !this.is_valid_location)
        );
      }
      return false;
    },

    has_delivery() {
      return ShopOptionsHelper.AskShippingAddress(this.shop, this.type);
      /*
      if (this.isPhysical || this.isService) {
        return true;
      }
      return false;*/
    },

    has_direct_delivery() {
      return this.bill?.has_direct_delivery;
    },

    showCustomDeliveryTimeButton() {
      return (
        this.has_delivery &&
        this.receiver_info &&
        this.receiver_info.address &&
        this.is_valid_location
      );
    },

    error_message_payment() {
      if (this.isPhysical && this.has_delivery) {
        if (this.receiver_info) {
          if (!this.receiver_info.address)
            return this.$t("basket_page.errors.no_address");
          if (!this.receiver_info.phone)
            return this.$t("basket_page.errors.no_phone");
        }
      }

      return null;
    },

    is_valid_location() {
      if (this.no_map) return !!this.receiver_info.address; // Only enter address!
      return (
        this.receiver_info.location &&
        this.receiver_info.location.lat &&
        this.receiver_info.location.lng
      );
    },

    // ---------- Lottery --------
    prize_available_variants() {
      if (!this.prize || !this.prize || !this.prize.product) return [];
      return this.prize.variant
        ? [this.prize.variant]
        : this.prize.product.product_variants;
    },

    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ Pickup ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅

    pickup_transportation() {
      return (
        this.transport_types &&
        this.transport_types.find(
          (t) => t.type === ShopTransportations.Pickup.code
        )
      );
    },
    transportation_exclude_pickup() {
      return (
        this.transport_types &&
        this.transport_types.filter(
          (t) => t.type !== ShopTransportations.Pickup.code
        )
      );
    },
    pickups() {
      return this.pickup_transportation && this.pickup_transportation.pickups;
    },
    has_pickup() {
      return this.pickups && this.pickups.length && this.isPhysical;
    },

    is_pickup_selected() {
      return (
        this.receiver_info &&
        this.receiver_info.pickup &&
        this.transportation &&
        this.transportation.type === ShopTransportations.Pickup.code &&
        this.pickups.some((a) => a.address === this.receiver_info.address)
      ); /*Make sure address did not change*/
    },

    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ 🎗️ Subscription ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    subscription_prices() {
      return this.items.map((item) => item.subscription_price);
    },
    subscription_period() {
      return (
        this.subscription_prices.length && this.subscription_prices[0].period
      );
    },
    subscription_period_obj() {
      return (
        this.subscription_period && BillingPeriod[this.subscription_period]
      );
    },

    need_ask_shipping_date() {
      return (
        this.transportation &&
        [ETA.date.code, ETA.date_time.code].includes(this.transportation.eta)
      );
    },
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Watch
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  watch: {
    map_dialog(val) {
      this.$store.commit("setForceHideNavigation", val);
    },

    prize(prize) {
      this.lottery_win_selected_variant =
        prize &&
        this.prize_available_variants &&
        this.prize_available_variants.length
          ? this.prize_available_variants[0]
          : null;
    },

    customDeliveryTimes(custom) {
      // this.delivery_info.days = [];
      //  this.delivery_info.time_spans = [];

      if (custom && this.transportation) {
        // Set all times for default custom delivery time!
        this.delivery_info.days = this.transportation.days.slice(0);
        this.delivery_info.time_spans = this.transportation.time_spans.slice(0);
      }

      this.delivery_info.custom = custom;

      if (this.delivery_info.custom !== this.basket.delivery_info?.custom) {
        //console.log("🧨 watch ===> customDeliveryTimes : setBasketConfig (customDeliveryTimes)");
        this.setBasketConfig();
      }
    },

    transportation(transportation) {
      if (!this.has_delivery) return;

      this.delivery_info.type = transportation ? transportation.type : null;

      //  console.log('transportation',transportation)
      // Reset pickup in receiver info:
      if (
        transportation &&
        transportation.type !== ShopTransportations.Pickup.code
      ) {
        this.receiver_info.pickup = false;
      }
    },

    transport_types() {
      this.autoSelectTransportationType();
    },

    /*   calculated_weight() {
      this.autoSelectTransportationType();
    },*/

    deliverySupportCOD(support) {
      if (!support) this.cod_check = false;
    },
    type(type) {
      if (type !== this.$route.params.type)
        this.$router.replace({ params: { type: type } });
    },
    "$route.params"(params) {
      this.resetToDefault(); // 🞇 Reset to default
      this.type = params.type;
    },

    //------------- Customer previous auto save -----------

    basket(basket) {
      //  console.log("Debug basket",'Change basket!',basket)
      this.loadFromBasket();
    },

    //------------- Billing Tax -----------
    need_ask_shipping_date(value) {
      if (value) {
        // We should ask user to select a date!
        this.customDeliveryTimes = true;
      }
    },
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  created() {
    //  console.log("Debug basket",'Create basket page.')
    this.center = this.$store.getters.getInitialLocation;

    this.type = this.$route.params.type;

    this.setPageTitle("Open cart"); // Set Page Title!

    GtagEcommerce.MeasuringCheckoutSteps(this.basket, 0, "");

    this.loadFromBasket();
  },
  mounted() {
    if (
      ShopOptionsHelper.HasMap(this.shop) &&
      (!this.basket ||
        !this.basket.receiver_info ||
        !this.basket.receiver_info.location)
    )
      try {
        navigator.geolocation.getCurrentPosition((position, error) => {
          if (error) {
            console.error("Get current location", error);
            return;
          }

          if (this.basket?.receiver_info?.location) return; // Prevent lagged update location bug!
          //const userCoordinates = [position.coords.longitude, position.coords.latitude];
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        });
      } catch (e) {
        console.error(e);
      }
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Methods Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  methods: {
    ShadeColor,
    selectLottery(lottery) {
      // console.log("---selectLottery---", lottery);
      this.basket.lottery = lottery;
      this.$store.dispatch("setBasket", this.basket);
    },

    selectCoupon(coupon) {
      // console.log("---selectCoupon---", coupon);
      this.basket.coupon = coupon;
      this.$store.dispatch("setBasket", this.basket);
    },
    selectDiscountCode(discount_code) {
      // console.log("---selectDiscountCode---", discount_code);
      this.basket.discount_code = discount_code;
      this.$store.dispatch("setBasket", this.basket);
    },

    loadFromBasket() {
      if (!this.basket) return;

      //  console.log("watch ===> basket : Load saved values");

      // Prevent critical values be null:
      if (
        !this.basket.delivery_info ||
        Array.isArray(this.basket.delivery_info)
      )
        this.basket.delivery_info = {};
      if (
        !this.basket.receiver_info ||
        Array.isArray(this.basket.receiver_info)
      )
        this.basket.receiver_info = {};
      if (!this.basket.billing || Array.isArray(this.basket.billing))
        this.basket.billing = {};

      this.receiver_info = Object.assign({}, this.basket.receiver_info); // Local Clone

      this.delivery_info = Object.assign({}, this.basket.delivery_info); // Local Clone

      this.billing = this.basket.billing;

      // Set map center:
      if (this.basket.delivery_info && this.basket.receiver_info.location) {
        //console.log("load-center-map", this.basket.receiver_info.location);
        this.center = {
          lat: this.basket.receiver_info.location.lat,
          lng: this.basket.receiver_info.location.lng,
        };
      }

      this.customDeliveryTimes = this.delivery_info.custom;

      this.autoSelectTransportationType();

      if (!this.bill) {
        // Fetch if not loaded!
        this.fetchBill();
      }
    },
    //---------------------------- Get Calculated Bill --------------------
    fetchBill() {
      // console.log("watch ===> basket : fetchBill");

      this.busy_bill = true;

      axios
        .get(window.XAPI.GET_BASKET_BILL(this.shop_name, this.type))
        .then(({ data }) => {
          if (!data.error) {
            this.setBasketBill(this.basket, data.bill);
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_bill = false;
        });
    },
    //---------------------------- Update customer info set --------------------
    isChanged(a, b) {
      return a !== b && JSON.stringify(a) !== JSON.stringify(b);
    },
    setBasketConfig: _.throttle(function setBasketConfig() {
      if (
        !this.isChanged(this.receiver_info, this.basket.receiver_info) &&
        !this.isChanged(this.delivery_info, this.basket.delivery_info) &&
        !this.isChanged(this.billing, this.basket.billing)
      )
        return;

      this.busy_save = true;
      //console.log("🧨 setBasketConfig");

      axios
        .put(
          window.XAPI.PUT_SET_BASKET_CONFIG(this.shop_name, this.basket.id),
          {
            // currency:this.GetUserSelectedCurrency().code, // Not important! currency set in change currency api call! Guest + User
            receiver_info: this.receiver_info,
            delivery_info: this.delivery_info,
            billing: this.billing,
          }
        )
        .then(({ data }) => {
          if (!data.error) {
            // ➔ Update tax in basket (Only these items changed!)
            this.setBasketBill(this.basket, data.bill);

            // ➔ Update user delivery info:
            this.basket.receiver_info = data.receiver_info;
            this.basket.delivery_info = data.delivery_info;
            this.basket.billing = this.isObject(data.billing)
              ? data.billing
              : {}; // Solve return array!
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
    }, 3000),

    getCount(type) {
      let basket = this.getBasket(type);
      return basket && basket.items ? basket.items.length : 0;
    },

    autoSelectTransportationType() {
      if (
        !this.basket ||
        !this.has_delivery ||
        this.isService ||
        !this.basket.delivery_info
      )
        return; // Service has address (destination) but not need transportation type and delivery!
      /*  console.log(
        "%cautoSelectTransportationType: START",
        "background: #0097A7; color: #fff"
      );*/

      // Return if delivery type selected and valid (exist in acceptable transportations)
      if (this.basket.delivery_info.type) {
        const found = this.transport_types.find(
          (it) => it.type === this.basket.delivery_info.type
        );
        if (found) {
          this.transportation = found;
          /* console.log(
            "autoSelectTransportationType",
            "Found transportation : ",
            found
          );*/
          return;
        }
      }

      if (!this.transport_types || !this.transport_types.length) {
        //console.log("autoSelectTransportationType", "transport_types is null!");

        this.transportation = null;
        return null;
      }

      //  this.transportation = this.transport_types[0];
      // Do not auto select pickup!
      const eligible_transportations = this.transport_types.filter(
        (x) => x.type !== "Pickup"
      );

      if (eligible_transportations.length) {
        this.transportation = eligible_transportations[0];

        console.log(
          "%cautoSelectTransportationType: SELECT :::" +
            this.transportation.type,
          "background: #0097A7; color: #fff"
        );
      }
    },

    getShopTransportationObject(type) {
      return ShopTransportations[type];
    },

    onClickSetLocation(info) {
      if (!info.phone) info.phone = this.USER() ? this.USER().phone : null; // Autofill phone!

      this.receiver_info = info;
      this.map_dialog = false;

      this.setBasketConfig();

      GtagEcommerce.MeasuringCheckoutSteps(this.basket, 1, "");
    },

    showMap() {
      this.dialog_pre = false;
      this.$nextTick(() => {
        this.dialog_pre = true;
        this.$nextTick(() => {
          this.map_dialog = true;
        });
      });
    },

    //―――――――――――――――――――――― Final Step > Go to payment (Physical, Virtual, File) ――――――――――――――――――――

    goToPaymentBasket(gateway, deliverySupportCOD) {
      //―――――― 🎗️ Subscription ――――――
      // The payment process for subscription is different! We send permitted gateways from the backend.
      if (this.isSubscription) {
        if (!this.USER()) {
          // Force to log in for subscription.
          this.NeedLogin();
          return;
        }

        // Get list of gateways from subscription_price:
        const gateway_codes = this.items
          .map((item) => item.subscription_price?.gateway_code)
          .filter((g) => !!g)
          .unique();

        //  console.log('gateway_codes,',gateway_codes)

        this.ShowPaymentDialogSubscription(
          this.basket.currency,
          this.basket,
          this.bill,
          gateway_codes,
          /*Used for in site payment flow & free orders!*/
          (data) => {
            if (!this._isDestroyed)
              this.goToOrderInfo(this.type, data.target_id);
          }
        );
        return;
      }

      if (
        !this.USER() &&
        !ShopOptionsHelper.HasGuestPayment(this.getShop()) /*🥶 Guest*/
      ) {
        this.NeedLogin();
        return;
      }

      this.ShowPaymentDialogBasket(
        this.basket.code /*🥶 Guest*/,
        this.basket,
        this.type,
        this.bill,
        this.lottery_win_selected_variant
          ? this.lottery_win_selected_variant.id
          : null,
        gateway,
        deliverySupportCOD,
        /*Used for in site payment flow & free orders!*/
        (data) => {
          if (!this._isDestroyed) this.goToOrderInfo(this.type, data.target_id);
        }
      );

      GtagEcommerce.MeasuringCheckoutSteps(
        this.basket,
        2,
        gateway ? gateway : deliverySupportCOD ? "COD" : ""
      );
    },
    //―――――――――――――――――――――― Final Step > Submit service order (No payment here) (Service) ――――――――――――――――――――

    submitServiceOrder() {
      this.busy_submit = true;

      axios
        .post(
          window.XAPI.POST_SUBMIT_SERVICE_BASKET(this.shop_name, this.type),
          {
            currency: this.GetUserSelectedCurrency().code,
            selected_variant_id: this.lottery_win_selected_variant
              ? this.lottery_win_selected_variant.id
              : null,

            code: this.basket.code /*🥶 Guest*/,
          }
        )
        .then(({ data }) => {
          if (!data.error) {
            // ▀▀▀▀▀▀▀▀▀ 🥶 Guest ▀▀▀▀▀▀▀▀▀
            if (!this.USER()) {
              // Save array of guest codes in local storage:
              LocalStorages.AddCurrentGuestCodeToHistory(
                this.type,
                data.basket_id,
                data.code
              );
            }

            this.fetchBasketAndShop();
            this.showSuccessAlert(
              "Order submitted",
              "Your order has been submitted successfully. We will send bill to you."
            );
            this.$router.push({
              name: "MyServiceOrderInfoPage",
              params: { basket_id: data.basket_id },
            });
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_submit = false;
        });
    },

    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ Pickup ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅
    selectPickup(pickup_address) {
      // console.log('selectPickup',pickup_address)
      this.receiver_info = Object.assign({}, pickup_address);
      this.receiver_info.pickup = true;
      this.transportation = this.pickup_transportation;
      this.delivery_info.type = this.transportation
        ? this.transportation.type
        : null;

      this.setBasketConfig();
    },
  },
};
</script>

<style scoped lang="scss">
.receipt {
  position: relative;
  padding: 12px !important;

  &.dark {
    .receipt-container {
      //background-image: linear-gradient(-20deg, var(--theme-dark) 0%, var(--theme-deep-dark) 100%);
      background-image: linear-gradient(
        160deg,
        var(--color-bg-1) 0%,
        var(--color-bg-2) 100%
      );
      color: #fff;

      .total-price-after-discount {
        .label {
          color: rgba(255, 255, 255, 0.9);
        }
      }
      .total-price-after-discount {
        .label {
          color: #ffffff;
        }
        .value {
          color: #ffffff;
        }
      }
    }
  }

  .text-success {
    color: #2ab27b !important;
  }

  .receipt-bg {
    width: 100%;
    padding: 4px 4px 4px 4px !important;
    max-width: 100%;

    background-image: linear-gradient(-20deg, #fefefe 0%, #f1f1f1 100%);

    border-radius: 22px;

    &.success {
      background-image: linear-gradient(-60deg, #16a085 0%, #afb42b 100%);
    }

    &.error {
      background-image: linear-gradient(to top, #f77062 0%, #fe5196 100%);
    }
  }

  .receipt-container {
    text-align: start !important;
    padding: 12px;
    //background-image: linear-gradient(-20deg, #fefefe 0%, #f1f1f1 100%);
    background: #fff;
    border-radius: 16px;

    .total-price {
      font-size: 1.2rem;
      font-weight: 400;
    }

    .total-discount {
      font-size: 1rem;
      font-weight: 400;
      color: #2ab27b;
    }
    .spacer-line-dotted {
      display: block;
      border-bottom: 2px dotted rgba(255, 255, 255, 0.18);
      width: 60%;
      margin: 0 auto;
    }
    .spacer-line {
      display: block;
      border-bottom: thick double #eee;
      width: 80%;
      margin: 0 auto;
    }

    .total-price-after-discount {
      margin-top: 14px;
      text-align: center;
      font-size: 1.5rem;

      .label {
        color: #6c757d;
        font-weight: 400;
        font-size: 1.1rem;
      }

      .value {
        color: #444;
        font-weight: 500;
      }
    }
  }

  .select-address-button {
    display: block;
    font-size: 1.1em;
    min-height: 54px;
    min-width: 164px;
    margin: 12px 0;
  }

  .select-time-button {
    display: inline-block;
    font-size: 0.9rem;
    min-height: 36px;

    padding: 4px 12px !important;
    @media screen and (max-width: 900px) {
      font-size: 0.7rem;
    }
  }

  .data-row {
    padding: 6px 0;
    p {
      margin: 0;
    }
  }

  .bg-danger-match {
    background-color: #dc3545 !important;
    background-image: linear-gradient(
      to right,
      #fa6179 0%,
      #dc3545 20%,
      #dc3545 80%,
      #fa6279 100%
    ) !important;
  }
}

.busy-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.69);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.s--shop-basket-buy-button {
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;
  position: fixed !important;
  border-radius: 0 !important;
  margin: 0 !important;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 80;
  color: white !important;
  font-size: 1rem;
  transition: all 0.35s linear;
  background: #2ab27b;
  min-height: 48px;
  p {
    padding: 10px;
  }
  &.is-mobile {
    p {
      font-size: 0.9rem;
      max-width: calc(100% - 80px);
    }
  }

  &:hover {
    opacity: 0.8;
  }

  &.-up {
    bottom: 92px;
    left: 8px;
    right: 8px;
    width: calc(100% - 16px);
    border-radius: 8px !important;
    border: 1px solid #249567;
    transition: all 0.35s;
  }
}
</style>
