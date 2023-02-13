<template>
  <label>
    <slot></slot>{{required ? '*' : ''}}
  </label>
</template>

<script>
export default {
  name: "Label",
  props: {
    required: Boolean
  }
}
</script>

<style scoped lang="scss" src="./Label.scss"/>
