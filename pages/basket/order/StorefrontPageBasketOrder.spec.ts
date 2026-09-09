// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@selldone/components-vue/plugins/notification/NotificationService.ts", () => ({
  default: { showErrorAlert: vi.fn(), showLaravelError: vi.fn() },
}));
vi.mock("@selldone/components-vue/plugins/gtag/GtagEcommerce", () => ({
  GtagEcommerce: { MeasuringPurchasesBasket: vi.fn() },
}));
vi.mock("@selldone/core-js", () => ({
  Basket: { Status: { Payed: { code: "Payed" }, COD: { code: "COD" } } },
}));
vi.mock("@selldone/core-js/enums/product/ProductType", () => ({
  ProductType: { FILE: { code: "FILE" } },
}));
vi.mock("@selldone/core-js/utils", () => ({ FileHelper: {} }));
vi.mock("@selldone/core-js/helper/shop/ShopOptionsHelper", () => ({
  ShopOptionsHelper: { HasGuestCheckout: () => true },
}));
vi.mock("@selldone/components-vue/mixin/auth/AuthMixin.ts", () => ({ default: {} }));
vi.mock("@selldone/components-vue/mixin/route/RouteMixin.ts", () => ({ RouteMixin: {} }));
vi.mock("@selldone/components-vue/mixin/template/TemplateMixin.ts", () => ({ default: {} }));
vi.mock("@selldone/components-vue/utils/events/EventBus.ts", () => ({ EventBus: {} }));
vi.mock("@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue", () => ({ default: {} }));
vi.mock("@selldone/components-vue/storefront/order/shipping/stepper/SOrderDeliveryStatusStepper.vue", () => ({ default: {} }));

import OrderPage from "./StorefrontPageBasketOrder.vue";
import FileList from "@selldone/components-vue/storefront/product/file/SShopProductFilesList.vue";
import { StorefrontLocalStorages } from "@selldone/core-js/helper/local-storage/StorefrontLocalStorages";

const orderId = 101;
const paidCode = "synthetic-paid-order-code";
const openCode = "synthetic-new-open-basket-code";

describe("FILE order guest download access", () => {
  let get: ReturnType<typeof vi.fn>;
  let headers: Record<string, string>;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("guest-basket:" + orderId, paidCode);
    localStorage.setItem("guest-code", openCode);
    headers = { "S-Guest": openCode };
    get = vi.fn().mockResolvedValue({ data: { basket: { id: orderId, status: "Payed" } } });
    vi.stubGlobal("axios", { get, defaults: { headers: { common: headers } } });
    vi.stubGlobal("name", "");
    (window as any).XAPI = {
      GET_ORDER_BASKET_INFO: (_shop: string, id: number) => `/orders/${id}`,
      GENERATE_DOWNLOAD_PRODUCT_FILE_TEMP_URL: (_shop: string, product: number, file: number) => `/products/${product}/files/${file}`,
    };
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    delete (window as any).XAPI;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function context(user: object | null = null, query: Record<string, string> = {}) {
    return {
      USER: () => user,
      $shop: { name: "synthetic-shop" },
      $route: { params: { basket_id: orderId }, query },
      basket: null as any,
      busy: false,
    };
  }

  async function fetchOrder(ctx: ReturnType<typeof context>) {
    OrderPage.methods!.fetchOrderInfo.call(ctx);
    await vi.waitFor(() => expect(ctx.busy).toBe(false));
  }

  async function download(ctx: ReturnType<typeof context>) {
    get.mockResolvedValueOnce({ data: { url: "https://example.invalid/synthetic-download" } });
    const file = { id: 301, product_id: 201 };
    const fileContext = {
      USER: ctx.USER,
      getShop: () => ctx.$shop,
      shop_name: ctx.$shop.name,
      basket: ctx.basket,
      $route: ctx.$route,
      busy_get_file: null,
    };
    FileList.methods!.getBuyerFileUrl.call(fileContext, file);
    await vi.waitFor(() => expect(fileContext.busy_get_file).toBeNull());
    return get.mock.lastCall![1].params;
  }

  it("downloads with this paid order's code after the active guest code rotates", async () => {
    const ctx = context();
    await fetchOrder(ctx);
    expect(get.mock.calls[0][1].params.code).toBe(paidCode);
    expect(ctx.basket.code).toBe(paidCode);

    expect(await download(ctx)).toMatchObject({ code: paidCode, basket_id: orderId });
    expect(headers["S-Guest"]).toBe(openCode);
    expect(localStorage.getItem("guest-code")).toBe(openCode);
  });

  it("retains the exact code sent even if stored history changes during the request", async () => {
    let resolve!: (value: object) => void;
    get.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const ctx = context();
    OrderPage.methods!.fetchOrderInfo.call(ctx);
    localStorage.setItem("guest-basket:" + orderId, "synthetic-replacement");
    resolve({ data: { basket: { id: orderId, status: "Payed" } } });
    await vi.waitFor(() => expect(ctx.busy).toBe(false));
    expect(ctx.basket.code).toBe(paidCode);
  });

  it("keeps authenticated purchases independent of guest history", async () => {
    const history = vi.spyOn(StorefrontLocalStorages, "GetShopHistoryGuestCodeOfOrder");
    const ctx = context({ id: 501 });
    await fetchOrder(ctx);
    expect(history).not.toHaveBeenCalled();
    expect(ctx.basket.code).toBeUndefined();
    expect(await download(ctx)).toMatchObject({ code: undefined, basket_id: orderId });
  });

  it("preserves signed-order proof without attaching an unrelated guest code", async () => {
    const query = { signature: "synthetic-signature", timestamp: "12345" };
    const ctx = context(null, query);
    await fetchOrder(ctx);
    expect(ctx.basket.code).toBeUndefined();
    expect(await download(ctx)).toMatchObject({
      code: undefined,
      basket_id: orderId,
      ...query,
    });
  });

  it("does not substitute the new open basket code when order history is missing", async () => {
    localStorage.removeItem("guest-basket:" + orderId);
    const ctx = context();
    await fetchOrder(ctx);
    expect(get.mock.calls[0][1].params.code).toBeNull();
    expect(ctx.basket.code).toBeUndefined();
    expect(localStorage.getItem("guest-code")).toBe(openCode);
  });

  it("does not attach a code when order access is rejected", async () => {
    get.mockResolvedValueOnce({ data: { error: true, error_msg: "Synthetic access denied" } });
    const ctx = context();
    await fetchOrder(ctx);
    expect(ctx.basket).toBeNull();
  });

  it("preserves an order code already supplied by the response", async () => {
    get.mockResolvedValueOnce({ data: { basket: { id: orderId, status: "Payed", code: "synthetic-response-code" } } });
    const ctx = context();
    await fetchOrder(ctx);
    expect(ctx.basket.code).toBe("synthetic-response-code");
  });
});
