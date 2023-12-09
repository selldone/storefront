/*
 * Copyright (c) 2023. Selldone® Business OS™
 *
 * Author: M.Pajuhaan
 * Web: https://selldone.com
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
 * From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
 * Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
 * Our journey is not just about reaching a destination, but about creating a masterpiece.
 * Tread carefully, for you're treading on dreams.
 */

import Vue from "vue";
import Router from "vue-router";
import store from "../store/StorefrontStore";
import SStorefrontLayout from "../layouts/SStorefrontLayout.vue";

//――――――――――――――――――――――――― Shop ―――――――――――――――――――――――――

import SStorefrontProductsPage from "../pages/SStorefrontProductsPage.vue";

import SStorefrontProductPage from "../pages/product/SStorefrontProductPage.vue";

//――――――――――――――――――――――――― Basket ―――――――――――――――――――――――――
import SStorefrontBasketPage from "../pages/basket/SStorefrontBasketPage.vue";

//――――――――――――――――――――――――― Orders ―――――――――――――――――――――――――

const SStorefrontOrdersPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/SStorefrontOrdersPage.vue"
  );
const SStorefrontPhysicalOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/physical/SStorefrontPhysicalOrderDetailPage.vue"
  );
const SStorefrontVirtualOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/virtual/SStorefrontVirtualOrderDetailPage.vue"
  );
const SStorefrontAvocadoOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/avocado/avocado/SStorefrontAvocadoOrderDetailPage.vue"
  );
const SStorefrontAvocadoOrderDetailMasterLayout = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/avocado/SStorefrontAvocadoOrderDetailMasterLayout.vue"
  );
const SStorefrontServiceOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/service/SStorefrontServiceOrderDetailPage.vue"
  );
const SStorefrontSubscriptionOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/subscription/SStorefrontSubscriptionOrderDetailPage.vue"
  );

const SStorefrontPOSOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/pos/pos/SStorefrontPOSOrderDetailPage.vue"
  );
const SStorefrontPOSOrderDetailMasterLayout = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/pos/SStorefrontPOSOrderDetailMasterLayout.vue"
  );
const SStorefrontFileOrderDetailPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/file/SStorefrontFileOrderDetailPage.vue"
  );
const SStorefrontBasketOrderDetailMasterLayout = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/SStorefrontBasketOrderDetailMasterLayout.vue"
  );
const SStorefrontHistoryOrdersAvocadoPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/avocado/avocado/SStorefrontHistoryOrdersAvocadoPage.vue"
  );
const SStorefrontHistoryOrdersPhysicalPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/physical/SStorefrontHistoryOrdersPhysicalPage.vue"
  );
const SStorefrontHistoryOrdersVirtualPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/virtual/SStorefrontHistoryOrdersVirtualPage.vue"
  );
const SStorefrontHistoryOrdersFilePage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/file/SStorefrontHistoryOrdersFilePage.vue"
  );
const SStorefrontHistoryOrdersServicePage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/service/SStorefrontHistoryOrdersServicePage.vue"
  );

const SStorefrontHistoryOrdersSubscriptionPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/basket/subscription/SStorefrontHistoryOrdersSubscriptionPage.vue"
  );

const SStorefrontHistoryOrdersPOSPage = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/orders/pos/pos/SStorefrontHistoryOrdersPOSPage.vue"
  );
const SPageLoader = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "@app-page-builder/SPageLoader.vue"
  );
const SStorefrontUserReturnRequests = () =>
  import(
    /* webpackChunkName: "shop-profile" */ "../pages/user/return-orders/SStorefrontUserReturnRequests.vue"
  );

//――――――――――――――――――――――――― Insta ―――――――――――――――――――――――――

const SStorefrontInstagramPage = () =>
  import(
    /* webpackChunkName: "shop-insta" */ "../pages/instagram/SStorefrontInstagramPage.vue"
  );

//――――――――――――――――――――――――― Avocado ―――――――――――――――――――――――――

const SStorefrontAvocadoOrderPage = () =>
  import(
    /* webpackChunkName: "shop-avocado" */ "../pages/avocado/SStorefrontAvocadoOrderPage.vue"
  );
const SStorefrontAvocadoPage = () =>
  import(
    /* webpackChunkName: "shop-avocado" */ "../pages/avocado/SStorefrontAvocadoPage.vue"
  );

//――――――――――――――――――――――――― Hyper ―――――――――――――――――――――――――

