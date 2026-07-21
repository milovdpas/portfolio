<template>
  <div class="waterpolo-field">
    <div class="line"></div>
    <div class="panelty left"></div>
    <div class="goal-line left"></div>
    <div class="twometer-line left"></div>
    <div class="fivemeter-line left"></div>
    <div class="half"></div>
    <div class="goal-line right"></div>
    <div class="twometer-line right"></div>
    <div class="fivemeter-line right"></div>
    <div class="panelty right"></div>
  </div>
</template>

<script>
export default {
  name: "WaterpoloField",
}
</script>

<style scoped lang="scss">
.waterpolo-field {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $blue;

  .line {
    width: 100%;
    height: 100%;
    border: 5px solid #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;

    &::before {
      border: 5px solid $blue;
      bottom: -9px;
      content: "";
      left: -9px;
      position: absolute;
      right: -9px;
      top: -9px;
    }
  }

  .half {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    border-right-color: $white;
    border-right-style: solid;
    border-right-width: 4px;
    left: 0;
    z-index: 1;
  }

  .goal-line {
    width: 65px;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;

    &.left{
      left: 0;
      border-right-color: $white;
      border-right-style: solid;
      border-right-width: 4px;
    }
    &.right{
      right: 0;
      border-left-color: $white;
      border-left-style: solid;
      border-left-width: 4px;
    }
  }

  .twometer-line {
    width: 115px;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;

    &.left{
      left: 0;
      border-right-color: $red;
      border-right-style: solid;
      border-right-width: 4px;
    }
    &.right{
      right: 0;
      border-left-color: $red;
      border-left-style: solid;
      border-left-width: 4px;
    }
  }

  .fivemeter-line {
    width: 225px;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;

    &.left{
      left: 0;
      border-right-color: $yellow;
      border-right-style: solid;
      border-right-width: 4px;
    }
    &.right{
      right: 0;
      border-left-color: $yellow;
      border-left-style: solid;
      border-left-width: 4px;
    }
  }

  .panelty {
    width: 110px;
    height: 220px;
    position: absolute;
    z-index: 2;

    &.left {
      left: 3px;
      top: calc(50% - 110px);
      border-left-color: transparent;
      border-left-width: 0;

      &::after {
        border: 3px solid #ffffff;
        border-left: 0 transparent;
        bottom: 45px;
        content: "";
        left: 0;
        position: absolute;
        right: 55px;
        top: 45px;
      }
    }

    &.right {
      right: 0;
      top: calc(50% - 110px);
      border-right-color: transparent;
      border-right-width: 0;

      &::after {
        border: 3px solid #ffffff;
        border-right: 0 transparent;
        bottom: 45px;
        content: "";
        left: 55px;
        position: absolute;
        right: 0;
        top: 45px;
      }
    }
  }
}

@include mobile {
  .waterpolo-field {

    .half {
      width: 100%;
      height: 50%;
      border-bottom-color: $white;
      border-bottom-style: solid;
      border-bottom-width: 4px;
      border-right-width: 0;
    }
    .goal-line {
      width: 100%;
      height: 65px;
      top: auto;
      left: 0;

      &.left{
        top: 0;
        border-right: 0 transparent;
        border-bottom-color: $white;
        border-bottom-style: solid;
        border-bottom-width: 4px;
      }
      &.right{
        bottom: 0;
        border-left: 0 transparent;
        border-top-color: $white;
        border-top-style: solid;
        border-top-width: 4px;
      }
    }

    .twometer-line {
      width: 100%;
      height: 115px;
      top: auto;
      left: 0;

      &.left{
        top: 0;
        border-right: 0 transparent;
        border-bottom-color: $red;
        border-bottom-style: solid;
        border-bottom-width: 4px;
      }
      &.right{
        bottom: 0;
        border-left: 0 transparent;
        border-top-color: $red;
        border-top-style: solid;
        border-top-width: 4px;
      }
    }

    .fivemeter-line {
      width: 100%;
      height: 225px;
      top: auto;
      left: 0;

      &.left{
        top: 0;
        border-right: 0 transparent;
        border-bottom-color: $yellow;
        border-bottom-style: solid;
        border-bottom-width: 4px;
      }
      &.right{
        bottom: 0;
        border-left: 0 transparent;
        border-top-color: $yellow;
        border-top-style: solid;
        border-top-width: 4px;
      }
    }

    .panelty {
      width: 220px;
      height: 110px;

      &.left {
        left: calc(50% - 110px);
        top: 3px;
        border-top-color: transparent;
        border-top-width: 0;
        border-left-color: $white;
        border-left-width: 3px;


        &::after {
          border-top-color: transparent;
          border-top-width: 0;
          border-left: solid;
          border-left-color: $white;
          border-left-width: 3px;
          left: 45px;
          top: 0;
          bottom: 55px;
          right: 45px;
        }
      }

      &.right {
        left: calc(50% - 110px);
        bottom: 0;
        right: auto;
        top: auto;
        border-bottom-color: transparent;
        border-bottom-width: 0;
        border-right-color: $white;
        border-right-width: 3px;

        &::after {
          border-bottom-color: transparent;
          border-bottom-width: 0;
          border-right: solid;
          border-right-color: $white;
          border-right-width: 3px;
          left: 45px;
          top: 55px;
          bottom: 0;
          right: 45px;
        }
      }
    }
  }
}
</style>
