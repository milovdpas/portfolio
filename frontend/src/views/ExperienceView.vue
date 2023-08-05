<template>
  <div>
    <Menu></Menu>
    <main>
      <section id="header" class="header">
        <div class="content">
          <div class="text">
            <h1>Experience</h1>
            <div class="underline"/>
            <p class="description">My experience in my work field and life</p>
          </div>
          <div class="ctas row">
            <CTA class="col-md-4" link="#program" color="yellow" :icon="icons.down">Program Skills</CTA>
            <CTA class="col-md-4" link="#social" color="green" :icon="icons.down">Social Skills</CTA>
            <CTA class="col-md-4" link="#jobs" color="orange" :icon="icons.down">Jobs</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="program" class="program-skills">
        <button id="spawn-button" class="spawn-button" @click="spawnSkill">Skills. Click me</button>
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
          </div>
        </div>
        <canvas id="program-canvas"></canvas>
      </section>
      <section id="jobs" class="jobs">
        <div class="title">
          <h2>Jobs</h2>
        </div>
        <TimelineSlider :timePeriods="timePeriods"/>
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
import TimelineSlider from "@/components/sliders/TimelineSlider.vue";
import PhysicsWorker from '@/utils/PhysicsWorker?worker';
import PhysicsRenderer from "@/utils/PhysicsRenderer";
import nodejs from "@/assets/images/languages/nodejs.svg?raw";
import csharp from "@/assets/images/languages/csharp.svg?raw";
import mysql from "@/assets/images/languages/mysql.svg?raw";
import vue from "@/assets/images/languages/vue.svg?raw";
import fsharp from "@/assets/images/languages/fsharp.svg?raw";
import PhysicsHelper from "@/utils/PhysicsHelper";

