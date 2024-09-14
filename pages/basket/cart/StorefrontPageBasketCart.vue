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
        -30,
      ),
    }"
  >
    <v-card
      :flat="isMobile"
      class="s--shop-card mb-16 s--shadow-no-padding -hide1720 text-start"
      style="min-height: 80vh"
    >
      <v-toolbar color="transparent" flat>
        <v-btn icon @click.stop="$router.go(-1)" variant="text">
          <v-icon>{{ $t("icons.arrow_back") }}</v-icon>
        </v-btn>

        <v-toolbar-title class="body-title">
          {{ $t("basket_page.title") }}
        </v-toolbar-title>

        <v-spacer />
      </v-toolbar>

      <div v-if="filtered_types.length > 1" class="text-center pt-2">
        <u-button-circle
          v-for="item in filtered_types"
          :key="item.code"
          :badge-number="getCount(item.code)"
          :disabled="!item.enable"
          :outline="type === item.code"
          :src="item.image"
          :tooltip="$t(item.name)"
          has-badge
          persist-badge
          @click="type = item.code"
        />
      </div>

      <v-container
        v-if="basket && basket.items && basket.items.length"
        :class="{ blurred: busy_shop }"
        class="mt-4 blur-animate"
        style="max-width: 100%; overflow: hidden"
      >
        <v-row dense>
          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ List ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
          <v-col class="px-md-0 px-lg-3" cols="12" lg="8" md="7" sm="12">
            <div
              class="widget-box -large mb-5 mt-2 min-height-50vh d-flex flex-column"
            >
              <s-shop-basket-items :items="items" :shop="shop" />

              <v-spacer></v-spacer>
              <!-- Share order - Secure link generator -->
              <s-shop-share-order-button
                :basket="basket"
                :shop="shop"
                class="mt-3 text-end"
              ></s-shop-share-order-button>
            </div>

            <!-- NOTE: In service all calculated by seller manually -->

            <s-storefront-coupons-list
              v-if="!isSubscription"
              v-model="basket.coupon"
              :basket="basket"
              force-show
              return-object
              selectable
              @loading="(val) => (refreshing_price = val)"
              @update:model-value="selectCoupon"
            ></s-storefront-coupons-list>

            <!-- NOTE: In service all calculated by seller manually -->

            <s-storefront-lottery-prizes-list
              v-if="!isSubscription"
              v-model="basket.lottery"
              :basket="basket"
              force-show
              return-object
              selectable
              @loading="(val) => (refreshing_price = val)"
              @update:model-value="selectLottery"
            >
            </s-storefront-lottery-prizes-list>
          </v-col>

          <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Receipt ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
          <v-col
            :class="{ dark: !light_checkout }"
            class="receipt"
            cols="12"
            lg="4"
            md="5"
            sm="12"
          >
            <v-sheet
              :class="{
                success: canPayAndComplete,
                error: hasErrorInReceiverInfo,
              }"
              :theme="light_checkout ? 'light' : 'dark'"
              class="receipt-bg m-0"
              color="transparent"
            >
              <div class="receipt-container m-lg-2 m-md-1 position-relative">
                <u-loading-progress v-if="busy_save"></u-loading-progress>

                <div v-if="busy_bill" class="text-center">
                  <u-loading-ellipsis
                    css-mode
                    :light="light_checkout"
                  ></u-loading-ellipsis>
                </div>
                <div v-else-if="bill">
                  <!-- START OF PRICES -->

                  <div class="font-weight-medium data-row">
                    <!-- SERVICE: Dont show price for service -->
                    <u-text-value-dashed>
                      <template v-slot:label>
                        {{ $t("basket_page.total_price") }}
                      </template>
                      <u-price :amount="raw_items_price" medium></u-price>
                    </u-text-value-dashed>
                  </div>

                  <!-- Delivery price -->

                  <div
                    v-if="!isService && receiver_info && is_valid_location"
                    class="font-weight-medium data-row"
                  >
                    <!-- SERVICE: Dont show price for service / Show shipping cost after user select address! -->
                    <u-text-value-dashed>
                      <template v-slot:label>
                        <i class="fas fa-shipping-fast me-1" />
                        {{ $t("basket_page.shipping") }}
                      </template>

                      <u-price
                        v-if="shipping_cost > 0"
                        :amount="shipping_cost"
                        medium
                      ></u-price>

                      <span v-else-if="shipping_cost === 0">
                        {{ $t("basket_page.free_shipping") }}
                      </span>

                      <span v-else>
                        {{ $t("basket_page.shipping_not_pay") }}
                      </span>
                    </u-text-value-dashed>
                  </div>

                  <!-- Products Discount -->

                  <div
                    v-if="total_items_discount"
                    class="data-row font-weight-medium"
                  >
                    <!-- SERVICE: Dont show price for service -->
                    <u-text-value-dashed>
                      <template v-slot:label>
                        <i class="fas fa-tags me-1" />
                        {{ $t("basket_page.total_discount") }}
                      </template>
                      <p class="text-success">
                        <u-price
                          :amount="-total_items_discount"
                          medium
                        ></u-price>

                        <span v-if="total_offers_amount">
                          <v-icon class="mx-1 align-baseline" size="small"
                            >add</v-icon
                          >

                          <v-icon
                            class="align-baseline vertical-align-baseline me-1"
                            color="#2ab27b"
                            size="small"
                            >fa:fas fa-gift</v-icon
                          >
                          <u-price
                            :amount="-total_offers_amount"
                            medium
                          ></u-price>
                        </span>
                      </p>
                    </u-text-value-dashed>
                  </div>

                  <!-- Cross selling discount -->

                  <div
                    v-if="cross_selling_discount > 0"
                    class="data-row font-weight-medium"
                  >
                    <!-- SERVICE: Dont show price for service -->
                    <u-text-value-dashed>
                      <template v-slot:label>
                        <v-icon class="me-1" size="small">whatshot</v-icon>
                        {{ $t("basket_page.cross_selling_discount") }}
                      </template>
                      <p class="text-success">
                        <u-price
                          :amount="-cross_selling_discount"
                          medium
                        ></u-price>
                      </p>
                    </u-text-value-dashed>
                  </div>

                  <!-- Discount Code -->
                  <div
                    v-if="!isSubscription"
                    class="data-row d-flex align-center"
                  >
                    <s-discount-code-input
                      v-model="basket.discount_code"
                      :basket="basket"
                      :currency="basket.currency"
                      @loading="(val) => (refreshing_price = val)"
                      @update:model-value="selectDiscountCode"
                      class="flex-grow-1 me-2"
                    />

                    <u-price
                      v-if="discount_code_amount > 0 /*&& !isService*/"
                      :amount="-discount_code_amount"
                      class="text-success font-weight-medium"
                      medium
                    ></u-price>
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
                  <div v-if="club">
                    <div class="text-center mt-2">
                      <img
                        :src="getCustomerClubLevel(club.level).icon"
                        class="mx-auto mb-1"
                        height="48"
                        width="48"
                      />
                      <p class="text-subtitle-2">
                        {{ $t("basket_page.customer_club") }}
                      </p>
                      <p class="small m-0" v-text="club.description"></p>
                    </div>

                    <div
                      v-if="customer_club_discount > 0"
                      class="font-weight-medium data-row"
                    >
                      <!-- SERVICE: Dont show price for service -->
                      <u-text-value-dashed>
                        <template v-slot:label>
                          <i class="fas fa-heart me-1" />{{
                            $t("basket_page.customer_club_discount")
                          }}
                        </template>
                        <u-price
                          :amount="-customer_club_discount"
                          class="text-success"
                          medium
                        ></u-price>
                      </u-text-value-dashed>
                    </div>
                  </div>

                  <!-- Coupon -->

                  <v-expand-transition>
                    <div v-if="coupon">
                      <div class="text-center mt-2">
                        <img
                          class="mx-auto mb-1"
                          height="48"
                          src="@selldone/components-vue/assets/icons/coupon.svg"
                          width="48"
                        />
                        <p>{{ coupon.title }}</p>
                        <p class="small m-0" v-text="coupon.description"></p>
                      </div>

                      <div class="font-weight-medium data-row">
                        <!-- SERVICE: Dont show price for service -->
                        <u-text-value-dashed>
                          <template v-slot:label>
                            <i class="fas fa-ticket-alt me-1" />{{
                              $t("global.commons.coupon")
                            }}
                          </template>
                          <u-price
                            :amount="-coupon_discount"
                            class="text-success"
                            medium
                          ></u-price>
                        </u-text-value-dashed>
                      </div>
                    </div>
                  </v-expand-transition>

                  <!-- Lottery -->

                  <v-expand-transition>
                    <div v-if="prize">
                      <div class="text-center mt-2">
                        <img
                          class="mx-auto mb-1"
                          height="48"
                          src="@selldone/components-vue/assets/icons/lottery-win.svg"
                          width="48"
                        />
                        <p>{{ prize.title }}</p>
                        <p class="small m-0" v-text="prize.description"></p>
                      </div>

                      <div class="font-weight-medium data-row">
                        <!-- SERVICE: Dont show price for service -->
                        <u-text-value-dashed>
                          <template v-slot:label>
                            <i class="fas fa-dice me-1" />{{
                              $t("global.commons.prize")
                            }}
                          </template>
                          <u-price
                            v-if="prize.discount || prize.amount"
                            :amount="-prize_discount"
                            class="text-success"
                            medium
                          ></u-price>
                          <div v-else-if="prize.product">
                            <v-avatar
                              class="me-1 hover-scale-small pointer-pointer"
                              size="20"
                              @click="goToProduct(prize.product.id)"
                            >
                              <v-img
                                :src="getShopImagePath(prize.product.icon)"
                              />
                            </v-avatar>

                            {{ prize.product.title }}
                          </div>
                        </u-text-value-dashed>
                      </div>

                      <!-- Product has variant! User can select variant for prize. -->
                      <div
                        v-if="
                          prize_available_variants &&
                          lottery_win_selected_variant
                        "
                      >
                        <v-menu>
                          <template v-slot:activator="{ props }">
                            <div class="position-relative" v-bind="props">
                              <variant-item-mini
                                :product-variant="lottery_win_selected_variant"
                                class="m-2"
                                force-enable
                                selected
                              />
                              <v-icon class="absolute-top-end">
                                arrow_drop_down
                              </v-icon>
                            </div>
                          </template>
                          <v-sheet class="py-2" color="#fff">
                            <variant-item-mini
                              v-for="(
                                product_variant, index
                              ) in prize_available_variants"
                              :key="index"
                              :product-variant="product_variant"
                              :selected="
                                product_variant === lottery_win_selected_variant
                              "
                              class="m-2"
                              @select="
                                lottery_win_selected_variant = product_variant
                              "
                            />
                          </v-sheet>
                        </v-menu>
                      </div>
                    </div>
                  </v-expand-transition>

                  <!-- SERVICE: Dont show price for service -->

                  <!-- ========== Spacer ========== -->

                  <!-- ========== Wallet (Pay by customer wallet) ========== -->

                  <div v-if="wallet" class="font-weight-medium data-row">
                    <u-text-value-dashed>
                      <template v-slot:label>
                        <v-icon class="me-1">wallet</v-icon>
                        {{ $t("global.commons.my_wallet") }}
                      </template>
                      <u-price
                        :amount="-wallet"
                        medium
                        class="text-success"
                      ></u-price>
                    </u-text-value-dashed>
                  </div>

                  <!-- ========== Net Price ========== -->

                  <div class="font-weight-medium data-row">
                    <u-text-value-dashed>
                      <template v-slot:label>
                        {{ $t("global.commons.net_price") }}
                      </template>
                      <u-price :amount="net_price" medium></u-price>
                    </u-text-value-dashed>
                  </div>

                  <!-- ========== Tax ========== -->

                  <div v-if="bill.tax" class="font-weight-medium data-row">
                    <u-text-value-dashed>
                      <template v-slot:label>
                        {{ $t("global.commons.tax") }}
                      </template>
                      <u-price :amount="bill.tax" medium></u-price>
                    </u-text-value-dashed>
                  </div>

                  <div
                    v-if="bill.tax_shipping"
                    class="font-weight-medium data-row"
                  >
                    <u-text-value-dashed>
                      <template v-slot:label>
                        {{ $t("global.commons.shipping_tax") }}
                      </template>
                      <u-price :amount="bill.tax_shipping" medium></u-price>
                    </u-text-value-dashed>
                  </div>

                  <!-- ========== Spacer ========== -->

                  <!-- ====================================== TOTAL PRICE ================================= -->

                  <div class="total-price-after-discount">
                    <p class="label m-0">
                      {{ $t("basket_page.final_price") }}
                      :
                    </p>
                    <p class="value font-weight-black">
                      <u-loading-ellipsis
                        v-if="refreshing_price"
                        css-mode
                        :light="light_checkout"
                      ></u-loading-ellipsis>

                      <u-price v-else :amount="final_price" x-large></u-price>

                      <span v-if="isSubscription && subscription_period_obj">
                        / {{ $t(subscription_period_obj.title) }}</span
                      >
                    </p>
                  </div>

                  <div v-if="has_delivery" class="spacer-line my-3" />
                </div>
                <!-- END OF PRICES -->
                <div v-else class="text-h4 text-center p-3">
                  Sorry, Can not calculate the bill. contact us by :
                  info@selldone.com
                </div>

                <template v-if="!isService">
                  <!-- ════════════════════════ 🦠 Connect Shipping Options ════════════════════════ -->

                  <s-shop-connect-shipping-options
                    :basket="basket"
                    :shop="shop"
                    @change="
                      (connect_shippings) => {
                        delivery_info.connect_shippings = connect_shippings;
                        setBasketConfig();
                      }
                    "
                  ></s-shop-connect-shipping-options>

                  <!-- ════════════════════════ 🍇 Vendors Shipping Options ════════════════════════ -->
                  <s-order-shipping-vendors-options
                    :shop="shop"
                    :basket="basket"
                    :deliveryInfo="delivery_info"
                    @set-basket-config="setBasketConfig"
                  ></s-order-shipping-vendors-options>

                  <!-- ════════════════════════ 🥬 Store Shipping Options (Multi Warehouse - soon) ════════════════════════ -->

                  <s-order-shipping-stores-options
                    :shop="shop"
                    :basket="basket"
                    :delivery-info="delivery_info"
                    @set-basket-config="setBasketConfig"
                  ></s-order-shipping-stores-options>

                  <!-- ════════════════════════ 🥕 Drop Shipping delivery ════════════════════════ -->
                  <div v-if="extra_shipping_counts" class="my-4">
                    <p class="text-center font-weight-bold">
                      <v-icon class="blink-me me-1" color="green" size="x-small"
                        >lens
                      </v-icon>
                      {{
                        $t("basket_page.extra_shipping_count", {
                          count: has_custom_delivery
                            ? 1 + extra_shipping_counts
                            : extra_shipping_counts,
                        })
                      }}
                    </p>
                    <p class="text-start small">
                      <v-icon class="me-1" size="small">info</v-icon>
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
                  <v-icon class="mx-1 blink-me" dark size="small"
                    >arrow_downward
                  </v-icon>
                </p>

                <!-- ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Select Receiver Address ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃  -->
                <div v-if="has_delivery">
                  <div
                    v-intersect="
                      (isIntersecting, entries, observer) => {
                        intersect_location_btn = isIntersecting;
                      }
                    "
                    style="min-height: 78px"
                  >
                    <div v-if="!is_valid_location" class="widget-buttons">
                      <v-btn
                        :class="{
                          's--shop-basket-buy-button slideInUp':
                            !intersect_location_btn,
                          'is-mobile': isMobile,
                          '-up': bottom_nav_show,
                        }"
                        class="select-address-button"
                        color="#4d90fe"
                        @click.stop="showMap()"
                        variant="elevated"
                      >
                        <v-icon class="me-2"> near_me</v-icon>
                        {{
                          isService
                            ? $t("global.receiver_info.service_address")
                            : all_is_pickup
                              ? $t("global.receiver_info.select_billing_address")
                              : $t("global.receiver_info.receiver_address")
                        }}

                        <u-price
                          v-if="final_price > 0 && !intersect_location_btn"
                          :amount="final_price"
                          :currency="basket.currency"
                          class="ms-3 ps-3 border-start"
                        ></u-price>
                      </v-btn>
                    </div>

                    <s-shop-customer-receiver-info-widget
                      v-else
                      :dark="!light_checkout"
                      :noMap="no_map"
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
                      @update:country="setBasketConfig"
                    ></s-shop-customer-receiver-info-widget>
                  </div>
                </div>

                <!-- ========== Alert Not Click On Location!========== -->

                <p
                  v-if="
                    has_delivery && !error_message_payment && !is_valid_location
                  "
                  class="bg-danger-match text-white text-center font-weight-medium mt-3 px-2 mx-n3 py-2 my-2"
                >
                  <v-icon class="me-1 blink-me" dark size="small"
                    >error_outline
                  </v-icon>
                  {{ $t("basket_page.select_location_error") }}
                </p>

                <!-- ============== Billing Info ============== -->
                <div v-if="canPayAndComplete" class="mt-5">
                  <s-shop-billing-address-form
                    v-model="billing"
                    :dark="!light_checkout"
                    :receiver-info="receiver_info"
                    @change="setBasketConfig"
                  ></s-shop-billing-address-form>
                </div>

                <!-- ============== User messages (by server) ============== -->

                <div
                  v-if="bill?.user_messages?.length"
                  class="py-2 border-between-vertical mt-5 text-h4"
                >
                  <div
                    v-for="(msg, i) in bill.user_messages"
                    :key="i"
                    class="py-2"
                  >
                    <v-icon class="me-1" color="amber" size="large"
                      >warning
                    </v-icon>
                    <span v-html="msg"></span>
                  </div>
                </div>

                <!-- ********************************** Payment ********************************** -->

                <div
                  v-intersect="
                    (isIntersecting, entries, observer) => {
                      intersect_payment_btn = isIntersecting;
                    }
                  "
                  class="d-flex"
                  style="min-height: 78px"
                >
                  <div class="widget-buttons">
                    <!-- Payment button (Online & COD) -->
                    <v-btn
                      v-if="canPayAndComplete && !is_service_need_pricing"
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
                      color="#16a085"
                      variant="elevated"
                      rounded
                      @click.stop="goToPaymentBasket(null)"
                    >
                      <span
                        v-if="!$vuetify.display.xs"
                        class="me-4"
                        style="min-width: 28px"
                      >
                      </span>
                      <v-icon class="me-2"> payment</v-icon>
                      {{ $t("basket_page.pay_and_complete_action") }}

                      <u-price
                        v-if="final_price > 0 && !intersect_payment_btn"
                        :amount="final_price"
                        :currency="basket.currency"
                        class="ms-3 ps-3 border-start"
                      ></u-price>

                      <span
                        v-if="!$vuetify.display.xs || busy_save || busy_bill"
                        class="ms-4"
                        style="min-width: 28px"
                      >
                        <v-fab-transition>
                          <v-progress-circular
                            v-if="busy_save || busy_bill"
                            indeterminate
                            size="24"
                          ></v-progress-circular>
                        </v-fab-transition>
                      </span>
                    </v-btn>

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
                      :loading="busy_submit"
                      class="select-address-button"
                      color="#16a085"
                      variant="elevated"
                      rounded
                      @click.stop="submitServiceOrder()"
                    >
                      <v-icon class="me-2"> check_circle</v-icon>
                      {{ $t("basket_page.pre_confirm_service") }}

                      <u-price
                        v-if="final_price > 0 && !intersect_payment_btn"
                        :amount="final_price"
                        :currency="basket.currency"
                        class="ms-3 ps-3 border-start"
                      ></u-price>
                    </v-btn>
                  </div>
                </div>
                <span v-if="can_pay_cod" class="mx-1 small d-flex align-center"
                  ><v-icon class="me-1">check_circle</v-icon>
                  {{ $t("basket_page.can_pay_cod_message") }}</span
                >

                <!-- ******************************************************************************************** -->

                <template v-if="canPayAndComplete && !isService">
                  <u-payment-stripe-split
                    :basket="basket"
                    :country-code="receiver_info?.country"
                    :dark="!light_checkout"
                  ></u-payment-stripe-split>
                </template>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>

      <div
        v-else
        :class="{ blurred: busy_shop }"
        class="blur-animate text-center"
        style="min-height: 60vh; padding-top: 15vh"
      >
        <img
          class="m-5 img-grayscale"
          height="120"
          src="@selldone/components-vue/assets/icons/baskets.svg"
        />
        <h1 class="text-uppercase text-muted">
          {{ $t("basket_page.basket_empty") }}
        </h1>
      </div>

      <div v-if="busy_shop" class="busy-overlay">
        <div class="text-h4 font-weight-thin">
          <v-icon class="me-2" size="large">hourglass_empty</v-icon>

          {{ $t("global.commons.waiting") }}...
        </div>
      </div>
    </v-card>

    <!-- █████████████████████ Dialog > Map █████████████████████ -->

    <v-dialog
      v-if="has_delivery"
      v-model="map_dialog"
      :content-class="no_map ? 'bg-gray' : 'bg-map'"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <!-- Shop Configuration ➡ Map enabled / disabled -->
      <u-map-view
        v-if="dialog_pre"
        v-model="basket.receiver_info"
        v-model:center="center"
        :address-type="$t('global.receiver_info.map.address_type')"
        :availableCountries="
          shop.countries?.length ? shop.countries : undefined
        "
        :color="SaminColorDark"
        :confirm-text="$t('global.receiver_info.map.confirm')"
        :delay-load="1000"
        :hide="!map_dialog"
        :noMap="no_map"
        :receptor-type="$t('global.receiver_info.map.receptor_type')"
        :startup-mode="startup_mode_map_dialog"
        :title="$t('global.receiver_info.map.title')"
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
  </div>
