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
@import "~bootstrap/scss/bootstrap";
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
