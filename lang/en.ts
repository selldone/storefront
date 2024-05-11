import global from "@selldone/translate/global/en";
import icons from "@selldone/translate/global/icons/ltr";
import community from "@selldone/translate/global/community/en";
import pack from "@selldone/translate/shop/en";
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