</template>

<script lang="ts">
import SShopBasketItems from "@selldone/components-vue/storefront/order/basket/SShopBasketItems.vue";
import { ShopTransportations } from "@selldone/core-js/enums/logistic/ShopTransportations";
import SDiscountCodeInput from "@selldone/components-vue/storefront/discount-code/input/SDiscountCodeInput.vue";
import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";
import SStorefrontCouponsList from "@selldone/components-vue/storefront/coupon/list/SStorefrontCouponsList.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import SStorefrontLotteryPrizesList from "@selldone/components-vue/storefront/lottery/prizes-list/SStorefrontLotteryPrizesList.vue";
import VariantItemMini from "@selldone/components-vue/storefront/product/variant/VariantItemMini.vue";
import SShopCustomerReceiverInfoWidget from "@selldone/components-vue/storefront/order/delivery/SShopCustomerReceiverInfoWidget.vue";
import { ShopOptionsHelper } from "@selldone/core-js/helper/shop/ShopOptionsHelper";
import UTextValueDashed from "@selldone/components-vue/ui/text/value-dashed/UTextValueDashed.vue";
import { StorefrontLocalStorages } from "@selldone/core-js/helper/local-storage/StorefrontLocalStorages";
import SShopShareOrderButton from "@selldone/components-vue/storefront/order/share-order/SShopShareOrderButton.vue";
import SShopBillingAddressForm from "@selldone/components-vue/storefront/order/billing/SShopBillingAddressForm.vue";
import BillingPeriod from "@selldone/core-js/enums/subscription/BillingPeriod";
import SShopConnectShippingOptions from "@selldone/components-vue/storefront/order/shipping/connect/SShopConnectShippingOptions.vue";
import { ETA } from "@selldone/core-js/enums/logistic/ETA";
import { ShadeColor } from "@selldone/core-js/helper/color/ColorGenerator";
import _ from "lodash-es";
import UPaymentStripeSplit from "@selldone/components-vue/ui/payment/stripe/split/UPaymentStripeSplit.vue";
import { BasketHelper } from "@selldone/core-js/helper/shop/BasketHelper";
import SOrderShippingVendorsOptions from "@selldone/components-vue/storefront/order/shipping/vendor/SOrderShippingVendorsOptions.vue";
import SOrderShippingStoresOptions from "@selldone/components-vue/storefront/order/shipping/store/SOrderShippingStoresOptions.vue";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";
import { Basket } from "@selldone/core-js/models";

