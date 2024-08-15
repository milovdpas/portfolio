<template>
  <div v-if="method" @click="method" :class="'round-button'">
    <slot/>
    <img v-if="icon" v-once :src="icon" width="48" height="48" alt="down arrow"/>
  </div>
  <a v-else :href="link" :class="'round-button'">
    <slot/>
    <img v-if="icon" v-once :src="icon" width="48" height="48" alt="down arrow"/>
  </a>
</template>

<script>
export default {
  name: "RoundButton",
  props: {
    link: String,
    method: Function,
    icon: String
  },
}
</script>

<style scoped lang="scss" src="./RoundButton.scss"/>
