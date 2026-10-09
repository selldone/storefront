import {
  START_LOCATION,
  type NavigationFailure,
  type RouteLocationNormalized,
} from "vue-router";
import { Currency } from "@selldone/core-js/enums/payment/Currency";
import { PriceHelper } from "@selldone/core-js/helper/price/PriceHelper";
import type { Shop } from "@selldone/core-js/models/shop/shop.model";
import type { Product } from "@selldone/core-js/models/shop/product/product.model";
import type { Article } from "@selldone/core-js/models/article/article.model";
import type { Category } from "@selldone/core-js/models/shop/category/category.model";

type JsonLd = Record<string, unknown>;
type Content = {
  title?: string | null;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
};
type SeoProduct = Partial<Product> & {
  article_pack?: { article?: Partial<Article> | null } | null;
  valuation?: unknown;
};
type SeoPage = {
  title: string;
  sharingTitle?: string;
  description?: string | null;
  images?: (string | null | undefined)[];
  url: string;
  type?: string;
  graph: JsonLd[];
};

/** Storefront-only head ownership. Ticket zero can never write, even if its data arrives later. */
export class StorefrontSeo {
  private static navigation = 0;
  private static path = "/";
  private static canonicalBase = "";
  private static canonicalPrefix = "";
  private static page: SeoPage | null = null;

