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

import { ProductType } from "@core/enums/product/ProductType";
import { i18n, loadLanguageAsyncShop } from "./../lang/i18n_shop";
import { type ILanguage, Language } from "@core/enums/language/Language";
import merge from "lodash-es/merge";
import {
  NativeInterfaceShop,
  NativeInterfaceUser,
} from "@components/plugins/native/NativeAppInterface";
import { LocalStorages } from "@core/helper/local-storage/LocalStorages";
import CoreMixin from "@components/mixin/CoreMixin";
import type { Basket } from "@core/models/shop/order/basket/basket.model";
import { Club } from "@core/models/shop/club/club.model";
import { XapiShop } from "@sdk-storefront/shop/XapiShop";
import { Product } from "@core/models/shop/product/product.model";
import type { ProductVariant } from "@core/models/shop/product/product_variant.model";
import type { BasketItem } from "@core/models/shop/order/basket/basket_item.model";
import type { SubscriptionPrice } from "@core/models/shop/product/subscription_price.model";
import { Currency } from "@core/enums/payment/Currency";
import { Avocado } from "@core/models/shop/order/avocado/avocado.order";
import type { Hyper } from "@core/models/shop/order/hyper/hyper.order";
import type { ProductCompare } from "@core/models/shop/product/product-compare.model";
import { SetupService } from "@core/server/SetupService";
import type { Coupon } from "@core/models/shop/incentives/coupon/coupon.model";
import type { Offer } from "@core/models/shop/incentives/offer/offer.model";
import type { RouteRecord } from "vue-router/types/router";
import { Shop } from "@core/models/shop/shop.model";

