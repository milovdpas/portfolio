<template>
  <RouterView/>
</template>

<script>
import {RouterView} from 'vue-router'
import * as bootstrap from 'bootstrap'

export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
  },
  methods: {}
};
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "assets/scss/_fonts.scss";
@import "assets/scss/_defaults.scss";

#app {
  font-family: $fontstack;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

body {
  width: 100%;
  font-family: Source Sans Pro, serif;
  overflow:hidden;
}

section {
  scroll-snap-align: start;
}

// Scroll bar
/* width */
::-webkit-scrollbar {
  width: 11px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: lightgrey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: $blue;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $dark-blue;
}

@include mobile {
  body {
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
