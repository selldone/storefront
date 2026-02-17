<!--
  - Copyright (c) 2023-2026. Selldone® Business OS™
  - Author: M.Pajuhaan
  - Web: https://selldone.com
  - All rights reserved.
-->

<template>
  <div class="sld-compare-page text-start">
    <u-loading-progress v-if="busy" />

    <v-alert v-if="error_text" type="error" variant="tonal" border="start" class="mb-4">
      {{ error_text }}
    </v-alert>

    <v-card class="apple-card" rounded="xl" variant="flat">
      <v-card-text class="pa-4 pa-sm-6">
        <div class="d-flex align-center justify-space-between flex-wrap gap-2">
          <div class="d-flex align-center">
            <v-icon class="me-2">compare_arrows</v-icon>
            <div class="text-h6 font-weight-black">Compare</div>
          </div>

          <div class="d-flex align-center gap-2">
            <v-btn variant="text" @click="clear" :disabled="busy">
              Clear
            </v-btn>
            <v-btn variant="outlined" @click="$router.push('/listing')" :disabled="busy">
              Back to listing
            </v-btn>
          </div>
        </div>

        <div class="text-muted small mt-2">
          Select items to compare. Minimum 2 items is recommended.
        </div>

        <v-divider class="my-4" />

        <div v-if="!busy && items.length < 2" class="text-muted py-4">
          Add at least two items for a meaningful comparison.
        </div>

        <div v-else class="table-wrap">
          <v-table class="compare-table">
            <thead>
            <tr>
              <th class="th-label">Field</th>
              <th v-for="it in items" :key="`h_${it.id}`" class="th-item">
                <div class="th-item-head">
                  <div class="th-thumb">
                    <img
                      v-if="thumb(it)"
                      :src="getShopImagePath(thumb(it)!)"
                      class="th-thumb-img"
                      alt="thumb"
                    />
                    <div v-else class="th-thumb-empty">
                      <v-icon size="18">image</v-icon>
                    </div>
                  </div>

                  <div class="th-title">
                    <div class="font-weight-black text-truncate">
                      {{ it.title || `Item #${it.id}` }}
                    </div>
                    <div class="text-muted small text-truncate">
                      {{ it.category?.title || "—" }}
                    </div>
                  </div>

                  <v-btn icon variant="text" size="small" @click="remove(it.id)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </div>
              </th>
            </tr>
            </thead>

            <tbody>
            <tr>
              <td class="td-label">Rating</td>
              <td v-for="it in items" :key="`r_${it.id}`">
                <div class="d-flex align-center">
                  <v-rating :model-value="Number(it.reviews_average_rating || 0)" readonly density="compact" half-increments />
                  <div class="ms-2 text-muted small">
                    {{ Number(it.reviews_average_rating || 0).toFixed(1) }}
                    <span v-if="Number(it.reviews_count || 0)">· {{ it.reviews_count }}</span>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="td-label">Price</td>
              <td v-for="it in items" :key="`p_${it.id}`">
                <div class="text-muted">
                  {{ priceText(it) || "—" }}
                </div>
              </td>
            </tr>

            <tr>
              <td class="td-label">Phone</td>
              <td v-for="it in items" :key="`t_${it.id}`">
                <div class="text-muted wrap-anywhere">{{ it.tel || "—" }}</div>
              </td>
            </tr>

            <tr>
              <td class="td-label">Email</td>
              <td v-for="it in items" :key="`e_${it.id}`">
                <div class="text-muted wrap-anywhere">{{ it.email || "—" }}</div>
              </td>
            </tr>

            <tr>
              <td class="td-label">Website</td>
              <td v-for="it in items" :key="`w_${it.id}`">
                <div class="text-muted wrap-anywhere">{{ domain(it.website) || "—" }}</div>
              </td>
            </tr>

            <tr>
              <td class="td-label">Address</td>
              <td v-for="it in items" :key="`a_${it.id}`">
                <div class="text-muted wrap-anywhere">{{ addressText(it) || "—" }}</div>
              </td>
            </tr>

            <tr v-for="k in metaKeys" :key="`m_${k}`">
              <td class="td-label">{{ humanize(k) }}</td>
              <td v-for="it in items" :key="`m_${k}_${it.id}`">
                <div class="text-muted wrap-anywhere" style="white-space: pre-wrap">
                  {{ renderMeta(it?.meta?.[k]) }}
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import NotificationService from "@selldone/components-vue/plugins/notification/NotificationService.ts";
import { ListingCompareStore } from "@selldone/components-vue/storefront/listing/compare/ListingCompareStore";

