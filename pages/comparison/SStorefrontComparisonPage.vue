<!--
  - Copyright (c) 2023. Selldone® Business OS™
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
  <div class="px-1 mb-16">
    <div
      style="min-height: 800px; background-color: white; border-radius: 18px"
      class="py-16"
    >
      <product-comparison-list v-if="!busy" :products="productsList" />
    </div>
  </div>
</template>

<script>
import ProductComparisonList from "@components/storefront/comparison/list/ProductComparisonList.vue";
export default {
  name: "SStorefrontComparisonPage",
  components: { ProductComparisonList },

  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Data
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */

  data: () => ({
    busy: false,
    list: null,
    products: [],
  }),
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Computed
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  computed: {
    productsList() {
      if (!this.list || !this.products || !this.products.length) return [];

      let out = [];
      this.list.forEach((item) => {
        let product = this.FindItemByID(this.products, item.p);
        if (!product) return;

        let variants = product.product_variants;
        let product_clone = Object.assign({}, product); // Clone product to place as item.

        if (item.v) {
          let variant = this.FindItemByID(variants, item.v);
          if (!variant) return;
          product_clone.variant = variant;
          product_clone.key = product.id + "-" + variant.id;
        } else {
          product_clone.key = product.id;
        }
        out.push(product_clone);
      });

      return out;
    },
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Component Lifecycle
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  created() {
    if (this.$route.query.list) {
      let res = this.$route.query.list.split("_");
      let out = "[";

      for (let i = 0, len = res.length; i < len; i++) {
        let item = res[i];
        if (!item) continue;
        item = item.replace(/v/g, ',"v":');
        item = item.replace(/p/g, '"p":');

        out += "{" + item + "}";
        if (i < len - 1) out += ",";
      }

      out += "]";
      console.log("out: " + out);

      this.list = JSON.parse(out);

      this.setPageTitle("Comparison items"); // Set Page Title!

      this.fetchProducts(this.list);
    }
  },
  /**
   * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   *  🔷 Methods Section
   * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   */
  methods: {
    fetchProducts(list) {
      let product_ids = [];

      list.forEach((item) => {
        product_ids.push(item.p);
      });

      this.busy = true;

      axios
        .get(window.XAPI.GET_PRODUCTS_LIST(this.shop_name), {
          params: {
            list: product_ids,
          },
        })
        .then(({ data }) => {
          if (!data.error) {
            this.products = data.products;
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style scoped></style>
