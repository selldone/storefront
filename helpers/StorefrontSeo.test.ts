// @vitest-environment jsdom
import {beforeEach, describe, expect, it, vi} from "vitest";
import type {Router} from "vue-router";

let seo: typeof import("./StorefrontSeo").StorefrontSeo;
let router: Router;

const shop: any = {id: 1, name: "test-shop", title: "Test shop", description: "Shop description", currency: "EUR"};
const product: any = {
  id: 2,
  slug: "headphones",
  title: "Headphones",
  type: "PHYSICAL",
  pricing: "FIX",
  currency: "USD",
  price: 80,
  commission: 5,
  discount: 10,
  dis_start: "2000-01-01 00:00:00",
  dis_end: "2099-01-01 00:00:00",
  quantity: 3,
  article_pack: {article: {page_title: "Headphones SEO title", description: "Headphones description"}},
};
const page: any = {id: 3, name: "summer", title: "Summer landing", description: "Summer description"};
const article: any = {id: 4, parent_id: 4, slug: "news", title: "Shop news", page_title: "News SEO title", description: "News description"};
const category: any = {id: 5, name: "audio", title: "Audio category", description: "Audio description"};
const listing: any = {id: 6, title: "Places directory", description: "Places description"};
const listingItem: any = {id: 7, title: "Studio profile", description: "Studio description"};

const serverHead = `
  <title>Server SEO title</title>
  <meta name="description" content="Server description">
  <meta name="robots" content="noindex, nofollow">
  <meta name="google-site-verification" content="Keep verification">
  <meta property="og:title" content="Server sharing title">
  <meta property="og:description" content="Server sharing description">
  <meta name="twitter:title" content="Server sharing title">
  <meta name="twitter:description" content="Server sharing description">
  <link rel="canonical" href="https://example.test/product/1">
  <script type="application/ld+json">{"@type":"Product","name":"Server product"}</script>
  <script type="application/ld+json" data-storefront-seo="server">{"@type":"Product","name":"Marked server product"}</script>
`;

function meta(selector: string): string | null {
  return document.head.querySelector(selector)?.getAttribute("content") ?? null;
}

function schemaNodes(value: any): any[] {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  if (!value || typeof value !== "object") return [];
  return value["@graph"] ? schemaNodes(value["@graph"]) : [value];
}

function clientNodes(): any[] {
  return Array.from(document.head.querySelectorAll('script[data-storefront-seo="client"]'))
    .flatMap((script) => schemaNodes(JSON.parse(script.textContent!)));
}

function productNode(): any {
  const result = clientNodes().find((node) => node["@type"] === "Product");
  expect(result).toBeDefined();
  return result;
}

function updateEveryPage(navigation: number): void {
  seo.setTitle("Delayed title", navigation);
  seo.updateProduct(product, shop, navigation);
  seo.updateProducts({parent: category, products: [product]}, shop, navigation);
  seo.updatePage(page, shop, navigation);
  seo.updatePage(page, shop, navigation, {
    asset: {vendor: {name: "Vendor landing", description: "Vendor description", icon: "https://cdn.test/vendor.png"}},
    augment: [{type: "image", value: "https://cdn.test/vendor-cover.png"}],
  });
  seo.updateArticle(article, shop, navigation);
  seo.updateListing(listing, shop, navigation, category);
  seo.updateListingItem(listingItem, shop, navigation);
}

async function enterProduct(): Promise<number> {
  await router.push("/product/1");
  await router.push("/product/2");
  const navigation = seo.captureNavigation();
  seo.updateProduct(product, shop, navigation);
  return navigation;
}

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
  vi.resetModules();
  ({StorefrontSeo: seo} = await import("./StorefrontSeo"));
  const {createRouter, createMemoryHistory} = await import("vue-router");
  router = createRouter({
    history: createMemoryHistory(),
    routes: [{path: "/:pathMatch(.*)*", component: {template: "<div />"}}],
  });
  router.afterEach((to, from, failure) => {
    if (seo.onNavigation(to, from, failure)) seo.updateRoute(shop, to.fullPath);
  });
  document.head.innerHTML = serverHead;
});

