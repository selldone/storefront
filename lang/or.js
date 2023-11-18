import global from "@core/lang/global/or";
import icons from "@core/lang/global/icons/ltr";
import community from "@core/lang/global/community/or";
import pack from "@core/lang/shop/or";

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
