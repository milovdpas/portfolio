<template>
  <div class="game-overlay">
    <slot/>
    <button class="close-button" @click="$emit('close')" :aria-label="$t('games.close')">✕</button>
  </div>
</template>

<script>
/**
 * Shell for a hobby mini-game: fills the hobby field, renders the game in its
 * slot and adds a close button + ESC to leave the game.
 */
export default {
  name: "GameOverlay",
  emits: ['close'],
  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
    // Hide the fixed menu button while playing — it sits exactly where the
    // close button lives (see body.game-active in App.vue).
    document.body.classList.add('game-active');
  },
  unmounted() {
    window.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.remove('game-active');
  },
  methods: {
    onKeyDown(event) {
      if (event.code === 'Escape') {
        this.$emit('close');
      }
    }
  }
}
</script>

<style scoped lang="scss">
.game-overlay {
  position: absolute;
  inset: 0;
  z-index: 4;
  overflow: hidden;
}

.close-button {
  position: absolute;
  top: calc(0.75em + env(safe-area-inset-top, 0px));
  right: 0.75em;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: $black;
  color: $white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  z-index: 6;
}
</style>
