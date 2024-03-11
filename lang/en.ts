import global from "@core/lang/global/en";
import icons from "@core/lang/global/icons/ltr";
import community from "@core/lang/global/community/en";
import pack from "@core/lang/shop/en";
import {en} from "vuetify/locale";

export default {
  /** ---------------- Icons ---------------- **/
  icons: icons,

  /** ---------------- Global ---------------- **/
  global: global,

  /** ---------------- Community ---------------- **/
  community: community,

  /** ---------------- Main Package ---------------- **/
  ...pack,

  $vuetify: en,

};
