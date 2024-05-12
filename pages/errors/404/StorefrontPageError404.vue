<!--
  - Copyright (c) 2024. Selldone® Business OS™
  -
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  -
  - All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
  - From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
  - Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
  - Our journey is not just about reaching a destination, but about creating a masterpiece.
  - Tread carefully, for you're treading on dreams.
  -->
<template>
  <v-empty-state
    headline="Page Not Found, 404"
    text="The page you were looking for does not exist."
  >
    <template v-slot:media>
      <div>
        <v-avatar
          rounded="xl"
          class="avatar-gradient -shop mx-auto my-5"
          :size="120"
          style="--border-radious: 20px"
        >
          <v-img
            :src="getShopImagePath(shop.icon)"
            height="100%"
            width="100%"
          ></v-img>
        </v-avatar>
      </div>
    </template>
    <template v-slot:actions>
      <s-widget-buttons style="width: 100vw">
        <v-btn
          size="x-large"
          color="#000"
          :to="{ path: '/' }"
          prepend-icon="home"
        >
          {{ shop ? shop.title : $t("global.commons.home") }}
        </v-btn>
      </s-widget-buttons>
    </template>
  </v-empty-state>
</template>
<script>
import { defineComponent } from "vue";
import SWidgetButtons from "@selldone/components-vue/ui/widget/buttons/SWidgetButtons.vue";

export default defineComponent({
  name: "StorefrontPageError404",
  components: { SWidgetButtons },

  computed: {
    shop() {
      return this.getShop();
    },
  },
});
</script>

<style scoped lang="scss"></style>
