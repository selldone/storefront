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

        <v-toolbar color="transparent" flat>
          <v-btn
            v-if="product"
            :to="
              product.category
                ? {
                    name: window.$storefront.routes.SHOP_CATEGORY_PAGE,
                    params: { category_name: product.category.name },
                  }
                : { name: 'ShopPage' }
            "
            class="hide-on-small-600"
            exact
            icon
            aria-label="Go Back"
          >
            <v-icon>{{ $t("icons.arrow_back") }}</v-icon>
          </v-btn>

          <!-- ⬬⬬⬬⬬ Breadcrumbs ⬬⬬⬬⬬ -->
          <s-product-breadcrumb class="flex-grow-1"></s-product-breadcrumb>

          <!-- ████████████████████ Go to admin panel button ████████████████████ -->
          <s-product-admin-button
            v-if="$vuetify.display.mdAndUp"
          ></s-product-admin-button>

          <!-- ⬬⬬⬬⬬ QR CODE ⬬⬬⬬⬬ -->

          <s-product-qr></s-product-qr>
        </v-toolbar>

        <s-product-overview v-if="product" can-buy show-cover />
        <s-product-overview-loading v-else />

        <u-loading-progress v-if="busy"></u-loading-progress>
      </div>
    </div>

    <template v-if="product">
      <!-- ▁▁▁▁▁▁ 🞇 Cross selling 🞇 ▁▁▁▁▁▁ -->

      <div :style="{ order: getOrder('cross') }">
        <s-product-cross-sells
          class="s--product-section my-16"
        ></s-product-cross-sells>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Offer 🞇 ▁▁▁▁▁▁ -->
      <div :style="{ order: getOrder('offer') }">
        <s-product-offers class="s--product-section my-16"></s-product-offers>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Spec 🞇 ▁▁▁▁▁▁ -->

      <div :style="{ order: getOrder('spec') }">
        <s-product-spec class="s--product-section my-16"></s-product-spec>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Includes in the product 🞇 ▁▁▁▁▁▁ -->

      <div :style="{ order: getOrder('includes') }">
        <s-product-includes class="my-16"></s-product-includes>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Pros & Cons 🞇 ▁▁▁▁▁▁ -->
      <div v-if="has_pros_cons" :style="{ order: getOrder('pros') }">
        <v-container class="s--product-section-header my-16" fluid>
          <v-row align="center">
            <v-col class="text-start" cols="12" md="6">
              <v-list-subheader
                >●
                {{
                  $t("product_info.product_description_header", {
                    product: product.title,
                  })
                }}
              </v-list-subheader>
              <h2
                v-if="article"
                class="text-h3 line-height-normal font-weight-black"
              >
                {{ article.title }}
              </h2>
            </v-col>

            <v-col cols="12" md="6">
              <s-product-pros-cons></s-product-pros-cons>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <!-- ▁▁▁▁▁▁ 🞇 Article 🞇 ▁▁▁▁▁▁ -->

      <div :style="{ order: getOrder('review') }">
        <s-product-article :hide-title="has_pros_cons"></s-product-article>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Files List ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('files') }">
        <s-product-files-list
          class="s--product-section-header"
        ></s-product-files-list>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > 🦄 Membership Contents ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('contents') }">
        <s-product-subscription-membership
          class="s--product-section-header"
        ></s-product-subscription-membership>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Shipping ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('shipping') }">
        <s-product-shipping
          class="s--product-section-header"
        ></s-product-shipping>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Warranty ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->

      <div :style="{ order: getOrder('warranty') }">
        <s-product-warranty
          class="s--product-section-header"
        ></s-product-warranty>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Guide ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->
      <div :style="{ order: getOrder('guide') }">
        <s-product-guide class="s--product-section-header"></s-product-guide>
      </div>

      <!-- █████████████████████ Internal Page █████████████████████ -->

      <div :style="{ order: getOrder('page') }">
        <s-product-landing></s-product-landing>
      </div>

      <!-- ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ TAB > Comment ▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅ -->

      <div :style="{ order: getOrder('comments') }">
        <s-product-comments
          class="s--product-section-header"
        ></s-product-comments>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Related products ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <div :style="{ order: getOrder('related-products') }">
        <s-product-related-products></s-product-related-products>
      </div>

      <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Related categories ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
      <div :style="{ order: getOrder('related-categories') }">
        <s-product-related-categories></s-product-related-categories>
      </div>

      <!-- ▁▁▁▁▁▁ 🞇 Badges 🞇 ▁▁▁▁▁▁ -->
      <!--  <div :style="{ order: getOrder('badges') }">
          <u-fade-scroll>
            <s-product-section-badges
              :large="$vuetify.display.mdAndUp"
              class="py-16"
            ></s-product-section-badges>
          </u-fade-scroll>
        </div>-->
    </template>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SProductOverview from "@selldone/components-vue/storefront/product/overview/SProductOverview.vue";
import SProductOverviewLoading from "@selldone/components-vue/storefront/product/overview/loading/SProductOverviewLoading.vue";

import { GtagEcommerce } from "@selldone/components-vue/plugins/gtag/GtagEcommerce";

