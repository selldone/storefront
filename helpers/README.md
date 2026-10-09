# Storefront dynamic SEO

`StorefrontSeo.ts` owns client-side titles, descriptions, canonical links,
Open Graph, Twitter metadata and JSON-LD for the storefront only.

Initial router resolution, redirects, refreshes and query/hash normalization
perform **no head writes**. The server remains authoritative until a successful
navigation to a different path. Each such navigation clears the previous page's
schema and applies shop defaults, then the destination's data replaces those
defaults. Same-path filters/selections keep the document's canonical identity.

Async requests capture `captureNavigation()` before dispatch. Page callbacks
pass that ticket to `updateProduct`, `updateProducts`, `updatePage`,
`updateArticle`, `updateListing` or `updateListingItem`. Ticket zero and
superseded tickets cannot update the head. Route wrappers key data-loading
children and retain an owner ticket to reject events from the previous page.
Shop-wide listing configuration combines with the current mounted owner's
category and ticket, so a delayed configuration response still fills current
fallbacks without enabling initial-load writes.

Server JSON-LD scripts are marked `data-storefront-seo="server"`; the client
maintains one `data-storefront-seo="client"` graph. Compatibility cleanup handles
unmarked page objects, arrays and mixed graphs from cached HTML, while retaining
site/organization nodes and malformed or unknown third-party schemas. Existing
robots restrictions and SDK/configuration metadata are preserved.

Product schema uses actual product identity and genuine ratings. Offers reuse
the existing price calculation only for fixed, simple products with a known
price/currency; unresolved variants, marketplace, subscriptions, valuations and
quantity tiers omit offers. No invented review, rating or expiry is added.
Collections describe loaded products; articles use actual dates and author data.
Canonical URLs retain the primary domain and local shop prefix supplied by SSR.

Integration files changed for this feature:

- Storefront: `helpers/StorefrontSeo.ts`, `helpers/StorefrontSeo.test.ts`,
  `helpers/README.md`, `router/StorefrontRouter.ts`,
  `pages/product/StorefrontPageProduct.vue`, `pages/products/StorefrontPageProducts.vue`,
  `pages/landing/StorefrontPageLanding.vue`, `pages/blog/view/StorefrontPageBlogsView.vue`,
  `pages/listing/StorefrontPageListing.vue`, `pages/listing/item/StorefrontPageListingItem.vue`.
- Shared data events in `@selldone/components-vue`:
  `storefront/products/listing/SProductsListing.vue`,
  `storefront/listing/categories/SStorefrontListingCategories.vue`,
  `storefront/listing/item/SStorefrontListingItemProfile.vue`.
- Backend public page description/image projections:
  `app/Storefront/Pages/Page.php`,
  `app/Http/Controllers/Shop/PageBuilder/PageBuilderRenderController.php`,
  `app/Http/Controllers/Shop/Marketplace/ShopPublicVendorsController.php`,
  `app/Http/Controllers/Shop/PageBuilder/IncludeItems/PageBuilderIncludeItemController.php`,
  `app/Http/Controllers/Shop/PageBuilder/IncludeItems/PageBuilderRenderIncludeItemController.php`,
  `app/Http/Controllers/Shop/PageBuilder/Vendor/PageBuilderRenderVendorController.php`.
- Backend schema ownership markup: `resources/views/seo-render/shop/shop-head.blade.php`.

Focused verification (with a writable local `TEMP`/`TMP` directory):

```text
node ./node_modules/vitest/vitest.mjs run src/Applications/Storefront/helpers/StorefrontSeo.test.ts --config @selldone/sdk-storefront/vitest.config.ts
```

Standards: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[Product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet),
[JSON-LD embedding](https://www.w3.org/TR/json-ld11/#embedding-json-ld-in-html-documents).
