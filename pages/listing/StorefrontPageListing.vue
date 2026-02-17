<template>
  <div>
    <div style="transition: all 400ms ease">
      <slot name="header" :center="true"></slot>
    </div>

    <div class="pa-4">
      <u-loading-progress v-if="busy_info" />

      <v-alert
        v-if="error_text"
        type="error"
        variant="tonal"
        border="start"
        class="mb-4"
      >
        {{ error_text }}
      </v-alert>

      <div v-if="listing" class="mb-4">
        <div class="text-h5 font-weight-black">
          {{ listing.title || "Listing" }}
        </div>
        <div v-if="listing.description" class="text-muted mt-1">
          {{ listing.description }}
        </div>
      </div>

      <s-storefront-listing-categories
        v-model="selected_category_id"
        class="mb-4"
        @update:modelValue="onCategoryChanged"
      />

      <s-storefront-listing-items
        :category-id="selected_category_id"
        @select-item="openItem"
      />
    </div>
  </div>
</template>

<script lang="ts">
import TemplateMixin from "@selldone/components-vue/mixin/template/TemplateMixin.ts";
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";

import SStorefrontListingCategories from "@selldone/components-vue/storefront/listing/categories/SStorefrontListingCategories.vue";
import SStorefrontListingItems from "@selldone/components-vue/storefront/listing/items/SStorefrontListingItems.vue";

export default {
  name: "StorefrontPageListing",
  mixins: [TemplateMixin],

  components: {
    SStorefrontListingCategories,
    SStorefrontListingItems,
  },

  inject: ["$shop"],

  data: () => ({
    listing: null as any | null,
    busy_info: false,
    error_text: "",

    selected_category_id: null as number | null,

    _syncing_from_route: false,
  }),

  created() {
    this.fetchListingInfo();
    this.syncCategoryFromRoute();
  },

  watch: {
    "$route.params.category"() {
      this.syncCategoryFromRoute();
    },
  },

  methods: {
    fetchListingInfo() {
      this.busy_info = true;
      this.error_text = "";

      axios
        .get(window.XAPI.GET_SHOP_LISTING_INFO(this.$shop.name))
        .then(({ data }) => {
          if (data?.error) {
            this.error_text = data.error_msg || "Listing is not available.";
            this.listing = null;
            return;
          }
          this.listing = data.listing || null;
        })
        .catch((error) => NotificationService.showLaravelError(error))
        .finally(() => (this.busy_info = false));
    },

    /**
     * Extract numeric id from "slug-123" OR "123".
     */
    extractTrailingId(segment: any): number | null {
      const s = String(segment || "").trim();
      if (!s) return null;

      const m = s.match(/(\d+)\s*$/);
      if (m) {
        const id = parseInt(m[1], 10);
        return Number.isFinite(id) ? id : null;
      }

      const n = parseInt(s, 10);
      return Number.isFinite(n) ? n : null;
    },

    /**
     * When URL changes (listing/:category?), reflect it into UI selection.
     */
    syncCategoryFromRoute() {
      const cat = (this.$route.params as any)?.category || null;
      const id = this.extractTrailingId(cat);

      this._syncing_from_route = true;
      this.selected_category_id = id;
      this.$nextTick(() => (this._syncing_from_route = false));
    },

    /**
     * When user selects a category chip, update URL.
     * We keep it simple: "listing/{categoryId}" (works with your backend where()).
     * If you want SEO slug-id later, change this to "slug-id".
     */
    onCategoryChanged(id: number | null) {
      if (this._syncing_from_route) return;

      const current = (this.$route.params as any)?.category || null;
      const currentId = this.extractTrailingId(current);

      if ((currentId || null) === (id || null)) return;

      if (!id) {
        this.$router.push({ name: "StorefrontListing", params: {} });
      } else {
        this.$router.push({
          name: "StorefrontListing",
          params: { category: String(id) },
        });
      }
    },

    /**
     * Navigate to profile instead of opening dialog.
     * Route format: /listing/{category}/{item}
     * We build "item" as "slug-id" when slug exists, otherwise "id".
     */
    openItem(item: any) {
      const it = typeof item === "object" ? item : null;
      const id = it?.id ? parseInt(String(it.id), 10) : parseInt(String(item || ""), 10);
      if (!id) return;

      const currentCategoryParam = (this.$route.params as any)?.category || null;

      // Prefer current route category (so profile stays inside same category view)
      let categorySegment = String(currentCategoryParam || "").trim();

      // If we are on /listing (no category), fallback to selected_category_id or item.category_id
      if (!categorySegment) {
        if (this.selected_category_id) categorySegment = String(this.selected_category_id);
        else if (it?.category?.id) categorySegment = String(it.category.id);
        else if (it?.category_id) categorySegment = String(it.category_id);
        else categorySegment = "all";
      }

      const slug = it?.slug ? String(it.slug).trim() : "";
      const itemSegment = slug ? `${slug}-${id}` : String(id);

      this.$router.push({
        name: "StorefrontListingItemProfile",
        params: { category: categorySegment, item: itemSegment },
      });
    },
  },
};
</script>

<style scoped></style>
