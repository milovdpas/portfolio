<template>
  <div class="football-field">
    <div class="line"></div>
    <div class="half"></div>
    <div class="panelty left"></div>
    <div class="panelty right"></div>
    <div class="p-spot left">&nbsp;</div>
    <div class="p-spot right">&nbsp;</div>
    <div class="center"></div>
    <div class="p-place left"></div>
    <div class="p-place right"></div>
  </div>
</template>

<script>
export default {
  name: "FootballField",
}
</script>

<style scoped lang="scss">
.football-field {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $green;

  .line {
    width: 100%;
    height: 100%;
    border: 5px solid #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    &::before {
      border: 5px solid #539A46;
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

  .panelty {
    width: 110px;
    height: 220px;
    border: 3px solid #ffffff;
    position: absolute;
    z-index: 2;
    background-color: #539A46;

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

  .p-spot {
    &.left {
      &:after {
        content: "\2022";
        position: absolute;
        color: $white;
        font-size: 35px;
        top: calc(50% - 22.5px);
        left: 80px;
        z-index: 3;
      }
    }

    &.right {
      &:after {
        content: "\2022";
        position: absolute;
        color: $white;
        font-size: 35px;
        top: calc(50% - 22.5px);
        right: 80px;
        z-index: 3;
      }
    }
  }

  .center {
    position: absolute;
    width: 130px;
    height: 130px;
    border: 3px solid $white;
    left: calc(50% - 67.5px);
    top: calc(50% - 67.5px);
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;

    &::after {
      background-color: $white;
      border: 5px solid $white;
      bottom: 55px;
      content: "";
      left: 55px;
      position: absolute;
      right: 55px;
      top: 55px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
    }
  }

  .p-place {
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    height: 130px;
    position: absolute;
    width: 150px;
    z-index: 1;
    border: 3px solid transparent;

    &.left {
      border-bottom-color: $white;
      border-right-color: $white;
      border-top-color: $white;
      left: 0;
      top: calc(50% - 67px);
    }

    &.right {
      border-bottom-color: $white;
      border-left-color: $white;
      border-top-color: $white;
      right: 0;
      top: calc(50% - 67px);
    }
  }
}

@include mobile {
  .football-field {

    .half {
      width: 100%;
      height: 50%;
      border-bottom-color: $white;
      border-bottom-style: solid;
      border-bottom-width: 4px;
      border-right-width: 0;
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

    .p-spot {
      &.left {
        &:after {
          left: calc(50% - 8px);
          top: 60px;
        }
      }

      &.right {
        &:after {
          bottom: 60px;
          left: calc(50% - 8px);
          right: auto;
          top: auto;
        }
      }
    }

    .p-place {
      height: 150px;
      width: 130px;

      &.left {
        border-top-color: transparent;
        border-bottom-color: $white;
        border-right-color: $white;
        border-left-color: $white;
        left: calc(50% - 68px);
        top: 0;
      }

      &.right {
        border-top-color: $white;
        border-bottom-color: transparent;
        border-right-color: $white;
        border-left-color: $white;
        left: calc(50% - 68px);
        bottom: 0;
        right: auto;
        top: auto;
      }
    }
  }
}
</style>
