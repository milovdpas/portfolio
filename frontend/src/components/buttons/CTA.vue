<template>
  <div v-if="method" @click="method" :class="'cta ' + (color ? color : 'orange')">
    <slot/>
    <img :src="icon" alt="down arrow"/>
  </div>
  <a v-else :href="link" :class="'cta ' + (color ? color : 'orange')">
    <slot/>
    <img :src="icon" alt="down arrow"/>
  </a>
</template>

<script>
export default {
  name: "CTA",
  props: {
    link: String,
    method: Function,
    color: String,
    icon: String
  },
  data() {
    return {
    };
  }
}
</script>

<style lang="scss" src="./CTA.scss"/>
