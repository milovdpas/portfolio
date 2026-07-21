<template>
  <div id="form" class="form">
    <slot></slot>
    <SendButton :method="submit"/>
  </div>
</template>

<script>
import SendButton from "../buttons/SendButton.vue";
import {isMobile} from "@/utils/device";

export default {
  name: "Form",
  components: {
    SendButton,
  },
  props: {
    submit: Function,
  },
  methods: {
    isMobile
  }
}
</script>

<style scoped lang="scss" src="./Form.scss"/>
