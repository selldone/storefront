<!--
  - Copyright (c) 2023-2024. Selldone® Business OS™
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
  <div>
    <u-loading-progress v-if="busy_fetch"></u-loading-progress>
    <v-data-table-server
      :mobile="$vuetify.display.xs"
      v-model="selected"
      v-model:options="options"
      v-model:page="page"
      v-model:sort-by="sortBy"
      :class="{ 'blurred disabled': busy_fetch && !HIGHLIGHT_ID }"
      :header-props="{ sortByText: $t('global.commons.sort_by') }"
      :headers="headers"
      :items="orders"
      :items-length="totalItems"
      :items-per-page="itemsPerPage"
      :no-data-text="$t('global.commons.no_data')"
      :row-props="
        (_data) => {
          return {
            class:
              'row-hover ' +
              (HIGHLIGHT_ID === _data.item.id ? 'drop-down-delayed' : ''),
          };
        }
      "
      class="bg-transparent blur-animate"
      density="compact"
      hide-default-footer
      item-key="id"
      style="min-height: 60vh"
      @click:row="(_, r) => handleSelected(r.item)"
    >
      <template v-slot:loading>
        <u-loading-ellipsis css-mode light></u-loading-ellipsis>
      </template>

      <template v-slot:item.id="{ item }">
        <img
          :src="
            isAvocado
              ? require('@selldone/core-js/assets/order-types/basket-avocado.svg')
              : isPos
                ? require('@selldone/core-js/assets/order-types/basket-pos.svg')
                : type.basket
          "
          class="my-2 me-2"
          height="42"
        />
        <b
          >{{ isAvocado ? "AVO" : isPos ? "POS" : type.basket_code }}-{{
            item.id
          }}</b
        >
        <v-chip
          v-if="item.subscription_id"
          class="ms-1"
          color="#111"
          variant="flat"
          label
          size="small"
          title="This order is auto-created by your subscription plan."
        >
          <img
            :src="ProductType.SUBSCRIPTION.image"
            class="ms-n2 me-1"
            height="16"
            width="16"
          />
          {{ $t("global.commons.auto") }}
        </v-chip>

        <!-- ▂▂▂▂▂▂▂▂ Chat ▂▂▂▂▂▂▂ -->
        <v-btn
          v-if="item.chat && item.chat.length"
          class="ms-1 float-end"
          color="#111"
          icon
          variant="text"
        >
          <v-badge
            :model-value="
              item.chat[item.chat.length - 1]
                .officer /*Show dot if admin send last message!*/
            "
            color="red"
            dot
          >
            <v-icon>chat</v-icon>
          </v-badge>
          <v-tooltip
            activator="parent"
            content-class="bg-black"
            location="bottom"
            max-width="460"
          >
            <s-order-chat-message
              :basket="item"
              :message="item.chat[item.chat.length - 1]"
            >
            </s-order-chat-message>
          </v-tooltip>
        </v-btn>
      </template>

      <template v-slot:item.items="{ item }">
        <div class="min-width-200">
          <products-dense-images-circles
            :ids="getProductsIDs(item)"
            :raw-images-path="isAvocado"
            big-scale
            border
            style="vertical-align: super; display: inline"
          ></products-dense-images-circles>
        </div>
      </template>

      <template v-slot:item.price="{ item }">
        <span
          v-if="isService && item.status === 'Reserved' && !item.price"
          class="text-muted"
          ><v-icon class="me-1 blink-me" color="blue" size="x-small"
            >lens</v-icon
          >
          {{ $t("global.commons.waiting_review") }}</span
        >
        <u-price
          v-else
          :amount="item.price"
          :currency="item.currency"
        ></u-price>
      </template>

      <template v-slot:item.status="{ item }">
        <s-order-status-view :status="item.status"></s-order-status-view>
      </template>

      <template v-if="!isPos" v-slot:item.delivery_state="{ item }">
        <div class="min-width-250">
          <p v-if="item.reject" class="m-0 text-danger font-weight-bold">
            {{ $t("history_orders_physical.rejected") }}
            <i class="fas fa-exclamation" />
          </p>
          <div v-else class="m-0 pt-2">
            <s-order-delivery-status-stepper
              :has-subscription="isSubscription"
              :is-subscribed="item.status === 'Payed'"
              :state="item.delivery_state"
              :states="orders_states"
              class="my-1"
              @mouseEnterToCustomer="(n) => setActivator(n, item)"
            />

            <div
              class="py-1 small min-width-200 d-flex align-center justify-center"
            >
              <span class="text-muted">
                {{ getDeliveryStateString(item.delivery_state) }}
              </span>
              <template v-if="item.receiver_info">
                <span class="dashed-flex-space"></span>
                <div class="ps-1">
                  <flag
                    :iso="item.receiver_info.country"
                    :squared="false"
                    class="me-1"
                  ></flag>
                  <span>{{ getShortAddress(item.receiver_info) }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template
        v-if="!isPos && !isAvocado"
        v-slot:item.basket_item_returns="{ item }"
      >
        <div class="text-center" style="max-width: 32px">
          <return-request-button-badge
            :basket-item-returns="item.basket_item_returns"
          ></return-request-button-badge>
        </div>
      </template>

      <template v-slot:item.reserved_at="{ item }">
        <div class="min-width-200 text-start">
          {{ getFromNowString(item.reserved_at) }} <br />
          <small>
            {{ getLocalTimeString(item.reserved_at) }}
          </small>
        </div>
      </template>

      <template v-slot:bottom>
        <v-pagination v-model="page" :length="pageCount" rounded />
      </template>
    </v-data-table-server>

    <!-- ----------------------------------- Receiver Info Details Menu ----------------------------------- -->
    <v-menu
      v-if="hasReceiverInfo"
      :activator="activator"
      :open-delay="200"
      max-width="360"
      open-on-hover
      content-class="rounded-xl"
      location="top"
    >
      <v-sheet class="pa-3" rounded="xl">
        <s-order-receiver-info-card
          v-if="activator_item && activator_item.receiver_info"
          :receiver-info="activator_item.receiver_info"
          :userId="activator_item.user_id"
          class="text-start"
        >
        </s-order-receiver-info-card>
        <small v-else>
          <i class="fa:fas fa-map-location me-1"></i>Not set yet!</small
        >
      </v-sheet>
    </v-menu>
  </div>
</template>

<script lang="ts">
import SOrderDeliveryStatusStepper from "@selldone/components-vue/storefront/order/shipping/stepper/SOrderDeliveryStatusStepper.vue";
import { ProductType } from "@selldone/core-js/enums/product/ProductType";
import ReturnRequestButtonBadge from "@selldone/components-vue/storefront/order/order-return/ReturnRequestButtonBadge.vue";
import ProductsDenseImagesCircles from "@selldone/components-vue/storefront/product/products-dense-images-circles/ProductsDenseImagesCircles.vue";
import SOrderStatusView from "@selldone/components-vue/storefront/order/order-status/SOrderStatusView.vue";
import SOrderReceiverInfoCard from "@selldone/components-vue/storefront/order/receiver-info/card/SOrderReceiverInfoCard.vue";
import { StorefrontLocalStorages } from "@selldone/core-js/helper/local-storage/StorefrontLocalStorages";
import { RouteMixin } from "@selldone/components-vue/mixin/RouteMixin";
import { Avocado, Basket } from "@selldone/core-js";
import SOrderChatMessage from "@selldone/components-vue/storefront/order/chat/message/SOrderChatMessage.vue";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";

export default {
  name: "SOrdersList",
  mixins: [RouteMixin],

  components: {
    ULoadingEllipsis,
    SOrderChatMessage,
    SOrderReceiverInfoCard,
    SOrderStatusView,
    ProductsDenseImagesCircles,
    ReturnRequestButtonBadge,
    SOrderDeliveryStatusStepper,
  },
  inject: ["$shop"],
  props: {
    type: {
      // Object (Basket) or String (POS)
      require: true,
    },
    isPos: {
      default: false,
      type: Boolean,
    },
    isAvocado: {
      default: false,
      type: Boolean,
    },
  },

  data: function () {
    return {
      ProductType: ProductType,

      activator: null,
      activator_item: null,

      selected: [],

      orders: [],

      busy_fetch: false,

      // Pagination:
      page: 1,
      itemsPerPage: 10,
      totalItems: 0,
      options: {},
      sortBy: [{ key: null, order: "desc" }],
    };
  },

  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    hasReceiverInfo() {
      return (
        (this.type &&
          [ProductType.PHYSICAL.code, ProductType.SERVICE.code].includes(
            this.type?.code,
          )) ||
        this.isAvocado
      );
    },

    isService() {
      return this.type?.code === ProductType.SERVICE.code;
    },
    isSubscription() {
      return this.type?.code === ProductType.SUBSCRIPTION.code;
    },

    headers() {
      if (this.isPos) {
        return [
          {
            title: this.$t("history_orders.table.code"),
            align: "start",
            sortable: false,
            value: "id",
          },
          {
            title: this.$t("history_orders.table.items"),
            align: "start",
            sortable: false,
            value: "items",
          },

          {
            title: this.$t("history_orders.table.price"),
            align: "center",
            value: "price",
            sortable: true,
          },
          {
            title: this.$t("history_orders.table.status"),
            align: "center",
            value: "status",
          },

          {
            title: this.$t("history_orders.table.reserved"),
            align: "start",
            value: "reserved_at",
          },
        ];
      }
      return [
        {
          title: this.$t("history_orders.table.code"),
          align: "start",
          sortable: false,
          value: "id",
        },

        {
          title: this.$t("history_orders.table.items"),
          align: "start",
          sortable: false,
          value: "items",
        },

        {
          title: this.$t("history_orders.table.price"),
          align: "center",
          value: "price",
          sortable: true,
        },
        {
          title: this.$t("history_orders.table.status"),
          align: "center",
          value: "status",
        },

        {
          title: this.$t("history_orders.table.delivery_state"),
          align: "center",
          value: "delivery_state",
        },
        {
          title: "",
          align: "center",
          value: "basket_item_returns",
          sortable: false,
        },

        {
          title: this.$t("history_orders.table.reserved"),
          align: "start",
          value: "reserved_at",
        },
      ];
    },

    order_detail_page() {
      if (this.type?.code === ProductType.PHYSICAL.code) {
        return "MyPhysicalOrderInfoPage";
      } else if (this.type?.code === ProductType.VIRTUAL.code) {
        return "MyVirtualOrderInfoPage";
      } else if (this.type?.code === ProductType.FILE.code) {
        return "MyFileOrderInfoPage";
      } else if (this.type?.code === ProductType.SERVICE.code) {
        return "MyServiceOrderInfoPage";
      } else if (this.type?.code === ProductType.SUBSCRIPTION.code) {
        return "MySubscriptionOrderInfoPage";
      } else if (this.isPos) {
        return "MyPOSOrderInfoPage";
      } else if (this.isAvocado) {
        return "AvocadoOrderDetailPage";
      }

      return null;
    },
    orders_states() {
      if (this.type?.code === ProductType.PHYSICAL.code) {
        return Basket.PhysicalOrderStates;
      } else if (this.type?.code === ProductType.VIRTUAL.code) {
        return Basket.VirtualOrderStates;
      } else if (this.type?.code === ProductType.FILE.code) {
        return Basket.FileOrderStates;
      } else if (this.type?.code === ProductType.SERVICE.code) {
        return Basket.ServiceOrderStates;
      } else if (this.type?.code === ProductType.SUBSCRIPTION.code) {
        return Basket.SubscriptionOrderStates;
      } else if (this.isPos) {
        return null;
      } else if (this.isAvocado) {
        return Avocado.DeliveryStates;
      }
      return null;
    },
  },

  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, sortDesc, page } = this.options;
        this.fetchOrders(page, sortBy[0]?.key, sortBy[0]?.order === "desc");
      },
      deep: true,
    },
  },
  created() {},

  methods: {
    setActivator(node, item) {
      if (!this.hasReceiverInfo) return;
      this.activator = node;
      this.activator_item = item;
    },

    handleSelected(selected) {
      this.cacheRouteState(selected.id);

      this.$router.push({
        name: this.order_detail_page,
        params: {
          shop_name: this.$shop.name,
          basket_id: selected.id,
        },
      });
    },

    fetchOrders(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;
      axios
        .get(
          window.XAPI.GET_MY_ORDERS_HISTORY_PHYSICAL(
            this.$shop.name,
            this.isAvocado ? "AVO" : this.isPos ? "POS" : this.type.code,
          ),
          {
            params: {
              offset: (page - 1) * this.itemsPerPage,
              limit: this.itemsPerPage,
              sortBy: sortBy,
              sortDesc: sortDesc,

              codes:
                !this.USER() && this.type
                  ? StorefrontLocalStorages.GetShopHistoryGuestCodes(
                      this.type.code,
                    ) /*🥶 Guest*/
                  : undefined,
            },
          },
        )
        .then(({ data }) => {
          if (!data.error) {
            this.orders = data.orders;
            this.totalItems = data.total;
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((e) => {
          this.showLaravelError(e);
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    getProductsIDs(basket) {
      const out = [];

      if (this.isAvocado) {
        // Raw image path mode!
        basket.items.forEach((item) => {
          out.push(
            item.image
              ? item.image
              : require("@selldone/components-vue/assets/icons/circle-blue.svg"),
          );
        });
      } else {
        basket.items.forEach((item) => {
          if (!out.includes("" + item.product_id))
            out.push("" + item.product_id);
        });
      }

      return out;
    },

    getShortAddress(receiver_info) {
      if (receiver_info.state && receiver_info.city)
        return `${receiver_info.state} > ${receiver_info.city}`;
      else if (receiver_info.city) return receiver_info.city;
      else receiver_info.state;
    },
  },
};
</script>

<style lang="scss" scoped>
.data-table {
  cursor: pointer;
  font-size: 1.071rem;
  font-weight: 400;
  color: #555;
  height: 68px;
}
</style>
