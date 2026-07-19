<template>
  <section :id="id" class="under-construction">
    <img v-once :src="icon" width="70" height="70" alt="exclamation triangle"/>
    <h2 class="title">Under construction</h2>
    <p class="description">This section will be available soon</p>
    <div class="stripe" style="transform: rotate(-20deg);"/>
    <div class="stripe" :style="`transform: rotate(-20deg); bottom: ${isMobile() ? '12.5': '17.5'}em;`"/>
    <div class="stripe" style="transform: rotate(20deg);"/>
  </section>
</template>

<script>
export default {
  name: "UnderConstruction",
  props: {
    id: String
  },
  data(){
    return {
      icon: new URL(`../assets/images/icons/exclamation-triangle.svg`, import.meta.url).href,
    }
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style scoped lang="scss" src="./UnderConstruction.scss"/>
