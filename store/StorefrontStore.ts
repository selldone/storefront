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
import Vuex from "vuex";
import type { ActionContext } from "vuex";
import { Currency } from "@core/enums/payment/Currency";
import type { ICurrency } from "@core/enums/payment/Currency";
import { ProductType } from "@core/enums/product/ProductType";
import { OverrideCustomVariantsName } from "@core/enums/product/ProductVariants";
import { XapiShop } from "@sdk-storefront/shop/XapiShop";
import type { ProductCompare } from "@core/models/shop/product/product-compare.model";
import type { Coupon } from "@core/models/shop/incentives/coupon/coupon.model";
import type { Offer } from "@core/models/shop/incentives/offer/offer.model";
import { Club } from "@core/models/shop/club/club.model";
import { Shop } from "@core/models/shop/shop.model";
import type { Basket } from "@core/models/shop/order/basket/basket.model";

Vue.use(Vuex);

interface State {
  user: any | null;
  debug: boolean;
  permissions: any | null;
  basket_physical: Basket | null;
  basket_virtual: Basket | null;
  basket_file: Basket | null;
  basket_service: Basket | null;
  basket_subscription: Basket | null;
  gifts: any | null;
  shop: Shop | null;
  busy_shop: boolean;
  pending_transactions: any[];
  user_currency: keyof typeof Currency | null;
  products_comparison: ProductCompare[] | null;
  club: Club | null;
  orders_state: any | null;
  is_native: boolean;
  coupons: Coupon[];
  offers: Offer[];
  countries: any[];
  lottery_prizes: any[];
  channel_entry: string | null;
  community_config: {
    show_deletes: boolean;
  };
  bottom_nav_show: boolean;
  busy_user: boolean;
  show_filter_menu: boolean;
  force_hide_navigation: boolean;
  current_selected_variant: any | null;
  shop_main_banner: any | null;
  /**
   * Set default location calculated based on user IP
   */
  initial_location: XapiShop.ILocation | null;
}

