<template>
  <!--
    Reusable placeholder section for parts of the website that are being worked on.
    Drop it in place of a real section and give it the section's anchor id:
      <UnderConstruction id="my-section"/>
    It renders a full-height dark section with warning stripes and localized
    "under construction" copy (i18n keys: underConstruction.*).
  -->
  <section :id="id" class="under-construction">
    <img v-once :src="icon" width="70" height="70" alt="exclamation triangle"/>
    <h2 class="title">{{ $t('underConstruction.title') }}</h2>
    <p class="description">{{ $t('underConstruction.description') }}</p>
    <div class="stripe" style="transform: rotate(-20deg);"/>
    <div class="stripe" :style="`transform: rotate(-20deg); bottom: ${isMobile() ? '12.5': '17.5'}em;`"/>
    <div class="stripe" style="transform: rotate(20deg);"/>
  </section>
</template>

<script>
import {isMobile} from "@/utils/device";

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
    isMobile
  }
}
</script>

<style scoped lang="scss" src="./UnderConstruction.scss"/>
