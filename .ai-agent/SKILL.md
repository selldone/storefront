---
name: storefront-builder
description: >-
  Customize the official Selldone Vue 3 Storefront into a business-specific
  web app that can be published as a Selldone Layout. Use when an AI agent must
  discover a merchant's business goals, audience, brand, content, page scope,
  and design references; translate that brief into any visual direction within
  the existing Storefront architecture; preserve the complete Selldone
  commerce behavior; and optionally build, validate, package, deploy, and
  verify the Layout through the documented release workflow.
---

# Selldone Storefront Builder Skill

Use the official Vue 3/Vite Storefront in this repository as the working
product baseline. This is a general, design-agnostic customization skill, not
a fixed theme and not a prompt to rebuild the commerce application from
scratch. The merchant may request any visual style, information architecture,
or brand expression, but the implementation must adapt the existing routes,
state, SDK integrations, components, and commerce flows. A framework migration
or parallel storefront is outside this skill's default scope and must be
handled as a separate explicit project with equivalent contract validation.

## Repository operations and deployment

When the task involves cloning the official base, creating a GitHub repository,
synchronizing Selldone updates, building a Layout artifact, authenticating, or
deploying, read and follow `AGENTS.md` and `AI_WORKFLOW.md` completely. Those
files define the Git authority model, interactive approvals, secret handling,
manifest identity rules, artifact contract, and required post-deploy checks.
Never invent an OAuth scope or client; authentication belongs to the official
Selldone CLI `/developers/login` flow.

A design or implementation task may stop after planning, coding, preview, or a
local build. Do not package, authenticate, deploy, or publish merely because
this skill was invoked; those actions must be explicitly requested.

## Core rule

Preserve and adapt the complete standard Storefront; do not reduce it to a
landing page, replacement shell, or collection of display-only mocks. A custom
visual design may change composition, navigation, styling, content hierarchy,
and interaction patterns, but it must not break or bypass the existing
Selldone data, authentication, catalog, basket, checkout, payment, account,
localization, SEO, or feature-flag contracts.

Do not remove a feature because it is inconvenient for the selected design.
Hide inactive features based on shop data, permissions, route metadata,
product type, gateway support, country, language, currency, or store options.

## Business and design intake

Before visual changes, inspect the repository and current storefront behavior,
then collect only material information not already supplied. Cover:

- Business: store name, industry, catalog and product types, value proposition,
  goals, and primary conversion actions.
- Audience: customer segments, markets, languages, currencies, devices, and
  accessibility or regional requirements.
- Brand: logo and assets, colors, typography, tone, imagery direction, brand
  rules, and anything that must not change.
- Experience scope: priority pages and routes, navigation, homepage sections,
  content hierarchy, required features, integrations, and out-of-scope areas.
- Design direction: reference URLs, screenshots, design files, moodboards, and
  specific likes or dislikes about each reference.
- Content and data: approved copy and media, live shop data, and whether
  reversible placeholders are acceptable for missing material.
- Delivery: target devices, preview or test shop, release scope, and whether the
  request ends at design, implementation, local build, or published Layout.

Do not ask again for facts already present in the request, repository, or
provided assets. Do not invent business claims, brand assets, or legal copy.
When optional information is missing, state a reasonable, reversible assumption.
Ask a compact grouped question only when an ambiguity would materially change
the result.

Summarize the intake as a short implementation brief containing the business
objective, audience, visual direction, page map, design tokens, reusable
components, preserved commerce flows, content dependencies, acceptance
criteria, and explicit assumptions.

## Customization boundaries

1. Inspect the existing Vue 3/Vite app, routes, stores, SDK integrations,
   layouts, components, and current build behavior before editing.
2. Map the approved business and design brief onto existing pages and
   components; replace presentation where needed without duplicating commerce
   state or backend logic.
3. Reuse the current router, state architecture, official SDKs, platform
   components, live shop data, and feature flags.
4. Keep checkout, payment, authentication, basket, and account behavior
   independent from purely visual components and styling changes.
5. Preserve SEO-safe public URLs for products, categories, blog posts, vendor
   pages, listings, and order links.

## Preserve the required platform bootstrap

Inspect and retain the existing environment and hosting configuration reads:

- `shop-name`
- `shop-prefix-address`
- `custom-home`
- `service-url`
- Selldone API origins such as gapi/xapi/iframe/community endpoints
- CDN origins for images, videos, JSON, storage, and thumbnails
- storage redirect flags
- default currency
- default country
- default language
- local service country
- theme colors: light, dark, deep dark, info, buy button
- PWA and service worker settings

Preserve initialization of:

- Existing official Storefront SDK integrations and request adapters
- Existing official Community SDK integration
- i18n and language packs
- global shop state
- router
- user and guest identity
- service worker and PWA update handling
- app shell, notification layer, modal layer, payment layer, map dialog, full-screen image viewer

Preserve the storefront loaded event so external hosting scripts can hide preloaders.

## Global state contract

Keep these state domains available in the app architecture:

- `shop`
- `busy_shop`
- `user`
- `busy_user`
- `permissions`
- `pending_transactions`
- `initial_location`
- `user_currency`
- `basket_physical`
- `basket_virtual`
- `basket_file`
- `basket_service`
- `basket_subscription`
- `gifts`
- `club`
- `orders_state`
- `coupons`
- `offers`
- `lottery_prizes`
- `products_comparison`
- `channel_entry`
- `community_config`
- `bottom_nav_show`
- `show_filter_menu`
- `force_hide_navigation`
- `current_selected_variant`
- `shop_main_banner`
- `globalStyle.header_color`
- `globalStyle.header_filter`
- `globalStyle.header_mode`
- `globalStyle.dark_header`
- `globalStyle.transparent_header`
- `globalStyle.search_mode`

Keep the current project state architecture and responsibilities. Refactor it
only when the approved customization requires a verified architectural change;
do not introduce a parallel store for data already managed by the app.

## Existing SDK and data contract

Preserve or extend the current SDK/API methods for these capabilities:

- Fetch shop, settings, theme, languages, currencies, exchange rates, banners, popups, social links, policies, pages, and feature flags.
- Fetch current user, permissions, customer profile, club status, addresses, wallets, gift cards, comments, wishlist, returns, and order counts.
- Handle guest customer code and authenticated access token.
- Add, update, and delete basket items.
- Fetch and recalculate basket bills.
- Fetch coupons, offers, and lottery prizes for the selected currency and user.
- Set user-selected currency.
- Fetch products, categories, vendors, variants, vendor products, subscriptions, product articles, product layouts, reviews, comments, cross-sells, upsells, suggestions, and inventory.
- Search products.
- Filter and sort products.
- Fetch listing categories, listing items, listing item profiles, and listing comparisons.
- Fetch map products and map vendors.
- Create and update checkout orders by product type.
- Fetch shipping options, pickup options, delivery prices, taxes, COD eligibility, gateway eligibility, and checkout validation errors.
- Create, retrieve, reset, retry, and complete payments.
- Fetch order details for physical, virtual, file, service, subscription, POS, avocado, hyper, and bill orders.
- Fetch blog lists, blog posts, author/team pages, FAQ, terms, privacy, about, contact, and custom pages.
- Fetch and mutate community categories, topics, feed, and user comments.
- Fetch language override packs and apply them over default translations.
- Register FCM or push notification token where supported.
- Logout and clear auth-dependent state.

Preserve the official SDK integrations already used by this app. Extend their
existing abstractions when required instead of duplicating endpoints or leaking
transport details into visual components.

## Identity and access

Support both guest and authenticated shoppers:

- Use guest code for guest baskets and checkout.
- Store access token in the correct cookie scope for the shop prefix.
- Set the authorization header after login.
- Fetch user after token changes.
- Support direct OAuth login, popup login where safe, social login parameters, registration redirects, and callback route handling for shopper authentication only; this does not override the CLI-only Layout authentication rule above.
- Save the pre-login path and return the user after successful login.
- Clear token, pending transactions, baskets, gifts, and user state on logout.
- Respect private or restricted shops. If the shop is private and the customer has no access, show an access check view instead of storefront content.
- Respect `requiresAuth` route metadata unless guest checkout is enabled.
- Support native app login query flows and native app identity bridge when applicable.

## Localization, currency, and region

Implement:

- Default language from server or meta.
- Saved customer language from local storage.
- Shop-supported language validation.
- Async loading of language packs.
- Shop-specific translation overrides.
- RTL/LTR switching.
- `X-Localization` or equivalent header for localized content.
- Refetch shop and baskets when language changes if translated objects can change.
- Default currency from meta/shop.
- Customer-selected currency persisted per shop.
- Currency validation against shop currencies.
- Currency update on server for guest/user where supported.
- Coupon and offer refetch after currency changes.
- Auto exchange-rate refresh if shop has auto exchange rates.
- Country, location, tax, shipping, and payment behavior tied to selected/initial region.

## Route contract

Preserve these public route behaviors or provide redirects:

| Feature | URL pattern |
| --- | --- |
| Custom home | `/` resolves by `custom-home`: landing page, shop, blog, avocado, hyper, community, or map |
| Login | `/welcome` |
| Shop catalog | `/shop` |
| Category catalog | `/:category_name-category` |
| Vendor catalog | `/@:slug-:vendor_id` |
| Vendor landing | `/vendor/@:slug-:vendor_id` |
| Custom page | `/pages/:page_name` |
| Include page/profile | `/in/:path-:include_id` |
| Product | `/product/:product_id` |
| Product comparison | `/comparison` |
| Mobile shop info | `/info` |
| Basket | `/basket/:type` |
| Login callback | `/selldone-callback` |
| Blog list | `/blog` |
| Blog author/team | `/team/:author-:author_id` |
| Blog post | `/blog/:slug-:blog_id` and `/blog/:blog_id` |
| About | `/about-us` |
| Terms | `/terms` |
| Privacy | `/privacy` |
| Contact | `/contact-us` |
| FAQ | `/faq/:tag?` |
| Physical order detail | `/orders/physical/SM-:basket_id` |
| Virtual order detail | `/orders/virtual/SV-:basket_id` |
| File order detail | `/orders/file/SF-:basket_id` |
| Service order detail | `/orders/service/SS-:basket_id` |
| Subscription order detail | `/orders/subscription/SN-:basket_id` |
| POS order detail | `/orders/pos/POS-:basket_id` |
| Avocado order detail | `/orders/avocado/AVO-:basket_id` |
| Map products | `/map` |
| Map vendors | `/map-vendors` |
| Instagram sales channel | `/instagram` |
| Avocado inquiry | `/avocado` |
| Avocado buyer/order form | `/avocado/:hash` |
| Hyper inquiry/cart | `/hyper` |
| Hyper order | `/hyper/:basket_id` |
| POS customer scan view | `/pos/:basket_id` |
| Community home | `/community` |
| Community feed | `/community/feed` |
| Community comments | `/community/comments` |
| Community category | `/community/:category_id-:category_slug?` |
| Community topic | `/community/:category_id-:category_slug?/:topic_id-:topic_slug?` |
| Listing home | `/listing` |
| Listing compare | `/listing/compare` |
| Listing category | `/listing/:category?` |
| Listing item | `/listing/:category/:item` where item is `slug-id` or `id` |
| 404 | catch all unknown routes |

User account area must include these sections:

- `/user/orders`
- `/user/orders/physical`
- `/user/orders/virtual`
- `/user/orders/file`
- `/user/orders/service`
- `/user/orders/subscription`
- `/user/orders/pos`
- `/user/profile`
- `/user/addresses`
- `/user/wishlist`
- `/user/comments`
- `/user/returns`
- `/user/gift-cards`
- `/user/wallets`

Use route metadata or equivalent layout state for:

- footer on/off
- comparison on/off
- support on/off
- search on/off
- full-screen page mode
- background color
- auth requirement
- page title
- dark/light/transparent header
- custom page background
- channel entry
- card mode

## App shell requirements

Redesign the responsive shell as requested while preserving:

- Main router outlet.
- Private shop access fallback.
- Campaign banner portal/slot.
- Floating social buttons.
- Master payment dialog.
- Product comparison entry point.
- Need-login dialog.
- Small notification stack.
- Application login dialog.
- Address/map selection dialog.
- Cookie consent when GDPR option is active.
- PWA update snackbar.
- Mobile footer/bottom navigation.
- Popup display.
- Fullscreen image viewer.
- Secure shared order retrieval.
- Debug/developer panel only in development or authorized debug mode.