const StorefrontMixin = CoreMixin.extend({
  data() {
    return {
      // Data properties
      shop_name: window.$storefront.name,
    };
  },
  computed: {
    isNative() {
      return this.$store.getters.getIsNative;
    },

    current_product_type_in_basket() {
      // Or appropriate type for the product type
      const baskets = this.getBaskets();

      const product_id = this.getId(this.$route.params.product_id);
      if (!product_id) {
        for (let i = 0; i < baskets.length; i++) {
          const basket = baskets[i];
          if (basket && basket.items && basket.items.length) return basket.type;
        }

        return ProductType.PHYSICAL.code;
      }

      for (let i = 0; i < baskets.length; i++) {
        const basket = baskets[i];
        if (!basket) continue;

        const basket_item = basket.items.find(
          (item: BasketItem) => item.product_id === product_id
        );

        if (basket_item && basket_item.product) return basket_item.product.type;
      }

      console.warn("NOT FOUND TYPE");
      return ProductType.PHYSICAL.code;
    },
  },

  methods: {
    setPageTitle(title: string): void {
      if (this.getShop().title)
        document.title = title
          ? `${this.getShop().title} | ${title}`
          : this.getShop().title;
    },

    /**
     * Important! Use in page builder to get the current shop name!
     * @returns string
     */
    getCurrentShopName(): string {
      return window.$storefront.name;
    },

    $localstorage_base_path() {
      return `shop/@${window.$storefront.name}/`;
    },

    geti18n() {
      return i18n;
    },

    async setCurrentLanguage(
      _local: string | ILanguage,
      save_on_local: boolean = false
    ) {
      let local: string;
      if (typeof _local === "object") {
        local = _local.code;
      } else {
        local = _local;
      }

      console.log("🌐 Set Language: ", local);

      if (!local || !Language[local]) local = "en";
      // Temporary set window global language object: (Used by language selector set its default)
      window.$language = this.getLanguageObject(local);

      // 🞧 Header: Language
      window.axios.defaults.headers.common["X-Localization"] =
        window.$language.local;

      await loadLanguageAsyncShop(local, () => {
        console.log("🌐 SwitchLanguage | ✅ Load async package: ", local);
        this.$i18n.locale = local;

        if (save_on_local) {
          window.$storefront.database.language.setLanguage(local);
        }

        //――――  Set global language object ―――
        window.$language = this.getCurrentLanguage();

        this.$vuetify.rtl = this.getCurrentLanguage().dir === "rtl";
      });

      try {
        let rez = window.OverrideShopLanguagePacks[local];
        if (!rez) {
          window.OverrideShopLanguagePacks[local] = {}; // Prevent duplicate loading!

          // load language override pack
          rez = await window.$storefront.shop.language.fetchLanguagePack(local);

          window.OverrideShopLanguagePacks[local] = rez;
        }

        if (rez) {
          const { global, shop } = rez;
          console.log("🌐 Language | 🟠 Set custom language packs.");

          // get current messages
          const currentMessages = this.$i18n.getLocaleMessage(local);

          // merge with override
          const mergedMessages = merge({}, currentMessages, {
            global: { ...global },
            ...shop,
          });

          this.$i18n.setLocaleMessage(local, mergedMessages);
        }
      } catch (e) {
        console.error(e);
      }
    },

    //―――――――――――――――――――――― Shop Address (Base URl) ――――――――――――――――――――

    /**
     * @return {string}
     */
    GetCurrentShopUrl(): string {
      const origin = window.location.origin; //result = "http://localhost:60470"
      return `${origin}${window.$storefront.prefix_url}`;
    },

    UpdateUserInfo() {
      this.$store.commit("setAuthUser", null);

      if (window.$cookies.get("access_token")) {
        this.$store.commit("setBusyUser", true); // Set busy fetch user!
        //  console.log('cookies access_token',window.$cookies.get("access_token"))
        window.$storefront.user.fetchMyInfo(
          (user) => {
            this.$store.commit("setAuthUser", user);
            NativeInterfaceUser(user);

            this.fetchCoupons();
            this.fetchOffers();
            this.fetchLotteryPrizes(); // Only for user!

            this.EventBus.$emit("get-me:success", user);

            this.$store.commit("setBusyUser", false);
          },
          (error) => {
            console.log(
              "=============== REMOVE ACCESS TOKEN ================="
            );
            window.$cookies.remove(
              "access_token",
              window.$storefront.prefix_url,
              null
            );

            this.showLaravelError(error);

            NativeInterfaceUser(null);

            this.fetchCoupons();
            this.fetchOffers();

            this.EventBus.$emit("get-me:error", error);

            this.$store.commit("setBusyUser", false);
          }
        );
      } else {
        this.$store.commit("setBusyUser", false); // Set busy fetch user to false! (initial state is true)

        // + Add to gust shop!
        this.fetchCoupons();
        this.fetchOffers();
      }
    },
    //―――――――――――――――――――――― Login (OAuth2 by Selldone) ――――――――――――――――――――
    /**
     *
     * @param callback Callback function
     * @param social  Social login option (Direct to this login type if login needed)
     * @param popup Problem in custom domain! popup window closed!
     * @constructor
     */
    LoginShop(
      callback: (state: string) => void | null,
      social = null,
      popup = false
    ) {
      // 1) Save current url.
      sessionStorage.setItem("after-login-path", this.$route.path);

      // 2) Redirect to Selldone oath2 url.
      //Old:

      // Problem in open window login!
      if (!popup) {
        // In direct social login move to url normally (Not open popup because of close win problem)
        // Add hash query: Solve cache bug in CDN!
        window.location.href =
          `${window.$storefront.prefix_url}/login?hash=${Math.random()
            .toString(36)
            .substring(7)}-${new Date().getTime()}` +
          (social ? `&social=${social}` : "");
        return;
      }

      //New:
      function startLogin() {
        const login_url =
          `${
            window.$storefront.prefix_url
          }/login?popup=true&hash=${Math.random()
            .toString(36)
            .substring(7)}-${new Date().getTime()}` +
          (social ? `&social=${social}` : ""); // Add hash query: Solve cache bug in Arvan cloud!
        const win = window.open(
          login_url,
          "Selldone Login",
          "width=640, height=750"
        );

        const pollTimer = window.setInterval(function () {
          try {
            if (win?.location.href.includes("access_token")) {
              window.clearInterval(pollTimer);

              const fragmentString = win.location.hash.substring(1);

              const fragment: { [key: string]: string } = {};
              const fragmentItemStrings = fragmentString.split("&");

              fragmentItemStrings.forEach((val) => {
                {
                  const fragmentItem = val.split("=");
                  if (fragmentItem.length !== 2) {
                    return;
                  }
                  fragment[fragmentItem[0]] = fragmentItem[1];
                }
              });

              if (fragment["access_token"]) {
                const expires_in = parseInt(fragment["expires_in"]);
                window.SelldoneUser = {
                  access_token: fragment["access_token"],
                  expires_in: expires_in,
                  refresh_token: fragment["refresh_token"],
                };

                validateToken(fragment["access_token"], expires_in);
              }

              win.close();
            } else if (win?.document.URL.includes("#error=")) {
              console.log("---------- Deny ----------");
              window.clearInterval(pollTimer);
              win.close();
              if (callback) callback("deny");
            }
          } catch (e) {
            // console.error(e)  Some error for cross-origin block (until back to shop website)
          }

          if (win?.closed) {
            console.log("---------- closed ----------", win);
            window.clearInterval(pollTimer);

            if (callback) callback("close");
          }
        }, 100);
      }

      function validateToken(token: string, expires_in: number) {
        //  console.log('validateToken','token',token,'expires_in',expires_in)

        if (callback) callback("login");

        let expire_date = null;
        if (expires_in) {
          expire_date = new Date();
          expire_date.setUTCSeconds(expires_in);
        }

        window.SetToken(token, expire_date);
      }

      startLogin();
    },
    Register() {
      // 1) Save current url.
      sessionStorage.setItem("after-login-path", this.$route.path);
      // 2) Redirect to samin oath2 url.
      window.location.href = `${window.$storefront.prefix_url}/register`;
    },

    Logout(callback: (state: string) => void | null) {
      window.$storefront.auth
        .logout()
        .then(() => {
          this.LogoutProcess();
          if (callback) callback("success");
        })
        .catch((e) => {
          this.showLaravelError(e);
          if (callback) callback("failed");
        })
        .finally(() => {});
    },

    LogoutProcess() {
      // localStorage.clear();
      // sessionStorage.clear();
      window.$cookies.remove(
        "access_token",
        window.$storefront.prefix_url,
        null
      );
      // 🞧 Header: Authorization
      delete window.axios.defaults.headers.common["Authorization"];

      this.$store.commit("setAuthUser", null);
      this.$store.commit("setPendingTransactions", []);

      this.$store.commit("setBasketPhysical", null);
      this.$store.commit("setBasketVirtual", null);
      this.$store.commit("setBasketFile", null);
      this.$store.commit("setBasketService", null);
      this.$store.commit("setBasketSubscription", null);

      this.$store.commit("setGifts", null);

      this.fetchBasketAndShop();

      if (
        this.$route.matched.some(
          (record: RouteRecord) => record.meta.requiresAuth
        )
      )
        this.$router.push({ name: window.$storefront.routes.SHOP_PAGE });
    },

    //―――――――――――――――――――――― Update Exchange Rates ――――――――――――――――――――
    UpdateExchangeRates(show_success = false, callback: () => void | null) {
      window.$storefront.shop.exchange.fetchRates(
        (data) => {
          this.getShop().shop_exchange_rates = data.rates;
          // this.$store.commit("setExchangeRates", data.rates);
          if (show_success)
            this.showSuccessAlert(
              "Update exchange rates",
              "Exchange rates were updated."
            );
          if (callback) callback();
        },
        (error) => {
          this.showLaravelError(error);
        }
      );
    },

    //―――――――――――――――――――――― Basket (Physical) ――――――――――――――――――――

    fetchBasketAndShop() {
      this.$store.commit("setBusyShop", true);

      window.$storefront.shop
        .fetchShop()
        .then(
          ({
            shop,
            pending_transactions,
            initial_location,
            baskets,
            club,
            orders_state,
            seen_pops,
          }) => {
            window.shop = shop;
            this.$store.commit("setShop", shop);
            this.$store.commit("setPendingTransactions", pending_transactions);

            // Set default location calculated based on user IP:
            this.$store.commit("setInitialLocation", initial_location);

            NativeInterfaceShop(shop);

            // ▀▀▀▀▀▀▀▀▀ 🥶 Guest ▀▀▀▀▀▀▀▀▀
            // Set guest code (use for guest basket)
            if (shop.guest_code) {
              // Must save in localstorage to reuse in all requests headers:
              LocalStorages.SetShopGuestCode(shop.guest_code);
              // 🞧 Header: Add guest code to all headers:
              window.axios.defaults.headers.common["S-Guest"] = shop.guest_code;
            }
            // ▀▀▀▀▀▀▀▀▀ 🥵 User ▀▀▀▀▀▀▀▀▀
            else {
              try {
                // - Header: Remove guest code
                delete window.axios.defaults.headers.common["S-Guest"];
              } catch (e) {
                console.error(e);
              }
            }

            // Set all baskets:
            this.setBasket(null); // Clear all!
            if (baskets)
              baskets
                .uniqueByKey(
                  "type"
                ) /*Prevent to show last basket! Always reopen baskets has lower ID!*/
                .forEach((basket) => {
                  this.setBasket(basket);
                });

            this.setClub(club);
            this.setOrdersState(orders_state);

            //...........................................................................
            // Set language by shop language:
            // 1. Saved by user on local:
            let saved_local =
              window.$storefront.database.language.getLanguage();

            if (saved_local) {
              // Options:
              const language_option =
                shop.options &&
                shop.options.find((i) => i.code === "languages");

              if (
                language_option &&
                Array.isArray(language_option.value) &&
                language_option.value.includes(saved_local.code)
              ) {
                console.log(
                  "🌐 Valid language on the local.",
                  saved_local.code
                );

                this.setCurrentLanguage(saved_local);
              } else {
                saved_local = null; // Not valid!
              }
            }

            // 2. Load main shop language:
            if (shop.language && !saved_local) {
              console.log("🌐 Load default language...", shop.language);
              this.setCurrentLanguage(shop.language);
            }
            //...........................................................................

            // Set Currency:
            const user_selected_currency = window.$storefront.currency;
            // Check selected currency available in shop!
            // If selected currency not exist set first shop currency:
            if (
              !user_selected_currency ||
              !shop.currencies!.includes(user_selected_currency.code)
            ) {
              if (!shop.currencies?.length) {
                throw new Error("Shop has no currency!");
              }

              window.$storefront.currency = Currency[shop.currencies![0]];
              console.log(
                "Set currency automatically",
                window.$storefront.currency
              );
            }

            // Popup: We save seen_pops in localstorage (Client) and send in the header request
            if (seen_pops) {
              localStorage.setItem(
                LocalStorages.GetSeenPopups(this.$localstorage_base_path()),
                JSON.stringify(seen_pops)
              );
            }
          }
        )
        .catch((error) => {
          this.showLaravelError(error);
        })

        .finally(() => {
          this.$store.commit("setBusyShop", false);
        });
    },

    //―――――――――――――――――――――― Change User Selected Currency ――――――――――――――――――――
    onChangeUserSelectedCurrency() {
      this.setUserShopCurrency();
      this.fetchCoupons();
      this.fetchOffers();
    },

    //―――――――――――――――――――――― Save User Selected Currency For Shop ――――――――――――――――――――

    /**
     * 🥶 Guest and 🥵 User
     */
    setUserShopCurrency() {
      // if (!this.USER()) return;
      const currency_obj = this.GetUserSelectedCurrency();
      if (!currency_obj) return;

      window.$storefront.user
        .setUserCurrency(currency_obj.code)
        .then(() => {
          this.fetchBasketAndShop(); // Need refresh baskets...
        })
        .catch((error) => {
          this.showLaravelError(error);
        });
    },
    //―――――――――――――――――――――― Bill ――――――――――――――――――――
    /**
     * Update basket prices
     *
     * @param basket
     * @param bill
     */
    setBasketBill(basket: Basket & { bill?: object }, bill: object | null) {
      if (!bill) return;
      basket.bill = bill;

      this.$store.dispatch("setBasket", basket);
    },
    //―――――――――――――――――――――― Coupons ――――――――――――――――――――

    fetchCoupons() {
      const currency_obj = this.GetUserSelectedCurrency();
      if (!currency_obj) return;

      window.$storefront.coupon
        .fetchAvailableCoupons(currency_obj.code)
        .then(({ coupons }) => {
          this.$store.commit("setCoupons", coupons);
        })
        .catch((error) => {
          this.showLaravelError(error);
        });
    },

    //―――――――――――――――――――――― Lottery ――――――――――――――――――――

    fetchLotteryPrizes() {
      window.$storefront.lottery
        .fetchLotteryPrizes()
        .then(({ prizes }) => {
          this.$store.commit("setLotteryPrizes", prizes);
        })
        .catch(() => {
          // this.showLaravelError(error); Prevent show error on restricted shops!
        });
    },

    //―――――――――――――――――――――― Offers ――――――――――――――――――――

    fetchOffers() {
      const currency_obj = this.GetUserSelectedCurrency();
      if (!currency_obj) return;

      window.$storefront.offer
        .fetchOffers(currency_obj.code)
        .then(({ offers }) => {
          this.$store.commit("setOffers", offers);
        })
        .catch((error) => {
          this.showLaravelError(error);
        });
    },

    //―――――――――――――――――――――― Shop ――――――――――――――――――――

    getShop() {
      return this.$store.getters.getShop;
    },
    GetPendingTransactions() {
      return this.$store.getters.getPendingTransactions;
    },

    setBasket(basket: Basket | null): void {
      if (!basket) {
        this.$store.commit("setBasketPhysical", null);
        this.$store.commit("setBasketVirtual", null);
        this.$store.commit("setBasketFile", null);
        this.$store.commit("setBasketService", null);
        this.$store.commit("setBasketSubscription", null);
      } else {
        if (basket.type === ProductType.PHYSICAL.code)
          this.$store.commit("setBasketPhysical", basket);
        else if (basket.type === ProductType.VIRTUAL.code)
          this.$store.commit("setBasketVirtual", basket);
        else if (basket.type === ProductType.FILE.code)
          this.$store.commit("setBasketFile", basket);
        else if (basket.type === ProductType.SERVICE.code)
          this.$store.commit("setBasketService", basket);
        else if (basket.type === ProductType.SUBSCRIPTION.code)
          this.$store.commit("setBasketSubscription", basket);
      }
    },
    getBasket(type: keyof typeof ProductType): Basket | null {
      if (type === ProductType.PHYSICAL.code)
        return this.$store.getters.getBasketPhysical;
      else if (type === ProductType.VIRTUAL.code)
        return this.$store.getters.getBasketVirtual;
      else if (type === ProductType.FILE.code)
        return this.$store.getters.getBasketFile;
      else if (type === ProductType.SERVICE.code)
        return this.$store.getters.getBasketService;
      else if (type === ProductType.SUBSCRIPTION.code)
        return this.$store.getters.getBasketSubscription;

      return null;
    },
    getBaskets(): [Basket?, Basket?, Basket?, Basket?, Basket?] {
      return [
        this.$store.getters.getBasketPhysical,
        this.$store.getters.getBasketVirtual,
        this.$store.getters.getBasketFile,
        this.$store.getters.getBasketService,
        this.$store.getters.getBasketSubscription,
      ];
    },

    getTotalItemInBaskets() {
      let out = 0;

      Object.keys(ProductType).forEach((type) => {
        const basket = this.getBasket(type);
        if (basket && basket.items) out += basket.items.length;
      });

      return out;
    },

    setClub(club: Club | null) {
      this.$store.commit("setClub", club);
    },
    getClub() {
      return this.$store.getters.getClub;
    },

    setOrdersState(orders_state: XapiShop.OrdersState[] | null) {
      this.$store.commit("setOrdersState", orders_state);
    },
    getOrdersState() {
      return this.$store.getters.getOrdersState;
    },

    AddToBasket(
      shop_name: string,
      product: Product,
      variant: ProductVariant,
      count: number,
      callbackError: (message: string) => void,
      callbackSuccess: (basket: Basket) => void,
      preferences: BasketItem.IPreferences | null = null,
      vendor_product: VendorProduct | null = null, // 🟣 Marketplace 🟣
      subscription_price: SubscriptionPrice | null = null // 🎗️ Subscription
    ) {
      const product_id = product.id;
      const variant_id = variant ? variant.id : null;
      const vendor_product_id = vendor_product ? vendor_product.id : null; // 🟣 Marketplace 🟣
      const subscription_price_id = subscription_price
        ? subscription_price.id
        : null; // 🎗️ Subscription

      // ▀▀▀▀▀▀▀▀▀ 🥵 User & 🥶 Guest ▀▀▀▀▀▀▀▀▀

      window.$storefront.basket
        .addItem(product_id, variant_id, count, {
          preferences: preferences,
          vendor_product_id: vendor_product_id, // 🟣 Marketplace 🟣
          price_id: subscription_price_id, // 🎗️ Subscription
        })

        .then(({ basket, bill, refresh, error, error_msg }) => {
          if (basket) {
            this.setBasket(basket);
            this.setBasketBill(basket, bill);
            if (callbackSuccess) callbackSuccess(basket);
          }

          // There is an error in adding item to basket, but the correct basket with bill returned from backend.
          if (error) {
            this.showErrorAlert(null, error_msg);
            if (callbackError) callbackError(error_msg!);
          }

          if (refresh) this.fetchBasketAndShop(); // Important! Fetch data from server. (Ex. Remove item automatically from basket)
        })
        .catch((error) => {
          this.showLaravelError(error);
          if (callbackError) callbackError(error);
        });
    },
    RemoveFromBasket(
      product_id: number,
      variant_id: number | null,
      callbackError: (message: string) => void,
      callbackSuccess: (basket: Basket) => void
    ) {
      // ▀▀▀▀▀▀▀▀▀ 🥵 User & 🥶 Guest ▀▀▀▀▀▀▀▀▀
      window.$storefront.basket
        .removeItem(product_id, variant_id)

        .then(({ basket, bill }) => {
          this.setBasket(basket);
          this.setBasketBill(basket, bill);
          if (callbackSuccess) callbackSuccess(basket);
        })
        .catch((error) => {
          this.showLaravelError(error);
          if (callbackError) callbackError(error);
        });
    },

    //―――――――――――――――――――――― Product ――――――――――――――――――――

    goToProduct(product_id: number | string) {
      this.$router.push({
        name: window.$storefront.routes.PRODUCT_PAGE,
        params: {
          shop_name: window.$storefront.name,
          product_id: product_id as string,
        },
      });
    },

    //―――――――――――――――――――――― SHOP ――――――――――――――――――――

    //―――――――――――――――――――――― User ――――――――――――――――――――

    //―――――――――――――――――――――― Event Bus ――――――――――――――――――――
    ShowPaymentDialogBasket(
      code: string /*🥶 Guest*/,
      order: Basket | null,
      type: keyof typeof ProductType,
      bill: Basket.IBill,
      prize_selected_variant_id: number | null = null,
      gateway: string | null = null,
      acceptCOD: boolean = false, // Based on delivery methods support COD!
      callback: (() => void) | null = null // Not used yet!
    ) {
      this.EventBus.$emit("payment-form-basket", {
        code: code,
        order: order,
        type: type,
        bill: bill,
        prize_selected_variant_id: prize_selected_variant_id,
        gateway: gateway,
        acceptCOD: acceptCOD,
        callback: callback,
      });
    },

    //―――――― 🎗️ Subscription ――――――
    ShowPaymentDialogSubscription(
      currency: keyof typeof Currency,
      order: Basket | null,
      bill: Basket.IBill,
      gateway_codes: String,
      callback: (() => void) | null = null // Not used yet!
    ) {
      this.EventBus.$emit("payment-form-subscription", {
        currency: currency,
        bill: bill,
        gateway_codes: gateway_codes,
        callback: callback,
        order: order,
      });
    },

    /**
     *
     * @param gateway
     * @param transaction_id
     * @param order_id        Only use for guest payment! 🥶 Guest
     * @param force_reset_payment Will force to create new payment and select payment options
     * @constructor
     */
    TryToPayOrder(
      gateway: string,
      transaction_id: number,
      order_id: number,
      force_reset_payment: boolean = false
    ) {
      console.log(
        "====== TRY TO PAY ======",
        gateway,
        transaction_id,
        order_id,
        force_reset_payment ? "🆕 Reset payment" : "🆔 Retrieve payment"
      );

      this.EventBus.$emit("try-to-pay", {
        gateway: gateway,
        transaction_id: transaction_id,
        order_id: order_id,
        force_reset_payment: force_reset_payment,
      });
    },
    OnPaymentCompleted(order_type: keyof typeof ProductType, order_id: number) {
      this.EventBus.$emit("on-payment-completed", {
        order_type: order_type,
        order_id: order_id,
      });
    },

    ShowPaymentDialogBill(
      code: string /*🥶 Guest*/,
      order: Basket | null,
      bill: Basket.IBill,
      callback: () => void
    ) {
      this.EventBus.$emit("payment-form-bill", {
        code: code,
        bill: bill,
        callback: callback,
        order: order,
      });
    },

    ShowPaymentDialogAvocado(avocado: Avocado, callback: () => void) {
      this.EventBus.$emit("payment-form-avocado", {
        avocado: avocado,
        callback: callback,
      });
    },

    ShowPaymentDialogHyper(hyper: Hyper, callback: () => void) {
      this.EventBus.$emit("payment-form-hyper", {
        hyper: hyper,
        callback: callback,
      });
    },

    /**
     * Open side menu cart
     * @param open
     * @param type  Auto select basket type
     * @constructor
     */
    OpenCartSideMenu(open: boolean, type: keyof typeof ProductType) {
      this.EventBus.$emit("side-cart-menu-open", { type, open });
    },

    //―――――――――――――――――――――― Product Comparison ――――――――――――――――――――

    addToProductComparison(
      product: Product,
      variant: ProductVariant | null,
      need_update: boolean = false /*In product list fast add to comparison! need full data by fetch!*/
    ) {
      let list = this.$store.getters.getProductsComparison;

      if (!list) list = [];

      const item = Object.assign({}, product) as ProductCompare;
      item.variant = variant;
      item.need_update = need_update; // Add a flag to item to force fetch full data in ProductComparison!

      if (variant) item.key = product.id + "-" + variant.id;
      else item.key = product.id;

      this.AddOrUpdateItemByID(list, item, "key");

      // console.table(list);

      this.$store.commit("setProductsComparison", list);
    },
    removeFromProductComparison(
      product: Product,
      variant: ProductVariant | null
    ) {
      const list = this.$store.getters.getProductsComparison;
      if (!list) return;

      let key;
      if (variant) key = product.id + "-" + variant.id;
      else key = product.id;

      this.DeleteItemByID(list, key, "key");

      // remove all product's variants if variant is null:
      if (!variant) {
        list.forEach((item: ProductCompare) => {
          if (item.id === product.id)
            this.DeleteItemByID(list, item.key, "key");
        });
      }

      this.$store.commit("setProductsComparison", list);
    },

    //――――――――――――――――――――――――― Custom Home Page ―――――――――――――――――――――――――

    getCustomHomePage() {
      const CUSTOM_HOME = SetupService.GetMetaValue("custom-home"); // Address for shop page! null or shop

      return CUSTOM_HOME === Shop.Home.SHOP // CUSTOM_HOME -> shop
        ? null
        : CUSTOM_HOME === Shop.Home.BLOG
        ? window.$storefront.routes.BLOGS_PAGE
        : CUSTOM_HOME === Shop.Home.AVOCADO
        ? window.$storefront.routes.AVOCADO_PAGE
        : CUSTOM_HOME === Shop.Home.HYPER
        ? window.$storefront.routes.HYPER_PAGE
        : CUSTOM_HOME === Shop.Home.COMMUNITY
        ? window.$community.routes.COMMUNITY_HOME_PAGE
        : CUSTOM_HOME === Shop.Home.MAP
        ? window.$storefront.routes.MAP_PRODUCTS_PAGE
        : CUSTOM_HOME
        ? window.$storefront.routes.CUSTOM_HOME_PAGE // CUSTOM_HOME -> Page ID
        : null;
    },

    //――――――――――――――――――――――――― Coupon ―――――――――――――――――――――――――
    hasCouponThisProducts(product_id: string | number, variant_id: number) {
      const coupons = this.$store.getters.getCoupons;
      if (!coupons) return false;
      product_id = "" + product_id; // save as string!

      return coupons.some((coupon: Coupon) => {
        // console.log('coupon',coupon.products[product_id],variant_id,coupon.products && coupon.products[product_id] && (variant_id===null || coupon.products[product_id].includes(variant_id)))
        if (
          coupon.products &&
          coupon.products[product_id] &&
          (variant_id === null ||
            coupon.products[product_id].includes(variant_id))
        )
          return true;
      });
    },
    //――――――――――――――――――――――――― Offer ―――――――――――――――――――――――――
    hasOfferThisProduct(product_id: string | number, variant_id: number) {
      const offers = this.$store.getters.getOffers;
      if (!offers) return false;
      product_id = "" + product_id; // save as string!

      return offers.some((offer: Offer) => {
        if (
          offer.buy_products[product_id] &&
          (variant_id === null ||
            offer.buy_products[product_id].includes(variant_id))
        )
          return true;
      });
    },

    getOffersBuyProduct(product_id: string | number, variant_id: number) {
      const offers = this.$store.getters.getOffers;
      if (!offers) return [];
      product_id = "" + product_id; // save as string!

      return offers.filter((offer: Offer) => {
        return (
          offer.buy_products[product_id] &&
          (variant_id === null ||
            offer.buy_products[product_id].includes(variant_id))
        );
      });
    },

    //―――――――――――――――――――――― Basket Info ――――――――――――――――――――
    /**
     *
     * @param order_type
     * @param order_id
     * @return true: Page is refreshing!
     */
    goToOrderInfo(order_type: string, order_id: number) {
      let to = null;

      if (order_type === ProductType.PHYSICAL.code)
        to = {
          name: "MyPhysicalOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === ProductType.VIRTUAL.code)
        to = {
          name: "MyVirtualOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === ProductType.FILE.code)
        to = {
          name: "MyFileOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === ProductType.SERVICE.code)
        to = {
          name: "MyServiceOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === ProductType.SUBSCRIPTION.code)
        to = {
          name: "MySubscriptionOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === "POS")
        to = {
          name: "MyPOSOrderInfoPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === "AVO")
        to = {
          name: "AvocadoOrderDetailPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === "HYP")
        to = {
          name: "HyperOrderPage",
          params: { basket_id: "" + order_id },
        };
      else if (order_type === "BILL")
        to = {
          name: "MyServiceOrderInfoPage",
          params: { basket_id: "" + order_id },
        };

      if (to) {
        if (
          to.name === this.$route.name &&
          "" + to.params.basket_id === "" + this.$route.params.basket_id
        ) {
          // Force refresh page:
          window.location.reload();
          return true;
        } else {
          this.$router.push(to);
          return false;
        }
      }
    },

    //―――――――――――――――――――――― Notification ――――――――――――――――――――
    EnablePushNotification() {
      console.error("Push notification not supported for the shop!");
      // PushNotification.AskForPermission();
    },
  },
});

export default StorefrontMixin;
