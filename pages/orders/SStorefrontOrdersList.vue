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
  <div>
    <s-progress-loading v-if="busy_fetch"></s-progress-loading>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="orders"
      item-key="id"
      hide-default-footer
      :server-items-length="totalItems"
      :options.sync="options"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
      :header-props="{ sortByText: $t('global.commons.sort_by') }"
      :item-class="
        (item) => 'row-hover ' + (KEEP === item.id ? 'drop-down-delayed' : '')
      "
      @click:row="(item) => handleSelected(item)"
      class="bg-transparent dense-padding"
      style="min-height: 60vh"
    >
      <template v-slot:loading>
        <s-loading css-mode light></s-loading>
      </template>

      <template v-slot:item.id="{ item }">
        <img
          :src="
            isAvocado
              ? require('@core/assets/order-types/basket-avocado.svg')
              : isPos
              ? require('@core/assets/order-types/basket-pos.svg')
              : type.basket
          "
          height="42"
          class="my-2 me-2"
        />
        <b
          >{{ isAvocado ? "AVO" : isPos ? "POS" : type.basket_code }}-{{
            item.id
          }}</b
        >
        <v-chip v-if="item.subscription_id" color="#111" dark label class="ms-1" small title="This order is auto-created by your subscription plan.">
          <img width="16" height="16" class="ms-n2 me-1" :src="ProductType.SUBSCRIPTION.image">
       {{$t('global.commons.auto')}}</v-chip>
      </template>

      <template v-slot:item.items="{ item }">
        <div class="min-width-200">
          <products-dense-images-circles
            style="vertical-align: super; display: inline"
            :ids="getProductsIDs(item)"
            big-scale
            :raw-images-path="isAvocado"
          ></products-dense-images-circles>
        </div>
      </template>

      <template v-slot:item.price="{ item }">
        <span
          v-if="isService && item.status === 'Reserved' && !item.price"
          class="text-muted"
          ><v-icon class="me-1 blink-me" x-small color="blue">lens</v-icon>
          {{ $t("global.commons.waiting_review") }}</span
        >
        <price-view
          v-else
          :amount="item.price"
          :currency="item.currency"
        ></price-view>
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
            <status-stepper
              :states="orders_states"
              :state="item.delivery_state"
              class="my-1"
              @mouseEnterToCustomer="(n) => setActivator(n, item)"
              :is-subscribed="item.status==='Payed'"
              :has-subscription="isSubscription"
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
                    class="me-1"
                    :squared="false"
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

      <template v-slot:footer>
        <v-pagination v-model="page" circle :length="pageCount" />
      </template>
    </v-data-table>

    <!-- ----------------------------------- Receiver Info Details Menu ----------------------------------- -->
    <v-menu
      v-if="hasReceiverInfo"
      top
      :activator="activator"
      open-on-hover
      rounded="xl"
      :open-delay="200"
      max-width="360"
      offset-y
    >
      <v-sheet class="p-3">
        <receiver-info-widget
          class="text-start"
          v-if="activator_item && activator_item.receiver_info"
          :userId="activator_item.user_id"
          :receiver-info="activator_item.receiver_info"
        >
        </receiver-info-widget>
        <small v-else>
          <i class="fa-solid fa-map-location me-1"></i>Not set yet!</small
        >
      </v-sheet>
    </v-menu>
  </div>
</template>

<script>
import { VirtualOrderStates } from "@core/enums/basket/VirtualOrderStates";
import StatusStepper from "@components/storefront/order/order-status/StatusStepper.vue";
import { ProductType } from "@core/enums/product/ProductType";
import ReturnRequestButtonBadge from "@components/storefront/order/order-return/ReturnRequestButtonBadge.vue";
import { PhysicalOrderStates } from "@core/enums/basket/PhysicalOrderStates";
import { FileOrderStates } from "@core/enums/basket/FileOrderStates";
import ProductsDenseImagesCircles from "@components/product/products-dense-images-circles/ProductsDenseImagesCircles.vue";
import SOrderStatusView from "@components/order/order-status/SOrderStatusView.vue";
import { ServiceOrderStates } from "@core/enums/basket/ServiceOrderStates";
import { AvocadoOrderStates } from "@core/enums/avocado/AvocadoOrderStates";
import ReceiverInfoWidget from "@components/storefront/order/order-reciver-info/ReceiverInfoWidget.vue";
import { LocalStorages } from "@core/helper/local-storage/LocalStorages";
import {SubscriptionOrderStates} from "@core/enums/basket/SubscriptionOrderStates";

