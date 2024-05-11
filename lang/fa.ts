import global from "@selldone/translate/global/fa";
import icons from "@selldone/translate/global/icons/rtl";
import community from "@selldone/translate/global/community/fa";
import pack from "@selldone/translate/shop/fa";
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
