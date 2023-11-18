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

/**
 * @link https://developers.google.com/tag-manager/enhanced-ecommerce
 */

import type { ProductVariant } from "@core/models/shop/product/product_variant.model";
import { ProductType } from "@core/enums/product/ProductType";
import { Product } from "@core/models/shop/product/product.model";
import { Currency } from "@core/enums/payment/Currency";
import { Category } from "@core/models/shop/category/category.model";
import type { Basket } from "@core/models/shop/order/basket/basket.model";
import type { Shop } from "@core/models/shop/shop.model";
import { PriceHelper } from "@core/helper/price/PriceHelper";

declare global {
  interface Window {
    dataLayer: any;
  }
}

export default class GtagEcommerce {
  /**
   * To measure product impressions, send a view_item_list with the product information:
   * @param shop
   * @param products
   * @param currency
   * @param _list
   * @param category
   */
  static MeasuringProductImpressions(
    shop: Shop,
    products: (Product & { category: Category })[],
    currency: keyof typeof Currency,
    _list: string | null,
    category: Category | null
  ) {
    window.dataLayer = window.dataLayer || [];

    const products_list: object[] = [];

    let index = 1;
    products
      ?.filter((x) => !!x?.id) // Remove null values!
      .forEach((product) => {
        const category_name = product.category
          ? product.category.title
          : category
          ? category.title
          : "Home";
        const list = _list ? _list : `${category_name} Gallery`;

        try {
          const price = PriceHelper.priceProductByCurrency(
            shop,
            product,
            null,
            currency
          );
          products_list.push({
            name: product.title, // Name or ID is required.
            id: product.id,
            price: price,
            brand: product.brand,
            category: category_name,
            variant: "",
            list: list,
            position: index++,
          });
        } catch (e) {
          console.error(e);
          return;
        }
      });

    window.dataLayer.push({
      ecommerce: {
        currencyCode: currency, // Local currency is optional.
        impressions: products_list,
      },
    });
  }