  static onNavigation(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    failure?: NavigationFailure | void,
  ): boolean {
    // Read the server's primary domain/prefix without touching the initial head.
    if (!this.canonicalBase) {
      const canonical = this.httpUrl(
        document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
          ?.href,
      );
      if (canonical) {
        const url = new URL(canonical);
        const prefix =
          document.head.querySelector<HTMLMetaElement>(
            'meta[name="shop-prefix-address"]',
          )?.content || "";
        // /@vendor-id is a real page, not a shop prefix. Only trust the explicit
        // prefix when the server canonical actually uses it (local storefronts).
        this.canonicalPrefix =
          prefix &&
          (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))
            ? prefix
            : "";
        this.canonicalBase = url.origin + this.canonicalPrefix;
      }
    }
    if (failure || from === START_LOCATION || to.path === from.path)
      return false;
    // Query/hash normalization and product selections belong to the same document.
    this.path = to.path;
    this.navigation += 1;
    this.page = null;
    this.clearPageSchemas();
    return true;
  }

  static captureNavigation(): number {
    return this.navigation;
  }

  static canUpdate(navigation = this.navigation): boolean {
    return navigation > 0 && navigation === this.navigation;
  }

  static updateRoute(
    shop: Partial<Shop> | null,
    title?: string,
    params: Record<string, unknown> = {},
  ): void {
    if (!this.canUpdate()) return;
    const routeTitle = (title || "").replace(/\{([^}]+)\}/g, (_, key) => {
      const value = params[key];
      if (typeof value !== "string") return "";
      const text = value.replace(/-/g, " ");
      return text.charAt(0).toUpperCase() + text.slice(1);
    });
    const url = this.canonical(shop);
    const name = routeTitle || shop?.title || "";
    this.apply({
      title: name,
      description: shop?.description,
      images: [shop?.icon],
      url,
      graph: [this.webPage("WebPage", name, shop?.description, url)],
    });
  }

  static setTitle(title: string, navigation = this.navigation): void {
    if (!this.canUpdate(navigation)) return;
    document.title = this.text(title);
    this.meta("property", "og:title", this.text(title));
    this.meta("name", "twitter:title", this.text(title));
    if (this.page) {
      this.page.title = title;
      this.page.sharingTitle = title;
      this.page.graph[0].name = this.text(title);
      this.writeSchema(this.page.graph);
    }
  }

  static updateProduct(
    product: SeoProduct,
    shop: Partial<Shop>,
    navigation: number,
    currency = product.currency,
  ): void {
    if (!this.canUpdate(navigation) || !product?.title) return;
    const article = product.article_pack?.article;
    const url = this.productUrl(product, shop);
    const description = article?.description || shop.description;
    const images = [
      product.icon,
      ...(product.images || []).map((image) => image.path),
    ];
    const schema: JsonLd = {
      "@type": "Product",
      "@id": `${url}#product`,
      url,
      name: this.text(product.title),
    };
    this.optional(schema, "description", this.text(article?.description));
    this.optional(schema, "image", this.images(images));
    for (const key of ["sku", "mpn", "gtin"] as const)
      this.optional(schema, key, product[key]);
    if (product.brand)
      schema.brand = { "@type": "Brand", name: this.text(product.brand) };
    if (
      Number.isFinite(product.rate) &&
      product.rate! > 0 &&
      product.rate! <= 5 &&
      Number.isInteger(product.rate_count) &&
      product.rate_count! > 0
    ) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.rate,
        ratingCount: product.rate_count,
      };
    }
    const offer = this.productOffer(product, shop, url, currency);
    if (offer) schema.offers = offer;
    const graph = [
      this.webPage("WebPage", product.title, description, url),
      schema,
    ];
    graph[0].mainEntity = { "@id": `${url}#product` };
    this.addBreadcrumb(graph, shop, [
      ...this.categoryCrumbs(product.category, shop),
      { name: product.title, url },
    ]);
    this.addFaq(graph, article?.faqs);
    this.apply(
      {
        title: article?.page_title || this.shopTitle(shop, product.title),
        sharingTitle: product.title,
        description,
        images,
        url,
        type: "product",
        graph,
      },
      navigation,
    );
  }

  static updateProducts(
    data: { parent?: Partial<Category> | null; products?: SeoProduct[] },
    shop: Partial<Shop>,
    navigation: number,
  ): void {
    if (!this.canUpdate(navigation)) return;
    const category = data.parent;
    const name = category?.title || shop.title || "";
    const description = category?.description || shop.description;
    const url = this.canonical(shop);
    const collection = this.webPage("CollectionPage", name, description, url);
    collection.mainEntity = {
      "@type": "ItemList",
      itemListElement: (data.products || [])
        .filter((product) => product.id && product.title)
        .map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: this.text(product.title),
          url: this.productUrl(product, shop),
        })),
    };
    const graph = [collection];
    if (category?.title)
      this.addBreadcrumb(graph, shop, this.categoryCrumbs(category, shop));
    this.apply(
      {
        title: this.shopTitle(shop, category?.title),
        sharingTitle: name,
        description,
        images: [category?.icon || shop.icon],
        url,
        graph,
      },
      navigation,
    );
  }

  static updatePage(
    page: Content,
    shop: Partial<Shop>,
    navigation: number,
    data?: {
      asset?: { vendor?: Content; include?: Content };
      augment?: { type?: string; value?: unknown }[];
    },
  ): void {
    if (!this.canUpdate(navigation) || !page) return;
    const resource = data?.asset?.vendor || data?.asset?.include;
    const name =
      resource?.title || resource?.name || page.title || shop.title || "";
    const description =
      resource?.description || page.description || shop.description;
    const augmentImage = data?.augment?.find(
      (item) =>
        item.type === "image" && typeof item.value === "string" && item.value,
    )?.value;
    const url = this.canonical(shop);
    const graph = [this.webPage("WebPage", name, description, url)];
    if (url !== this.canonical(shop, "/"))
      this.addBreadcrumb(graph, shop, [{ name, url }]);
    this.apply(
      {
        title: name,
        description,
        images: [
          typeof augmentImage === "string"
            ? augmentImage
            : page.image || resource?.image || resource?.icon || shop.icon,
        ],
        url,
        graph,
      },
      navigation,
    );
  }

  static updateArticle(
    article: Partial<Article>,
    shop: Partial<Shop>,
    navigation: number,
  ): void {
    if (!this.canUpdate(navigation) || !article?.title) return;
    const url =
      article.slug && article.parent_id
        ? this.canonical(
            shop,
            `/blog/${encodeURIComponent(article.slug)}-${article.parent_id}/`,
          )
        : this.canonical(shop);
    const description = article.description || shop.description;
    const posting: JsonLd = {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      url,
      headline: this.text(article.title),
      mainEntityOfPage: { "@id": `${url}#webpage` },
    };
    this.optional(posting, "description", this.text(article.description));
    this.optional(posting, "image", this.images([article.image]));
    this.optional(posting, "datePublished", this.date(article.created_at));
    this.optional(posting, "dateModified", this.date(article.updated_at));
    this.optional(posting, "inLanguage", article.lang);
    if (article.user?.name)
      posting.author = {
        "@type": "Person",
        name: this.text(article.user.name),
      };
    if (shop.title) {
      posting.publisher = {
        "@type": "Organization",
        name: this.text(shop.title),
      };
      const logo = this.images([shop.icon])[0];
      if (logo)
        (posting.publisher as JsonLd).logo = {
          "@type": "ImageObject",
          url: logo,
        };
    }
    const graph = [
      this.webPage("WebPage", article.title, description, url),
      posting,
    ];
    graph[0].mainEntity = { "@id": `${url}#article` };
    this.addBreadcrumb(graph, shop, [{ name: article.title, url }]);
    this.addFaq(graph, article.faqs);
    this.apply(
      {
        title: article.page_title || this.shopTitle(shop, article.title),
        sharingTitle: article.title,
        description,
        images: [article.image || shop.icon],
        url,
        type: "article",
        graph,
      },
      navigation,
    );
  }

  static updateListing(
    listing: Content | null,
    shop: Partial<Shop>,
    navigation: number,
    category?: Content | null,
  ): void {
    if (!this.canUpdate(navigation)) return;
    const name =
      category?.title || category?.name || listing?.title || shop.title || "";
    const description =
      category?.description || listing?.description || shop.description;
    const url = this.canonical(shop);
    const graph = [this.webPage("CollectionPage", name, description, url)];
    this.addBreadcrumb(graph, shop, [{ name, url }]);
    this.apply(
      {
        title: this.shopTitle(shop, name),
        sharingTitle: name,
        description,
        images: [
          category?.image || category?.icon || listing?.image || shop.icon,
        ],
        url,
        graph,
      },
      navigation,
    );
  }

  static updateListingItem(
    item: Content & {
      media?: {
        type?: string;
        url?: string;
        path?: string;
        is_main?: boolean;
      }[];
    },
    shop: Partial<Shop>,
    navigation: number,
  ): void {
    if (!this.canUpdate(navigation) || !item?.title) return;
    const url = this.canonical(shop);
    const graph = [this.webPage("WebPage", item.title, item.description, url)];
    this.addBreadcrumb(graph, shop, [{ name: item.title, url }]);
    const media = [...(item.media || [])]
      .filter((image) => image.type === "image")
      .sort((a, b) => Number(!!b.is_main) - Number(!!a.is_main));
    // A directory item may be a person, service or place; do not invent a Product type.
    this.apply(
      {
        title: this.shopTitle(shop, item.title),
        sharingTitle: item.title,
        description: item.description || shop.description,
        images: media.length
          ? media.map((image) => image.url || image.path)
          : [item.image || shop.icon],
        url,
        graph,
      },
      navigation,
    );
  }

  private static apply(page: SeoPage, navigation = this.navigation): void {
    if (!this.canUpdate(navigation)) return;
    this.page = page;
    document.title = this.text(page.title);
    this.meta("name", "description", this.text(page.description));
    this.meta(
      "property",
      "og:title",
      this.text(page.sharingTitle || page.title),
    );
    this.meta("property", "og:description", this.text(page.description));
    this.meta("property", "og:url", page.url);
    this.meta("property", "og:type", page.type || "website");
    this.meta(
      "name",
      "twitter:title",
      this.text(page.sharingTitle || page.title),
    );
    this.meta("name", "twitter:description", this.text(page.description));
    const images = this.images(page.images || []);
    this.meta("property", "og:image", images[0] || "");
    this.meta("name", "twitter:image", images[0] || "");
    this.meta(
      "name",
      "twitter:card",
      images.length ? "summary_large_image" : "summary",
    );
    // Clear page-specific auxiliary tags; leave robots, site ownership and SDK configuration intact.
    document.head
      .querySelectorAll<HTMLMetaElement>("meta[property], meta[name]")
      .forEach((meta) => {
        const key =
          meta.getAttribute("property") || meta.getAttribute("name") || "";
        if (
          /^(article:|product:|og:image:|twitter:(label|data)\d|twitter:image:)/i.test(
            key,
          )
        )
          meta.remove();
      });
    document.head
      .querySelectorAll('meta[name="keywords"], link[rel="amphtml"]')
      .forEach((node) => node.remove());
    const canonicals = [
      ...document.head.querySelectorAll<HTMLLinkElement>(
        'link[rel="canonical"]',
      ),
    ];
    const canonical = canonicals.shift() || document.createElement("link");
    canonicals.forEach((node) => node.remove());
    canonical.rel = "canonical";
    canonical.href = page.url;
    if (!canonical.isConnected) document.head.append(canonical);
    if (images.length) page.graph[0].image = images;
    this.writeSchema(page.graph);
  }

  private static meta(
    attribute: "name" | "property",
    key: string,
    value: string,
  ): void {
    const nodes = [
      ...document.head.querySelectorAll<HTMLMetaElement>(
        `meta[name="${key}"], meta[property="${key}"]`,
      ),
    ];
    const node = nodes.shift() || document.createElement("meta");
    nodes.forEach((node) => node.remove());
    if (!value) {
      node.remove();
      return;
    }
    node.removeAttribute(attribute === "name" ? "property" : "name");
    node.setAttribute(attribute, key);
    node.content = value;
    if (!node.isConnected) document.head.append(node);
  }

  private static writeSchema(graph: JsonLd[]): void {
    let script = document.head.querySelector<HTMLScriptElement>(
      'script[data-storefront-seo="client"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.storefrontSeo = "client";
      document.head.append(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    }).replace(/</g, "\\u003c");
  }

  private static clearPageSchemas(): void {
    document
      .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
      .forEach((script) => {
        if (script.dataset.storefrontSeo) {
          script.remove();
          return;
        }
        // Compatibility with cached server HTML and merchant graphs: preserve site/unknown nodes.
        try {
          const original = JSON.parse(script.textContent || "");
          const remaining = this.prunePageSchema(original);
          if (remaining === null) script.remove();
          else if (JSON.stringify(original) !== JSON.stringify(remaining))
            script.textContent = JSON.stringify(remaining).replace(
              /</g,
              "\\u003c",
            );
        } catch {
          /* Unrelated/malformed merchant scripts are outside our ownership. */
        }
      });
  }

  private static prunePageSchema(value: unknown): unknown {
    if (Array.isArray(value)) {
      const nodes = value
        .map((node) => this.prunePageSchema(node))
        .filter((node) => node !== null);
      return nodes.length ? nodes : null;
    }
    if (!value || typeof value !== "object") return value;
    const node = value as JsonLd;
    const types = [node["@type"]]
      .flat()
      .filter((type) => typeof type === "string")
      .map((type) => (type as string).replace(/^https?:\/\/schema.org\//, ""));
    const site = types.some((type) =>
      ["Organization", "LocalBusiness", "WebSite"].includes(type),
    );
    if (
      !site &&
      types.some((type) =>
        [
          "WebPage",
          "ItemPage",
          "CollectionPage",
          "Product",
          "ProductGroup",
          "Offer",
          "AggregateOffer",
          "Article",
          "BlogPosting",
          "NewsArticle",
          "BreadcrumbList",
          "FAQPage",
          "ItemList",
        ].includes(type),
      )
    )
      return null;
    if (node["@graph"] && typeof node["@graph"] === "object") {
      const graph = this.prunePageSchema(node["@graph"]);
      if (graph === null)
        return types.length ? { ...node, "@graph": [] } : null;
      return { ...node, "@graph": graph };
    }
    return value;
  }

  private static canonical(
    shop?: Partial<Shop> | null,
    path = this.path,
  ): string {
    const base =
      this.canonicalBase ||
      this.httpUrl(shop?.domain) ||
      `${window.location.origin}${document.head.querySelector<HTMLMetaElement>('meta[name="shop-prefix-address"]')?.content || ""}`;
    if (
      this.canonicalPrefix &&
      (path === this.canonicalPrefix ||
        path.startsWith(`${this.canonicalPrefix}/`))
    ) {
      path = path.slice(this.canonicalPrefix.length);
    }
    return `${base.replace(/\/$/, "")}/${path.replace(/^\/+/, "").split(/[?#]/)[0]}`;
  }

  private static productUrl(product: SeoProduct, shop: Partial<Shop>): string {
    return product.id
      ? this.canonical(
          shop,
          `/product/${product.id}${product.slug ? `-${encodeURIComponent(product.slug)}` : ""}`,
        )
      : this.canonical(shop);
  }

  private static httpUrl(
    value: unknown,
    base = window.location.origin,
  ): string {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, base);
      return ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password
        ? url.href
        : "";
    } catch {
      return "";
    }
  }

  private static images(values: (string | null | undefined)[]): string[] {
    return [
      ...new Set(
        values
          .filter((value) => typeof value === "string" && value.trim())
          .map((value) => {
            const path = value!;
            if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("//"))
              return this.httpUrl(path);
            // Reuse the storefront's configured public CDN; never fabricate a placeholder.
            return this.httpUrl(
              window.CDN
                ? window.CDN.GET_SHOP_IMAGE_PATH(path)
                : path.startsWith("/")
                  ? path
                  : "",
            );
          })
          .filter(Boolean),
      ),
    ];
  }

  private static text(value: unknown): string {
    if (typeof value !== "string") return "";
    // Detached template parses text only; it neither executes HTML nor loads images.
    const template = document.createElement("template");
    template.innerHTML = value;
    template.content
      .querySelectorAll("script, style")
      .forEach((node) => node.remove());
    return (template.content.textContent || "").replace(/\s+/g, " ").trim();
  }

  private static shopTitle(shop: Partial<Shop>, title?: string | null): string {
    return title && title !== shop.title
      ? [shop.title, title].filter(Boolean).join(" | ")
      : shop.title || title || "";
  }

  private static optional(node: JsonLd, key: string, value: unknown): void {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length)
    )
      node[key] = value;
  }

  private static webPage(
    type: string,
    name: string,
    description: string | null | undefined,
    url: string,
  ): JsonLd {
    const page: JsonLd = {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: this.text(name),
    };
    this.optional(page, "description", this.text(description));
    return page;
  }

  private static categoryCrumbs(
    category: Partial<Category> | null | undefined,
    shop: Partial<Shop>,
  ): { name: string; url: string }[] {
    const crumbs: { name: string; url: string }[] = [];
    const seen = new Set();
    for (
      let current = category;
      current && !seen.has(current);
      current = current.parent
    ) {
      seen.add(current);
      if (current.title && current.name)
        crumbs.unshift({
          name: current.title,
          url: this.canonical(
            shop,
            `/${encodeURIComponent(current.name)}-category`,
          ),
        });
    }
    return crumbs;
  }

  private static addBreadcrumb(
    graph: JsonLd[],
    shop: Partial<Shop>,
    crumbs: { name: string; url: string }[],
  ): void {
    const items = [
      { name: shop.title || shop.name || "", url: this.canonical(shop, "/") },
      ...crumbs,
    ].filter((item) => item.name && item.url);
    if (items.length < 2) return;
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: this.text(item.name),
        item: item.url,
      })),
    });
  }

  private static date(value: unknown): string {
    if (!(value instanceof Date) && (typeof value !== "string" || !value))
      return "";
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : "";
  }

  private static addFaq(graph: JsonLd[], faqs?: Article.Faq[] | null): void {
    const questions = (faqs || [])
      .map((faq) => ({
        question: this.text(faq.question),
        answer: this.text(faq.answer),
      }))
      .filter((faq) => faq.question && faq.answer);
    if (!questions.length) return;
    graph.push({
      "@type": "FAQPage",
      mainEntity: questions.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  private static productOffer(
    product: SeoProduct,
    shop: Partial<Shop>,
    url: string,
    code: keyof typeof Currency | undefined,
  ): JsonLd | null {
    if (
      !code ||
      !Currency[code] ||
      Currency[code].blockchain ||
      !product.currency ||
      !Currency[product.currency] ||
      product.pricing !== "FIX" ||
      product.type === "SUBSCRIPTION" ||
      product.valuation ||
      product.valuation_id ||
      shop.marketplace ||
      product.variants?.length ||
      product.product_variants?.length ||
      product.extra_pricings?.length ||
      (product.price_input && product.price_input !== "default") ||
      typeof product.price !== "number" ||
      !Number.isFinite(product.price) ||
      product.price < 0
    )
      return null;
    try {
      // Same calculation as the price UI, including commission, active discount and selected currency.
      const price = PriceHelper.priceProductByCurrency(
        shop as Shop,
        product as Product,
        null,
        code,
      );
      if (!Number.isFinite(price) || price < 0) return null;
      const offer: JsonLd = {
        "@type": "Offer",
        url,
        price,
        priceCurrency: code,
      };
      if (product.type === "FILE")
        offer.availability = "https://schema.org/InStock";
      else if (
        typeof product.quantity === "number" &&
        Number.isFinite(product.quantity)
      ) {
        offer.availability = `https://schema.org/${product.quantity > 0 ? "InStock" : "OutOfStock"}`;
      }
      return offer;
    } catch {
      return null;
    }
  }
}
