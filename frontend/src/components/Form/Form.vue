<template>
  <div id="form" class="form">
    <slot></slot>
    <SendButton/>
  </div>
</template>

<script>
import SendButton from "../buttons/SendButton.vue";

export default {
  name: "Form",
  components: {
    SendButton,
  },
  props: {
    submit: Function,
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style scoped lang="scss" src="./Form.scss"/>
