<template>
  <a v-if="link!=null && link.includes('#')" :href="link" class="button button--primary"><slot></slot></a>
  <router-link v-else-if="link!=null" :to="link" class="button button--primary"><slot></slot></router-link>
  <button v-else @click="method()" class="button button--primary"><slot></slot></button>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: "Button",
  props:{
    link: String,
    method: Function
  },
  components: {
    RouterLink,
  }
}
</script>

<style lang="scss" src="./MoreButton.scss"/>