const SStorefrontHyperOrderPage = () =>
  import(
    /* webpackChunkName: "shop-hyper" */ "../pages/hyper/SStorefrontHyperOrderPage.vue"
  );
const SStorefrontHyperPage = () =>
  import(
    /* webpackChunkName: "shop-hyper" */ "../pages/hyper/SStorefrontHyperPage.vue"
  );

//――――――――――――――――――――――――― POS ―――――――――――――――――――――――――

const SStorefrontPOSPage = () =>
  import(
    /* webpackChunkName: "shop-pos" */ "../pages/pos/SStorefrontPOSPage.vue"
  );

//――――――――――――――――――――――――― Custom Home Page ―――――――――――――――――――――――――

const SHOP_PREFIX_ADDRESS = SetupService.GetMetaValue(
  "shop-prefix-address",
  ""
);
const CUSTOM_HOME = SetupService.GetMetaValue("custom-home") as Shop.Home;

//――――――――――――――――――――――――― Article ―――――――――――――――――――――――――
import SStorefrontLoginRedirect from "../pages/login/SStorefrontLoginRedirect.vue";
import SStorefrontComparisonPage from "../pages/comparison/SStorefrontComparisonPage.vue";
import SStorefrontUserPagesLayout from "../pages/user/SStorefrontUserPagesLayout.vue";
import SStorefrontUserProfilePage from "../pages/user/profile/SStorefrontUserProfilePage.vue";
import SStorefrontUserAddressesPage from "@app-storefront/pages/user/address/SStorefrontUserAddressesPage.vue";
import SStorefrontUserFavoritesPage from "../pages/user/favorites/SStorefrontUserFavoritesPage.vue";
import SStorefrontUserCommentsPage from "../pages/user/comment/SStorefrontUserCommentsPage.vue";
import SStorefrontUserGiftCardsPage from "../pages/user/giftcard/SStorefrontUserGiftCardsPage.vue";
import SStorefrontAboutUsPage from "@app-storefront/pages/official/about-us/SStorefrontAboutUsPage.vue";
import SStorefrontTermsPage from "../pages/official/terms/SStorefrontTermsPage.vue";
import SStorefrontPrivacyPage from "../pages/official/privacy/SStorefrontPrivacyPage.vue";
import SStorefrontProfilePage from "../pages/official/SStorefrontProfilePage.vue";
import SStorefrontBlogPage from "../pages/blog/SStorefrontBlogPage.vue";
import SStorefrontBlogsPage from "../pages/blog/SStorefrontBlogsPage.vue";
import SStorefrontFAQPage from "@app-storefront/pages/official/faq/SStorefrontFAQPage.vue";
import SStorefrontContactUsPage from "@app-storefront/pages/official/contact-us/SStorefrontContactUsPage.vue";

import SStorefrontInfoPage from "@app-storefront/pages/official/info/SStorefrontInfoPage.vue";
import { ShopOptionsHelper } from "@core/helper/shop/ShopOptionsHelper";
import { SetupService } from "@core/server/SetupService";
import { Shop } from "@core/models/shop/shop.model";
import type { Route } from "vue-router/types/router.d.ts";
import type { RouteConfigSingleView } from "vue-router/types/router.d.ts";
import {StorefrontRoutesName} from "@core/enums/route/StorefrontRoutesName";
import {CommunityRoutesName} from "@core/enums/route/CommunityRoutesName";

//――――――――――――――――――――――――― Social network ―――――――――――――――――――――――――

const CommunityLayout = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/layout/CommunityLayout.vue"
  );

const CommunityHomePage = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/pages/CommunityHomePage.vue"
  );

const CommunityCategoryPage = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/pages/CommunityCategoryPage.vue"
  );

const CommunityTopicPage = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/pages/CommunityTopicPage.vue"
  );

const CommunityFeedPage = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/pages/CommunityFeedPage.vue"
  );

const CommunityMyCommentsPage = () =>
  import(
    /* webpackChunkName: "community" */ "@components/community/pages/CommunityMyCommentsPage.vue"
  );

//――――――――――――――――――――――――― Map ―――――――――――――――――――――――――
const SStorefrontMapProducts = () =>
  import(
    /* webpackChunkName: "shop-map" */ "../pages/map/products/SStorefrontMapProducts.vue"
  );
const SStorefrontMapVendors = () =>
  import(
    /* webpackChunkName: "shop-map" */ "../pages/map/vendors/SStorefrontMapVendors.vue"
  );

