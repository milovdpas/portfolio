<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>About me</h1>
            <div class="underline"/>
            <p class="description">A little guide about who I am and what I love to do outside work</p>
          </div>
          <div class="ctas row">
            <CTA class="col-md-4" link="#general" color="yellow" :icon="icons.down">General</CTA>
            <CTA class="col-md-4 font-small" link="#country" color="green" :icon="icons.down">Country of origin</CTA>
            <CTA class="col-md-4" link="#hobbies" color="red" :icon="icons.down">Hobbies</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="general" class="general">
        <div class="row h-100">
          <div class="col-md-7 introduction">
            <h2>Hi, I'm Milo</h2>
            <p>
              Full Stack developer and ux designer fascinated by the possibilities code gives.
            </p>
            <p>
              Currently finishing my bachelor in computer science at Avans university in Den Bosch.
            </p>
          </div>
          <div class="col-md-5 image">
            <img :src="me" alt="Picture of me"/>
          </div>
        </div>
      </section>
      <section id="country" class="country">
        <div class="row h-100">
          <div class="col-md-7 introduction">
            <h2>Country of origin</h2>
            <p>
              I was born in Oss, Noord-Brabant in the Netherlands. I Still live here too.
            </p>
          </div>
          <div class="col-md-5 image">
            <img :src="netherlands" alt="country"/>
          </div>
        </div>
      </section>
      <section id="hobbies" class="hobbies">
        <h2>Football</h2>
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
      </section>
    </main>
    <section>
      <Footer/>
    </section>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Button from "../components/buttons/MoreButton.vue";
import Footer from '../components/Footer.vue'
import CTA from "@/components/buttons/CTA.vue";

export default {
  name: "AboutMeView",
  components: {
    Menu,
    Button,
    Footer,
    CTA
  },
  data() {
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href
      },
      me: new URL(`../assets/images/me.jpg`, import.meta.url).href,
      netherlands: new URL(`../assets/images/netherlands/netherlands.svg`, import.meta.url).href
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {},
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" scoped>
/* Header */
.header {
  display: flex;
  height: 100vh;

  .content {
    height: 100vh;
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
    height: 100vh;
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
  height: 100vh;
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
  height: 100vh;
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

/* Hobbies */
.hobbies {
  position: relative;
  height: 100vh;
  background-color: $orange;

  h2 {
    position: absolute;
    top: 1em;
    left: 2em;
    font-size: 50px;
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
        bottom: -6px;
        content: "";
        left: -9px;
        position: absolute;
        right: -6px;
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
  }

  /* Hobbies */
  .hobbies {
    h2 {
      font-size: 35px;
      top: 30%;
      right: 0;
      left: 0;
    }
    .football-field {

      .half {
        width: 100%;
        height: 50%;
        border-bottom-color: #FFFFFF;
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
}

</style>
