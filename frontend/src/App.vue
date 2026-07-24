<template>
  <RouterView/>
</template>

<script>
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
// Trimmed Bootstrap: only the parts this site actually uses. The full
// "~bootstrap/scss/bootstrap" import pulled in ~24 unused components
// (buttons, navbar, dropdown, modal, carousel, tables, tooltip, ...).
// Configuration (no CSS output):
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/maps";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/utilities";
// Layout & the components in use:
@import "~bootstrap/scss/root";
@import "~bootstrap/scss/reboot";
@import "~bootstrap/scss/containers";
@import "~bootstrap/scss/grid";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/card";
@import "~bootstrap/scss/badge";
// Utility classes (mt-*, mb-*, px-*, d-flex, justify-content-*, h-100, text-muted, ...):
@import "~bootstrap/scss/utilities/api";

@import "assets/scss/_fonts.scss";
@import "assets/scss/_defaults.scss";

::selection {
  background: $blue;
  color: $white;
}

#app {
  font-family: $fontstack;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  @include full-height;
  scroll-snap-type: y mandatory;
  scroll-behavior:smooth;
}

section {
  scroll-snap-align: start;
}

body {
  width: 100%;
  overflow:hidden;
}

/* While a hobby mini-game is open (GameOverlay mounted), hide the menu:
   its fixed button sits exactly where the game's close button lives. */
body.game-active nav {
  display: none;
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