function getRouteForHome(): IVueRoute {
  switch (CUSTOM_HOME) {
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Blog ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.BLOG:
      return {
        path: "",
        name: StorefrontRoutesName.BLOGS_PAGE,
        component: SStorefrontBlogsPage,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Avocado ▃▃▃▃▃▃▃▃▃▃▃*/

    case Shop.Home.AVOCADO:
      return {
        path: "",
        name: StorefrontRoutesName.AVOCADO_PAGE,
        component: SStorefrontAvocadoPage,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Hyper ▃▃▃▃▃▃▃▃▃▃▃*/

    case Shop.Home.HYPER:
      return {
        path: "",
        name: StorefrontRoutesName.HYPER_PAGE,
        component: SStorefrontHyperPage,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Community ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.COMMUNITY:
      return {
        meta: {
          card: true,
        },
        path: "",
        component: CommunityLayout,
        children: [
          {
            path: "",
            name: CommunityRoutesName.COMMUNITY_HOME_PAGE,
            component: CommunityHomePage,
          },
        ],
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Shop ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.SHOP:
      return {
        path: "",
        name: StorefrontRoutesName.SHOP_PAGE,
        component: SStorefrontProductsPage,
        meta: {
          search: true,
        },
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Map ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.MAP:
      return {
        path: "",
        name: StorefrontRoutesName.MAP_PRODUCTS_PAGE,
        component: SStorefrontMapProducts,
        meta: {
          fullscreen: true,
        },
      };

    default:
      /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Landing Page ▃▃▃▃▃▃▃▃▃▃▃*/
      if (Shop.Home.LANDING_PAGE)
        // Landing page ID!
        return {
          path: "",
          name: StorefrontRoutesName.CUSTOM_HOME_PAGE, // Landing page loader!
          component: SPageLoader,
          meta: {
            fullscreen: true,
          },
        };

      /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Default (Shop) ▃▃▃▃▃▃▃▃▃▃▃*/
      return {
        path: "",
        name: StorefrontRoutesName.SHOP_PAGE,
        component: SStorefrontProductsPage,
        meta: {
          search: true,
        },
      };
  }
}

Vue.use(Router);
const routes: IVueRoute[] = [
  //█████████████████████████████████████████████████████████████
  //――――――――――――――――――――― Shop General Layout ―――――――――――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "",
    component: SStorefrontLayout,
    meta: {
      footer: true, // Show Footer
      comparison: true, // Show Product Comparison
      support: true, // Show Support (If enabled)
    },

    children: [
      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Shop Page ⬬⬬⬬⬬⬬⬬⬬⬬
      // Important: This route selection must be first!
      // + Add new pages on shop.js > getCustomHomePage & GetDomainHomeIcon & GetDomainHomeName
      getRouteForHome(),

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Shop Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        // Order important! first route to ShopPage consider as ShopPage!
        path: "shop",
        name:
          CUSTOM_HOME === "shop"
            ? "ShopPage-shop" // Prevent duplicated route name 'ShopPage'
            : StorefrontRoutesName.SHOP_PAGE,
        component: SStorefrontProductsPage,
        meta: {
          search: true,
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Category ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: ":category_name-category",
        name: StorefrontRoutesName.SHOP_CATEGORY_PAGE,
        component: SStorefrontProductsPage,
        meta: {
          search: true,
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Vendors ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "/@:slug-:vendor_id(\\d+)",
        component: SStorefrontProductsPage,
        name: StorefrontRoutesName.SHOP_VENDOR_PAGE,
        meta: {
          search: true,
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Pages ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "pages/:page_name",
        name: StorefrontRoutesName.PAGE_RENDER,
        component: SPageLoader,
        meta: {
          fullscreen: true,
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Include Dynamic Profiles ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "in/:path-:include_id(\\d+)",
        name: StorefrontRoutesName.INCLUDE_PAGE_RENDER,
        component: SPageLoader,
        meta: {
          fullscreen: true,
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ product Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "product/:product_id",
        name: StorefrontRoutesName.PRODUCT_PAGE,
        component: SStorefrontProductPage,
        meta: {
          search: true, // SHow search bar
          fullscreen: true,
          bg_color: "#f0f0f0", // Page background color | Set as --background root style variable
        },
      },
      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ product Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "comparison",
        name: StorefrontRoutesName.COMPARISON_PAGE,
        component: SStorefrontComparisonPage,
        meta: {
          bg_color: "#f0f0f0", // Page background color | Set as --background root style variable
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Shop info page (Instead of footer in mobile) ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "info",
        name: StorefrontRoutesName.SHOP_INFO_PAGE_MOBILE,
        component: SStorefrontInfoPage,
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ basket Page  ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "basket/:type",
        name: StorefrontRoutesName.BASKET_PAGE,
        component: SStorefrontBasketPage,
      },

      {
        path: "user",
        component: SStorefrontUserPagesLayout,

        meta: {
          requiresAuth: true,
        },

        children: [
          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ My Orders Page (Virtual, Physical ...) ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "orders",
            name: StorefrontRoutesName.ORDERS_PAGE,
            component: SStorefrontOrdersPage,

            children: [
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Physical ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "physical",
                name: StorefrontRoutesName.HISTORY_ORDERS_PHYSICAL,
                component: SStorefrontHistoryOrdersPhysicalPage,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Virtual ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "virtual",
                name: StorefrontRoutesName.HISTORY_ORDERS_VIRTUAL,
                component: SStorefrontHistoryOrdersVirtualPage,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ File ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "file",
                name: StorefrontRoutesName.HISTORY_ORDERS_FILE,
                component: SStorefrontHistoryOrdersFilePage,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Service ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "service",
                name: StorefrontRoutesName.HISTORY_ORDERS_SERVICE,
                component: SStorefrontHistoryOrdersServicePage,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "subscription",
                name: StorefrontRoutesName.HISTORY_ORDERS_SUBSCRIPTION,
                component: SStorefrontHistoryOrdersSubscriptionPage,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ POS ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "pos",
                name: StorefrontRoutesName.HISTORY_ORDERS_POS,
                component: SStorefrontHistoryOrdersPOSPage,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Avocado ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "avocado",
                name: StorefrontRoutesName.HISTORY_ORDERS_AVOCADO,
                component: SStorefrontHistoryOrdersAvocadoPage,
              },
            ],
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Profile ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "profile",
            name: StorefrontRoutesName.USER_PROFILE_PAGE,
            component: SStorefrontUserProfilePage,
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Addresses ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "addresses",
            name: StorefrontRoutesName.USER_ADDRESSES_PAGE,
            component: SStorefrontUserAddressesPage,
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User order returns ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "orders-return",
            name: StorefrontRoutesName.USER_RETURN_REQUESTS,
            component: SStorefrontUserReturnRequests,
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Favorites ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "favorites",
            name: StorefrontRoutesName.USER_FAVORITES_PAGE,
            component: SStorefrontUserFavoritesPage,
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Comments ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "comments",
            name: StorefrontRoutesName.USER_COMMENTS_PAGE,
            component: SStorefrontUserCommentsPage,
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User gift cards ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "gift-cards",
            name:  StorefrontRoutesName.USER_GIFTCARDS_PAGE,
            component: SStorefrontUserGiftCardsPage,
          },
        ],
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Redirect login ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "selldone-callback",
        name: StorefrontRoutesName.LOGIN_REDIRECT,
        component: SStorefrontLoginRedirect,
      },

      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――――――― Article ―――――――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Blog ▶ Blogs List ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "blog",
        name: StorefrontRoutesName.BLOGS_PAGE,
        component: SStorefrontBlogsPage,
      },
      {
        // Old version!
        path: "blog",
        name: StorefrontRoutesName.SHOP_BLOGS_PAGE,
        component: SStorefrontBlogsPage,
      },

      {
        path: "/team/:author-:author_id(\\d+)",
        name: StorefrontRoutesName.AUTHOR_PAGE,
        component: SStorefrontBlogsPage,
        meta: {
          title: "Team | {author}",
          dark: true,
          //light:true, // Light header
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Blog ▶ Blog View ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "blog/:slug-:blog_id(\\d+)",
        name: StorefrontRoutesName.SHOP_BLOG_PAGE_SLUG,
        component: SStorefrontBlogPage,
      },
      {
        path: "blog/:blog_id",
        name: StorefrontRoutesName.SHOP_BLOG_PAGE,
        component: SStorefrontBlogPage,
      },
      {
        path: "",
        component: SStorefrontProfilePage,

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ About Us ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "about-us",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_ABOUT_US,
            component: SStorefrontAboutUsPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ Terms ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "terms",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_TERMS,
            component: SStorefrontTermsPage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ Privacy ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "privacy",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_PRIVACY,
            component: SStorefrontPrivacyPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Contact US ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "contact-us",
            name: StorefrontRoutesName.SHOP_CONTACT_US,
            component: SStorefrontContactUsPage,
          },
        ],
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ FAQ ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "faq/:tag?",
        name: "ShopFAQ",
        component: SStorefrontFAQPage,
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "orders",
        component: SStorefrontBasketOrderDetailMasterLayout,
        meta: {
          requiresAuth: true,
        },

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Physical ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "physical/SM-:basket_id",
            name: "MyPhysicalOrderInfoPage",
            component: SStorefrontPhysicalOrderDetailPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Virtual ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "virtual/SV-:basket_id",
            name: "MyVirtualOrderInfoPage",
            component: SStorefrontVirtualOrderDetailPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ File ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "file/SF-:basket_id",
            name: "MyFileOrderInfoPage",
            component: SStorefrontFileOrderDetailPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Service ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "service/SS-:basket_id",
            name: "MyServiceOrderInfoPage",
            component: SStorefrontServiceOrderDetailPage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "subscription/SN-:basket_id",
            name: "MySubscriptionOrderInfoPage",
            component: SStorefrontSubscriptionOrderDetailPage,
          },
        ],
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ POS Order info ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "orders",
        component: SStorefrontPOSOrderDetailMasterLayout,
        meta: {
          requiresAuth: true,
        },

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ POS ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "pos/POS-:basket_id",
            name: "MyPOSOrderInfoPage",
            component: SStorefrontPOSOrderDetailPage,
          },
        ],
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ POS Order info ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "orders",
        component: SStorefrontAvocadoOrderDetailMasterLayout,
        meta: {
          requiresAuth: true,
        },
        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ POS ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "avocado/AVO-:basket_id",
            name: "AvocadoOrderDetailPage",
            component: SStorefrontAvocadoOrderDetailPage,
          },
        ],
      },
    ],
  },
  //█████████████████████████████████████████████████████████████
  //――――――――――――――――― Map - Find products/vendors on the map ―――――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "",
    component: SStorefrontLayout,
    meta: {}, // No footer mode!
    children: [
      {
        path: "/map",
        component: SStorefrontMapProducts,
        meta: {
          fullscreen: true,
        },
      },

      {
        path: "/map-vendors",
        component: SStorefrontMapVendors,
        meta: {
          fullscreen: true,
        },
      },
    ],
  },

  //█████████████████████████████████████████████████████████████
  //――――――――――――――――――――――――― Simple Mode ―――――――――――――――――――――――――――
  //█████████████████████████████████████████████████████████████
  {
    path: "",
    component: SStorefrontLayout,
    meta: {
      footer: false, // Show Footer
      comparison: false, // Show Product Comparison
      support: false, // Show Support (If enabled)
      light_header: true, // Header is light!
    },

    children: [
      //―――――――――――――― Instagram ――――――――――――――
      {
        path: "instagram",
        name: "InstagramPage",
        component: SStorefrontInstagramPage,
        meta: {
          channel: "instagram", // To save channel entry
        },
      },
    ],
  },

  //█████████████████████████████████████████████████████████████
  //――――――――――――――――――――― Simple pages layout ―――――――――――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "",
    component: SStorefrontLayout,
    meta: {},
    children: [
      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――――――― Avocado ―――――――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Avocado ▶ Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/avocado/:hash",
        name: "AvocadoOrderPage",
        component: SStorefrontAvocadoOrderPage,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #9eb644, #e8db8e)`,
          transparent_header: true,
          title: "Avocado | Order",
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Avocado ▶ Form ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/avocado",
        name: StorefrontRoutesName.AVOCADO_PAGE,
        component: SStorefrontAvocadoPage,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #9eb644, #e8db8e)`,
          transparent_header: true,
          title: "Avocado | Inquiry",
        },
      },

      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――――――― Hyper ―――――――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Hyper ▶ Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/hyper/:basket_id",
        name: "HyperOrderPage",
        component: SStorefrontHyperOrderPage,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #C2185B, #FF5722)`,
          transparent_header: true,
          title: "Hyper | Order",
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Hyper ▶ Form ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/hyper",
        name: StorefrontRoutesName.HYPER_PAGE,
        component: SStorefrontHyperPage,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #C2185B, #FF5722)`,
          transparent_header: true,
          title: "Hyper | Inquiry",
        },
      },

      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――― POS ―――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████
      // ⬬⬬⬬⬬⬬⬬⬬⬬ POS ▶ Customer View Scan Result ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "pos/:basket_id",
        name: "ShopPOSPage",
        component: SStorefrontPOSPage,
        meta: {
          transparent_header: true,
          page_background: `background-image: linear-gradient(60deg, #0288D1, #0097A7)`,
          title: "POS | Order",
        },
      },
    ],
  },

  //█████████████████████████████████████████████████████████████
  //――――――――――――――――――――――――― Community  ――――――――――――――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "/community",
    component: SStorefrontLayout,
    meta: {
      card: true,
    },
    children: [
      {
        path: "",
        name: "CommunityLayout",
        component: CommunityLayout,

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Categories (Home)  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "",
            name: CommunityRoutesName.COMMUNITY_HOME_PAGE,
            component: CommunityHomePage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Feed  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "feed",
            name: "CommunityFeedPage",
            component: CommunityFeedPage,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Feed  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "comments",
            name: "CommunityMyCommentsPage",
            component: CommunityMyCommentsPage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Category (Topics list)  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: ":category_id-:category_slug",
            name: CommunityRoutesName.COMMUNITY_CATEGORY_PAGE,
            component: CommunityCategoryPage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Topic  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: ":category_id-:category_slug/:topic_id-:topic_slug",
            name: CommunityRoutesName.COMMUNITY_TOPIC_PAGE,
            component: CommunityTopicPage,
          },
        ],
      },
    ],
  },

  //█████████████████████████████████████████████████████████████
  //―――――――――――――― Shop User Layout (Global - for all shops) ―――――――――――――――――
  //█████████████████████████████████████████████████████████████
];

