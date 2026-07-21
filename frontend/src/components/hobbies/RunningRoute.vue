<template>
  <div class="running-route">
    <div class="mountain far"></div>
    <div class="mountain near"></div>
    <div class="tree" style="left: 12%; top: 18%;"></div>
    <div class="tree" style="left: 22%; top: 12%;"></div>
    <div class="tree" style="left: 70%; top: 64%;"></div>
    <div class="tree" style="left: 80%; top: 58%;"></div>

    <div class="road straight bottom"></div>
    <div class="turn right"></div>
    <div class="road straight middle"></div>
    <div class="turn left"></div>
    <div class="road straight top"></div>

    <div class="marker start">START</div>
    <div class="marker km">21.1</div>
    <div class="finish-line"></div>
  </div>
</template>

<script>
export default {
  name: "RunningRoute",
}
</script>

<style scoped lang="scss">
// Top-down long-distance running route: a switchback road through nature
// (Milo runs roads/trails, not track), drawn in the same hand-made CSS style
// as the other hobby fields.
$asphalt: #5b5b63;

.running-route {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $green;
  overflow: hidden;

  // Center dashes are painted on the straights with a repeating gradient.
  .road {
    position: absolute;
    background-color: $asphalt;
    background-image: repeating-linear-gradient(90deg, $white 0 26px, transparent 26px 54px);
    background-size: 100% 6px;
    background-position: 0 center;
    background-repeat: no-repeat;
    border-top: 4px solid $white;
    border-bottom: 4px solid $white;
    height: 72px;
  }

  // Straights overlap the turns by 3px to avoid subpixel hairline seams.
  .straight.bottom {
    left: 6%;
    right: calc(24% - 3px);
    bottom: 12%;
  }

  .straight.middle {
    left: calc(24% - 3px);
    right: calc(24% - 3px);
    top: calc(50% - 36px);
  }

  .straight.top {
    left: calc(24% - 3px);
    right: 6%;
    top: 12%;
  }

  // U-turns: half of a ring, clipped. The ring's outer size spans from the
  // top of one straight to the bottom of the next. The white edge lines are
  // drawn INSIDE the ring (like the straights' borders) via pseudo-elements,
  // so they line up seamlessly at the joints.
  .turn {
    position: absolute;
    border: 72px solid $asphalt;
    border-radius: 50%;

    &::before {
      // Outer edge line (matches the straights' outer border position).
      content: "";
      position: absolute;
      inset: -72px;
      border: 4px solid $white;
      border-radius: 50%;
    }

    &::after {
      // Inner (hole-side) edge line.
      content: "";
      position: absolute;
      inset: -4px;
      border: 4px solid $white;
      border-radius: 50%;
    }
  }

  .turn.right {
    // Connects the bottom straight to the middle straight on the right side:
    // spans from the middle straight's top edge (50% - 36px from the top)
    // down to the bottom straight's bottom edge (12% from the bottom).
    right: calc(24% - 130px);
    bottom: 12%;
    width: 260px;
    height: calc(38% + 36px);
    clip-path: inset(0 0 0 50%);
  }

  .turn.left {
    // Connects the middle straight to the top straight on the left side.
    left: calc(24% - 130px);
    top: 12%;
    width: 260px;
    height: calc(38% + 36px);
    clip-path: inset(0 50% 0 0);
  }

  .marker {
    position: absolute;
    padding: 4px 10px;
    background: $white;
    color: #111112;
    font-weight: bold;
    font-size: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
  }

  .marker.start {
    left: 4%;
    bottom: calc(12% + 90px);
  }

  .marker.km {
    left: 31%;
    top: calc(50% - 76px);
    transform: translateX(-50%);
  }

  .finish-line {
    position: absolute;
    right: 8%;
    top: calc(12% - 6px);
    width: 26px;
    height: 92px;
    background-image: repeating-conic-gradient($black 0% 25%, $white 0% 50%);
    background-size: 13px 13px;
  }

  // Nature decorations, kept flat and simple.
  .tree {
    position: absolute;
    width: 46px;
    height: 46px;
    background-color: #3f9e4d;
    border: 4px solid #2e7d3a;
    border-radius: 50%;

    &::after {
      content: "";
      position: absolute;
      left: calc(50% - 4px);
      bottom: -12px;
      width: 8px;
      height: 12px;
      background: #7a4a21;
    }
  }

  .mountain {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
  }

  // Kept in the empty pocket between the bottom and middle straights,
  // clear of the right U-turn.
  .mountain.far {
    left: 16%;
    bottom: calc(12% + 90px);
    border-width: 0 60px 90px 60px;
    border-bottom-color: #8b9bb4;
  }

  .mountain.near {
    left: 6%;
    bottom: calc(12% + 90px);
    border-width: 0 75px 120px 75px;
    border-bottom-color: #6f819e;
  }
}

@include mobile {
  .running-route {
    .road {
      height: 48px;
      background-size: 100% 4px;
      background-image: repeating-linear-gradient(90deg, $white 0 18px, transparent 18px 38px);
    }

    .straight.bottom {
      right: calc(30% - 3px);
    }

    .straight.middle {
      left: calc(30% - 3px);
      right: calc(30% - 3px);
      top: calc(50% - 24px);
    }

    .straight.top {
      left: calc(30% - 3px);
    }

    .turn {
      border-width: 48px;

      &::before {
        inset: -48px;
      }
    }

    .turn.right {
      right: calc(30% - 80px);
      width: 160px;
      height: calc(38% + 24px);
    }

    .turn.left {
      left: calc(30% - 80px);
      width: 160px;
      height: calc(38% + 24px);
    }

    .marker.start {
      bottom: calc(12% + 60px);
    }

    .marker.km {
      top: calc(50% - 60px);
    }

    .finish-line {
      height: 62px;
      width: 20px;
      background-size: 10px 10px;
    }

    .tree {
      width: 32px;
      height: 32px;
    }

    .mountain.far {
      border-width: 0 40px 60px 40px;
      bottom: calc(12% + 60px);
    }

    .mountain.near {
      border-width: 0 50px 80px 50px;
      bottom: calc(12% + 60px);
    }
  }
}
</style>
