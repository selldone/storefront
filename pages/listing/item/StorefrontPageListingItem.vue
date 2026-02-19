<template>
  <div class="text-start">
    <div style="transition: all 400ms ease">
      <slot name="header" :center="true"></slot>
    </div>

    <v-container >
      <v-btn
        variant="text"
        prepend-icon="arrow_back"
        class="mb-3 tnt"
        :to="backToCategory"
      >
        Back
      </v-btn>

      <s-storefront-listing-item-profile :item-id="itemId" />
    </v-container>
  </div>
</template>

<script lang="ts">
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import SStorefrontListingItemProfile from "@selldone/components-vue/storefront/listing/item/SStorefrontListingItemProfile.vue";

export default {
  name: "StorefrontPageListingItem",
  mixins: [TemplateMixin],

  components: {
    SStorefrontListingItemProfile,
  },

  inject: ["$shop"],

  computed: {
    backToCategory() {
      const category = (this.$route.params as any)?.category || null;
      return category ? { name: "StorefrontListing", params: { category } } : { name: "StorefrontListing" };
    },

    itemId(): number {
      const raw = (this.$route.params as any)?.item || "";
      const s = String(raw || "").trim();

      // Accept "slug-123" or "123"
      const m = s.match(/(\d+)\s*$/);
      const id = m ? parseInt(m[1], 10) : parseInt(s, 10);
      return Number.isFinite(id) ? id : 0;
    },
  },
};
</script>

<style scoped></style>
