import global from "@core/lang/global/is";
import icons from "@core/lang/global/icons/ltr";
import community from "@core/lang/global/community/is";
import pack from "@core/lang/shop/is";

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
