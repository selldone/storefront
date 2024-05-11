import global from "@selldone/core-js/lang/global/fa";
import icons from "@selldone/core-js/lang/global/icons/rtl";
import community from "@selldone/core-js/lang/global/community/fa";
import pack from "@selldone/core-js/lang/shop/fa";
import {fa} from "vuetify/locale";

export default {
  /** ---------------- Icons ---------------- **/
  icons: icons,

  /** ---------------- Global ---------------- **/
  global: global,

  /** ---------------- Community ---------------- **/
  community: community,

  /** ---------------- Main Package ---------------- **/
  ...pack,

  $vuetify: fa,

};