On route changes, clear app blur, preserve scroll when only query changes, and scroll to top for real page changes. Use smooth scroll when moving between catalog/category variants.

## Catalog, search, and filtering

Catalog pages must support:

- Home shop mode.
- Category pages.
- Vendor pages.
- Search mode.
- Query parameters for filters, sort, pagination, and selected category/vendor.
- Empty, loading, error, and retry states.
- Infinite scroll or pagination.
- Product cards with localized name, media, price, compare price, discount, availability, rating, vendor, badges, and quick actions.
- Product type visibility for physical, virtual, file, service, and subscription products.
- Marketplace vendor product selection where applicable.
- Product comparison quick add.
- Wishlist quick add when logged in or after login prompt.
- Responsive filter drawer on mobile.

Implement filters where supported by shop/product data:

- Text search.
- Category and subcategory.
- Vendor.
- Product type.
- Price range.
- Currency.
- Availability and stock.
- Discount, coupon, offer, or campaign.
- Brand.
- Tags.
- Variant options such as color, size, style, material, region, or custom variant names.
- Rating.
- Shipping, pickup, or delivery capability.
- Location or map bounds for local products/vendors.
- Subscription plan attributes.
- Service attributes.
- File/digital attributes.
- Custom listing attributes.

Implement sorting:

- Relevance.
- Newest.
- Popular.
- Best selling if available.
- Price low to high.
- Price high to low.
- Rating.
- Distance when map/location search is active.
- Custom backend sort keys when provided.

## Product page requirements

Each product page must include:

- SEO title, metadata, canonical data, and share metadata.
- Gallery with images/video and fullscreen viewer.
- Localized product title, summary, description, article, and custom layout/page-builder content.
- Variant selector using shop-specific variant names.
- Marketplace vendor product selector where applicable.
- Subscription price/plan selector for subscriptions.
- Quantity selector with min/max/stock rules.
- Preferences/customization input for basket item preferences.
- Price, compare price, discount, tax hint, shipping hint, and bill preview when available.
- Stock, availability, delivery/pickup eligibility, and out-of-stock behavior.
- Coupons and offers that apply to the selected product/variant.
- Add to basket for guest and logged-in shoppers.
- Buy now flow.
- Wishlist.
- Product comparison.
- Reviews/comments and customer-generated content.
- Related products, smart suggestions, cross-sells, and upsells.
- Gift shopping support.
- Vendor and category navigation.
- Social share.
- Error states for missing/unpublished/private products.

When adding to basket, send:

- product id
- variant id
- count
- preferences
- vendor product id for marketplace items
- subscription price id for subscriptions

After add/remove/update, update the correct basket, update bill data, surface backend validation errors, and refetch shop/baskets if backend requests refresh.

## Basket model

Maintain separate baskets for:

- Physical products
- Virtual products
- File products
- Service products
- Subscription products

Basket behavior:

- Show total item count across all baskets.
- Support side cart open/close with selected basket type.
- Support basket page by type.
- Support item add, remove, quantity update, preference update, and variant/vendor/subscription selection updates.
- Recalculate bill after every mutation.
- Preserve guest baskets via guest code.
- Merge or refresh baskets after login when backend supports it.
- Handle stale, unavailable, or auto-removed items.
- Show coupons, offers, club benefits, gifts, lottery prizes, taxes, shipping, fees, discounts, total, payable amount, and currency.
- Retrieve basket/order from secure share links.

## Checkout requirements

Checkout must be type-aware.

Physical checkout:

- Customer identity or guest contact.
- Address selection and address CRUD.
- Map location selection.
- Shipping options.
- Pickup options.
- Delivery scheduling where supported.
- COD eligibility by delivery method.
- Tax, shipping, discount, and total recalculation.
- Notes and delivery instructions.

Virtual checkout:

- Customer identity or guest contact.
- Recipient/account information required for virtual delivery.
- Immediate delivery state after payment.

File checkout:

- Customer identity or guest contact.
- License/download access information.
- Post-payment download state.

Service checkout:

- Customer identity or guest contact.
- Service options, appointment/request fields, notes, and status expectations.

Subscription checkout:

- Plan/price selection.
- Recurring payment gateway eligibility.
- Subscription bill.
- Renewal/payment status.

All checkout flows:

- Validate server-side before payment.
- Keep checkout recoverable after refresh.
- Support pending transactions.
- Prevent double payment.
- Surface all backend errors clearly.
- Offer login where required, but allow guest checkout when the shop allows it.

## Payment requirements

Implement a master payment layer that supports:

- Basket payment by type.
- Subscription payment.
- Bill payment.
- Avocado payment.
- Hyper payment.
- Gateway selection.
- COD when accepted.
- Pending transaction retrieval.
- Payment retry.
- Payment reset and new payment creation.
- Payment completion callback.
- Payment failed/canceled states.
- Guest order payment by code/order id.
- Redirect, popup, iframe, or native payment modes depending on gateway.

Use event-driven or command-driven payment actions equivalent to:

- show basket payment form
- show subscription payment form
- show bill payment form
- show avocado payment form
- show hyper payment form
- try to pay transaction
- handle payment completed

## Order history and order detail

Customer order history must include separate tabs/pages for:

- Physical
- Virtual
- File
- Service
- Subscription
- POS
- Avocado when available

Order detail pages must support:

- Correct route prefix: `SM`, `SV`, `SF`, `SS`, `SN`, `POS`, `AVO`, and hyper order routes.
- Guest access where secure link/code allows it.
- Payment status and retry payment.
- Fulfillment status.
- Timeline.
- Items, variants, preferences, vendor details, and prices.
- Shipping address and delivery/pickup data for physical orders.
- Tracking data where available.
- Download/access data for file and virtual orders.
- Service request/appointment/status data for service orders.
- Subscription plan, renewal, and billing status for subscription orders.
- Invoice/receipt view.
- Return or cancellation entry points where supported.
- Review/comment entry points after fulfillment where supported.

## Customer account

Implement:

- Profile view/edit.
- Addresses list and address form.
- Wishlist.
- Comments/reviews.
- Gift cards.
- Wallets and wallet transactions.
- Returns and return requests.
- Order history.
- Customer club status.
- Coupons and offers.
- Lottery prizes.
- Permissions-aware UI.
- Login-required fallbacks and return-to-page after login.

## Content and marketing

Support:

- Custom landing pages and page-builder content.
- Dynamic include/profile pages.
- Blog list.
- Blog post.
- Author/team page.
- FAQ with optional tag.
- About us.
- Terms.
- Privacy.
- Contact us.
- Shop info page.
- Campaign banners.
- Popups.
- Floating social links.
- Instagram sales channel entry tracking.
- SEO metadata for content pages.

## Community

If community is enabled, support:

- Community home.
- Category list.
- Category page.
- Topic page.
- Feed.
- My comments.
- Deleted-post visibility for admin/moderator config where applicable.
- Auth-aware comment/post actions.
- Community route isolation under `/community` or home when custom home is community.

## Map and local discovery

Support:

- Fullscreen map products page.
- Fullscreen map vendors page.
- Initial location from shop fetch or browser permission.
- Product/vendor markers.
- Search by map bounds.
- Distance-aware sorting.
- Product/vendor detail preview.
- Navigation from map item to product/vendor page.

## Listing module

Support:

- Listing home.
- Listing category.
- Listing item profile.
- Listing comparison with max item limit.
- Listing search and filters.
- Listing-specific attributes.
- Per-shop local comparison storage.

## Special sales channels

Avocado:

- Inquiry page.
- Buyer/order form by hash.
- Order detail.
- Payment flow.

Hyper:

- Hyper cart/inquiry.
- Hyper order by basket id.
- Payment flow.

POS:

- Customer scan result page.
- POS order detail.
- Auth requirement where configured.

Instagram:

- Channel entry route.
- Save `channel_entry = instagram` or equivalent attribution.

## Notifications and real-time behavior

Support:

- Small notification stack.
- Server message display.
- Push token registration after authenticated user is available.
- Incoming push notification display only when notification shop matches current shop.
- App blur events when modal/payment layers require focus.
- Global hotkeys only when they do not conflict with form inputs or accessibility.