export default new Vuex.Store<State>({
  state: {
    user: null,
    debug: false,

    //━━━━━━━ 🔑 Permissions ━━━━━━━
    permissions: null,

    //━━━━━━━ Basket ━━━━━━━
    basket_physical: null,
    basket_virtual: null,
    basket_file: null,
    basket_service: null,
    basket_subscription: null,
    //━━━━━━━ 📦 Gifts ━━━━━━━
    gifts: null,

    shop: null,
    busy_shop: false, // Indicate all  shop is updating.

    pending_transactions: [],

    //━━━━━━━ User Currency ━━━━━━━
    user_currency: null,

    //━━━━━━━ Products comparison ━━━━━━━
    products_comparison: null,

    //━━━━━━━ Customer Club ━━━━━━━
    club: null,

    //━━━━━━━ Orders state ━━━━━━━
    orders_state: null,

    //━━━━━━━ Is native ━━━━━━━

    is_native: false,

    //━━━━━━━ Coupons ━━━━━━━
    coupons: [],

    //━━━━━━━ Offers ━━━━━━━
    offers: [],

    //━━━━━━━ Countries ━━━━━━━
    countries: [],

    //━━━━━━━ Lottery ━━━━━━━
    lottery_prizes: [],

    //━━━━━━━ Sales Channel Entry ━━━━━━━
    channel_entry: null, // Can be : instagram,..

    //━━━━━━━ Community Configuration ━━━━━━━
    community_config: {
      show_deletes: false /* Show Deleted Posts for admin and moderators*/,
    },

    //━━━━━━━ UI ━━━━━━━
    bottom_nav_show: false,
    busy_user: true, // Initial state, important to decide what happen in router (meta : requiresAuth)
    show_filter_menu: false, // Show filters menu global access

    //━━━━━━━ Hide bottom navigation ━━━━━━━
    force_hide_navigation: false,

    //━━━━━━━ Product Page ━━━━━━━
    current_selected_variant: null,

    //━━━━━━━ Shop Main Banner ━━━━━━━
    /**
     * Current displayed campaign banner.
     */
    shop_main_banner: null,

    initial_location: null,
  },

  mutations: {
    setShop(state, shop) {
      state.shop = shop;
      OverrideCustomVariantsName(shop); // Apply custom variants name
      //console.log("-------shop save---------");
    },
    setBusyShop(state, busy) {
      state.busy_shop = busy;
    },

    setPendingTransactions(state, pending_transactions) {
      state.pending_transactions = pending_transactions;
    },

    setAuthUser(state, user) {
      state.user = user;
      state.permissions = user ? user.permissions : null;
      //console.log("-------End save---------");
    },

    setDebugMode(state, debug) {
      state.debug = debug;
    },

    //━━━━━━━ 🔑 Permissions ━━━━━━━
    setUserPermissions(state, permissions) {
      state.permissions = permissions;
    },

    //━━━━━━━ Basket ━━━━━━━

    setBasketPhysical(state, basket) {
      state.basket_physical = basket;
    },
    setBasketVirtual(state, basket) {
      state.basket_virtual = basket;
    },
    setBasketFile(state, basket) {
      state.basket_file = basket;
    },
    setBasketService(state, basket) {
      state.basket_service = basket;
    },
    setBasketSubscription(state, basket) {
      state.basket_subscription = basket;
    },

    //━━━━━━━ 📦 Gifts ━━━━━━━
    setGifts(state, gifts) {
      state.gifts = gifts;
    },

    //━━━━━━━ User Currency ━━━━━━━
    setUserCurrency(state, currency: ICurrency) {
      state.user_currency = currency.code;
    },

    //━━━━━━━ Products comparison ━━━━━━━
    setProductsComparison(state, products_comparison: ProductCompare[] | null) {
      state.products_comparison = products_comparison;
    },
    //━━━━━━━ Customer Club ━━━━━━━
    setClub(state, club) {
      state.club = club;
    },

    //━━━━━━━ Orders state ━━━━━━━
    setOrdersState(state, orders_state) {
      state.orders_state = orders_state;
    },

    //━━━━━━━ Is native mode ━━━━━━━
    setIsNative(state, is_native) {
      state.is_native = is_native;
    },

    //━━━━━━━ Coupons ━━━━━━━
    setCoupons(state, coupons) {
      state.coupons = coupons;
    },

    //━━━━━━━ Offers ━━━━━━━
    setOffers(state, offers) {
      state.offers = offers;
    },

    //━━━━━━━ Countries ━━━━━━━
    setCountries(state, countries) {
      state.countries = countries;
    },

    //━━━━━━━ Lottery ━━━━━━━
    setLotteryPrizes(state, lottery_prizes) {
      state.lottery_prizes = lottery_prizes;
    },

    //━━━━━━━ Sales Channel Entry━━━━━━━
    setChannelEntry(state, channel_entry) {
      state.channel_entry = channel_entry;
    },

    //━━━━━━━ Community Configuration ━━━━━━━
    setCommunityConfiguration(state, community_config) {
      state.community_config = community_config;
    },

    //━━━━━━━ UI ━━━━━━━
    setBottomNavShow(state, bottom_nav_show) {
      state.bottom_nav_show = bottom_nav_show;
    },
    setBusyUser(state, busy_user) {
      state.busy_user = busy_user;
    },
    setShowFilterMenu(state, show_filter_menu) {
      state.show_filter_menu = show_filter_menu;
    },

    //━━━━━━━ Hide bottom navigation ━━━━━━━
    setForceHideNavigation(state, force_hide_navigation) {
      state.force_hide_navigation = force_hide_navigation;
    },

    //━━━━━━━ Product Page ━━━━━━━
    setCurrentSelectedVariant(state, variant) {
      state.current_selected_variant = variant;
    },
    //━━━━━━━ Shop Main Banner ━━━━━━━
    /**
     * We update the banner's status in the store state to notify other components, such as the layout, whether the banner is displayed.
     * @param state
     * @param banner
     */
    setShopMainBanner(state, banner) {
      state.shop_main_banner = banner;
    },

    setInitialLocation(state, initial_location) {
      state.initial_location = initial_location;
    },
  },
  getters: {
    getShop(state) {
      return state.shop;
    },
    getBusyShop(state) {
      return state.busy_shop;
    },

    getPendingTransactions(state) {
      return state.pending_transactions ? state.pending_transactions : [];
    },

    isLoggedIn(state) {
      return state.user !== null;
    },
    getUser(state) {
      return state.user;
    },
    isDebugMode(state) {
      return state.debug;
    },

    //━━━━━━━ 🔑 Permissions ━━━━━━━
    getPermissions(state) {
      return state.permissions;
    },
    //━━━━━━━External Accounts ━━━━━━━
    /*  getExchangeRates(state) {
      return state.exchangeRates;
    },*/

    //━━━━━━━ 📦 Gifts ━━━━━━━
    getGifts(state) {
      return state.gifts;
    },

    //━━━━━━━Basket━━━━━━━
    getBasketPhysical(state): object | null {
      return state.basket_physical;
    },
    getBasketVirtual(state): object | null {
      return state.basket_virtual;
    },
    getBasketFile(state): object | null {
      return state.basket_file;
    },
    getBasketService(state): object | null {
      return state.basket_service;
    },
    getBasketSubscription(state): object | null {
      return state.basket_subscription;
    },
    //━━━━━━━ User Currency ━━━━━━━
    getUserCurrency(state) {
      if (!state.user_currency) return null;
      return Currency[state.user_currency];
    },

    //━━━━━━━ Products comparison ━━━━━━━
    getProductsComparison(state: State): ProductCompare[] | null {
      return state.products_comparison;
    },
    //━━━━━━━ Customer Club ━━━━━━━
    getClub(state) {
      return state.club;
    },

    //━━━━━━━ Orders state ━━━━━━━
    getOrdersState(state) {
      return state.orders_state;
    },

    //━━━━━━━ Is native mode ━━━━━━━
    // this.$store.getters.getIsNative
    getIsNative(state) {
      return state.is_native;
    },

    //━━━━━━━ Coupons ━━━━━━━
    getCoupons(state) {
      return state.coupons;
    },

    //━━━━━━━ Offers ━━━━━━━
    getOffers(state) {
      return state.offers;
    },

    //━━━━━━━ Countries ━━━━━━━
    getCountries(state) {
      return state.countries;
    },

    //━━━━━━━ Lottery ━━━━━━━
    getLotteryPrizes(state) {
      return state.lottery_prizes;
    },

    //━━━━━━━ Sales Channel Entry ━━━━━━━
    getChannelEntry(state) {
      return state.channel_entry;
    },

    //━━━━━━━ Community Configuration ━━━━━━━
    getCommunityConfiguration(state) {
      return state.community_config;
    },

    //━━━━━━━ UI ━━━━━━━
    getBottomNavShow(state) {
      return state.bottom_nav_show;
    },
    getBusyUser(state) {
      return state.busy_user;
    },
    getShowFilterMenu(state) {
      return state.show_filter_menu;
    },
    //━━━━━━━ Hide bottom navigation ━━━━━━━
    getForceHideNavigation(state) {
      return state.force_hide_navigation;
    },

    //━━━━━━━ Product Page ━━━━━━━
    getCurrentSelectedVariant(state) {
      return state.current_selected_variant;
    },

    //━━━━━━━ Shop Main Banner ━━━━━━━
    getShopMainBanner(state) {
      return state.shop_main_banner;
    },
    // ━━━━━━━ Initial Location ━━━━━━━

    getInitialLocation(state) {
      return state.initial_location;
    },
  },

  actions: {
    /**
     * Sets the appropriate basket based on the type.
     * @param context - Vuex action context.
     * @param basket - The basket object containing the product type and its data.
     */

    setBasket(context: ActionContext<State, any>, basket: { type: string }) {
      basket = basket ? JSON.parse(JSON.stringify(basket)) : null; // Deep clone to force update in all components.

      if (basket.type === ProductType.PHYSICAL.code)
        context.commit("setBasketPhysical", basket);
      else if (basket.type === ProductType.VIRTUAL.code)
        context.commit("setBasketVirtual", basket);
      else if (basket.type === ProductType.FILE.code)
        context.commit("setBasketFile", basket);
      else if (basket.type === ProductType.SERVICE.code)
        context.commit("setBasketService", basket);
      else if (basket.type === ProductType.SUBSCRIPTION.code)
        context.commit("setBasketSubscription", basket);
    },
  },
});
