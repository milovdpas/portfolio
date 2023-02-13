<template>
  <div class="section">
    <h3 class="name px-4">
      {{name}}
    </h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Section",
  props: {
    name: String,
    previous: Function,
    next: Function
  }
}
</script>

<style lang="scss" src="./Section.scss"/>