## PWA, mobile, and native behavior

Implement:

- Service worker registration.
- PWA update prompt.
- Mobile bottom navigation.
- Responsive header/search/filter behavior.
- Touch-friendly gallery, cart, checkout, and map controls.
- Native app bridge for shop and user when embedded.
- Native login query handling.
- Safe-area spacing for mobile devices.

## Security and privacy

Requirements:

- Never expose access tokens in logs.
- Scope cookies to the shop prefix.
- Remove auth headers on logout.
- Respect guest checkout boundaries.
- Do not show private shop content before access verification.
- Do not trust client-side totals; always use backend bill/payment results.
- Sanitize page-builder, blog, product article, and custom page HTML according to platform rules.
- Show GDPR cookie consent only when platform and shop options require it.
- Keep payment idempotent and prevent duplicate submissions.

## Accessibility and UX quality

Every implementation must include:

- Keyboard navigation.
- Visible focus states.
- Screen-reader labels for controls.
- Semantic headings and landmarks.
- Accessible modal focus trapping.
- Reduced-motion-safe animations.
- Color contrast for theme colors.
- Loading skeletons or progress states.
- Empty states with next actions.
- Retry states for network failures.
- Clear checkout/payment error messages.

## Implementation workflow for an AI agent

1. Inspect Git state and establish the current app and production-build baseline.
2. Convert the approved brief into a page map, component plan, design tokens,
   content plan, and regression checklist.
3. Customize the existing Storefront incrementally. Reuse platform components
   and live shop data; never replace working commerce state with visual mocks.
4. Apply the design consistently across the app shell and scoped pages,
   including responsive, RTL/LTR, loading, empty, error, focus, and
   accessibility states.
5. Verify affected routes and complete journeys touched by the change,
   especially product discovery, product selection, basket, checkout, payment,
   account, localization, and mobile behavior.
6. Run the safe project checks that exist for the changed scope. Do not run
   destructive or raw TypeScript build/clean commands prohibited by repository
   instructions.
7. If setup, packaging, authentication, or publication is requested, read
   `AGENTS.md` and `AI_WORKFLOW.md` completely and follow their guarded release
   path. Bump `manifest.version` before the final production build, publish the
   exact reviewed source commit, deploy only with explicit approval, and verify
   the developer-panel record and versioned CDN assets before reporting success.

## Acceptance checklist

Treat this checklist as a regression contract for the standard Storefront, not
a mandate to reimplement every feature. For a scoped redesign, verify affected
flows plus release-critical smoke tests; keep untouched capabilities connected
to their existing implementation.

- Shop loads from runtime config and fetches current shop data.
- Private shop blocks unauthorized shoppers.
- Guest and logged-in users can browse.
- Login, callback, register, and logout work.
- Language can change and localized content refetches when needed.
- Currency can change and baskets/coupons/offers refresh.
- Catalog supports search, filtering, sorting, and pagination/infinite scroll.
- Category, vendor, custom page, include page, and product URLs work.
- Product page supports variants, vendor products, subscriptions, preferences, wishlist, comparison, reviews, suggestions, and add to basket.
- Physical, virtual, file, service, and subscription baskets are separate and correctly updated.
- Checkout validates server-side and recalculates bills.
- Shipping, pickup, COD, taxes, coupons, offers, gifts, and discounts are represented where supported.
- Payment supports gateway selection, pending transactions, retry, reset, completion, and failure states.
- Order history is split by product/order type.
- Order detail works for physical, virtual, file, service, subscription, POS, avocado, and hyper flows.
- User profile, addresses, wishlist, comments, gift cards, wallets, and returns work.
- Blog, FAQ, official pages, contact, custom pages, campaign banners, popups, and social links work.
- Community routes work when enabled.
- Map product/vendor discovery works when enabled.
- Listing and listing compare work when enabled.
- Avocado, hyper, POS, and Instagram channel flows work.
- PWA update, cookie consent, notifications, mobile bottom nav, and fullscreen image viewer work.
- All protected routes handle auth and guest checkout correctly.
- All totals and payment states come from backend responses, not client calculations.
- The storefront remains responsive, accessible, and SEO-safe.