  /**
   * To measure a product click, send a select_content event, specify product as the content_type, and provide the product information:
   * @param shop
   * @param product
   * @param currency
   * @param position
   * @param category
   * @constructor
   */
  static MeasuringProductClicks(
    shop: Shop,
    product: Product & { category: Category },
    currency: keyof typeof Currency,
    position: number,
    category: Category | null
  ) {
    window.dataLayer = window.dataLayer || [];

    const category_name = product.category
      ? product.category.title
      : category
      ? category.title
      : "Home";

    try {
      const price = PriceHelper.priceProductByCurrency(
        shop,
        product,
        null,
        currency
      );

      window.dataLayer.push({
        event: "productClick",
        currencyCode: currency, // Pajuhaan: Added by me! not in Google docs!
        ecommerce: {
          click: {
            actionField: { list: "Search Results" }, // Optional list property.
            products: [
              {
                name: product.title, // Name or ID is required.
                id: product.id,
                price: price,
                brand: product.brand,
                category: category_name,
                variant: "",
                position: position,
              },
            ],
          },
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * Measure a view of product details by pushing a detail action to the data layer, along with one or more productFieldObjects representing the products being viewed:
   * @param shop
   * @param product
   * @param currency
   * @param _list       product-page    quick-view
   * @constructor
   */
  static MeasuringViewsOfProductDetails(
    shop: Shop,
    product: Product & { category: Category },
    currency: keyof typeof Currency,
    _list?: "product-page" | "quick-view" | null
  ) {
    window.dataLayer = window.dataLayer || [];
    const category_name = product.category ? product.category.title : "Home";
    const list = _list ? _list : `${category_name} Gallery`;

    const products_list = [];

    try {
      const price = PriceHelper.priceProductByCurrency(
        shop,
        product,
        null,
        currency
      );

      products_list.push({
        name: product.title, // Name or ID is required.
        id: product.id,
        price: price,
        brand: product.brand,
        category: category_name,
        variant: "",
      });

      window.dataLayer.push({
        currencyCode: currency, // Pajuhaan: Added by me! not in Google docs!

        ecommerce: {
          detail: {
            actionField: { list: list }, // 'detail' actions have an optional list property.
            products: products_list,
          },
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * Measure adding a product to a shopping cart by using an 'add' actionFieldObject and a list of productFieldObjects.
   * @param shop
   * @param product
   * @param variant
   * @param quantity
   * @param currency
   */
  static AddingProductToShoppingCart(
    shop: Shop,
    product: Product & { category: Category },
    variant: ProductVariant | null,
    quantity: number,
    currency: keyof typeof Currency
  ) {
    window.dataLayer = window.dataLayer || [];
    const category_name = product.category ? product.category.title : "Home";

    try {
      const price = PriceHelper.priceProductByCurrency(
        shop,
        product,
        variant,
        currency
      );

      const products_list = [];
      products_list.push({
        name: product.title, // Name or ID is required.
        id: product.id,
        price: price,
        brand: product.brand,
        category: category_name,
        variant: variant,
        quantity: quantity,
      });

      window.dataLayer.push({
        event: "addToCart",
        ecommerce: {
          currencyCode: currency,
          add: {
            // 'add' actionFieldObject measures.
            products: products_list, //  adding a product to a shopping cart.
          },
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * Measure the removal of a product from a shopping cart.
   * @param shop
   * @param product
   * @param variant
   * @param quantity
   * @param currency
   * @constructor
   */
  static RemovingProductFromShoppingCart(
    shop: Shop,
    product: Product & { category: Category },
    variant: ProductVariant | null,
    quantity: number,
    currency: keyof typeof Currency
  ) {
    window.dataLayer = window.dataLayer || [];
    const category_name = product.category ? product.category.title : "Home";

    try {
      const price = PriceHelper.priceProductByCurrency(
        shop,
        product,
        variant,
        currency
      );

      const products_list = [];
      products_list.push({
        name: product.title, // Name or ID is required.
        id: product.id,
        price: price,
        brand: product.brand,
        category: category_name,
        variant: variant,
        quantity: quantity,
      });

      window.dataLayer.push({
        event: "removeFromCart",
        ecommerce: {
          currencyCode: currency,
          add: {
            // 'add' actionFieldObject measures.
            products: products_list, //  adding a product to a shopping cart.
          },
        },
      });
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /**
   * The checkout option is useful in cases where you've already measured a checkout step but you want to capture
   * additional information about the same checkout step. For example, the shipping method selected by a user.
   * To measure this use the checkout_option action along with the step and option fields.
   *
   * step 0: View basket
   * step 1: Select location
   * step 2: Select payment button
   *
   * @param basket
   * @param step
   * @param option
   * @constructor
   */
  static MeasuringCheckoutSteps(
    basket: Basket,
    step: number,
    option: string | null
  ) {
    if (!basket) return;
    window.dataLayer = window.dataLayer || [];
    const products_list: {
      name: any; // Name or ID is required.
      id: any;
      price: any;
      currencyCode: any;
      brand: any;
      category: string;
      variant: any;
      quantity: any;
    }[] = [];

    try {
      if (
        basket.items &&
        [
          ProductType.PHYSICAL.code,
          ProductType.VIRTUAL.code,
          ProductType.SERVICE.code,
          ProductType.FILE.code,
          "POS",
        ].includes(basket.type)
      ) {
        basket.items
          ?.filter((item) => !!item?.product) // Must have product!
          .forEach((item) => {
            // let category_name = product.category ? product.category.title : "Home";

            products_list.push({
              name: item.product?.title, // Name or ID is required.
              id: item.product?.id,
              price: item.price,
              currencyCode: item.currency,
              brand: item.product?.brand,
              category: "",
              variant: item.variant,
              quantity: item.count,
            });
          });
      }
    } catch (e) {
      console.error(e);
    }

    window.dataLayer.push({
      event: "checkout",
      currencyCode: basket.currency, // Pajuhaan: Added by me! not in Google docs!

      ecommerce: {
        checkout: {
          actionField: { step: step, option: option },
          products: products_list,
        },
      },
    });
  }

  static MeasuringPurchasesBasket(basket: Basket) {
    const products_list: {
      name: any; // Name or ID is required.
      id: any;
      price: any;
      currency: any;
      brand: any;
      category: string;
      variant: any;
      quantity: any;
      coupon: string;
    }[] = [];

    try {
      if (
        basket.items &&
        [
          ProductType.PHYSICAL.code,
          ProductType.VIRTUAL.code,
          ProductType.SERVICE.code,
          ProductType.FILE.code,
          "POS",
        ].includes(basket.type)
      ) {
        basket.items
          ?.filter((item) => !!item?.product) // Must have product!
          .forEach((item) => {
            // let category_name = product.category ? product.category.title : "Home";

            products_list.push({
              name: item.product?.title, // Name or ID is required.
              id: item.product?.id,
              price: item.price,
              currency: item.currency,
              brand: item.product?.brand,
              category: "",
              variant: item.variant,
              quantity: item.count,
              coupon: basket.discount_id ? `${basket.discount_id}` : "", // Optional fields may be omitted or set to empty string.
            });
          });
      }
    } catch (e) {
      console.error(e);
    }

    window.dataLayer.push({
      currencyCode: basket.currency, // Pajuhaan: Added by me! not in Google docs!

      ecommerce: {
        purchase: {
          actionField: {
            id: `${basket.type}-${basket.id}`, // Transaction ID. Required for purchases and refunds.
            affiliation: "Online Store",
            revenue: basket.price, // Total transaction value (incl. tax and shipping)
            tax: "0",
            shipping: basket.delivery_price > 0 ? basket.delivery_price : 0, // -1: reserved for free shipping!
            coupon: "",
          },
          products: products_list,
        },
      },
    });
  }
}
