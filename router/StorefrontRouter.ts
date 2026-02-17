// @ts-nocheck
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

import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import store from "../store/StorefrontStore";

import {ShopOptionsHelper} from "@selldone/core-js/helper/shop/ShopOptionsHelper";
import {SetupService} from "@selldone/core-js/server/SetupService";
import {Shop} from "@selldone/core-js/models/shop/shop.model";
import {StorefrontRoutesName} from "@selldone/core-js/enums/route/StorefrontRoutesName";
import {CommunityRoutesName} from "@selldone/core-js/enums/route/CommunityRoutesName";

//――――――――――――――――――――――――― Layout ―――――――――――――――――――――――――

import StorefrontLayout from "../layouts/StorefrontLayout.vue";
//const StorefrontPageLanding = () => import( "@app-storefront/pages/landing/StorefrontPageLanding.vue");
import StorefrontPageLanding from "@app-storefront/pages/landing/StorefrontPageLanding.vue";

import StorefrontPageLogin from "@app-storefront/pages/login/StorefrontPageLogin.vue";
//――――――――――――――――――――――――― Shop ―――――――――――――――――――――――――
const StorefrontPageProducts = () =>
    import( "../pages/products/StorefrontPageProducts.vue");

const StorefrontPageProduct = () => import( "../pages/product/StorefrontPageProduct.vue");
//import StorefrontPageProduct from "../pages/product/StorefrontPageProduct.vue";

//――――――――――――――――――――――――― Basket ―――――――――――――――――――――――――
const StorefrontPageBasketCart = () =>
    import( "@app-storefront/pages/basket/cart/StorefrontPageBasketCart.vue");

//――――――――――――――――――――――――― Article ―――――――――――――――――――――――――
const StorefrontPageLoginRedirect = () =>
    import( "../pages/login/redirect/StorefrontPageLoginRedirect.vue");
const StorefrontPageComparison = () =>
    import( "../pages/comparison/StorefrontPageComparison.vue");
const StorefrontPageUser = () =>
    import( "@app-storefront/pages/user/StorefrontPageUser.vue");
const StorefrontPageUserProfile = () =>
    import( "../pages/user/profile/StorefrontPageUserProfile.vue");
const StorefrontUserAddresses = () =>
    import( "@app-storefront/pages/user/addresses/StorefrontUserAddresses.vue");
const StorefrontPageUserWishlist = () =>
    import( "@app-storefront/pages/user/wishlist/StorefrontPageUserWishlist.vue");
const StorefrontPageUserComments = () =>
    import( "@app-storefront/pages/user/comments/StorefrontPageUserComments.vue");
const StorefrontPageUserGiftcards = () =>
    import( "@app-storefront/pages/user/giftcards/StorefrontPageUserGiftcards.vue");
const StorefrontPageOfficialAboutUs = () =>
    import( "@app-storefront/pages/official/about-us/StorefrontPageOfficialAboutUs.vue");
const StorefrontPageOfficialTerms = () =>
    import( "../pages/official/terms/StorefrontPageOfficialTerms.vue");
const StorefrontPageOfficialPrivacy = () =>
    import( "../pages/official/privacy/StorefrontPageOfficialPrivacy.vue");
const StorefrontPageOfficial = () =>
    import( "../pages/official/StorefrontPageOfficial.vue");
const StorefrontPageBlogsView = () =>
    import( "../pages/blog/view/StorefrontPageBlogsView.vue");
const StorefrontPageBlogsList = () =>
    import( "../pages/blog/list/StorefrontPageBlogsList.vue");
const StorefrontPageFaq = () =>
    import("@app-storefront/pages/faq/StorefrontPageFaq.vue");
const StorefrontPageOfficialContactUs = () =>
    import( "@app-storefront/pages/official/contact-us/StorefrontPageOfficialContactUs.vue");

const StorefrontPageInfo = () =>
    import( "@app-storefront/pages/info/StorefrontPageInfo.vue");
const StorefrontPageError404 = () =>
    import( "@app-storefront/pages/errors/404/StorefrontPageError404.vue");

const StorefrontPageUserWallets = () =>
    import( "@app-storefront/pages/user/wallets/StorefrontPageUserWallets.vue");