describe("Storefront server SEO preservation", () => {
  it("makes no head mutations or cleanup for any initial preload, cache or delayed page API", async () => {
    const original = document.head.innerHTML;
    const mutations: MutationRecord[] = [];
    const observer = new MutationObserver((records) => mutations.push(...records));
    observer.observe(document.head, {subtree: true, childList: true, attributes: true, characterData: true});
    const append = vi.spyOn(document.head, "appendChild");
    const remove = vi.spyOn(document.head, "removeChild");

    await router.push("/product/1");
    const initialNavigation = seo.captureNavigation();
    seo.updateRoute(shop, "Initial route title");
    updateEveryPage(initialNavigation);
    await Promise.resolve();
    updateEveryPage(initialNavigation);
    seo.setTitle("Created or category event title");
    await Promise.resolve();

    expect(document.head.innerHTML).toBe(original);
    expect([...mutations, ...observer.takeRecords()]).toHaveLength(0);
    expect(append).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    expect(seo.canUpdate()).toBe(false);
    observer.disconnect();
    append.mockRestore();
    remove.mockRestore();
  });

  it("preserves SSR during automatic initial filter/query/hash normalization", async () => {
    await router.push("/shop");
    const original = document.head.innerHTML;
    await router.replace("/shop?only_available=true");
    await router.replace("/shop?only_available=true&filter=headphones#products");
    updateEveryPage(seo.captureNavigation());

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
    updateEveryPage(seo.captureNavigation());

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
    updateEveryPage(seo.captureNavigation());

    expect(document.head.innerHTML).toBe(original);
    expect(seo.canUpdate()).toBe(false);
  });

  it("keeps an active page and its request ticket during query/hash-only navigation", async () => {
    const navigation = await enterProduct();
    const original = document.head.innerHTML;
    await router.replace("/product/2?currency=EUR#buy");
    await router.replace("/product/2?currency=USD#reviews");

    expect(seo.captureNavigation()).toBe(navigation);
    expect(seo.canUpdate(navigation)).toBe(true);
    expect(document.head.innerHTML).toBe(original);
  });

  it("rejects every initial data API arriving after the first SPA navigation", async () => {
    await router.push("/product/1");
    const initialNavigation = seo.captureNavigation();
    await router.push("/product/2");
    const original = document.head.innerHTML;
    updateEveryPage(initialNavigation);

    expect(document.head.innerHTML).toBe(original);
  });

  it("rejects every superseded request even after returning to the same URL", async () => {
    await router.push("/home");
    await router.push("/product/2");
    const oldNavigation = seo.captureNavigation();
    await router.push("/product/3");
    await router.push("/product/2");
    const original = document.head.innerHTML;
    updateEveryPage(oldNavigation);
    expect(document.head.innerHTML).toBe(original);

    seo.updateProduct(product, shop, seo.captureNavigation());
    expect(document.title).toContain("Headphones");
  });
});