export default {
  name: "StorefrontPageBasketCart",
  components: {
    ULoadingEllipsis,
    SOrderShippingStoresOptions,
    SOrderShippingVendorsOptions,
    UPaymentStripeSplit,

    SShopConnectShippingOptions,
    SShopBillingAddressForm,
    SShopShareOrderButton,

    UTextValueDashed,
    SShopCustomerReceiverInfoWidget,
    VariantItemMini,
    SStorefrontLotteryPrizesList,
    SStorefrontCouponsList,
    SDiscountCodeInput,
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

    delivery_info: {},

    startup_mode_map_dialog: "default",

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
    receiver_info() {
      return this.basket.receiver_info;
    },
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
      return this.getBasket(this.type) as Basket;
    },

    bill() {
      return this.basket ? (this.basket.bill as Basket.ICalculatedBill) : null;
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

    wallet() {
      return this.bill.wallet;
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

    /**
     * It determines delivery and product type support COD or not!
     */
    deliverySupportCOD() {
      return this.bill?.can_cod; // Only for physical and service!
    },

    can_pay_cod() {
      return (
        this.deliverySupportCOD &&
        this.shop.gateways?.some(
          (gateway) => gateway.currency === this.basket.currency && gateway.cod,
        )
      );
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
        !!this.receiver_info.location.lat &&
        !!this.receiver_info.location.lng
      );
    },

    // ---------- Lottery --------
    prize_available_variants() {
      if (!this.prize || !this.prize || !this.prize.product) return [];
      return this.prize.variant
        ? [this.prize.variant]
        : this.prize.product.product_variants;
    },

    club() {
      return this.getClub();
    },

    // ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ Address Button (SHipping or Billing) ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅

    vendor_shipping_options() {
      return this.bill?.vendor_shipping_options;
    },
    store_shipping_options() {
      return this.bill?.store_shipping_options;
    },
    connect_shipping_options() {
      return this.bill?.connect_shipping_options;
    },
    /**
     * Check here all shipping methods are pickup!?
     */
    all_is_pickup() {
      if (!this.delivery_info || this.connect_shipping_options?.length/*In connect shipping mode always we ask shipping address*/) return false;

      if (this.vendor_shipping_options?.length) {
        return this.delivery_info.vendor_shippings.every(
          (vendor_shipping) =>
            vendor_shipping.type == ShopTransportations.Pickup.code,
        );
      }
      if (this.store_shipping_options?.length) {
        return (
          this.delivery_info.delivery_type == ShopTransportations.Pickup.code
        );
      }
      return false;
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

      // this.receiver_info = Object.assign({}, this.basket.receiver_info); // Local Clone

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

    setBasketConfig() {
      this.PENDING_UPDATE = true;
      this.setBasketConfigThrottle();
    },
    setBasketConfigThrottle: _.throttle(
      function setBasketConfig() {
        this.PENDING_UPDATE = false;

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
            },
          )
          .then(({ data }) => {
            if (!data.error) {
              if (this.PENDING_UPDATE) {
                console.log(
                  "⏳ Not update local basket because of pending update!",
                );
                return; // Update only on last function call to prevent jump back basket changes!
              }
              console.log("✅ Local cart updated.");

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
      },
      3000,
      {
        leading: true, // Call immediately on the first call
        trailing: true, // Optional: Set to false if you don't want it called after the wait period
      },
    ),

    getCount(type) {
      let basket = this.getBasket(type);
      return basket && basket.items ? basket.items.length : 0;
    },

    getShopTransportationObject(type) {
      return ShopTransportations[type];
    },

    onClickSetLocation(info) {
      if (!info.phone) info.phone = this.USER() ? this.USER().phone : null; // Autofill phone!

      this.basket.receiver_info = info;
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

    goToPaymentBasket(gateway) {
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
          },
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

      console.log(
        "🧨 goToPaymentBasket | Selected Gayteway: ",
        gateway,
        "Can COD: ",
        this.deliverySupportCOD,
      );
      this.ShowPaymentDialogBasket(
        this.basket.code /*🥶 Guest*/,
        this.basket,
        this.type,
        this.bill,
        this.lottery_win_selected_variant
          ? this.lottery_win_selected_variant.id
          : null,
        gateway,
        this.deliverySupportCOD,
        /*Used for in site payment flow & free orders!*/
        (data) => {
          if (!this._isDestroyed) this.goToOrderInfo(this.type, data.target_id);
        },
      );

      GtagEcommerce.MeasuringCheckoutSteps(this.basket, 2, gateway);
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
          },
        )
        .then(({ data }) => {
          if (!data.error) {
            // ▀▀▀▀▀▀▀▀▀ 🥶 Guest ▀▀▀▀▀▀▀▀▀
            if (!this.USER()) {
              // Save array of guest codes in local storage:
              StorefrontLocalStorages.AddCurrentGuestCodeToHistory(
                this.type,
                data.basket_id,
                data.code,
              );
            }

            this.fetchBasketAndShop();
            this.showSuccessAlert(
              "Order submitted",
              "Your order has been submitted successfully. We will send bill to you.",
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
  },
};
</script>

<style lang="scss" scoped>
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

    ::v-deep(.spacer-line-dotted) {
      display: block;
      border-bottom: 2px dotted rgba(255, 255, 255, 0.18);
      width: 60%;
      margin: 0 auto;
    }

    ::v-deep(.spacer-line) {
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