//――――――――――――――――――――――――― Orders ―――――――――――――――――――――――――

const StorefrontPageUserOrders = () =>
  import(
    "../pages/user/orders/StorefrontPageUserOrders.vue"
  );
const StorefrontPageBasketOrderPhysicalDashboard = () =>
  import(
    "@app-storefront/pages/basket/order/physical/dashbaord/StorefrontPageBasketOrderPhysicalDashboard.vue"
  );
const StorefrontPageBasketOrderVirtualDashboard = () =>
  import(
    "@app-storefront/pages/basket/order/virtual/dashboard/StorefrontPageBasketOrderVirtualDashboard.vue"
  );
const StorefrontPageAvocadoOrderDashboard = () =>
  import(
    "../pages/avocado/order/dashboard/StorefrontPageAvocadoOrderDashboard.vue"
  );
const StorefrontPageAvocadoOrder = () =>
  import(
    "@app-storefront/pages/avocado/order/StorefrontPageAvocadoOrder.vue"
  );
const StorefrontPageBasketOrderServiceDashboard = () =>
  import(
    "@app-storefront/pages/basket/order/service/dashboard/StorefrontPageBasketOrderServiceDashboard.vue"
  );
const StorefrontPageBasketOrderSubscriptionDashboard = () =>
  import(
    "../pages/basket/order/subscription/dashboard/StorefrontPageBasketOrderSubscriptionDashboard.vue"
  );

const StorefrontPagePosOrderDashboard = () =>
  import(
    "@app-storefront/pages/pos/order/dashboard/StorefrontPagePosOrderDashboard.vue"
  );
const SStorefrontPOSOrderDetailMasterLayout = () =>
  import(
    "@app-storefront/pages/pos/order/StorefrontPagePosOrder.vue"
  );
const StorefrontPageBasketOrderFileDashboard = () =>
  import(
    "@app-storefront/pages/basket/order/file/dashboard/StorefrontPageBasketOrderFileDashboard.vue"
  );
const StorefrontPageBasketOrder = () =>
  import(
    "@app-storefront/pages/basket/order/StorefrontPageBasketOrder.vue"
  );
const StorefrontPageUserOrdersAvocado = () =>
  import(
    "@app-storefront/pages/user/orders/avocado/StorefrontPageUserOrdersAvocado.vue"
  );
const StorefrontPageUserOrdersPhysical = () =>
  import(
    "@app-storefront/pages/user/orders/physical/StorefrontPageUserOrdersPhysical.vue"
  );
const StorefrontPageUserOrdersVirtual = () =>
  import(
    "@app-storefront/pages/user/orders/virtual/StorefrontPageUserOrdersVirtual.vue"
  );
const StorefrontPageUserOrdersFile = () =>
  import(
    "@app-storefront/pages/user/orders/file/StorefrontPageUserOrdersFile.vue"
  );
const StorefrontPageUserOrdersService = () =>
  import(
    "@app-storefront/pages/user/orders/service/StorefrontPageUserOrdersService.vue"
  );

const StorefrontPageUserOrdersSubscription = () =>
  import(
    "@app-storefront/pages/user/orders/subscription/StorefrontPageUserOrdersSubscription.vue"
  );

const StorefrontPageUserOrdersPos = () =>
  import(
    "@app-storefront/pages/user/orders/pos/StorefrontPageUserOrdersPos.vue"
  );

const StorefrontPageUserReturns = () =>
  import(
    "@app-storefront/pages/user/returns/StorefrontPageUserReturns.vue"
  );

//――――――――――――――――――――――――― Insta ―――――――――――――――――――――――――

const StorefrontPageInstagram = () =>
  import(
     "../pages/instagram/StorefrontPageInstagram.vue"
  );

//――――――――――――――――――――――――― Avocado ―――――――――――――――――――――――――

const StorefrontPageAvocadoCart = () =>
  import(
     "../pages/avocado/cart/StorefrontPageAvocadoCart.vue"
  );
const StorefrontPageAvocado = () =>
  import(
     "../pages/avocado/page/StorefrontPageAvocado.vue"
  );

//――――――――――――――――――――――――― Hyper ―――――――――――――――――――――――――

