import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as vueRouter from "vue-router";

function loadTypescript(url, imports = {}) {
  const exports = {};
  const result = ts.transpileModule(readFileSync(url, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    reportDiagnostics: true,
  });
  assert.deepEqual(result.diagnostics.filter((item) => item.category === ts.DiagnosticCategory.Error), []);
  vm.runInNewContext(result.outputText, {
    exports,
    require: (name) => {
      assert.ok(Object.hasOwn(imports, name), `Unexpected router dependency: ${name}`);
      return imports[name];
    },
  });
  return exports;
}

const core = "../../../../@selldone/core-js/";
const { Shop } = loadTypescript(new URL(`${core}models/shop/shop.model.ts`, import.meta.url));
const { StorefrontRoutesName } = loadTypescript(new URL(`${core}enums/route/StorefrontRoutesName.ts`, import.meta.url));
const { CommunityRoutesName } = loadTypescript(new URL(`${core}enums/route/CommunityRoutesName.ts`, import.meta.url));

function fixture(home, prefix = "") {
  return loadTypescript(new URL("./StorefrontRouter.ts", import.meta.url), {
    "vue-router": { ...vueRouter, createWebHistory: vueRouter.createMemoryHistory },
    "../store/StorefrontStore": { default: { getters: {} } },
    "@selldone/core-js/helper/shop/ShopOptionsHelper": { ShopOptionsHelper: {} },
    "@selldone/core-js/server/SetupService": {
      SetupService: { GetMetaValue: (name) => name === "custom-home" ? home : prefix },
    },
    "@selldone/core-js/models/shop/shop.model": { Shop },
    "@selldone/core-js/enums/route/StorefrontRoutesName": { StorefrontRoutesName },
    "@selldone/core-js/enums/route/CommunityRoutesName": { CommunityRoutesName },
    "../helpers/StorefrontSeo": { StorefrontSeo: {} },
    "../layouts/StorefrontLayout.vue": { default: { name: "StorefrontLayout" } },
    "@app-storefront/pages/landing/StorefrontPageLanding.vue": { default: { name: "StorefrontPageLanding" } },
    "@app-storefront/pages/login/StorefrontPageLogin.vue": { default: { name: "StorefrontPageLogin" } },
  }).default;
}

test("empty and missing home settings open the same catalog as an explicit Shop home", () => {
  for (const home of ["", null, undefined, Shop.Home.SHOP]) {
    for (const prefix of ["", "/store/"]) {
      const router = fixture(home, prefix);
      const root = router.resolve("/");
      const catalog = router.resolve("/shop");
      assert.equal(root.name, StorefrontRoutesName.SHOP_PAGE);
      assert.equal(root.matched.length, 2, "the catalog must mount inside the storefront layout");
      assert.equal(root.meta.search, true);
      assert.equal(catalog.name, `${StorefrontRoutesName.SHOP_PAGE}-reserve`);
      assert.equal(root.matched.at(-1).components.default, catalog.matched.at(-1).components.default);
      assert.equal(router.resolve({ name: StorefrontRoutesName.SHOP_PAGE }).href, `${prefix || "/"}`);
      assert.equal(router.resolve("/orchard-fruits-category").name, StorefrontRoutesName.SHOP_CATEGORY_PAGE);
    }
  }
});

test("configured home modes retain their root route and a separate catalog", () => {
  for (const [home, expected] of [
    [Shop.Home.BLOG, StorefrontRoutesName.BLOGS_PAGE],
    [Shop.Home.AVOCADO, StorefrontRoutesName.AVOCADO_PAGE],
    [Shop.Home.HYPER, StorefrontRoutesName.HYPER_PAGE],
    [Shop.Home.MAP, StorefrontRoutesName.MAP_PRODUCTS_PAGE],
    [Shop.Home.COMMUNITY, CommunityRoutesName.COMMUNITY_HOME_PAGE],
  ]) {
    const router = fixture(home);
    assert.equal(router.resolve("/").name, expected);
    assert.equal(router.resolve({ name: expected }).path, "/");
    assert.equal(router.resolve("/shop").name, StorefrontRoutesName.SHOP_PAGE);
    assert.equal(router.resolve({ name: StorefrontRoutesName.SHOP_PAGE }).path, "/shop");
  }
});

test("configured landing pages and legacy page IDs retain their landing renderer", () => {
  for (const home of [Shop.Home.LANDING_PAGE, "123"]) {
    const router = fixture(home, "/store/");
    const root = router.resolve("/");
    assert.equal(root.name, StorefrontRoutesName.CUSTOM_HOME_PAGE);
    assert.equal(root.meta.fullscreen, true);
    assert.equal(root.matched.at(-1).components.default.name, "StorefrontPageLanding");
    assert.equal(router.resolve("/shop").name, StorefrontRoutesName.SHOP_PAGE);
    assert.equal(router.resolve({ name: StorefrontRoutesName.CUSTOM_HOME_PAGE }).href, "/store/");
  }
});

test("retired Instagram clone routes stay absent while catalog categories remain reachable", () => {
  const router = fixture("");
  assert.equal(router.hasRoute("InstagramPage"), false);
  assert.equal(router.resolve("/instagram").matched.length, 1);
  assert.equal(router.resolve("/orchard-fruits-category").name, StorefrontRoutesName.SHOP_CATEGORY_PAGE);
});