import SProductProsCons from "@selldone/components-vue/storefront/product/pros-cons/SProductProsCons.vue";
import SProductIncludes from "@selldone/components-vue/storefront/product/includes/SProductIncludes.vue";
import SProductRelatedProducts from "@selldone/components-vue/storefront/product/related-products/SProductRelatedProducts.vue";
import SProductRelatedCategories from "@selldone/components-vue/storefront/product/related-categories/SProductRelatedCategories.vue";
import SProductShipping from "@selldone/components-vue/storefront/product/shipping/SProductShipping.vue";
import SProductWarranty from "@selldone/components-vue/storefront/product/warranty/SProductWarranty.vue";
import SProductGuide from "@selldone/components-vue/storefront/product/guide/SProductGuide.vue";
import SProductFilesList from "@selldone/components-vue/storefront/product/file/list/SProductFilesList.vue";
import SProductComments from "@selldone/components-vue/storefront/product/comments/SProductComments.vue";
import SProductSubscriptionMembership from "@selldone/components-vue/storefront/product/subscription/membership/SProductSubscriptionMembership.vue";
import SProductOffers from "@selldone/components-vue/storefront/product/offers/SProductOffers.vue";
import SProductCrossSells from "@selldone/components-vue/storefront/product/cross-sells/SProductCrossSells.vue";
import ProductSection from "@selldone/core-js/enums/product/ProductSection";
import { Article } from "@selldone/core-js";
import { computed } from "vue";
import SProductBreadcrumb from "@selldone/components-vue/storefront/product/breadcrumb/SProductBreadcrumb.vue";
import SProductAdminButton from "@selldone/components-vue/storefront/product/admin/button/SProductAdminButton.vue";
import SProductQr from "@selldone/components-vue/storefront/product/qr/SProductQr.vue";
import SProductSpec from "@selldone/components-vue/storefront/product/spec/SProductSpec.vue";
import SProductArticle from "@selldone/components-vue/storefront/product/article/SProductArticle.vue";
import { XapiProductGetTypes } from "@selldone/sdk-storefront/product";
import SProductLanding from "@selldone/components-vue/storefront/product/landing/SProductLanding.vue";
import CurrencyMixin from "@selldone/components-vue/mixin/currency/CurrencyMixin.ts";
import {StorefrontSeo} from "../../helpers/StorefrontSeo";

export default {
  name: "StorefrontPageProduct",
  mixins: [CurrencyMixin],

  inject: ["$shop"],
  props: {},
  components: {
    SProductLanding,
    SProductArticle,
    SProductSpec,
    SProductQr,
    SProductAdminButton,
    SProductBreadcrumb,
    SProductCrossSells,
    SProductOffers,
    SProductSubscriptionMembership,
    SProductComments,
    SProductFilesList,
    SProductGuide,
    SProductWarranty,
    SProductShipping,
    SProductRelatedCategories,
    SProductRelatedProducts,
    SProductIncludes,
    SProductProsCons,

    SProductOverviewLoading,

    SProductOverview,
  },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Provide
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  provide() {
    return {
      $product: computed(() => this.product),

      /**
       * Current selected variant by user
       */
      $variant: computed(() => this.current_variant),
    };
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  data: function () {
    return {
      show_article: true, // For refresh article!

      product: null,

      busy: false,

      article_type: Article.Types.Product,
    };
  },

  computed: {
    theme() {
      return this.$shop.theme && !Array.isArray(this.$shop.theme)
        ? this.$shop.theme
        : {};
    },

    current_variant() {
      return this.$store.getters.getCurrentSelectedVariant;
    },

    article() {
      return (
        this.product &&
        this.product.article_pack &&
        this.product.article_pack.article &&
        this.product.article_pack.article
      );
    },

    // ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃ Admin URLs: ▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

    has_pros_cons() {
      return (
        (this.product?.pros && Object.keys(this.product.pros).length > 0) ||
        (this.product?.cons && Object.keys(this.product.cons).length > 0)
      );
    },
  },

  watch: {
    $route() {
      this.getProduct();
      this.$forceUpdate(); // Notice we have to use a $ here
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
        // Add missing sections
        Object.values(ProductSection).forEach((t) => {
          if (!this.theme.order.includes(t)) this.theme.order.push(t);
        });
      }

      return this.theme.order.indexOf(code) + 1;
    },

    getProduct() {
      const seoNavigation = StorefrontSeo.captureNavigation();
      const handleSuccessResponse = ({
        product,
      }: XapiProductGetTypes.IResponse) => {
        this.product = product;

        GtagEcommerce.MeasuringViewsOfProductDetails(
          this.$shop,
          product,
          this.GetUserSelectedCurrency().code,
          "product-page",
        );

        // Reject initial-load and superseded responses, including SDK cache callbacks.
        StorefrontSeo.updateProduct(
          product,
          this.$shop,
          seoNavigation,
          this.GetUserSelectedCurrency().code,
        );
      };

      if (window.PRE_LOADED_DATA?.PRODUCT_PACK) {
        console.log("⚡ Turbo load product.");
        handleSuccessResponse(window.PRE_LOADED_DATA.PRODUCT_PACK);
        window.PRE_LOADED_DATA = null; // Clear!
      } else {
        this.busy = true; // Do not show loading!
      }

      window.$storefront.products
        .optimize(60)
        .get(this.getId(this.$route.params.product_id), {
          "augmented-categories": 3, // Return 3 categories in the parent folder of current category
          "augmented-cross-sells": true, // Return max 3 cross-selling items
        })
        .cache(handleSuccessResponse)
        .then(handleSuccessResponse)
        .catch((e) => {
          NotificationService.showLaravelError(e);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
