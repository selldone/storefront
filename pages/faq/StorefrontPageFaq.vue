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

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card class="min-height-100vh overflow-hidden s--shadow-with-padding">
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ Top Shop Menu ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->
    <slot name="header"></slot>
    <!-- ⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬⬬ -->

    <v-app-bar color="#fff" extended extension-height="12px" flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>
        {{ $t("global.faq.faq") }}
        <v-icon v-if="current_tag" class="mx-2" size="small"
          >{{ $t("icons.angle_next") }}
        </v-icon>
        {{ current_tag }}
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-container class="faq-container">
      <u-widget-header
        :title="$t('global.faq.title')"
        :disabled="!USER()"
        disabled-reason="Login to add a question"
        :add-caption="$t('global.faq.add_question_action')"
        @click:add="dialog_faq = true"
      ></u-widget-header>
      <v-list-subheader>
        {{ $t("global.faq.message") }}
      </v-list-subheader>

      <u-loading-ellipsis
        v-if="!faqs.length && busy_fetch"
        css-mode
        light
      ></u-loading-ellipsis>

      <v-fade-transition
        :class="{ blurred: busy_fetch }"
        class="border-between-vertical blur-animate"
        group
        hide-on-leave
        tag="div"
      >
        <div v-for="faq in faqs" :key="faq.id" class="faq">
          <p class="question" v-html="faq.question"></p>
          <p class="answer" v-html="faq.answer"></p>
          <div class="text-end">
            <v-btn
              v-if="faq.link"
              :href="faq.link"
              color="blue"
              target="_blank"
              variant="text"
            >
              {{ $t("global.faq.read_more") }}
            </v-btn>
          </div>
        </div>
      </v-fade-transition>

      <v-pagination
        v-model="page"
        :length="pageCount"
        rounded
        @update:model-value="fetchFAQData()"
      />
    </v-container>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list density="compact" tile>
        <v-list-item :to="{ name: 'ShopFAQ' }" exact prepend-icon="home">
          <v-list-item-title
            >{{ $t("global.faq.main_page") }}
          </v-list-item-title>
        </v-list-item>

        <v-list-group>
          <v-list-item
            v-for="tag in tags"
            :key="tag"
            :to="{ name: 'ShopFAQ', params: { tag: tag } }"
            exact
            ripple
          >
            <v-list-item-title>{{ tag }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- =================== Dialog =================== -->
    <v-bottom-sheet
      v-model="dialog_faq"
      width="860"
      max-width="98vw"
      content-class="rounded-t-xl"
    >
      <v-card rounded="t-xl" class="text-start">
        <v-card-title>
          <v-icon class="me-2"> fa:fas fa-question</v-icon>
          {{ $t("global.faq.add_new") }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="question"
            :label="$t('global.faq.question_input')"
            :placeholder="$t('global.faq.question_input_placeholder')"
            variant="underlined"
            auto-grow
          />
        </v-card-text>
        <v-card-actions>
          <div class="widget-buttons">
            <v-btn
              :class="{ disabled: !question }"
              :loading="busy"
              color="primary"
              size="x-large"
              variant="elevated"
              @click="sendFAQ"
              prepend-icon="check"
            >
              {{ $t("global.actions.confirm") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-card>
</template>

<script lang="ts">
import { throttle } from "lodash-es";
import ULoadingEllipsis from "@selldone/components-vue/ui/loading/ellipsis/ULoadingEllipsis.vue";

export default {
  name: "StorefrontPageFaq",
  components: {ULoadingEllipsis},
  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data() {
    return {
      drawer: false,

      dialog_faq: false,
      question: "",
      busy: false,
      busy_fetch: false,

      faqs: [],
      tags: [],

      total: true,

      search: null,
      //----------------------
      page: 1,
    };
  },
  computed: {
    current_tag() {
      return this.$route.params.tag;
    },
    pageCount() {
      return Math.ceil(this.total / 10);
    },
  },
  watch: {
    current_tag() {
      this.drawer = false;
      this.offset = 0;
      this.fetchFAQData();
    },
    search: throttle(function (newVal) {
      this.page = 1;
      this.fetchFAQData(newVal);
    }, window.SERACH_THROTTLE),
  },
  created() {
    this.setPageTitle("FAQ"); // Set Page Title!
    this.fetchFAQData();
    this.fetchFAQTags();
  },
  methods: {
    //――――――――――――――――――――――― FAQ Tags ―――――――――――――――――――――――

    fetchFAQTags() {
      axios.get(window.XAPI.GET_FAQ_TAGS(this.shop.name)).then(({ data }) => {
        this.tags = data.tags;
      });
    },

    //――――――――――――――――――――――― FAQs ―――――――――――――――――――――――

    fetchFAQData() {
      this.busy_fetch = true;
      axios
        .get(window.XAPI.GET_FAQ(this.shop.name), {
          params: {
            offset: (this.page - 1) * 10,
            limit: 10,
            tag: this.$route.params.tag,
            search: this.search,
          },
        })
        .then(({ data }) => {
          this.faqs = data.faqs;
          this.total = data.total;
        })
        .finally(() => {
          this.busy_fetch = false;
        });
    },

    sendFAQ() {
      this.busy = true;
      axios
        .post(window.XAPI.POST_SEND_QUESTION(this.shop.name), {
          question: this.question,
        })
        .then(({ data }) => {
          if (data.error) {
            this.showErrorAlert(null, data.error_msg);
          } else {
            this.question = null;
            this.showSuccessAlert(
              null,
              this.$t("global.faq.notifications.success_add"),
            );
            this.dialog_faq = false;
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.faq-container {
  text-align: start;
  max-width: 1100px;

  .faq {
    margin: 8px 0;
    padding: 14px 8px;

    .question {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .answer {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.7rem;
    }
  }

  margin: auto;
}
</style>