const StorefrontPageHyperOrder = () =>
  import(
     "../pages/hyper/order/StorefrontPageHyperOrder.vue"
  );
const StorefrontPageHyperCart = () =>
  import(
     "../pages/hyper/cart/StorefrontPageHyperCart.vue"
  );

//――――――――――――――――――――――――― POS ―――――――――――――――――――――――――

const SStorefrontPOSPage = () =>
  import(
     "../pages/pos/cart/SStorefrontPOSPage.vue"
  );

//――――――――――――――――――――――――― Custom Home Page ―――――――――――――――――――――――――

const SHOP_PREFIX_ADDRESS = SetupService.GetMetaValue("shop-prefix-address", "",);
const CUSTOM_HOME = SetupService.GetMetaValue("custom-home") as Shop.Home;

//――――――――――――――――――――――――― Social network ―――――――――――――――――――――――――

const CLayout = () =>
  import(
     "@selldone/components-vue/community/layout/CLayout.vue"
  );

const CommunityHomePage = () =>
  import(
     "@selldone/components-vue/community/pages/home/CommunityHomePage.vue"
  );

const CommunityCategoryPage = () =>
  import(
     "@selldone/components-vue/community/pages/category/CommunityCategoryPage.vue"
  );

const CommunityTopicPage = () =>
  import(
     "@selldone/components-vue/community/pages/topic/CommunityTopicPage.vue"
  );

const CommunityFeedPage = () =>
  import(
     "@selldone/components-vue/community/pages/feed/CommunityFeedPage.vue"
  );

const CommunityMyCommentsPage = () =>
  import(
     "@selldone/components-vue/community/pages/my-comments/CommunityMyCommentsPage.vue"
  );

//――――――――――――――――――――――――― Map ―――――――――――――――――――――――――
const StorefrontPageMapProducts = () =>
  import(
     "../pages/map/products/StorefrontPageMapProducts.vue"
  );
const StorefrontPageMapVendors = () =>
  import(
     "../pages/map/vendors/StorefrontPageMapVendors.vue"
  );






//――――――――――――――――――――――――― Listing ―――――――――――――――――――――――――
const StorefrontPageListing = () => import("../pages/listing/StorefrontPageListing.vue");
const StorefrontPageListingItem = () => import("../pages/listing/item/StorefrontPageListingItem.vue");

const StorefrontPageListingCompare = () => import("../pages/listing/compare/StorefrontPageListingCompare.vue");