export default {
  name: "SStorefrontOrdersList",
  components: {
    ReceiverInfoWidget,
    SOrderStatusView,
    ProductsDenseImagesCircles,
    ReturnRequestButtonBadge,
    StatusStepper,
  },
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
      activator: null,
      activator_item: null,

      selected: [],

      orders: [],

      busy_fetch: false,

      // Pagination:
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      options: { sortDesc: [true] },

      // KEEP in return param:
      KEEP: null,
    };
  },

  computed: {
    hasReceiverInfo() {
      return (
        (this.type &&
          [ProductType.PHYSICAL, ProductType.SERVICE].includes(this.type)) ||
        this.isAvocado
      );
    },

    isService() {
      return this.type.code === ProductType.SERVICE.code;
    },
    isSubscription() {
      return this.type.code === ProductType.SUBSCRIPTION.code;
    },

    headers() {
      if (this.isPos) {
        return [
          {
            text: this.$t("history_orders.table.code"),
            align: "start",
            sortable: false,
            value: "id",
          },
          {
            text: this.$t("history_orders.table.items"),
            align: "start",
            sortable: false,
            value: "items",
          },

          {
            text: this.$t("history_orders.table.price"),
            align: "center",
            value: "price",
            sortable: true,
          },
          {
            text: this.$t("history_orders.table.status"),
            align: "center",
            value: "status",
          },

          {
            text: this.$t("history_orders.table.reserved"),
            align: "start",
            value: "reserved_at",
          },
        ];
      }
      return [
        {
          text: this.$t("history_orders.table.code"),
          align: "start",
          sortable: false,
          value: "id",
        },

        {
          text: this.$t("history_orders.table.items"),
          align: "start",
          sortable: false,
          value: "items",
        },

        {
          text: this.$t("history_orders.table.price"),
          align: "center",
          value: "price",
          sortable: true,
        },
        {
          text: this.$t("history_orders.table.status"),
          align: "center",
          value: "status",
        },

        {
          text: this.$t("history_orders.table.delivery_state"),
          align: "center",
          value: "delivery_state",
        },
        {
          text: "",
          align: "center",
          value: "basket_item_returns",
          sortable: false,
        },

        {
          text: this.$t("history_orders.table.reserved"),
          align: "start",
          value: "reserved_at",
        },
      ];
    },

    order_detail_page() {
      if (this.type === ProductType.PHYSICAL) {
        return "MyPhysicalOrderInfoPage";
      } else if (this.type === ProductType.VIRTUAL) {
        return "MyVirtualOrderInfoPage";
      } else if (this.type === ProductType.FILE) {
        return "MyFileOrderInfoPage";
      } else if (this.type === ProductType.SERVICE) {
        return "MyServiceOrderInfoPage";
      }
      else if (this.type === ProductType.SUBSCRIPTION) {
        return "MySubscriptionOrderInfoPage";
      }
      else if (this.isPos) {
        return "MyPOSOrderInfoPage";
      } else if (this.isAvocado) {
        return "AvocadoOrderDetailPage";
      }

      return null;
    },
    orders_states() {
      if (this.type === ProductType.PHYSICAL) {
        return PhysicalOrderStates;
      } else if (this.type === ProductType.VIRTUAL) {
        return VirtualOrderStates;
      } else if (this.type === ProductType.FILE) {
        return FileOrderStates;
      } else if (this.type === ProductType.SERVICE) {
        return ServiceOrderStates;
      } else if (this.type === ProductType.SUBSCRIPTION) {
        return SubscriptionOrderStates;
      }

      else if (this.isPos) {
        return null;
      } else if (this.isAvocado) {
        return AvocadoOrderStates;
      }
      return null;
    },
  },

  watch: {
    // Pagination:
    options: {
      handler() {
        const { sortBy, sortDesc, page } = this.options;
        this.fetchOrders(page, sortBy[0], sortDesc[0]);
      },
      deep: true,
    },
  },
  created() {
    // ............ Handle return state: ............
    if (this.$route.params.STATE) {
      const STATE = this.$route.params.STATE;
      this.options = STATE.options;
      this.page = this.options.page;

      this.KEEP = STATE.KEEP; // Keep last selected item property!
    }

    //..............................................
  },

  methods: {
    setActivator(node, item) {
      if (!this.hasReceiverInfo) return;
      //  console.log('setActivator',node)
      this.activator = node;
      this.activator_item = item;
    },

    handleSelected(selected) {
      this.$router.push({
        name: this.order_detail_page,
        params: {
          shop_name: this.shop_name,
          basket_id: selected.id,
          RETURN: this.buildReturn(selected.id),
        },
      });
    },
    buildReturn(item_id) {
      return {
        options: this.options,
        KEEP: item_id,
      };
    },

    fetchOrders(page, sortBy, sortDesc = true) {
      this.busy_fetch = true;
      axios
        .get(
          window.XAPI.GET_MY_ORDERS_HISTORY_PHYSICAL(
            this.shop_name,
            this.isAvocado ? "AVO" : this.isPos ? "POS" : this.type.code
          ),
          {
            params: {
              offset: (page - 1) * this.itemsPerPage,
              limit: this.itemsPerPage,
              sortBy: sortBy,
              sortDesc: sortDesc,

              codes: !this.USER()
                ? LocalStorages.GetShopHistoryGuestCodes(
                    this.type.code
                  ) /*🥶 Guest*/
                : undefined,
            },
          }
        )
        .then(({ data }) => {
          if (!data.error) {
            this.orders = data.orders;
            this.totalItems = data.total;
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
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
              : require("@components/assets/icons/circle-blue.svg")
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

<style scoped lang="scss">
.data-table {
  cursor: pointer;
  font-size: 1.071rem;
  font-weight: 400;
  color: #555;
  height: 68px;
}
</style>
