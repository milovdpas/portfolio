<template>
  <footer class="row footer">
    <div class="col-md-6 left">
      <h2 class="footer-header">{{ $t('footer.fastTo') }}</h2>
      <router-link class="footer-link" to="/projects" @click="scrollToTop()">
        {{ $t('footer.projects') }}
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/experience" @click="scrollToTop()">
        {{ $t('footer.experience') }}
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/about_me" @click="scrollToTop()">
        {{ $t('footer.aboutMe') }}
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
      <LocaleSelect class="footer-locale-select"/>
    </div>
    <div class="col-md-6 right">
      <h2 class="footer-header">{{ $t('footer.contactMe') }}</h2>
      <Form :submit="submit" :disabled="!isFormValid">
        <Label>{{ $t('footer.emailAddress') }}</Label>
        <Input v-model="form.email" name="email" type="text" :placeholder="$t('footer.emailAddress')"></Input>
        <Label>{{ $t('footer.name') }}</Label>
        <Input v-model="form.name" name="name" type="text" :placeholder="$t('footer.name')"></Input>
        <Label>{{ $t('footer.comment') }}</Label>
        <TextArea v-model="form.message" name="message" :placeholder="$t('footer.comment')"></TextArea>
      </Form>
    </div>
  </footer>
</template>

<script>
import {RouterLink} from "vue-router/dist/vue-router";
import Form from "@/components/form/Form.vue"
import Label from "@/components/form/inputs/Label.vue";
import Input from "@/components/form/inputs/Input.vue";
import TextArea from "@/components/form/inputs/TextArea.vue";
import LocaleSelect from "@/components/LocaleSelect.vue";
import Axios from "@/utils/Axios";

export default {
  name: "Footer",
  components: {
    RouterLink,
    Form,
    Label,
    Input,
    TextArea,
    LocaleSelect
  },
  data() {
    return {
      icons: {
        rightArrow: new URL(`../assets/images/icons/right-arrow.svg`, import.meta.url).href,
      },
      form: {
        name: '',
        email: '',
        message: ''
      },
      loading: false,
      error: null
    }
  },
  computed: {
    // The send button is only enabled once a name, a valid email address and a
    // comment have all been filled in.
    isFormValid() {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim());
      const nameValid = this.form.name.trim().length > 0;
      const messageValid = this.form.message.trim().length > 0;
      return nameValid && emailValid && messageValid;
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async submit() {
      if (this.loading || !this.isFormValid)
        return;
      this.loading = true;
      try {
        await Axios.noAuth(import.meta.env.VITE_API_URL + `/api/contact`, 'POST', this.form);
      } catch (error) {
        if (import.meta.env.VITE_APP_DEBUG === 'true') {
          console.log(error)
        }
        this.error = error
      } finally {
        this.loading = false;
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';
      }
    }
  },
}
</script>

<style scoped lang="scss" src="./Footer.scss"/>