function getRouteForHome(): IVueRoute {
  switch (CUSTOM_HOME) {
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Blog ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.BLOG:
      return {
        path: "",
        name: StorefrontRoutesName.BLOGS_PAGE,
        component: StorefrontPageBlogsList,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Avocado ▃▃▃▃▃▃▃▃▃▃▃*/

    case Shop.Home.AVOCADO:
      return {
        path: "",
        name: StorefrontRoutesName.AVOCADO_PAGE,
        component: StorefrontPageAvocado,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Hyper ▃▃▃▃▃▃▃▃▃▃▃*/

    case Shop.Home.HYPER:
      return {
        path: "",
        name: StorefrontRoutesName.HYPER_PAGE,
        component: StorefrontPageHyperCart,
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Community ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.COMMUNITY:
      return {
        meta: {
          card: true,
        },
        path: "",
        component: CLayout,
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
        component: StorefrontPageProducts,
        meta: {
          search: true,
        },
      };
    /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Map ▃▃▃▃▃▃▃▃▃▃▃*/
    case Shop.Home.MAP:
      return {
        path: "",
        name: StorefrontRoutesName.MAP_PRODUCTS_PAGE,
        component: StorefrontPageMapProducts,
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
          component: StorefrontPageLanding,
          meta: {
            fullscreen: true,
          },
        };

      /*▃▃▃▃▃▃▃▃▃▃▃ Home ➤ Default (Shop) ▃▃▃▃▃▃▃▃▃▃▃*/
      return {
        path: "",
        name: StorefrontRoutesName.SHOP_PAGE,
        component: StorefrontPageProducts,
        meta: {
          search: true,
        },
      };
  }
}

const routes: IVueRoute[] = [
  //█████████████████████████████████████████████████████████████
  //――――――――――――――――――――― Shop General Layout ―――――――――――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "",
    component: StorefrontLayout,
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

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Login ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "welcome",
        name: StorefrontRoutesName.SHOP_LOGIN_PAGE,
        component: StorefrontPageLogin,
      },


      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Shop Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        // Order important! first route to ShopPage consider as ShopPage!
        path: "shop",
        name:
          StorefrontRoutesName.SHOP_PAGE + (CUSTOM_HOME===Shop.Home.SHOP?'-reserve':''),
        component: StorefrontPageProducts,
        meta: {
          search: true,
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Category ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: ":category_name-category",
        name: StorefrontRoutesName.SHOP_CATEGORY_PAGE,
        component: StorefrontPageProducts,
        meta: {
          search: true,
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Vendors ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "/@:slug-:vendor_id(\\d+)",
        name: StorefrontRoutesName.SHOP_VENDOR_PAGE,
        component: StorefrontPageProducts,
        meta: {
          search: true,
        },
      },

      {
        path: "/vendor/@:slug-:vendor_id(\\d+)",
        name: StorefrontRoutesName.SHOP_VENDOR_CUSTOM_LANDING_PAGE,
        component: StorefrontPageLanding,
        meta: {
          fullscreen: true,

        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Pages ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "pages/:page_name",
        name: StorefrontRoutesName.PAGE_RENDER,
        component: StorefrontPageLanding,
        meta: {
          fullscreen: true,
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Include Dynamic Profiles ⬬⬬⬬⬬⬬⬬⬬⬬

      {
        path: "in/:path-:include_id(\\d+)",
        name: StorefrontRoutesName.INCLUDE_PAGE_RENDER,
        component: StorefrontPageLanding,
        meta: {
          fullscreen: true,
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ product Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "product/:product_id",
        name: StorefrontRoutesName.PRODUCT_PAGE,
        component: StorefrontPageProduct,
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
        component: StorefrontPageComparison,
        meta: {
          bg_color: "#f0f0f0", // Page background color | Set as --background root style variable
        },
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Shop info page (Instead of footer in mobile) ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "info",
        name: StorefrontRoutesName.SHOP_INFO_PAGE_MOBILE,
        component: StorefrontPageInfo,
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ basket Page  ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "basket/:type",
        name: StorefrontRoutesName.BASKET_PAGE,
        component: StorefrontPageBasketCart,
      },

      {
        path: "user",
        component: StorefrontPageUser,



        children: [
          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ My Orders Page (Virtual, Physical ...) ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "orders",
            name: StorefrontRoutesName.ORDERS_PAGE,
            component: StorefrontPageUserOrders,

            children: [
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Physical ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "physical",
                name: StorefrontRoutesName.HISTORY_ORDERS_PHYSICAL,
                component: StorefrontPageUserOrdersPhysical,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Virtual ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "virtual",
                name: StorefrontRoutesName.HISTORY_ORDERS_VIRTUAL,
                component: StorefrontPageUserOrdersVirtual,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ File ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "file",
                name: StorefrontRoutesName.HISTORY_ORDERS_FILE,
                component: StorefrontPageUserOrdersFile,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Service ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "service",
                name: StorefrontRoutesName.HISTORY_ORDERS_SERVICE,
                component: StorefrontPageUserOrdersService,
              },

              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "subscription",
                name: StorefrontRoutesName.HISTORY_ORDERS_SUBSCRIPTION,
                component: StorefrontPageUserOrdersSubscription,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ POS ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "pos",
                name: StorefrontRoutesName.HISTORY_ORDERS_POS,
                component: StorefrontPageUserOrdersPos,
              },
              // ⬬⬬⬬⬬⬬⬬⬬⬬ History ▶ Avocado ⬬⬬⬬⬬⬬⬬⬬⬬
              {
                path: "avocado",
                name: StorefrontRoutesName.HISTORY_ORDERS_AVOCADO,
                component: StorefrontPageUserOrdersAvocado,
              },
            ],
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Profile ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "profile",
            name: StorefrontRoutesName.USER_PROFILE_PAGE,
            component: StorefrontPageUserProfile,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Addresses ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "addresses",
            name: StorefrontRoutesName.USER_ADDRESSES_PAGE,
            component: StorefrontUserAddresses,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User order returns ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "orders-return",
            name: StorefrontRoutesName.USER_RETURN_REQUESTS,
            component: StorefrontPageUserReturns,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Favorites ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "favorites",
            name: StorefrontRoutesName.USER_FAVORITES_PAGE,
            component: StorefrontPageUserWishlist,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Comments ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "comments",
            name: StorefrontRoutesName.USER_COMMENTS_PAGE,
            component: StorefrontPageUserComments,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User gift cards ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "gift-cards",
            name: StorefrontRoutesName.USER_GIFTCARDS_PAGE,
            component: StorefrontPageUserGiftcards,
            meta: {
              requiresAuth: true,
            },
          },

          // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ User Profile ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "wallets",
            name: StorefrontRoutesName.USER_WALLETS_PAGE,
            component: StorefrontPageUserWallets,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },

      // ▶ ▶ ⬬⬬⬬⬬⬬⬬⬬⬬ Redirect login ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "selldone-callback",
        name: StorefrontRoutesName.LOGIN_REDIRECT,
        component: StorefrontPageLoginRedirect,
      },

      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――――――― Article ―――――――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Blog ▶ Blogs List ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "blog",
        name: StorefrontRoutesName.BLOGS_PAGE + (CUSTOM_HOME===Shop.Home.BLOG?'-reserve':''),
        component: StorefrontPageBlogsList,
      },
      {
        // Old version!
        path: "blog",
        name: StorefrontRoutesName.SHOP_BLOGS_PAGE,
        component: StorefrontPageBlogsList,
      },

      {
        path: "/team/:author-:author_id(\\d+)",
        name: StorefrontRoutesName.AUTHOR_PAGE,
        component: StorefrontPageBlogsList,
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
        component: StorefrontPageBlogsView,
      },
      {
        path: "blog/:blog_id",
        name: StorefrontRoutesName.SHOP_BLOG_PAGE,
        component: StorefrontPageBlogsView,
      },
      {
        path: "",
        component: StorefrontPageOfficial,

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ About Us ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "about-us",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_ABOUT_US,
            component: StorefrontPageOfficialAboutUs,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ Terms ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "terms",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_TERMS,
            component: StorefrontPageOfficialTerms,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Profile ▶ Privacy ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "privacy",
            name: StorefrontRoutesName.SHOP_PROFILE_PAGE_PRIVACY,
            component: StorefrontPageOfficialPrivacy,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Contact US ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "contact-us",
            name: StorefrontRoutesName.SHOP_CONTACT_US,
            component: StorefrontPageOfficialContactUs,
          },
        ],
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ FAQ ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "faq/:tag?",
        name: "ShopFAQ",
        component: StorefrontPageFaq,
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "orders",
        component: StorefrontPageBasketOrder,

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Physical ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "physical/SM-:basket_id",
            name: "MyPhysicalOrderInfoPage",
            component: StorefrontPageBasketOrderPhysicalDashboard,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Virtual ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "virtual/SV-:basket_id",
            name: "MyVirtualOrderInfoPage",
            component: StorefrontPageBasketOrderVirtualDashboard,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ File ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "file/SF-:basket_id",
            name: "MyFileOrderInfoPage",
            component: StorefrontPageBasketOrderFileDashboard,
          },
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Service ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "service/SS-:basket_id",
            name: "MyServiceOrderInfoPage",
            component: StorefrontPageBasketOrderServiceDashboard,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ Subscription ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "subscription/SN-:basket_id",
            name: "MySubscriptionOrderInfoPage",
            component: StorefrontPageBasketOrderSubscriptionDashboard,
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
            component: StorefrontPagePosOrderDashboard,
          },
        ],
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ POS Order info ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "orders",
        component: StorefrontPageAvocadoOrder,
        meta: {
          requiresAuth: true,
        },
        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Order info ▶ POS ⬬⬬⬬⬬⬬⬬⬬⬬

          {
            path: "avocado/AVO-:basket_id",
            name: "AvocadoOrderDetailPage",
            component: StorefrontPageAvocadoOrderDashboard,
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
    component: StorefrontLayout,
    meta: {}, // No footer mode!
    children: [
      {
        path: "/map",
        component: StorefrontPageMapProducts,
        meta: {
          fullscreen: true,
        },
      },

      {
        path: "/map-vendors",
        component: StorefrontPageMapVendors,
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
    component: StorefrontLayout,
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
        component: StorefrontPageInstagram,
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
    component: StorefrontLayout,
    meta: {},
    children: [
      //█████████████████████████████████████████████████████████████
      //――――――――――――――――――――――――― Avocado ―――――――――――――――――――――――――――
      //█████████████████████████████████████████████████████████████

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Avocado ▶ Page ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/avocado/:hash",
        name: "AvocadoOrderPage",
        component: StorefrontPageAvocadoCart,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #9eb644, #e8db8e)`,
          transparent_header: true,
          title: "Avocado | Order",
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Avocado ▶ Form ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/avocado",
        name: StorefrontRoutesName.AVOCADO_PAGE + (CUSTOM_HOME===Shop.Home.AVOCADO?'-reserve':''),
        component: StorefrontPageAvocado,
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
        component: StorefrontPageHyperOrder,
        meta: {
          page_background: `background-image: linear-gradient(60deg, #C2185B, #FF5722)`,
          transparent_header: true,
          title: "Hyper | Order",
        },
      },

      // ⬬⬬⬬⬬⬬⬬⬬⬬ Hyper ▶ Form ⬬⬬⬬⬬⬬⬬⬬⬬
      {
        path: "/hyper",
        name: StorefrontRoutesName.HYPER_PAGE + (CUSTOM_HOME===Shop.Home.HYPER?'-reserve':''),
        component: StorefrontPageHyperCart,
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
    component: StorefrontLayout,
    meta: {
      card: true,
    },
    children: [
      {
        path: "",
        name: "CLayout",
        component: CLayout,

        children: [
          // ⬬⬬⬬⬬⬬⬬⬬⬬ Categories (Home)  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: "",
            name: CommunityRoutesName.COMMUNITY_HOME_PAGE + (CUSTOM_HOME===Shop.Home.COMMUNITY?'-reserve':''),
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
            path: ":category_id(\\d+)-:category_slug?",
            name: CommunityRoutesName.COMMUNITY_CATEGORY_PAGE,
            component: CommunityCategoryPage,
          },

          // ⬬⬬⬬⬬⬬⬬⬬⬬ Topic  ⬬⬬⬬⬬⬬⬬⬬⬬
          {
            path: ":category_id(\\d+)-:category_slug?/:topic_id(\\d+)-:topic_slug?",
            name: CommunityRoutesName.COMMUNITY_TOPIC_PAGE,
            component: CommunityTopicPage,
          },
        ],
      },
    ],
  },



  //█████████████████████████████████████████████████████████████
  //――――――――――――――――― Listing  ―――――――――――――――
  //█████████████████████████████████████████████████████████████

  {
    path: "/listing",
    component: StorefrontLayout,
    meta: {
      card: false,
      search: false,

    },
    children: [
      {
        path: "",
        name: "StorefrontListingPage",
        component: StorefrontPageListing,

      },

      {
        path: "/listing/compare",
        name: "StorefrontListingCompare",
        component:StorefrontPageListingCompare,
      },


// Listing home + category (one optional segment)
      {
        path: ":category?",
        name: "StorefrontListing",
        component: StorefrontPageListing,

      },




// Listing item profile (two segments after listing)
      {
        path: ":category/:item",
        name: "StorefrontListingItemProfile",
        component: StorefrontPageListingItem,

      },



    ],
  },












  // will match everything and put it under `route.params.pathMatch`
  { path: "/:pathMatch(.*)*", component: StorefrontPageError404 },
  { name: "AvocadoBuyerFormPage", component: StorefrontPageError404 },
  { name: "ShopHyperPage", component: StorefrontPageError404 },













];

const router = createRouter({
  history: createWebHistory(SHOP_PREFIX_ADDRESS /*process.env.BASE_URL*/),

  routes: routes as RouteRecordRaw[],
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

interface IVueRoute {
  path: string; // The path of the route. Should be always unique.
  name?: string; // The name of the route. Should be always unique.
  component: any; // The component to render when the route is matched.
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
