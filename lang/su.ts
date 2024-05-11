import global from "@selldone/core-js/lang/global/su";
import icons from "@selldone/core-js/lang/global/icons/ltr";
import community from "@selldone/core-js/lang/global/community/su";
import pack from "@selldone/core-js/lang/shop/su";

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
