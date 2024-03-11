import global from "@core/lang/global/fa";
import icons from "@core/lang/global/icons/rtl";
import community from "@core/lang/global/community/fa";
import pack from "@core/lang/shop/fa";
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
