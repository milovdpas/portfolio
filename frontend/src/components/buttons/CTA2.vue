<template>
  <div v-if="method" @click="method" :class="'cta'">
    <slot/>
    <img v-once :src="icon" width="48" height="48" alt="down arrow"/>
  </div>
  <a v-else :href="link" :class="'cta'">
    <slot/>
    <img v-once :src="icon" width="48" height="48" alt="down arrow"/>
  </a>
</template>

<script>
export default {
  name: "CTA2",
  props: {
    link: String,
    method: Function,
    icon: String
  },
}
</script>

<style scoped lang="scss" src="./CTA2.scss"/>

