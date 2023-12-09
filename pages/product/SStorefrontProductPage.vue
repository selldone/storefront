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
  <div class="s--product">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Product info ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <div style="order: 0">
      <div class="s--product-section-info">
        <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
        <slot name="header" :center="true"></slot>
        <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

        <v-toolbar flat color="transparent">
          <v-btn
            v-if="product"
            class="hide-on-small-600"
            icon
            exact
            :to="
              product.category
                ? {
                    name: window.$storefront.routes.SHOP_CATEGORY_PAGE,
                    params: { category_name: product.category.name },
                  }
                : { name: 'ShopPage' }
            "
          >
            <v-icon>{{ $t("icons.arrow_back") }}</v-icon>
          </v-btn>

          <!-- ⬬⬬⬬⬬ Breadcrumbs ⬬⬬⬬⬬ -->
          <s-breadcrumb-image
            v-if="product"
            :hierarchy-items="hierarchy_items"
            class="flex-grow-1"
            style="max-width: inherit"
          />

          <!-- ████████████████████ Go to admin panel button ████████████████████ -->

          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp && admin_url"
            dark
            :href="admin_url"
            target="_blank"
            class="tnt fadeIn"
            title="Open product admin panel"
          >
            <img
              src="@components/assets/selldone-logo/logo-mini-white.svg"
              width="16"
              height="16"
              class="me-1"
            />
            Product Admin
            <v-icon class="mx-1" small>open_in_new</v-icon>
          </v-btn>

          <!-- ⬬⬬⬬⬬ QR CODE ⬬⬬⬬⬬ -->

          <v-btn
            icon
            tile
            @click="show_qr = true"
            class="me-0 sub-caption -hover flex-grow-0"
            caption="Barcode"
            ><img src="@components/assets/icons/qr-code.svg" width="32"
          /></v-btn>
        </v-toolbar>

        <s-shop-product-main-card
          v-if="product"
          :product="product"
          can-buy
          show-cover
          ref="product_info"
        />
        <product-info-loading-view v-else />

        <s-progress-loading v-if="busy"></s-progress-loading>
      </div>
    </div>

    <template v-if="product">
      <!-- ████████████████████ Cross Sells ████████████████████ -->
      <div :style="{ order: getOrder('cross') }">
        <s-shop-product-cross-sell-list
          :shop="shop"
          :product="product"
          :current-variant="current_variant"
          class="s--product-section-spec my-16"
        ></s-shop-product-cross-sell-list>
      </div>

      <!-- ████████████████████ Offer ████████████████████ -->
      <!-- ▁▁▁▁▁▁ 🞇 Offer 🞇 ▁▁▁▁▁▁ -->
      <div :style="{ order: getOrder('offer') }">
        <s-shop-product-offers
          :shop="shop"
          :product="product"
          :current-variant="current_variant"
          class="s--product-section-spec my-16"
        ></s-shop-product-offers>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Spec ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div
        v-if="spec_array && Object.keys(spec_array).length"
        :style="{ order: getOrder('spec') }"
      >
        <div class="s--product-section-spec my-16 px-1 px-sm-3">
          <div class="product-widget">
            <product-spec-view :spec="spec_array" />
          </div>
        </div>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Includes in the product 🞇 ▁▁▁▁▁▁ -->

      <div
        v-if="product.includes?.length"
        :style="{ order: getOrder('includes') }"
        class="my-16"
      >
        <s-shop-product-includes :product="product"> </s-shop-product-includes>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Article ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->

      <!-- ▁▁▁▁▁▁ 🞇 Pros & Cons 🞇 ▁▁▁▁▁▁ -->
      <div v-if="has_pros_cons" :style="{ order: getOrder('pros') }">
        <v-container fluid class="s--product-section-header my-16">
          <v-row align="center">
            <v-col cols="12" md="6" class="text-start">
              <v-subheader
                >●
                {{
                  $t("product_info.product_description_header", {
                    product: product.title,
                  })
                }}
              </v-subheader>
              <h2
                class="display-2 line-height-normal font-weight-black"
                :style="{ color: page_article_title_color }"
              >
                {{ article.title }}
              </h2>
            </v-col>

            <v-col cols="12" md="6">
              <s-shop-product-pros-cons-table
                :shop="shop"
                :product="product"
              ></s-shop-product-pros-cons-table>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div v-if="has_article" :style="{ order: getOrder('review') }">
        <s-article-view
          :shop="getShop()"
          :initial-article-pack="product.article_pack"
          :article-type="article_type.code"
          :target-id="product.article_pack ? product.id : 'new'"
          :product-id="product.id"
          :need-create-new="product.should_add_article && !product.article_pack"
          :owner="product.user_id === USER_ID()"
          :tags="`${slugify(
            product.category ? product.category.title : null
          )},${slugify(product.title)},${slugify(product.title_en)}`"
          :shop-id="shop.id"
          :show-author-info="false"
          :show-user-feedback-buttons="false"
          :show-share-buttons="false"
          no-return-back-on-delete
          @delete="
            () => {
              product.article_pack = null;
              show_article = false; //  force refresh!
              $nextTick(() => {
                show_article = true;
              });
            }
          "
          :hide-title="!!has_pros_cons"
          class="s--product-section-article my-16"
        />
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Files List ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('files') }">
        <s-shop-product-files
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-files>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > 🦄 Membership Contents ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('contents') }">
        <s-shop-product-subscription-membership
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-subscription-membership>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Shipping ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('shipping') }">
        <s-shop-product-shipping
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-shipping>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Warranty ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->

      <div :style="{ order: getOrder('warranty') }">
        <s-shop-product-warranty
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-warranty>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Guide ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('guide') }">
        <s-shop-product-guide
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-guide>
      </div>

      <!-- █████████████████████ Internal Page █████████████████████ -->

      <div v-if="page" :style="{ order: getOrder('page') }">
        <SPageRender
          :data="page.content"
          :augment="augment"
          :style="page.background"
        />
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Comment ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->

      <div :style="{ order: getOrder('comments') }">
        <s-shop-product-comments
          :shop="shop"
          :product="product"
          class="s--product-section-header"
        ></s-shop-product-comments>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Related products ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <div :style="{ order: getOrder('related-products') }">
        <s-shop-related-products :shop="shop" :product="product">
        </s-shop-related-products>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Related categories ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <div v-if="categories" :style="{ order: getOrder('related-categories') }">
        <s-shop-related-categories
          :shop="shop"
          :product="product"
          :categories="categories"
        >
        </s-shop-related-categories>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Badges 🞇 ▁▁▁▁▁▁ -->
      <div :style="{ order: getOrder('badges') }">
        <s-fade-scroll>
          <s-shop-product-section-box-badges
            :shop="shop"
            :product="product"
            :large="$vuetify.breakpoint.mdAndUp"
            class="py-16"
          ></s-shop-product-section-box-badges>
        </s-fade-scroll>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Dialog > QR Code ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <v-dialog
        :dark="!light_qr"
        v-model="show_qr"
        max-width="530"
        content-class="no-shadow-dialog"
      >
        <v-card
          :style="`border-radius: ${qr_size / 5}px ${qr_size / 2}px ${
            qr_size / 10
          }px ${qr_size / 2}px;padding:${qr_size / 10}px;${
            light_qr
              ? 'background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);'
              : 'background-image: linear-gradient(60deg, #3a2c41 0%, #261b2d 100%);'
          }`"
          class="dialog-shadow"
        >
          <div>
            <qrcode
              v-if="qrcode_value"
              :value="qrcode_value"
              :options="{
                width: qr_size,
                color: { dark: light_qr ? '#222' : '#fff', light: '#FFFFFF00' },
              }"
            />
            <v-btn
              icon
              @click="show_qr = false"
              style="position: absolute; top: 10%; left: 10%"
              class="hover-scale-small"
            >
              <v-icon color="#989898">close</v-icon>
            </v-btn>

            <v-avatar class="center-absolute" size="38">
              <img v-if="product.icon" :src="getShopImagePath(product.icon)" />
            </v-avatar>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import SArticleView from "@components/article/SArticleView.vue";

import SShopProductMainCard from "@components/product/info/SShopProductMainCard.vue";
import { HierarchyHelper } from "@core/helper/breadcrumb/HierarchyHelper";
import SBreadcrumbImage from "@components/ui/breadcrumb/SBreadcrumbImage.vue";
import ProductSpecView from "@components/storefront/product/spec/ProductSpecView.vue";
import { ArticleTypes } from "@core/enums/article/ArticleTypes";
import ProductInfoLoadingView from "@components/product/loading/ProductInfoLoadingView.vue";
import { SpecHelper } from "@core/helper/product/SpecHelper";

import {GtagEcommerce} from "@components/plugins/gtag/GtagEcommerce";
import { ProductType } from "@core/enums/product/ProductType";
import { SetupService } from "@core/server/SetupService";

import SShopProductProsConsTable from "@components/product/pros-cons/SShopProductProsConsTable.vue";
import SFadeScroll from "@components/ui/fade-scroll/SFadeScroll.vue";
import SShopProductIncludes from "@components/product/includes/SShopProductIncludes.vue";
import { ColorHelper } from "@core/helper/color/ColorHelper";
import { ShadeColor } from "@core/helper/color/ColorGenerator";
import SShopRelatedProducts from "@components/product/related-products/SShopRelatedProducts.vue";
import SShopRelatedCategories from "@components/product/related-categories/SShopRelatedCategories.vue";
import SShopProductSectionBoxBadges from "@components/product/sections/SShopProductSectionBoxBadges.vue";
import { ShopTransportations } from "@core/enums/logistic/ShopTransportations";
import SShopProductShipping from "@components/product/shipping/SShopProductShipping.vue";
import SShopProductWarranty from "@components/product/warranty/SShopProductWarranty.vue";
import SShopProductGuide from "@components/product/guide/SShopProductGuide.vue";
import SShopProductFiles from "@components/product/files/SShopProductFiles.vue";
import SShopProductComments from "@components/product/comments/SShopProductComments.vue";
import SShopProductSubscriptionMembership from "@components/product/subscription/SShopProductSubscriptionMembership.vue";
import SShopProductOffers from "@components/product/offers/SShopProductOffers.vue";
import SShopProductCrossSellList from "@components/product/cross-sells/SShopProductCrossSellList.vue";
import ProductSection from "@core/enums/product/ProductSection";

export default {
  name: "SStorefrontProductPage",
  props: {
    shop: {
      require: true,
    },
  },
  components: {
    SShopProductCrossSellList,
    SShopProductOffers,
    SShopProductSubscriptionMembership,
    SShopProductComments,
    SShopProductFiles,
    SShopProductGuide,
    SShopProductWarranty,
    SShopProductShipping,
    SShopProductSectionBoxBadges,
    SShopRelatedCategories,
    SShopRelatedProducts,
    SShopProductIncludes,
    SFadeScroll,
    SShopProductProsConsTable,

    ProductInfoLoadingView,
    ProductSpecView,
    SBreadcrumbImage,
    SShopProductMainCard,
    SArticleView,
  },

  data: function () {
    return {
      show_article: true, // For refresh article!

      product: null,
      spec_array: [],
      categories: [],

      busy: false,

      article_type: ArticleTypes.Product,

      tab_mode: "tab-review",

      comments_count: 0,

      loaded_tab_comments: false,

      show_qr: false,
      light_qr: true,
    };
  },

  computed: {
    is_physical() {
      return this.product.type === ProductType.PHYSICAL.code;
    },

    transportations() {
      return this.shop.transportations;
    },
    has_free_shipping() {
      return this.is_physical && this.transportations_free_shipping?.length;
    },
    transportations_free_shipping() {
      return this.transportations?.filter(
        (t) => t.free_shipping && t.type !== ShopTransportations.Pickup.code
      );
    },
    images() {
      return this.transportations_free_shipping
        ?.filter((t) => !!t.logo)
        .map((t) => t.logo)
        .unique();
    },
    transportation_with_min_free_shipping_limit() {
      return this.transportations_free_shipping?.minByKey(
        "free_shipping_limit"
      );
    },

    pickup_transportation() {
      return (
        this.is_physical &&
        this.transportations?.find(
          (t) =>
            t.type === ShopTransportations.Pickup.code && t.pickups?.length > 0
        )
      );
    },
    has_pickup() {
      return this.pickup_transportation?.length;
    },

    admin_url() {
      if (!this.product) return null;
      const can_edit = this.product?.article_pack?.can_edit;

      return (
        this.USER() &&
        (this.USER_ID() === this.shop.user_id || can_edit) &&
        SetupService.MainServiceUrl() +
          `/shuttle/shop/${this.shop.id}/product/${this.product.id}`
      );
    },

    // Custom internal page for the product
    page() {
      return this.product?.page;
    },
    augment() {
      return this.product?.augment;
    },

    theme() {
      return this.shop.theme && !Array.isArray(this.shop.theme)
        ? this.shop.theme
        : {};
    },

    current_variant() {
      return this.$store.getters.getCurrentSelectedVariant;
    },

    page_article_title_color() {
      const variant_colors = ColorHelper.ExtractColors(
        this.current_variant?.color
      );
      if (variant_colors?.length) return ShadeColor(variant_colors[0], -30);
      return this.theme?.color_dark;
    },

    qr_size() {
      return window.innerWidth > 480 ? 400 : window.innerWidth * 0.8;
    },
    qrcode_value() {
      if (!this.product) return null;
      return `${this.getShopMainUrl(this.getShop())}/product/${
        this.product.id
      }`;
    },

    article() {
      return (
        this.product &&
        this.product.article_pack &&
        this.product.article_pack.article &&
        this.product.article_pack.article
      );
    },

    has_article() {
      return (
        this.product &&
        this.product.article_pack &&
        this.product.article_pack.article &&
        this.product.article_pack.article.title &&
        this.product.article_pack.article.body
      );
    },

    has_comment() {
      return (
        this.product &&
        this.product.article_pack &&
        this.product.article_pack.article
      );
    },

    has_spec() {
      return (
        this.product &&
        this.spec_array &&
        this.spec_array.length /* || (this.isFile && this.product.files)*/
      );
    },

    // ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Tabs ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

    tabs() {
      const tabs = [];

      if (this.warranty_article) {
        tabs.push({
          title: this.$t("product.warranty"),
          value: "tab-warranty",
          color: "#673AB7",
          icon: "fas fa-certificate me-2",
          code: "warranty",
        });
      }

      if (this.return_policy_article) {
        tabs.push({
          title: this.$t("product.return_policy"),
          value: "tab-return-policy",
          color: "#455A64",
          icon: "fas fa-people-carry me-2",
          code: "return-policy",
        });
      }

      if (this.guide_article) {
        tabs.push({
          title: this.$t("product.guide"),
          value: "tab-guide",
          color: "#FFA000",
          icon: "fas fa-life-ring me-2",
          code: "guide",
        });
      }

      if (this.shipping_article) {
        tabs.push({
          title: this.$t("product.shipping"),
          value: "tab-shipping",
          color: "#3F51B5",
          icon: "fas fa-shipping-fast me-2",
          code: "shipping",
        });
      }

      if (this.isFile) {
        tabs.push({
          title: this.$t("global.commons.files"),
          value: "tab-files",
          color: "#F57C00",
          icon: "fas fa-folder me-2",
          code: "files",
        });
      }

      if (this.isMembershipSubscription) {
        tabs.push({
          title: this.$t("global.commons.contents"),
          value: "tab-content",
          color: "#212121",
          icon: "fas fa-folder me-2",
          code: "contents",
        });
      }

      // Try to apply custom order for tabs:
      try {
        if (this.theme && this.theme.order) {
          // Make sure all tabs exist:
          [
            "spec",
            "review",
            "comments",
            "warranty",
            "return-policy",
            "guide",
            "shipping",
            "files",
            "contents",
          ].forEach((t) => {
            if (!this.theme.order.includes(t)) this.theme.order.push(t);
          });

          tabs.sort(
            (a, b) =>
              this.theme.order.indexOf(a.code) -
              this.theme.order.indexOf(b.code)
          );
        }
      } catch (e) {
        console.error(e);
      }

      return tabs;
    },
    hierarchy_items() {
      return HierarchyHelper.GenerateCategoryHierarchyGeneral(
        this.$t("global.store"),
        this.product.category,
        this.shop_name,
        this.product,
        "shopping_bag"
      );
    },

    isFile() {
      return this.product && this.product.type === ProductType.FILE.code;
    },

    user() {
      return this.USER();
    },
    busy_user() {
      return this.$store.getters.getBusyUser;
    },

    // ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Admin URLs: ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

    has_pros_cons() {
      return (
        (this.product?.pros && Object.keys(this.product.pros).length) ||
        (this.product?.cons && Object.keys(this.product.cons).length)
      );
    },
  },

  watch: {
    $route() {
      this.getProduct();
      this.$forceUpdate(); // Notice we have to use a $ here
    },

    tab_mode(tab_mode) {
      if (tab_mode === "tab-comments") this.loaded_tab_comments = true;
    },
    user() {
      this.autoBuy();
    },

    tabs(tabs) {
      if (tabs.length) this.tab_mode = tabs[0].value;
    },
  },
  created() {
    this.getProduct();
  },

  methods: {
    getOrder(code) {
      if (!this.theme?.order || !Array.isArray(this.theme?.order)) {
        this.theme.order = Object.values(ProductSection).map((x) => x.code);
      } else {
        // Make sure all tabs exist:
        Object.values(ProductSection).forEach((t) => {
          if (!this.theme.order.includes(t)) this.theme.order.push(t);
        });
      }

      return this.theme.order.indexOf(code) + 1;
    },

    getProduct() {
      this.busy = true;

      const handleSuccessResponse = ({
        product,
        comments_count = 0,
        categories = null,
      }) => {
        this.product = product;
        this.comments_count = comments_count;
        this.categories = categories;

        if (Array.isArray(this.product.spec))
          this.spec_array = this.product.spec;
        //Old version:
        else
          this.spec_array = SpecHelper.CONVERT_SPEC_JSON_TO_ARRAY(
            this.product.spec,
            this.product.spec_order
          );

        GtagEcommerce.MeasuringViewsOfProductDetails(
          this.shop,
          product,
          this.GetUserSelectedCurrency().code,
          "product-page"
        );

        this.setPageTitle(product.title); // Set Page Title!

        // Set initial tab:
        this.tab_mode = this.tabs.length ? this.tabs[0].value : null;

        // Auto buy (Check query)
        this.autoBuy();
      };

      window.$storefront.products
        .optimize(60)
        .getInfo(this.getId(this.$route.params.product_id), {
          "augmented-categories": 3, // Return 3 categories in the parent folder of current category
          "augmented-cross-sells": true, // Return max 3 cross-selling items
        })
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)
        .catch((e) => {
          this.showLaravelError(e);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    /**
     * Use to automatically add product to cart
     */
    autoBuy() {
      if (this.$route.query.buy !== "true" || this.busy_user) return;

      console.log("🧺 Auto buy...");
      let variant = null;
      if (
        this.product.product_variants.length &&
        this.$route.query.variant_id
      ) {
        variant = this.product.product_variants.find(
          (v) => v.id === parseInt(this.$route.query.variant_id)
        );
      }

      if (!this.product.product_variants.length || variant) {
        console.log("🧺 Buy now", variant);
        this.$nextTick(() => {
          this.$refs.product_info.buy(variant);
        });
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
