<template>
  <footer class="row footer">
    <div class="col-md-6 left">
      <h2 class="footer-header">Fast to...</h2>
      <router-link class="footer-link" to="/projects" @click="scrollToTop()">
        Projects
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/experience" @click="scrollToTop()">
        Experience
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/about_me" @click="scrollToTop()">
        About me
        <img v-once :src="icons.rightArrow" class="right-arrow" width="40" height="40" alt="right arrow"/>
      </router-link>
    </div>
    <div class="col-md-6 right">
      <h2 class="footer-header">Contact me</h2>
      <Form :submit="submit">
        <Label>Email address</Label>
        <Input v-model="form.email" name="email" type="text" placeholder="Email address"></Input>
        <Label>Name</Label>
        <Input v-model="form.name" name="name" type="text" placeholder="Name"></Input>
        <Label>Comment</Label>
        <TextArea v-model="form.message" name="message" placeholder="Comment"></TextArea>
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
import Axios from "@/utils/Axios";

export default {
  name: "Footer",
  components: {
    RouterLink,
    Form,
    Label,
    Input,
    TextArea
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
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    async submit() {
      if(this.loading)
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

