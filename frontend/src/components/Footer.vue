<template>
  <footer class="row footer">
    <div class="col-md-6 left">
      <h2 class="footer-header">Fast to...</h2>
      <router-link class="footer-link" to="/projects" @click="scrollToTop()">
        Projects
        <img :src="icons.rightArrow" class="right-arrow" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/experience" @click="scrollToTop()">
        Experience
        <img :src="icons.rightArrow" class="right-arrow" alt="right arrow"/>
      </router-link>
      <router-link class="footer-link" to="/about_me" @click="scrollToTop()">
        About me
        <img :src="icons.rightArrow" class="right-arrow" alt="right arrow"/>
      </router-link>
    </div>
    <div class="col-md-6 right">
      <h2 class="footer-header">Contact me</h2>
      <Form :submit="submit">
        <Label>Email address</Label>
        <Input type="text" placeholder="Email address"></Input>
        <Label>Name</Label>
        <Input type="text" placeholder="Name"></Input>
        <Label>Comment</Label>
        <TextArea placeholder="Comment"></TextArea>
      </Form>
    </div>
  </footer>
</template>

<script>
import {RouterLink} from "vue-router/dist/vue-router";
import Form from "@/components/Form/Form.vue"
import Label from "@/components/Form/Inputs/Label.vue";
import Input from "@/components/Form/Inputs/Input.vue";
import TextArea from "@/components/Form/Inputs/TextArea.vue";

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
      }
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    submit() {

    }
  },
}
</script>

<style scoped lang="scss" src="./Footer.scss"/>

