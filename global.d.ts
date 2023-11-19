import { XapiShop } from "@sdk-storefront/shop/XapiShop";
import ShopApplicationInterface from "@core/enums/application/ShopApplicationInterface";
import { Store } from "vuex";

declare global {
  interface Window {
    $cookies: {
      set: (
        key: string,
        value: string,
        expiration: string,
        path: string,
        domain?: string | null,
        secure?: boolean
      ) => void;
      get: (key: string) => string | undefined;
      remove: (keyName: string, path: string, domain?: string | null) => void;
    };

    sms_agreement?: string; // The SMS agreement in HTML code (for SMS provider to show to the user)

    /**
     * Default location calculated based on user IP. This location receive on {@see XAPI.GET_SHOP_INFO}
     */
    initial_location: XapiShop.ILocation;
    AppInterface: ShopApplicationInterface;

    SetToken: (token: string, expire_date: Date | null) => void;

    OverrideShopLanguagePacks: { [local: string]: any };

    $global_store: Store<any>;
  }
}