const router = new Router({
  mode: "history",
  base: SHOP_PREFIX_ADDRESS, //process.env.BASE_URL
  routes: routes,
});

let FIRST_LOAD = true; // Detect first load of app to solve multi-language page title problem! (Because of async load)
//―――――――――――――――――――――― Prototypes ――――――――――――――――――――
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function ToPageName(str: string | any) {
  if (!str || !(typeof str === "string" || str instanceof String)) return str;
  return capitalizeFirstLetter(str.replace(/-/g, " "));
}

router.beforeEach((to, from, next) => {
  //---------------- Set Title ----------------
  if (to.meta && to.meta.title && !FIRST_LOAD) {
    let title = window.$i18n_global.t(to.meta.title);
    //console.log('to:',to,'title:',title)
    if (title) {
      if (to.params) {
        Object.keys(to.params).forEach((key) => {
          title = title.replace(`{${key}}`, ToPageName(to.params[key]));
        });
      }

      title = title.replace(/{[^}]*}/g, "");
      document.title = title;
    }
  }
  FIRST_LOAD = false;
  //-------------------------------------------

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = store.getters.getUser;
    const busy = store.getters.getBusyUser;
    const shop = store.getters.getShop;
    const has_guest_checkout = ShopOptionsHelper.HasGuestCheckout(shop);

    if (!user && !busy && !has_guest_checkout) {
      next({
        name: StorefrontRoutesName.SHOP_PAGE,
      });
    }
  }

  next();
});

