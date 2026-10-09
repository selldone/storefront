import {
  START_LOCATION,
  type NavigationFailure,
  type RouteLocationNormalized,
} from "vue-router";

/**
 * Keep server-rendered SEO untouched until a successful in-app navigation.
 * Async page loads must capture their navigation before dispatching requests.
 */
export class StorefrontSeo {
  private static navigation = 0;

  static onNavigation(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    failure?: NavigationFailure | void,
  ): boolean {
    if (failure || from === START_LOCATION) return false;
    // Product-list filters normalize the query during bootstrap; this is still
    // the server-rendered page, not a different document view.
    if (this.navigation === 0 && to.path === from.path) return false;

    this.navigation += 1;
    return true;
  }

  static captureNavigation(): number {
    return this.navigation;
  }

  static canUpdate(navigation = this.navigation): boolean {
    return navigation > 0 && navigation === this.navigation;
  }

  static setTitle(title: string, navigation = this.navigation): void {
    if (!this.canUpdate(navigation)) return;

    document.title = title;
  }
}
