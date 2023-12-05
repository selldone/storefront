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

    <v-app-bar flat extended extension-height="12px" color="#fff">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title>
        {{ $t("global.faq.faq") }}
        <v-icon v-if="current_tag" class="mx-2" small>{{
          $t("icons.angle_next")
        }}</v-icon>
        {{ current_tag }}
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-container class="faq-container">
      <s-widget-header :title="$t('global.faq.title')"></s-widget-header>
      <v-subheader>
        {{ $t("global.faq.message") }}
      </v-subheader>

      <v-btn
        v-if="USER()"
        depressed
        color="#8BC34A"
        rounded
        dark
        @click="dialog_faq = true"
        @click.stop
      >
        {{ $t("global.faq.add_question_action") }}
      </v-btn>

      <s-loading css-mode light v-if="!faqs.length && busy_fetch"></s-loading>

      <v-fade-transition
        group
        hide-on-leave
        tag="div"
        class="border-between-vertical blur-animate"
        :class="{ blured: busy_fetch }"
      >
        <div v-for="faq in faqs" :key="faq.id" class="faq">
          <p class="question" v-html="faq.question"></p>
          <p class="answer" v-html="faq.answer"></p>
          <div class="text-end">
            <v-btn
              text
              color="blue"
              v-if="faq.link"
              :href="faq.link"
              target="_blank"
            >
              {{ $t("global.faq.read_more") }}
            </v-btn>
          </div>
        </div>
      </v-fade-transition>

      <v-pagination
        v-model="page"
        circle
        :length="pageCount"
        @input="fetchFAQData()"
      />
    </v-container>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list dense tile>
        <v-list-item :to="{ name: 'ShopFAQ' }" exact>
          <v-list-item-icon><v-icon>home</v-icon></v-list-item-icon>
          <v-list-item-title>{{
            $t("global.faq.main_page")
          }}</v-list-item-title>
        </v-list-item>

        <v-list-item-group>
          <v-list-item
            v-for="tag in tags"
            :key="tag"
            ripple
            :to="{ name: 'ShopFAQ', params: { tag: tag } }"
            exact
          >
            <v-list-item-title>{{ tag }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- =================== Dialog =================== -->
    <v-bottom-sheet v-model="dialog_faq" inset max-width="800">
      <v-sheet class="p-2">
        <p class="dialog-title">
          <v-icon class="me-1"> fas fa-question </v-icon>
          {{ $t("global.faq.add_new") }}
        </p>
        <div class="p-2">
          <v-text-field
            v-model="question"
            :label="$t('global.faq.question_input')"
            :placeholder="$t('global.faq.question_input_placeholder')"
            filled
            rounded
          />

          <v-btn
            :class="{ disabled: !question }"
            depressed
            color="success"
            dark
            @click="sendFAQ"
            :loading="busy"
            large
          >
            {{ $t("global.actions.confirm") }}
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-card>
</template>

<script>
import _ from "lodash-es";

export default {
  name: "SStorefrontFAQPage",
  components: {},
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
    search: _.throttle(function (newVal) {
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
              this.$t("global.faq.notifications.success_add")
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

<style scoped lang="scss">
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
