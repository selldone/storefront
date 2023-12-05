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
  <div>
    <v-container>
      <h1 class="text-start display-3 font-weight-black text-capitalize">
        {{ $t("official_pages.contact_us") }}
      </h1>
      <s-progress-loading v-if="busy"></s-progress-loading>

      <div
        class="text-start px-lg-5 px-md-4 px-3 master-article-container min-height-40vh"
      >
        <s-article-editor
          v-if="profile"
          class="p-lg-5 p-md-4 p-3 article"
          :only-view="true"
          :edit="false"
          :body="profile.body"
          :enable-title="false"
        />
      </div>
    </v-container>

    <div class="contact-form">
      <div v-if="submitted">
        <div class="py-16 px-5">
          <h2 class="font-weight-medium mb-5">
            <v-icon large color="green" class="me-2">check_circle</v-icon>
            {{ $t("contact_us_form.submitted_title") }}
          </h2>
          <p class="text-muted max-widget-width mx-auto">
            {{ $t("contact_us_form.submitted_message") }}
          </p>
        </div>
      </div>
      <div v-else>
        <s-widget-header
          :title="$t('contact_us_form.title')"
          icon="contact_mail"
        ></s-widget-header>

        <div v-if="USER()" class="text-start d-flex my-4 align-items-center">
          <v-avatar
            v-if="USER().id"
            class="flex-grow-0 me-4 avatar-gradient -thin -user"
            size="4.2em"
          >
            <v-img :src="getUserAvatar(USER().id)"></v-img>
          </v-avatar>
          <div class="flex-grow-1">
            <p class="font-weight-bold m-0">{{ USER().name }}</p>
            <p class="small m-0">{{ USER().email }}</p>
            <p class="small m-0">{{ USER().phone }}</p>
          </div>
        </div>
        <div v-else>
          <v-text-field
            v-model="name"
            :label="$t('contact_us_form.name')"
            class="max-width-field"
            :placeholder="$t('global.placeholders.name')"
          />

          <v-text-field
            v-model="email"
            :label="$t('contact_us_form.email')"
            prepend-inner-icon="email"
            class="max-width-field english-field"
            :placeholder="$t('global.placeholders.email')"
            :rules="[GlobalRules.required(), GlobalRules.email()]"
          />

          <v-text-field
            v-model="phone"
            :label="$t('contact_us_form.phone')"
            class="max-width-field english-field"
            prepend-inner-icon="phone"
            :placeholder="$t('global.placeholders.phone')"
          />
        </div>

        <v-textarea
          v-model="message"
          :label="$t('contact_us_form.message')"
          :rules="[GlobalRules.required()]"
          auto-grow
        />

        <div class="widget-buttons">
          <v-btn
            color="primary"
            x-large
            dark
            :class="{ disabled: !canSend }"
            :loading="busy_send"
            @click="sendForm"
          >
            {{ $t("global.actions.send") }}

            <v-icon class="mx-1">send</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SArticleEditor from "@components/article/SArticleEditor.vue";
export default {
  name: "SStorefrontContactUsPage",
  components: { SArticleEditor },
  props: {
    shop: {
      require: true,
      type: Object,
    },
  },

  data: () => ({
    profile: null,
    busy: false,

    name: null,
    email: null,
    phone: null,
    message: "",
    category: null,

    busy_send: false,
    submitted: false,
  }),

  computed: {
    canSend() {
      return this.message && this.message.length > 0;
    },
  },

  watch: {},
  created() {
    this.setPageTitle("Contact us"); // Set Page Title!
    this.fetchProfile();

    if (this.USER()) {
      this.name = this.USER().name;
      this.email = this.USER().email;
      this.phone = this.USER().phone;
    }
  },

  methods: {
    fetchProfile() {
      this.busy = true;

      axios
        .get(window.XAPI.GET_SHOP_PROFILE(this.shop.name, "contact-us"))
        .then(({ data }) => {
          if (data.error) return this.showErrorAlert(null, data.error_msg);
          this.profile = data.profile;
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    sendForm() {
      this.message = this.message.replace(/<[^>]*>?/gm, "");
      if (!this.message) return;

      this.busy_send = true;

      axios
        .post(window.XAPI.POST_CONTACT_US_FORM(this.shop.name), {
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.message,
          category: this.category,
          url: window.location.href,
        })
        .then(({ data }) => {
          if (!data.error) {
            this.name = null;
            this.email = null;
            this.phone = null;
            this.message = "";
            this.category = null;

            this.submitted = true;

            this.showSuccessAlert(
              null,
              this.$t("contact_us_form.notifications.success")
            );
          } else {
            this.showErrorAlert(null, data.error_msg);
          }
        })
        .catch((error) => {
          this.showLaravelError(error);
        })
        .finally(() => {
          this.busy_send = false;
        });
    },
  },
};
</script>

<style scoped>
.contact-form {
  z-index: 1;
  position: relative;
  background-color: #fcfcfc;
  border-radius: 38px !important;
  max-width: 800px;
  width: 90%;
  margin: 48px auto;
  padding: 18px 16px;
}
</style>