export default {
  name: "StorefrontPageListingCompare",

  inject: ["$shop"],

  data: () => ({
    busy: false,
    error_text: "",
    items: [] as any[],
  }),

  computed: {
    shop(): any {
      return (this as any).$shop;
    },

    shopName(): string {
      return String(this.shop?.name || "").trim();
    },

    idsFromQuery(): number[] {
      const q: any = (this as any).$route?.query?.ids;

      if (Array.isArray(q)) {
        return q.map((x) => parseInt(String(x), 10)).filter((n) => Number.isFinite(n) && n > 0);
      }

      const s = String(q || "").trim();
      if (!s) return [];
      return s.split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => Number.isFinite(n) && n > 0);
    },

    metaKeys(): string[] {
      const out = new Set<string>();

      (this.items || []).forEach((it: any) => {
        const meta = it?.meta;
        if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;

        Object.keys(meta).forEach((k) => {
          // keep biography inside meta too if you want (optional). Here we keep all.
          out.add(k);
        });
      });

      return Array.from(out).sort((a, b) => a.localeCompare(b));
    },
  },

  created() {
    this.load();
  },

  watch: {
    "$route.query.ids": {
      deep: false,
      handler() {
        this.load();
      },
    },
  },

  methods: {
    load() {
      const ids = this.idsFromQuery.length
        ? this.idsFromQuery
        : ListingCompareStore.read(this.shopName).map((x) => x.id);

      this.fetch(ids);
    },

    fetch(ids: number[]) {
      const shopName = this.shopName;
      if (!shopName) return;

      const unique = Array.from(new Set(ids)).slice(0, 10);

      if (!unique.length) {
        this.items = [];
        return;
      }

      this.busy = true;
      this.error_text = "";

      axios
        .get(window.XAPI.GET_SHOP_LISTING_ITEMS_COMPARE(shopName), {
          params: {
            ids: unique.join(","),
            media_limit: 3,
          },
        })
        .then(({ data }) => {
          if (data?.error) {
            this.error_text = data.error_msg || "Failed to load compare data.";
            return;
          }

          this.items = Array.isArray(data.items) ? data.items : [];
        })
        .catch((error) => NotificationService.showLaravelError(error))
        .finally(() => (this.busy = false));
    },

    thumb(it: any): string | null {
      const media = Array.isArray(it?.media) ? it.media : [];
      const img = media.find((m: any) => String(m?.type || "") === "image" && (m.url || m.path)) || media[0];
      return (img?.url || img?.path || it?.image || null) ? String(img?.url || img?.path || it?.image) : null;
    },

    priceText(it: any): string {
      if (it?.price === null || it?.price === undefined) return "";
      const cur = it?.currency ? String(it.currency) : "";
      const unit = it?.price_unit ? ` (${it.price_unit})` : "";
      return `${it.price} ${cur}${unit}`.trim();
    },

    addressText(it: any): string {
      const parts = [it?.address, it?.city, it?.country_code]
        .map((x: any) => String(x || "").trim())
        .filter((x: string) => x.length);
      return parts.join(", ");
    },

    domain(url: any): string {
      const s = String(url || "").trim();
      if (!s) return "";
      try {
        const hasProto = s.startsWith("http://") || s.startsWith("https://");
        const u = new URL(hasProto ? s : `https://${s}`);
        return u.hostname.replace(/^www\./, "");
      } catch {
        return s;
      }
    },

    humanize(key: string) {
      return String(key || "")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    },

    renderMeta(v: any): string {
      if (v === null || v === undefined) return "—";

      // key_value list
      if (Array.isArray(v) && v.every((x) => x && typeof x === "object" && "key" in x && "value" in x)) {
        return v.map((r: any) => `${String(r.key || "").trim()}: ${String(r.value || "").trim()}`).join("\n");
      }

      if (Array.isArray(v)) return v.map((x) => String(x)).join(", ");

      if (typeof v === "object") {
        try {
          return JSON.stringify(v, null, 2);
        } catch {
          return "[object]";
        }
      }

      return String(v);
    },

    remove(id: number) {
      if (!this.shopName) return;
      ListingCompareStore.remove(this.shopName, id);

      // update UI immediately
      this.items = (this.items || []).filter((x: any) => parseInt(String(x?.id || 0), 10) !== id);

      // keep query in sync
      const ids = this.items.map((x: any) => x.id).join(",");
      this.$router.replace({ path: "/listing/compare", query: ids ? { ids } : {} });
    },

    clear() {
      if (!this.shopName) return;
      ListingCompareStore.clear(this.shopName);
      this.items = [];
      this.$router.replace({ path: "/listing/compare", query: {} });
    },
  },
};
</script>

<style lang="scss" scoped>
.sld-compare-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 10px;
}

.apple-card {
  background: #fff;
  border: 1px solid rgba(20, 20, 20, 0.08);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.compare-table {
  min-width: 980px;
}

.th-label {
  width: 180px;
  color: rgba(0, 0, 0, 0.65);
}

.th-item {
  min-width: 280px;
}

.th-item-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.th-thumb {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  flex: 0 0 auto;
}

.th-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.th-thumb-empty {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: rgba(0, 0, 0, 0.45);
}

.th-title {
  min-width: 0;
  flex: 1;
}

.td-label {
  font-weight: 800;
  color: rgba(0, 0, 0, 0.65);
}

.wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>
