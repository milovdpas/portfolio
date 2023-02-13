<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>Experience</h1>
            <div class="underline"/>
            <p class="description">My experience in my work field and life</p>
          </div>
          <div class="ctas row">
            <CTA class="col" link="#program" color="yellow" :icon="icons.down">Program Skills</CTA>
            <CTA class="col" link="#social" color="green" :icon="icons.down">Social Skills</CTA>
            <CTA class="col" link="#jobs" color="orange" :icon="icons.down">Jobs</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="program" class="program-skills">
        <button id="spawnButton" class="spawn-button" @click="spawnSkill">Skills. Click me</button>
        <div id="tooltip" class="custom-tooltip">
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
          <div class="popup-text">
            Your photos are safely stored in a data center in your geographical
            zone only accessible by you. Don't worry. You're in good hands!
          </div>
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
import Footer from "@/components/Footer.vue";
import CTA from "@/components/buttons/CTA.vue";
import anime from "animejs"
import Physics from '@/utils/Physics'
import nodejs from '@/assets/images/languages/nodejs.svg?raw'
import csharp from '@/assets/images/languages/csharp.svg?raw'
import mysql from '@/assets/images/languages/mysql.svg?raw'
import vue from '@/assets/images/languages/vue.svg?raw'
import fsharp from '@/assets/images/languages/fsharp.svg?raw'


export default {
  name: "ExperienceView",
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
      skills: [
        {
          svgBody: Physics.getSvgBody(this.getRandomPosition(), nodejs, 4, true),
          raw: nodejs,
          scale: 1.953125,
          offset: {
            x: 60,
            y: 60
          },
          info: "I Learned Node.js during my first internship, I would consider myself as an expert."
        },
        {
          svgBody: Physics.getSvgBody(this.getRandomPosition(), csharp, 0.3, true),
          raw: csharp,
          scale: 0.3*0.12,
          offset: {
            x: 40,
            y: 52
          },
          info: "I Learned C# during my bachelor degree and got good at it in my final internship at IO Digital."
        },
        {
          svgBody: Physics.getSvgBody(this.getRandomPosition(), mysql, 0.75, false),
          raw: mysql,
          scale: 0.75*0.12,
          offset: {
            x: 60,
            y: 60
          },
          info: "I have many years experience with MySql, i would consider myself an expert."
        },
        {
          svgBody: Physics.getSvgBody(this.getRandomPosition(), vue, 0.3, false),
          raw: vue,
          scale: 0.3*0.12,
          offset: {
            x: 60,
            y: 60
          },
          info: "I learned Vue.js at my first intership, I prefer this frontend framework above the others."
        },
        {
          svgBody: Physics.getSvgBody(this.getRandomPosition(), fsharp, 1, true),
          raw: fsharp,
          scale: 0.25,
          offset: {
            x: 60,
            y: 60
          },
          info: "I learned F# during my bachelor degree, i would consider myself as a beginner."
        },
      ],
      usedSkills: []
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {
    setTimeout(() => this.scrollFix(this.$route.hash));
    this.startPhysics();
    window.addEventListener('resize', () => {
      Physics.OnResize(window.innerWidth, window.innerHeight);
    });
  },
  methods: {
    scrollFix(hash) {
      if (!hash)
        return;
      const id = hash.replace('#', '');
      setTimeout(function () {
        if (id === 'program') {
          anime({
            targets: document.getElementById('app'),
            scrollTop: window.innerHeight,
            duration: 1000,
            easing: 'easeInOutQuad'
          })
        }
      }, 1000)
    },
    startPhysics() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      Physics.SetRender('program', width, height, '#FFD93D');
      Physics.SetWalls();
      Physics.SetMouse('program', 0.2);
      Physics.Start();
      document.getElementsByTagName('canvas')[0].allowTouchScrolling = true;
    },
    spawnSkill() {
      const spawnButton =  document.getElementById('spawnButton');
      spawnButton.classList.add('shake');
      setTimeout(function(){
        spawnButton.classList.remove('shake');
      }, 500);
      if (this.skills.length > 0) {
        const index = Math.floor(Math.random() * this.skills.length);
        const skill = this.skills[index];
        this.skills.splice(index, 1);
        this.usedSkills.push(skill.svgBody);
        Physics.AddSvg(skill);
      }else{
        const index = Math.floor(Math.random() * this.usedSkills.length);
        const skill = this.usedSkills[index];
        Physics.UpdatePosition(skill, this.getRandomPosition());
      }
    },
    getRandomPosition() {
      return {x: Math.floor(Math.random() * window.innerWidth), y: 200};
    },
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
      height: 75%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        font-size: 25px;
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
    background-color: $red;
  }
}

/* Program skills */
.program-skills {
  position: relative;
  height: 100vh;
  background-color: $yellow;

  canvas {
    position: relative;
    z-index: 1;
  }

  .spawn-button {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 150px;
    margin: auto;
    margin-top: 12.5%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: $black;
    color: $white;
    font-size: 55px;
    line-height: 65px;
    z-index: 3;
  }

  .spawn-button:hover {
    cursor: pointer;
  }

  @-webkit-keyframes shaker {
    0% { -webkit-transform: translate(2px, 0); }
    50% { -webkit-transform: translate(-2px, 0); }
    100% { -webkit-transform: translate(2px, 0); }
  }

  .shake {
    -webkit-animation-name: shaker;
    -webkit-animation-duration: 0.1s;
    -webkit-transform-origin:50% 50%;
    -webkit-animation-timing-function: linear;
  }
}

/* Tooltip */
.custom-tooltip {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  opacity: 0;
  transition: 0.5s opacity;
}

.custom-tooltip.show {
  opacity: 1;
  cursor: help;
}

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
}

.popup-text {
  display: block;
  position: absolute;
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

@include mobile {
  .header {
    .content {
      width: 100%;
      h1{
        z-index: 1;
      }
    }

    .underline{
      background-color: #FF6B6B;
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

}

</style>
