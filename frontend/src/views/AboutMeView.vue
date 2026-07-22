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
            <h3>{{ hobbies[hobbiesIndex].name }}</h3>
          </div>
          <div class="right">
            <RoundButton v-if="hobbiesIndex > 0" :icon="icons.right" :method="previousHobby" style="transform: rotate(180deg); width: 60px; height: 60px;"/>
            <RoundButton  v-if="hobbiesIndex !== hobbies.length-1" :icon="icons.right" :method="nextHobby" style="width: 60px; height: 60px;"/>
          </div>
        </div>
        <component v-for="(hobby, index) in hobbies" :key="hobby.component" :is="hobby.component"
                   v-show="hobbiesIndex === index"/>
        <button v-if="!activeGame && hobbies[hobbiesIndex].game" class="play-button"
                @click="activeGame = hobbies[hobbiesIndex].game">
          ▶ {{ $t('games.play') }}
        </button>
        <GameOverlay v-if="activeGame" @close="activeGame = null">
          <component :is="activeGame"/>
        </GameOverlay>
      </section>
    </main>
    <section>
      <Footer/>
    </section>
  </div>
</template>

<script>
import {defineAsyncComponent} from "vue";
import Menu from "../components/Menu.vue";
import Footer from '../components/Footer.vue'
import CTA from "@/components/buttons/CTA.vue";
import RoundButton from "@/components/buttons/RoundButton.vue";
import FootballField from "@/components/hobbies/FootballField.vue";
import WaterpoloField from "@/components/hobbies/WaterpoloField.vue";
import RunningRoute from "@/components/hobbies/RunningRoute.vue";
import GameOverlay from "@/components/games/GameOverlay.vue";
import {isMobile} from "@/utils/device";

export default {
  name: "AboutMeView",
  components: {
    RoundButton,
    Menu,
    Footer,
    CTA,
    FootballField,
    WaterpoloField,
    RunningRoute,
    GameOverlay,
    // Games are lazy chunks: nothing loads until Play is pressed.
    RunnerGame: defineAsyncComponent(() => import('@/components/games/RunnerGame.vue')),
    AirHockeyGame: defineAsyncComponent(() => import('@/components/games/AirHockeyGame.vue')),
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
      activeGame: null,
    }
  },
  computed: {
    // One entry per hobby: display name, the field component drawn behind it
    // and the mini-game that can be played on it.
    hobbies() {
      return [
        {name: this.$t('about.hobbies.football'), component: 'FootballField', game: 'AirHockeyGame'},
        {name: this.$t('about.hobbies.waterpolo'), component: 'WaterpoloField', game: null},
        {name: this.$t('about.hobbies.running'), component: 'RunningRoute', game: 'RunnerGame'},
      ];
    }
  },
  watch: {
    hobbiesIndex() {
      // Switching hobby closes a running game.
      this.activeGame = null;
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

  .play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    border: none;
    border-radius: 50%;
    background-color: $black;
    color: $white;
    font-family: inherit;
    font-size: 26px;
    font-weight: bold;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.2s;
    animation: play-pulse 2s ease-in-out infinite;

    &::after {
      // Radar-ping ring inviting a click.
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      animation: play-ping 2s ease-out infinite;
    }

    &:hover {
      animation: none;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
}

@keyframes play-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.06);
  }
}

@keyframes play-ping {
  0% {
    box-shadow: 0 0 0 0 rgba(17, 17, 18, 0.4);
  }
  75% {
    box-shadow: 0 0 0 28px rgba(17, 17, 18, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(17, 17, 18, 0);
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
  }
}

</style>
