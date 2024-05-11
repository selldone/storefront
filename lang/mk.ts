import global from "@selldone/core-js/lang/global/mk";
import icons from "@selldone/core-js/lang/global/icons/ltr";
import community from "@selldone/core-js/lang/global/community/mk";
import pack from "@selldone/core-js/lang/shop/mk";

export default {
  /** ---------------- Icons ---------------- **/
  icons: icons,

  /** ---------------- Global ---------------- **/
  global: global,

  /** ---------------- Community ---------------- **/
  community: community,

  /** ---------------- Main Package ---------------- **/
  ...pack,
};
