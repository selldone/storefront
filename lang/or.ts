import global from "@selldone/core-js/lang/global/or";
import icons from "@selldone/core-js/lang/global/icons/ltr";
import community from "@selldone/core-js/lang/global/community/or";
import pack from "@selldone/core-js/lang/shop/or";

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
