<template>
  <a :href="link" :class="'cta'">
    <span class="text"><slot/></span>
    <img :src="icon" alt="down arrow"/>
  </a>
</template>

<script>
export default {
  name: "CTA2",
  props: {
    link: String,
    icon: String
  },
}
</script>

<style scoped lang="scss" src="./CTA2.scss"/>

