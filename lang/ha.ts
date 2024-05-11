import global from "@selldone/core-js/lang/global/ha";
import icons from "@selldone/core-js/lang/global/icons/rtl";
import community from "@selldone/core-js/lang/global/community/ha";
import pack from "@selldone/core-js/lang/shop/ha";

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
