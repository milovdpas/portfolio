<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>{{ $t('about.title') }}</h1>
            <div class="underline"/>
            <p class="description">{{ $t('about.description') }}</p>
          </div>
          <div class="ctas row">
            <CTA class="col-md-4" link="#general" color="yellow" :icon="icons.down">{{ $t('about.ctaGeneral') }}</CTA>
            <CTA class="col-md-4 font-small" link="#country" color="green" :icon="icons.down">{{ $t('about.ctaCountry') }}</CTA>
            <CTA class="col-md-4" link="#hobbies" color="red" :icon="icons.down">{{ $t('about.ctaHobbies') }}</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="general" class="general">
        <div class="row h-100">
          <div class="col-md-7 introduction">
            <h2>{{ $t('about.generalTitle') }}</h2>
            <p>
              {{ $t('about.generalP1') }}
            </p>
            <p>
              {{ $t('about.generalP2') }}
            </p>
          </div>
          <div class="col-md-5 image">
            <img v-once :src="me" width="910" height="1792" alt="Picture of me"/>
          </div>
        </div>
      </section>
      <section id="country" class="country">
        <div class="row h-100">
          <div class="col-md-7 introduction">
            <h2>{{ $t('about.countryTitle') }}</h2>
            <p>
              {{ $t('about.countryP1') }}
            </p>
          </div>
          <div class="col-md-5 image">
            <img v-once :src="netherlands" width="612" height="723" alt="country"/>
            <img v-once class="bike" :src="bike" width="95" height="95" alt="bike"/>
          </div>
        </div>
      </section>
      <section id="hobbies" class="hobbies">
        <div class="header">
          <div class="left">
            <h2>{{ $t('about.hobbiesTitle') }}</h2>
            <h3>{{ hobbies[hobbiesIndex] }}</h3>
          </div>
          <div class="right">
            <RoundButton v-if="hobbiesIndex > 0" :icon="icons.right" :method="previousHobby" style="transform: rotate(180deg); width: 60px; height: 60px;"/>
            <RoundButton  v-if="hobbiesIndex !== hobbies.length-1" :icon="icons.right" :method="nextHobby" style="width: 60px; height: 60px;"/>
          </div>
        </div>
        <div class="football-field" :style="(hobbiesIndex === 0 ? '' : 'display: none;')">
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
        <div class="waterpolo-field" :style="(hobbiesIndex === 1 ? '' : 'display: none;')">
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
      </section>
    </main>
    <section>
      <Footer/>
    </section>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Footer from '../components/Footer.vue'
import CTA from "@/components/buttons/CTA.vue";
import RoundButton from "@/components/buttons/RoundButton.vue";
import {isMobile} from "@/utils/device";

export default {
  name: "AboutMeView",
  components: {
    RoundButton,
    Menu,
    Footer,
    CTA
  },
  data() {
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href,
        right: new URL(`../assets/images/icons/right-arrow.svg`, import.meta.url).href,
      },
      me: new URL(`../assets/images/me.jpg`, import.meta.url).href,
      netherlands: new URL(`../assets/images/netherlands/netherlands2.svg`, import.meta.url).href,
      bike: new URL(`../assets/images/netherlands/bike.svg`, import.meta.url).href,
      hobbiesIndex: 0,
    }
  },
  computed: {
    hobbies() {
      return [
        this.$t('about.hobbies.football'),
        this.$t('about.hobbies.waterpolo'),
      ];
    }
  },
  methods: {
    previousHobby(){
      this.hobbiesIndex--;
    },
    nextHobby(){
      this.hobbiesIndex++;
    },
    isMobile
  }
}
</script>

<style lang="scss" scoped>
/* Header */
.header {
  display: flex;
  @include full-height;

  .content {
    @include full-height;
    width: 67.5%;

    .text {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 75%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        width: 75%;
        font-size: 22.5px;
        font-weight: normal;
      }
    }

    .ctas {
      height: 25%;
      width: 100%;
      margin: 0;
    }
  }

  .side-bar {
    @include full-height;
    width: 32.5%;
    background-color: $orange;
  }

  .font-small {
    font-size: 27.5px;
  }
}

/* General */
.general {
  position: relative;
  @include full-height;
  padding: 3em 5em;
  background-color: $yellow;

  .introduction {
    text-align: left;
  }

  .image {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 600px;
      border-radius: 0 15px 0 15px;
    }
  }

  p {
    font-size: 27.5px;
  }

  h2 {
    font-size: 50px;
  }
}

/* Country */
.country {
  position: relative;
  @include full-height;
  padding: 3em 5em;
  background-color: $green;

  .introduction {
    text-align: left;
  }

  .image {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 600px;
      border-radius: 0 15px 0 15px;
    }
    .bike{
      position: absolute;
      right: 7%;
      top: 20%;
    }
  }

  p {
    font-size: 27.5px;
  }

  h2 {
    font-size: 50px;
  }
}

/* Hobbies */
.hobbies {
  position: relative;
  @include full-height;
  background-color: $orange;

  .header{
    position: absolute;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: min-content;
    top: 0;
    left: 0;
    padding: 2em 7em 0 4em;
    z-index: 3;
    .left{
      text-align: left;
      h2 {
        font-size: 50px;
        z-index: 2;
        margin-bottom: 0;
      }
      h3{
        font-size: 35px;
        z-index: 2;
        color: #111112;
      }
    }
    .right{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .football-field {
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
  .waterpolo-field {
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
}

@include mobile {
  .header {
    .content {
      width: 100%;

      h1 {
        z-index: 1;
      }

      .text {
        height: 60%;
      }

      .ctas {
        height: 40%;
        // Keep the last stacked CTA above the OS gesture bar / home indicator.
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
    }

    .underline {
      background-color: $orange;
      height: 5px;
      width: 75%;
      align-self: center;
      transform: translateY(-14px);
      z-index: 0;
    }

    .side-bar {
      display: none;
    }
  }

  /* General */
  .general {
    padding: 2em 2em;
    p {
      font-size: 17.5px;
    }

    h2 {
      font-size: 35px;
    }

    .image {
      img {
        max-height: 300px;
      }
    }
  }

  /* Country */
  .country {
    padding: 2em 2em;
    p {
      font-size: 17.5px;
    }

    h2 {
      font-size: 35px;
    }

    .image {
      .bike{
        width: 17.5%;
        top: 42%;
        right: 9%;
      }
    }
  }

  /* Hobbies */
  .hobbies {
    .header{
      top: 25%;
      padding: 0;
      justify-content: center;
      gap: 2em;
      .left{
        text-align: left;
        h2 {
          font-size: 35px;
        }
        h3{
          font-size: 30px;
        }
      }
      .right{
      }
    }
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
}

</style>
