/*
 * Copyright (c) 2024. Selldone® Business OS™
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

export class StorefrontShopHealthCheck {
  /**
   * 🧿 Auto fix Shop
   *
   * @param router
   * @param shop
   * @constructor
   */
  static Check(router, shop) {
    console.log("🧿 Checking shop health...", shop.menus);
    checkAndModifyRoutes(router, shop.menus);
    checkAndModifyRoutes(router, shop.footer);
  }
}

// Function to check if a route exists in the Vue router
function routeExists(router, routePath) {
  try {
    const resolvedRoute = router.resolve(routePath);
    return resolvedRoute?.name !== undefined;
  } catch (e) {
    return false;
  }
}

// Recursive function to check and modify the object
function checkAndModifyRoutes(router, obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (
        (typeof obj[i] === "object" || Array.isArray(obj[i])) &&
        obj[i] !== null
      ) {
        checkAndModifyRoutes(router, obj[i]);
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (
        key === "to" &&
        (typeof obj[key] === "object" || typeof obj[key] === "string")
      ) {
        if (!routeExists(router, obj[key])) {
          console.error(
            "🧿 Route not found in the Vue router. The route has been set to null.",
            obj[key],
          );
          obj[key] = null;
        } else {
          // console.log("🧿 Route found in the Vue router.", obj[key]);
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        checkAndModifyRoutes(router, obj[key]);
      }
    }
  }
}
