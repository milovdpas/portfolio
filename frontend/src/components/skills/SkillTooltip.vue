<template>
  <div class="custom-tooltip" :class="{show: visible, mirror}" :style="{left: x + 'px', top: y + 'px'}">
    <svg class="popup-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130" height="130" width="300">
      <path
          d="M36.5 12.695c15.9-2.4 32.556-4.284 82.977-3.815 79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022z"
          fill="#1889E6" stroke="#1889E6"/>
    </svg>
    <svg class="popup-outline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130" height="130" width="300">
      <g stroke-width="2" stroke-linecap="round">
        <path class="popup-outline-left"
              d="M233.5 129s-1.992-7.686-32.218-14c-17.933-5.043-118.204 3.687-163.51-2.544-21.317-2.932-33.706-8.26-34.228-27.022L2.272 39.717c-.46-16.58 12.34-23.718 34.23-27.022 15.897-2.4 32.554-4.284 82.975-3.815"
              fill="none" stroke="#1889E6"/>
        <path class="popup-outline-right"
              d="M119.477 8.88c79.67.74 121.785.26 145.294 5.51 18.483 4.13 34.333 11.696 33.382 32.11l-1.696 36.39c-1.01 21.68-11.678 29.377-21.934 30.838-14.884 2.12-29.72 3.52-54.512-.848C232.522 118.263 233.5 129 233.5 129"
              fill="none" stroke="#1889E6"/>
      </g>
    </svg>
    <div class="popup-text">{{ text }}</div>
  </div>
</template>

<script>
// How far the bubble reaches left/right of and above its anchor point, per
// orientation (matches the offsets in the styles below).
const EXTENT = {
  normal: {left: 230, right: 70},
  mirror: {left: 50, right: 250},
};
const HEIGHT = 135;

export default {
  name: "SkillTooltip",
  data() {
    return {
      visible: false,
      mirror: false,
      x: 0,
      y: 0,
      text: '',
    }
  },
  methods: {
    /**
     * @param mirror preferred orientation (bubble to the right of the point)
     * @param maxX   container width; the bubble flips and/or shifts to stay inside
     */
    show({x, y, text, mirror, maxX = Infinity}) {
      const overflow = side => Math.max(0, EXTENT[side].left - x) + Math.max(0, x + EXTENT[side].right - maxX);
      let side = mirror ? 'mirror' : 'normal';
      const other = mirror ? 'normal' : 'mirror';
      if (overflow(other) < overflow(side)) {
        side = other;
      }
      // On narrow screens neither side may fit as-is: nudge the anchor inward.
      this.x = Math.max(EXTENT[side].left, Math.min(x, maxX - EXTENT[side].right));
      this.y = Math.max(y, HEIGHT);
      this.text = text;
      this.mirror = side === 'mirror';
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
}
</script>

<style scoped lang="scss">
.custom-tooltip {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: 0.5s opacity;

  .popup-bg {
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.16)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.23));
    position: absolute;
    top: -135px;
    left: -230px;
  }

  .popup-outline {
    position: absolute;
    top: -135px;
    left: -230px;

    .popup-outline-left {
      stroke-dasharray: 426px 426px;
      stroke-dashoffset: 1px;
      transition: stroke-dasharray 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .popup-outline-right {
      stroke-dasharray: 352px 352px;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .popup-text {
    display: block;
    position: absolute;
    text-align: left;
    border-radius: 12px;
    box-sizing: border-box;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    left: -222px;
    padding: 12px 16px;
    top: -126px;
    width: 292px;
  }
}

.custom-tooltip.show {
  opacity: 1;
  cursor: help;
}

.custom-tooltip.mirror {
  .popup-bg {
    left: -50px;
    transform: rotateZ(180deg) rotateX(180deg);
  }

  .popup-outline {
    left: -50px;
    transform: rotateZ(180deg) rotateX(180deg);
  }

  .popup-text {
    left: -42px;
    top: -120px;
  }
}
</style>
