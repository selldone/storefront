import global from "@selldone/translate/global/fa";
import icons from "@selldone/translate/global/icons/rtl";
import countries from "@selldone/translate/global/countries/fa";
import community from "@selldone/translate/global/community/fa";
import pack from "@selldone/translate/shop/fa";
import { fa } from "vuetify/locale";

export default {
  /** ---------------- Icons ---------------- **/
  icons: icons,

  /** ---------------- Countries ---------------- **/
  countries: countries,

  /** ---------------- Global ---------------- **/
  global: global,

  /** ---------------- Community ---------------- **/
  community: community,

  /** ---------------- Main Package ---------------- **/
  ...pack,

  $vuetify: fa,
};