describe("Storefront dynamic metadata and JSON-LD", () => {
  it("updates title and sharing metadata together while preserving robots and verification", async () => {
    await enterProduct();
    expect(document.title).toContain("Headphones SEO title");
    expect(meta('meta[name="description"]')).toBe("Headphones description");
    expect(meta('meta[property="og:title"]')).toBe("Headphones");
    expect(meta('meta[name="twitter:title"]')).toBe("Headphones");
    expect(meta('meta[property="og:description"]')).toBe("Headphones description");
    expect(meta('meta[name="twitter:description"]')).toBe("Headphones description");
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");
    expect(meta('meta[name="google-site-verification"]')).toBe("Keep verification");
    expect(productNode().name).toBe("Headphones");
  });

  it("uses the authoritative SSR canonical origin and product data slug without query/hash", async () => {
    await router.push("/product/1");
    await router.push("/product/2-old-slug?currency=EUR#buy");
    seo.updateProduct(product, shop, seo.captureNavigation());
    const canonical = document.head.querySelector('link[rel="canonical"]')!.getAttribute("href");

    expect(canonical).toBe("https://example.test/product/2-headphones");
    expect(meta('meta[property="og:url"]')).toBe(canonical);
    expect(productNode().url).toBe(canonical);
  });

  it.each(["/product/2", "/@test-shop/product/2"])("preserves the SSR /@shop canonical prefix for route %s", async (path) => {
    document.head.insertAdjacentHTML("beforeend", '<meta name="shop-prefix-address" content="/@test-shop">');
    document.head.querySelector('link[rel="canonical"]')!.setAttribute("href", "https://primary.test/@test-shop/product/1-old");
    await router.push("/product/1");
    await router.push(path);
    seo.updateProduct(product, shop, seo.captureNavigation());

    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://primary.test/@test-shop/product/2-headphones");
  });

  it("keeps a vendor route separate from the shop canonical prefix", async () => {
    document.head.insertAdjacentHTML("beforeend", '<meta name="shop-prefix-address" content="">');
    document.head.querySelector('link[rel="canonical"]')!.setAttribute("href", "https://example.test/@vendor-7");
    await router.push("/@vendor-7");
    await router.push("/product/2");
    seo.updateProduct(product, shop, seo.captureNavigation());

    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://example.test/product/2-headphones");
  });

  it("preserves the primary canonical without a prefix when the local browser URL uses one", async () => {
    window.history.replaceState(null, "", "/@test-shop/product/1");
    document.head.insertAdjacentHTML("beforeend", '<meta name="shop-prefix-address" content="/@test-shop">');
    document.head.querySelector('link[rel="canonical"]')!.setAttribute("href", "https://primary.test/product/1-old");
    await enterProduct();
    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://primary.test/product/2-headphones");

    await router.push("/summer");
    seo.updatePage(page, shop, seo.captureNavigation());
    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href"))
      .toBe("https://primary.test/summer");
  });

  it("uses the backend blog slug/id canonical with its trailing slash", async () => {
    await router.push("/product/1");
    await router.push("/blog/old-slug-4?lang=en#article");
    seo.updateArticle(article, shop, seo.captureNavigation());
    const canonical = "https://example.test/blog/news-4/";

    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href")).toBe(canonical);
    expect(meta('meta[property="og:url"]')).toBe(canonical);
    expect(clientNodes().find((node) => node["@type"] === "BlogPosting")!.url).toBe(canonical);
  });

  it("uses vendor metadata and the first actual augment image when leaving a product", async () => {
    await enterProduct();
    await router.push("/@vendor-7");
    const vendorPage = {...page, image: "https://cdn.test/template.png"};
    seo.updatePage(vendorPage, shop, seo.captureNavigation(), {
      asset: {vendor: {name: "Music vendor", description: "Vendor description", icon: "https://cdn.test/vendor.png"}},
      augment: [
        {type: "text", value: "https://cdn.test/not-an-image.png"},
        {type: "image", value: ""},
        {type: "image", value: "https://cdn.test/first-cover.png"},
        {type: "image", value: "https://cdn.test/later-cover.png"},
      ],
    });

    expect(document.title).toBe("Music vendor");
    expect(meta('meta[name="description"]')).toBe("Vendor description");
    expect(meta('meta[property="og:image"]')).toBe("https://cdn.test/first-cover.png");
    expect(clientNodes().find((node) => node["@type"] === "WebPage")!.name).toBe("Music vendor");
    expect(clientNodes().some((node) => node["@type"] === "Product")).toBe(false);
  });

  it("uses include metadata while preserving the template image before the include image", async () => {
    await enterProduct();
    await router.push("/include/8");
    seo.updatePage({...page, image: "https://cdn.test/template.png"}, shop, seo.captureNavigation(), {
      asset: {include: {title: "Product bundle", description: "Bundle description", image: "https://cdn.test/bundle.png"}},
    });

    expect(document.title).toBe("Product bundle");
    expect(meta('meta[name="description"]')).toBe("Bundle description");
    expect(meta('meta[property="og:image"]')).toBe("https://cdn.test/template.png");
    expect(clientNodes().find((node) => node["@type"] === "WebPage")!.name).toBe("Product bundle");
    expect(clientNodes().some((node) => node["@type"] === "Product")).toBe(false);
  });

  it("falls back to page metadata and the resource image when the custom pack lacks overrides", async () => {
    await enterProduct();
    await router.push("/include/8");
    seo.updatePage(page, shop, seo.captureNavigation(), {
      asset: {include: {title: "", description: "", image: "https://cdn.test/bundle.png"}},
      augment: [{type: "image", value: ""}, {type: "image", value: 42}],
    });

    expect(document.title).toBe("Summer landing");
    expect(meta('meta[name="description"]')).toBe("Summer description");
    expect(meta('meta[property="og:image"]')).toBe("https://cdn.test/bundle.png");
    expect(clientNodes().some((node) => node["@type"] === "Product")).toBe(false);
  });

  it("publishes real article timestamps as ISO dates", async () => {
    const ticket = await enterProduct();
    seo.updateArticle({...article, created_at: "2026-10-01T12:30:00+04:00", updated_at: "2026-10-02T09:45:00Z"}, shop, ticket);
    const posting = clientNodes().find((node) => node["@type"] === "BlogPosting");

    expect(posting).toMatchObject({datePublished: "2026-10-01T08:30:00.000Z", dateModified: "2026-10-02T09:45:00.000Z"});
  });

  it.each([
    {created_at: undefined, updated_at: undefined},
    {created_at: "not-a-date", updated_at: "not-a-date"},
    {created_at: "", updated_at: null},
  ])("omits missing or invalid article timestamps %j", async (dates) => {
    const ticket = await enterProduct();
    seo.updateArticle({...article, created_at: "2026-10-01T12:30:00Z", updated_at: "2026-10-02T09:45:00Z"}, shop, ticket);
    seo.updateArticle({...article, ...dates}, shop, ticket);
    const posting = clientNodes().find((node) => node["@type"] === "BlogPosting");

    expect(posting).toBeDefined();
    expect(posting.datePublished).toBeUndefined();
    expect(posting.dateModified).toBeUndefined();
  });

  it.each(["javascript:blocked()", "data:text/plain,blocked", "https://user:password@example.test/image.png", "//user:password@example.test/image.png"])
    ("omits unsafe image %s before passing it to the CDN", async (image) => {
      const cdn = {GET_SHOP_IMAGE_PATH: vi.fn(() => "https://cdn.test/fake.png")};
      vi.stubGlobal("CDN", cdn);
      const ticket = await enterProduct();
      seo.updateProduct({...product, icon: image, images: [{path: image}]}, shop, ticket);

      expect(cdn.GET_SHOP_IMAGE_PATH).not.toHaveBeenCalled();
      expect(meta('meta[property="og:image"]')).toBeNull();
      expect(meta('meta[name="twitter:image"]')).toBeNull();
      expect(clientNodes().every((node) => node.image === undefined)).toBe(true);
    });

  it.each(["product", "blog"])("publishes real %s FAQs as plain text and removes them on exit", async (source) => {
    const ticket = await enterProduct();
    const faqs = [
      {question: "<b>Shipping?</b>", answer: "<p>Ships in <strong>two days</strong>.</p><script>blocked()</script>"},
      {question: " ", answer: "No question"},
      {question: "No answer", answer: "<p> </p>"},
    ];
    if (source === "product") {
      seo.updateProduct({...product, article_pack: {article: {...product.article_pack.article, faqs}}}, shop, ticket);
    } else {
      seo.updateArticle({...article, faqs}, shop, ticket);
    }
    const faq = clientNodes().find((node) => node["@type"] === "FAQPage");
    expect(faq?.mainEntity).toEqual([
      {"@type": "Question", name: "Shipping?", acceptedAnswer: {"@type": "Answer", text: "Ships in two days."}},
    ]);

    await router.push("/summer");
    seo.updatePage(page, shop, seo.captureNavigation());
    expect(clientNodes().some((node) => node["@type"] === "FAQPage")).toBe(false);
  });

  it("does not manufacture FAQ schema from missing or empty questions and answers", async () => {
    const ticket = await enterProduct();
    expect(clientNodes().some((node) => node["@type"] === "FAQPage")).toBe(false);
    seo.updateArticle({...article, faqs: [
      {question: "", answer: "Answer"}, {question: "Question", answer: "<script>blocked()</script>"},
    ]}, shop, ticket);
    expect(clientNodes().some((node) => node["@type"] === "FAQPage")).toBe(false);
  });

  it("replaces repeated and duplicate managed tags with one canonical and client graph", async () => {
    document.head.insertAdjacentHTML("beforeend", `
      <meta name="description" content="Duplicate description">
      <meta property="og:title" content="Duplicate title">
      <meta name="twitter:title" content="Duplicate title">
      <link rel="canonical" href="https://mirror.test/product/1">
    `);
    const navigation = await enterProduct();
    seo.updateProduct(product, shop, navigation);
    seo.updateProduct(product, shop, navigation);

    for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[name="twitter:title"]', 'link[rel="canonical"]']) {
      expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    }
    expect(document.head.querySelectorAll('script[data-storefront-seo="client"]')).toHaveLength(1);
    expect(document.head.querySelector('script[data-storefront-seo="client"]')!.getAttribute("type")).toBe("application/ld+json");
    expect(clientNodes().filter((node) => node["@type"] === "Product")).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')!.getAttribute("href")).toBe("https://example.test/product/2-headphones");
  });

  it.each([
    {name: "landing", path: "/pages/summer", update: (ticket: number) => seo.updatePage(page, shop, ticket), title: "Summer landing"},
    {name: "category", path: "/audio", update: (ticket: number) => seo.updateProducts({parent: category, products: [product]}, shop, ticket), title: "Audio category"},
    {name: "blog", path: "/blog/news-4", update: (ticket: number) => seo.updateArticle(article, shop, ticket), title: "News SEO title"},
    {name: "directory", path: "/listing/6", update: (ticket: number) => seo.updateListing(listing, shop, ticket), title: "Places directory"},
    {name: "directory item", path: "/listing/6/item/7", update: (ticket: number) => seo.updateListingItem(listingItem, shop, ticket), title: "Studio profile"},
  ])("clears old Product schema before loading a $name and publishes destination data", async ({path, update, title}) => {
    await enterProduct();
    await router.push(path);
    expect(clientNodes().some((node) => node["@type"] === "Product")).toBe(false);
    update(seo.captureNavigation());

    expect(document.title).toContain(title);
    expect(clientNodes().some((node) => node["@type"] === "Product")).toBe(false);
    expect(JSON.stringify(clientNodes())).not.toContain("Headphones description");
    expect(document.head.querySelectorAll('script[data-storefront-seo="client"]')).toHaveLength(1);
    expect(meta('meta[name="robots"]')).toBe("noindex, nofollow");
  });

  it("removes stale page nodes from unmarked server arrays and graphs while retaining site/custom data", async () => {
    document.head.insertAdjacentHTML("beforeend", `
      <script id="server-array" type="application/ld+json">${JSON.stringify([
        {"@type": "Organization", name: "Persistent organization"},
        {"@type": "Product", name: "Old array product"},
        {"@type": "CustomSchema", name: "Custom array data"},
      ])}</script>
      <script id="server-graph" type="application/ld+json">${JSON.stringify({"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", name: "Persistent site"},
        {"@type": "LocalBusiness", name: "Persistent business"},
        {"@type": "BreadcrumbList", name: "Old breadcrumbs"},
        {"@type": "Article", name: "Old article"},
        {"@type": "CustomSchema", name: "Custom graph data"},
      ]})}</script>
      <script id="server-invalid" type="application/ld+json">{invalid json</script>
    `);
    const invalid = document.head.querySelector("#server-invalid")!.outerHTML;
    await enterProduct();
    const serverNodes = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]:not([data-storefront-seo="client"]):not(#server-invalid)'))
      .flatMap((script) => schemaNodes(JSON.parse(script.textContent!)));

    expect(serverNodes.map((node) => node.name)).toEqual(expect.arrayContaining([
      "Persistent organization", "Persistent site", "Persistent business", "Custom array data", "Custom graph data",
    ]));
    expect(serverNodes.some((node) => ["Product", "BreadcrumbList", "Article"].includes(node["@type"]))).toBe(false);
    expect(document.head.querySelector("#server-invalid")!.outerHTML).toBe(invalid);
  });

  it("prunes an object-valued server graph while preserving an object-valued site graph", async () => {
    document.head.insertAdjacentHTML("beforeend", `
      <script id="object-page-graph" type="application/ld+json">${JSON.stringify({"@context": "https://schema.org", "@graph": {"@type": "Product", name: "Old object graph product"}})}</script>
      <script id="object-site-graph" type="application/ld+json">${JSON.stringify({"@context": "https://schema.org", "@graph": {"@type": "Organization", name: "Persistent object graph organization"}})}</script>
    `);
    const siteGraph = document.head.querySelector("#object-site-graph")!.outerHTML;
    await enterProduct();

    expect(document.head.querySelector("#object-page-graph")).toBeNull();
    expect(document.head.querySelector("#object-site-graph")!.outerHTML).toBe(siteGraph);
    expect(document.head.querySelector('script[data-storefront-seo="server"]')).toBeNull();
  });
});