export default {
  name: "ExperienceView",
  components: {
    Menu,
    Button,
    Footer,
    CTA,
    TimelineSlider
  },
  data() {
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href,
      },
      worker: new PhysicsWorker(),
      skills: [
        {
          href: new URL(`../assets/images/languages/nodejs.svg`, import.meta.url).href,
          offset: {
            x: 60,
            y: 60
          },
          info: "I Learned Node.js during my first internship, I would consider myself as an expert."
        },
        {
          href: new URL(`../assets/images/languages/csharp.svg`, import.meta.url).href,
          offset: {
            x: 40,
            y: 52
          },
          info: "I Learned C# during my bachelor degree and got good at it in my final internship at IO Digital."
        },
        {
          href: new URL(`../assets/images/languages/mysql.svg`, import.meta.url).href,
          offset: {
            x: 60,
            y: 60
          },
          info: "I have many years experience with MySql, i would consider myself an expert."
        },
        {
          href: new URL(`../assets/images/languages/vue.svg`, import.meta.url).href,
          offset: {
            x: 60,
            y: 30
          },
          info: "I learned Vue.js at my first intership, I prefer this frontend framework above the others."
        },
        {
          href: new URL(`../assets/images/languages/fsharp.svg`, import.meta.url).href,
          offset: {
            x: 60,
            y: 60
          },
          info: "I learned F# during my bachelor degree, i would consider myself as a beginner."
        },
      ],
      timePeriods: [
        {
          title: 'Internship at iO',
          period: {
            short: '2022 jan.',
            long: '2022 jan. - today'
          },
          description: 'This was my graduation internship at iO, me and Wessel van Tilburg created a reservation app with a microservices backend architecture. During this internship I learned a lot about app development, DevOps, different architectures and bettered my presentation skills.'
        },
        {
          title: 'Junior Full Stack developer at LiveWall Group',
          period: {
            short: '2021 aug.',
            long: '2021 aug. - jan. 2023'
          },
          description: 'I started as an intern at LiveWall Group, during this period I worked on 17 different PHP and Node.js projects for customers, made a Node.js API boilerplate with the Express.js framework and created a application that scanned a Word document and would automatically generate a documentation website out of the document. The boilerplate consisted of default middlewares for Basic, Firebase, secret and OAuth authentication, a rate limiter and an ip checker. It also had modules for Caching, Dates, exporting of CSV and excel files, filesystem implementations for local, public and Google Cloud Storage, Image manipulation and sending mails (including attachments). The boilerplate also had utils for Api responses, Axios requests, Encryption, Hashing and ErrorReporting/Logging to the cloud. To minimize the develop time for developers, commands were created do automatically create controllers, models and migrations, an ORM was implemented so that developers did not have to write there own Queries for retrieving data from a database, standard validation was implemented so that this could be written fast and config files were configured so that a new project could be setup really fast with specific needs.'
        },
        {
          title: 'Cook at Friethuys',
          period: {
            short: '2019 feb.',
            long: '2019 feb. - 2022 okt.'
          },
          description: 'During this job I developed my communication skills and learned to work together with other people.'
        },
        {
          title: 'Factory worker at Cups4You',
          period: {
            short: '2018 apr.',
            long: '2018 apr. - 2018 juli.'
          },
          description: 'After I graduated from high school I worked here for a couple months and this gave me the perspective that I absolutely did not want to be a factory worker :).'
        },
        {
          title: 'Co-driver at Vos Logistics',
          period: {
            short: '2017 jun.',
            long: '2017 jun. - 2017 aug.'
          },
          description: 'This was my first summer job and I learned a lot about communicating with people. This was important, because of the heavy lifting that we did. Like washing machines, refrigerators, couches etc.'
        },
      ],
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  },
  mounted() {
    setTimeout(this.startPhysics, 100);
    this.addEventListeners();
  },
  methods: {
    addEventListeners() {
      window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.worker.postMessage({
          cmd: 'resize',
          width: width,
          height: height,
        }, []);
        PhysicsRenderer.Resize(width, height);
      });
      document.getElementById('spawn-button').addEventListener('touchend', this.spawnSkill);
    },
    getSkills(isMobile,width){
      const points = [
        PhysicsHelper.GetRandomPosition(width),
        PhysicsHelper.GetRandomPosition(width),
        PhysicsHelper.GetRandomPosition(width),
        PhysicsHelper.GetRandomPosition(width),
        PhysicsHelper.GetRandomPosition(width)
      ];
      return [
        {
          point: points[0],
          vertices: PhysicsHelper.GetVerticesOfSvg(points[0], nodejs, 4 * (isMobile ? 0.5 : 1), true),
        },
        {
          point: points[1],
          vertices: PhysicsHelper.GetVerticesOfSvg(points[1], csharp, 0.3 * (isMobile ? 0.5 : 1), true),
        },
        {
          point: points[2],
          vertices: PhysicsHelper.GetVerticesOfSvg(points[2], mysql, 0.75 * (isMobile ? 0.5 : 1), false),
        },
        {
          point: points[3],
          vertices: PhysicsHelper.GetVerticesOfSvg(points[3], vue, 0.3 * (isMobile ? 0.5 : 1), false),
        },
        {
          point: points[4],
          vertices: PhysicsHelper.GetVerticesOfSvg(points[4], fsharp, 1 * (isMobile ? 0.5 : 1), true),
        },
      ];
    },
    async startPhysics() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.worker.addEventListener('message', (e) => {
        const data = e.data;
        if(data.status === 'init_finished'){
          PhysicsRenderer.SetRender('program-canvas', width, height, this.isMobile());
        }else if(data.status === 'add_body'){
          const index = data.index;
          const skill = this.skills[index];
          this.skills.splice(index, 1);
          PhysicsRenderer.AddSvg(data.body, skill);
        }else if(data.status === 'update_body'){
          PhysicsRenderer.UpdateSvg(data.body);
        }
      }, false);
      const skills = this.getSkills(this.isMobile(),width);
      this.worker.postMessage({
        cmd: 'init',
        width: width,
        height: height,
        skills:JSON.stringify(skills),
      }, []);
    },
    spawnSkill() {
      const spawnButton = document.getElementById('spawn-button');
      spawnButton.classList.add('shake');
      setTimeout(function () {
        spawnButton.classList.remove('shake');
      }, 500);
      this.worker.postMessage({
        cmd: 'add_skill',
      });
    },
    scroll(up) {
      document.getElementById(up ? 'header' : 'jobs').scrollIntoView({
        behavior: 'smooth',
      });
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
    font-weight: bold;
    line-height: 65px;
    z-index: 3;
  }

  .down-button {
    position: absolute;
    width: 50px;
    height: 50px;
    right: 25px;
    bottom: 25px;
    border-radius: 25px;
    border: none;
    background: black;
    color: white;
    z-index: 3;

    img {
      width: 20px;
      height: 20px;
      filter: brightness(0) invert(1);
    }
  }

  .up-button {
    position: absolute;
    width: 50px;
    height: 50px;
    right: 25px;
    bottom: 87.5px;
    border-radius: 25px;
    border: none;
    background: black;
    color: white;
    z-index: 3;

    img {
      width: 20px;
      height: 20px;
      filter: brightness(0) invert(1);
      transform: rotate(180deg);
    }
  }

  @-webkit-keyframes shaker {
    0% {
      -webkit-transform: translate(2px, 0);
    }
    50% {
      -webkit-transform: translate(-2px, 0);
    }
    100% {
      -webkit-transform: translate(2px, 0);
    }
  }

  .shake {
    -webkit-animation-name: shaker;
    -webkit-animation-duration: 0.1s;
    -webkit-transform-origin: 50% 50%;
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

.custom-tooltip.mirror{
  .popup-bg{
    left: -50px;
    transform: rotateZ(180deg) rotateX(180deg);
  }
  .popup-outline{
    left: -50px;
    transform: rotateZ(180deg) rotateX(180deg);
  }
  .popup-text{
    left: -42px;
    top: -120px;
  }
}

/** Jobs **/
.jobs {
  position: relative;
  height: 100vh;
  background-color: $orange;
  text-align: left;

  .title {
    position: absolute;
    padding: 3em 5em 0 5em;
    background: #fcac45;
    z-index: 2;
    width: 75%;

    h2 {
      font-size: 50px;
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
      background-color: $red;
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

  .jobs {
    .title {
      padding: 2em 2em 0 2em;

      h2 {
        font-size: 35px;
      }
    }
  }
}
</style>