router.afterEach((/*to: Route, from: Route*/) => {
  // Update the current location in header:
  window.axios.defaults.headers.common["S-Location"] = window.location.href;
});

export default router;

//█████████████████████████████████████████████████████████████
//―――――――――――――――― 🦫 Types ――――――――――――――――
//█████████████████████████████████████████████████████████████

interface IVueRoute extends RouteConfigSingleView {
  meta?: IRouteMeta; // Metadata associated with the route.
  children?: IVueRoute[]; // Nested child routes.
}

type IRouteMeta = {
  footer?: boolean; // Indicates if a footer should be displayed. Default is `false`.
  comparison?: boolean; // Indicates if product comparison should be shown. Default is `false`.
  support?: boolean; // If set to `true`, shows the support. Default is `false`.
  search?: boolean; // If set to `true`, displays the search bar. Default is `false`.
  fullscreen?: boolean; // Determines if the view should be in fullscreen mode. Default is `false`.
  bg_color?: string; // Sets the background color of the page. Default is not set.
  requiresAuth?: boolean; // If `true`, the route requires authentication. Default is `false`.
  title?: string;
  dark?: boolean;
  light_header?: boolean;
  page_background?: string;
  transparent_header?: boolean;
  channel?: string; // Force to set channel entry e,g: instagram (override auto-detection from previous url)
  card?: boolean; // Show card mode
};