describe("Storefront Product offer accuracy", () => {
  it("uses native currency and shared price calculation including commission and active discount", async () => {
    await enterProduct();
    expect(productNode().offers).toMatchObject({priceCurrency: "USD", price: 75});
    expect(productNode().aggregateRating).toBeUndefined();
  });

  it("excludes an expired discount from the offer price", async () => {
    const ticket = await enterProduct();
    seo.updateProduct({...product, dis_end: "2001-01-01 00:00:00"}, shop, ticket);
    expect(productNode().offers).toMatchObject({priceCurrency: "USD", price: 85});
  });

  it.each([
    {name: "variant dimensions", patch: {variants: [{name: "Color"}]}},
    {name: "loaded variant rows", patch: {product_variants: [{id: 1, price: 90}]}},
    {name: "valuation id", patch: {valuation_id: 9}},
    {name: "valuation object", patch: {valuation: {id: 9}}},
    {name: "subscription", patch: {type: "SUBSCRIPTION"}},
    {name: "estimated pricing", patch: {pricing: "ESTIMATION"}},
    {name: "agreed pricing", patch: {pricing: "AGREEMENT"}},
    {name: "missing pricing", patch: {pricing: undefined}},
    {name: "missing currency", patch: {currency: undefined}},
    {name: "missing price", patch: {price: undefined}},
    {name: "invalid price", patch: {price: Number.NaN}},
  ])("does not invent a concrete offer for $name", async ({patch}) => {
    const ticket = await enterProduct();
    seo.updateProduct({...product, ...patch}, shop, ticket);
    expect(productNode().offers).toBeUndefined();
  });

  it.each([
    {rate: undefined, rate_count: undefined},
    {rate: 4.5, rate_count: undefined},
    {rate: 0, rate_count: 4},
    {rate: 6, rate_count: 4},
    {rate: 4.5, rate_count: 0},
  ])("omits incomplete or invalid aggregate ratings %j", async (rating) => {
    const ticket = await enterProduct();
    seo.updateProduct({...product, ...rating}, shop, ticket);
    expect(productNode().aggregateRating).toBeUndefined();
  });
});
