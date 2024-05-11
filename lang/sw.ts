import global from "@selldone/translate/global/sw";
import icons from "@selldone/translate/global/icons/ltr";
import community from "@selldone/translate/global/community/sw";
import pack from "@selldone/translate/shop/sw";

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
