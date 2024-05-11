import global from "@selldone/core-js/lang/global/bs";
import icons from "@selldone/core-js/lang/global/icons/ltr";
import community from "@selldone/core-js/lang/global/community/bs";
import pack from "@selldone/core-js/lang/shop/bs";

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
