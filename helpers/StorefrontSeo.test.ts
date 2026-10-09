// @vitest-environment jsdom
import {beforeEach, describe, expect, it, vi} from "vitest";
import type {Router} from "vue-router";

let seo: typeof import("./StorefrontSeo").StorefrontSeo;
let router: Router;

const serverHead = `
  <title>Server SEO title</title>
  <meta name="description" content="Server description">
  <meta name="robots" content="noindex">
  <meta property="og:title" content="Server sharing title">
  <meta name="twitter:title" content="Server sharing title">
  <link rel="canonical" href="https://example.test/product/1">
  <script type="application/ld+json">{"@type":"Product","name":"Server product"}</script>
`;

beforeEach(async () => {
  vi.resetModules();
  ({StorefrontSeo: seo} = await import("./StorefrontSeo"));
  const {createRouter, createMemoryHistory} = await import("vue-router");
  router = createRouter({
    history: createMemoryHistory(),
    routes: [{path: "/:pathMatch(.*)*", component: {template: "<div />"}}],
  });
  router.afterEach((to, from, failure) => {
    if (seo.onNavigation(to, from, failure)) seo.setTitle(to.fullPath);
  });
  document.head.innerHTML = serverHead;
});

describe("Storefront server SEO preservation", () => {
  it("makes no head mutations for initial preload, cache or delayed data", async () => {
    const original = document.head.innerHTML;
    const mutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => mutations.push(...records));
    observer.observe(document.head, {subtree: true, childList: true, attributes: true, characterData: true});

    await router.push("/product/1");
    const initialNavigation = seo.captureNavigation();
    seo.setTitle("Preloaded title", initialNavigation);
    seo.setTitle("Cached title", initialNavigation);
    await Promise.resolve();
    seo.setTitle("Network title", initialNavigation);
    seo.setTitle("Created or category event title");
    await Promise.resolve();

    expect(document.head.innerHTML).toBe(original);
    expect([...mutations, ...observer.takeRecords()]).toHaveLength(0);
    expect(seo.canUpdate()).toBe(false);
    observer.disconnect();
  });

  it("preserves SSR during automatic initial filter/query/hash normalization", async () => {
    await router.push("/shop");
    const original = document.head.innerHTML;

    await router.replace("/shop?only_available=true");
    await router.replace("/shop?only_available=true&filter=headphones#products");
    seo.setTitle("Initial category response");

    expect(document.head.innerHTML).toBe(original);
    expect(seo.canUpdate()).toBe(false);

    await router.push("/headphones-category");
    seo.setTitle("Destination category");
    expect(document.title).toBe("Destination category");
  });

  it("keeps initial router redirects locked", async () => {
    router.beforeEach((to) => to.path === "/old" ? "/product/1" : undefined);
    const original = document.head.innerHTML;

    await router.push("/old");
    seo.setTitle("Redirected title");

    expect(router.currentRoute.value.path).toBe("/product/1");
    expect(document.head.innerHTML).toBe(original);
    expect(seo.canUpdate()).toBe(false);
  });

  it("does not unlock for aborted or duplicate navigations", async () => {
    await router.push("/product/1");
    router.beforeEach((to) => to.path === "/blocked" ? false : undefined);
    const original = document.head.innerHTML;

    await router.push("/blocked");
    await router.push("/product/1");
    seo.setTitle("Rejected title");

    expect(document.head.innerHTML).toBe(original);
    expect(seo.canUpdate()).toBe(false);
  });

  it("allows titles after a successful SPA navigation and preserves other SEO tags", async () => {
    await router.push("/product/1");
    const metadata = Array.from(document.head.children)
      .filter((node) => node.tagName !== "TITLE")
      .map((node) => node.outerHTML);

    await router.push("/product/2");
    const navigation = seo.captureNavigation();
    seo.setTitle("Loaded destination title", navigation);

    expect(document.title).toBe("Loaded destination title");
    expect(Array.from(document.head.children)
      .filter((node) => node.tagName !== "TITLE")
      .map((node) => node.outerHTML)).toEqual(metadata);
  });

  it("rejects initial data that arrives after the first SPA navigation", async () => {
    await router.push("/product/1");
    const initialNavigation = seo.captureNavigation();
    await router.push("/product/2");
    const currentTitle = document.title;

    seo.setTitle("Late initial product title", initialNavigation);

    expect(document.title).toBe(currentTitle);
  });

  it("rejects a superseded request even after navigating back to the same URL", async () => {
    await router.push("/home");
    await router.push("/product/1");
    const oldNavigation = seo.captureNavigation();
    await router.push("/product/2");
    await router.push("/product/1");

    seo.setTitle("Old product response", oldNavigation);
    expect(document.title).toBe("/product/1");

    seo.setTitle("Current product response", seo.captureNavigation());
    expect(document.title).toBe("Current product response");
  });
});
