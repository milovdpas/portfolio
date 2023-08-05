<template>
  <div>
    <Menu></Menu>
    <main class="home">
      <section class="header">
        <div class="title">
          <h1>MilovdPas</h1>
          <h1>MilovdPas</h1>
        </div>
        <h2 id="message" class="message">
          <span>always</span>
          <span class="slogan">
              &#8203;
              <span id="slogan" class="text">
              {{ slogans[sloganIndex] }}
              </span>
            </span>
        </h2>
      </section>
      <section id="projects" class="section">
        <h2>Projects</h2>
        <SlideShow :cards="projectCards"/>
        <div class="button-container">
          <MoreButton link="/projects">SHOW MORE</MoreButton>
        </div>
      </section>
      <section id="experience" class="section">
        <h2>Experience</h2>
        <SlideShow :cards="experienceCards"/>
        <div class="button-container">
          <MoreButton link="/experience">READ MORE</MoreButton>
        </div>
      </section>
      <section id="about_me" class="section">
        <h2>About me</h2>
        <SlideShow :cards="aboutCards"/>
        <div class="button-container">
          <MoreButton link="/about_me">LEARN MORE</MoreButton>
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
import MoreButton from "../components/buttons/MoreButton.vue";
import Footer from "@/components/Footer.vue";
import SlideShow from "@/components/cards/SlideShow.vue";
import svg from "@/assets/images/netherlands/netherlands.svg?raw"

export default {
  name: "HomeView",
  components: {
    Menu,
    MoreButton,
    SlideShow,
    Footer,
  },
  data() {
    return {
      slogans: ['coding', 'sporting', 'creating'],
      sloganIndex: 0,
      timeOut: 0,
      projectCards: [
        {
          type: 'image',
          image: new URL(`../assets/images/placeholder.png`, import.meta.url).href,
          tag: {
            color: 'red',
            text: 'Livewall Group'
          },
          title: "McDonalds Games",
          description: "Tijdens mijn stage heb ik meegewerkt aan meerdere McDonalds games."
        },
        {
          type: 'image',
          image: new URL(`../assets/images/placeholder.png`, import.meta.url).href,
          tag: {
            color: 'blue',
            text: 'Livewall Group'
          },
          title: "McDonalds Games",
          description: "Tijdens mijn stage heb ik meegewerkt aan meerdere McDonalds games."
        },
        {
          type: 'image',
          image: new URL(`../assets/images/placeholder.png`, import.meta.url).href,
          title: "McDonalds Games",
          tag: {
            color: 'orange',
            text: 'Livewall Group'
          },
          description: "Tijdens mijn stage heb ik meegewerkt aan meerdere McDonalds games."
        },
      ],
      experienceCards: [
        {
          type: 'skill',
          title: "Program Skills",
          skills: [
            {
              label: 'Frontend (html/css3/bootstrap/vue)',
              placeholder: 'Intermediate',
              percentage: 80
            },
            {
              label: 'Javascript (NodeJs, Express.js, typescript)',
              placeholder: 'Expert',
              percentage: 90
            },
            {
              label: 'C (C++, C#, .net core)',
              placeholder: 'Intermediate',
              percentage: 85
            },
            {
              label: 'PHP (Laravel, Laravel orchid)',
              placeholder: 'Expert',
              percentage: 90
            },
            {
              label: 'Mobile (React native, swift,  java)',
              placeholder: 'Beginner',
              percentage: 60
            },
            {
              label: 'Database (MySQL, MongoDB)',
              placeholder: 'Expert',
              percentage: 90
            }
          ],
        },
        {
          type: 'skill',
          title: "Social Skills",
          skills: [
            {
              label: 'Problem solving ability',
              placeholder: '',
              percentage: 80
            },
            {
              label: 'Flexibility & adaptability',
              placeholder: '',
              percentage: 90
            },
            {
              label: 'Team player',
              placeholder: '',
              percentage: 80
            },
            {
              label: 'Honesty',
              placeholder: '',
              percentage: 85
            },
            {
              label: 'Loyalty',
              placeholder: '',
              percentage: 90
            }
          ],
        },
        {
          type: 'timeline',
          title: "Jobs",
          items: [
            {
              title: 'Junior Full Stack developer at iO',
              timePeriod: 'jan. 2023 - jun. 2023'
            },
            {
              title: 'Junior Full Stack developer at LiveWall',
              timePeriod: 'aug. 2021 - jan. 2023'
            },
            {
              title: 'Junior Chef at Friethuys',
              timePeriod: 'feb. 2019 - oct. 2022'
            },
            {
              title: 'Factory worker at Cups4You',
              timePeriod: 'apr. 2018 - jul. 2018'
            },
            {
              title: 'Co driver at Vos logistics',
              timePeriod: 'jun. 2017 - aug. 2017'
            },
          ],
        }
      ],
      aboutCards: [
        {
          type: 'text',
          title: "General",
          text: "<p>Young 21 year old, who is passionate about programming and the people around him.</p>" +
              "<p>I have almost finished my bachelor degree in computer science at Avans university in Den Bosch.</p>",
        },
        {
          type: 'svg',
          title: "Country of origin",
          svg: svg,
          alt: 'netherlands image'
        },
        {
          type: 'bullet-points',
          title: "Hobbies",
          bulletPoints: [
            {
              icon: {
                src: new URL(`../assets/images/icons/football.svg`, import.meta.url).href,
                alt: 'Football icon'
              },
              title: 'Football',
            },
            {
              icon: {
                src: new URL(`../assets/images/icons/waterpolo.svg`, import.meta.url).href,
                alt: 'Waterpolo icon'
              },
              title: 'Waterpolo',
            },
            {
              icon: {
                src: new URL(`../assets/images/icons/friends.svg`, import.meta.url).href,
                alt: 'Friends icon'
              },
              title: 'Hangout with friends',
            },
            {
              icon: {
                src: new URL(`../assets/images/icons/party.svg`, import.meta.url).href,
                alt: 'Party icon'
              },
              title: 'Party',
            },
          ],
        }
      ],
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {
    this.addEventListeners();
    if (this.isMobile()) {
      const projects = document.getElementById('projects');
      const swiper = document.getElementsByClassName('swiper')[0];
      const swiperPagination = document.getElementsByClassName('swiper-pagination')[0];
      swiperPagination.style.bottom = '0';
      swiperPagination.style.position = 'relative';
      swiperPagination.style.margin = '0';
      swiper.removeChild(swiperPagination);
      projects.insertBefore(swiperPagination, projects.children[2]);
    }
  },
  methods: {
    addEventListeners() {
      const slogan = document.getElementById('slogan');
      slogan.addEventListener('animationstart', () => {
        setInterval(this.nextSlogan, 1450);
      });
    },
    nextSlogan(){
      this.timeOut += 50;
      setTimeout(() => {
        if(this.sloganIndex === this.slogans.length-1){
          this.sloganIndex = 0;
          return;
        }
        this.sloganIndex++;
      }, this.timeOut)
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  flex-flow: column;
  background-image: url("../assets/images/backgrounds/background.svg");
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.header {
  height: 100vh;
  padding-top: 5em;
}

/* Header title */
.title {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
}

h1 {
  color: #fff;
  font-size: 8em;
  position: absolute;
}

h1:nth-child(1) {
  color: transparent;
  -webkit-text-stroke: 2px $blue;
}

h1:nth-child(2) {
  color: $blue;
  animation: animate 4s ease-in-out infinite;
}

@keyframes animate {
  0%,
  100% {
    clip-path: polygon(
            0% 45%,
            16% 44%,
            33% 50%,
            54% 60%,
            70% 61%,
            84% 59%,
            100% 52%,
            100% 100%,
            0% 100%
    );
  }

  50% {
    clip-path: polygon(
            0% 60%,
            15% 65%,
            34% 66%,
            51% 62%,
            67% 50%,
            84% 45%,
            100% 46%,
            100% 100%,
            0% 100%
    );
  }
}

/* Header message */
.message {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .25em;
  margin-top: 250px;
  margin-right: 220px;

  font-family: tahoma, serif;
  font-size: 3rem;
  font-weight: 100;
  line-height: 1.5;
  text-transform: uppercase;
  white-space: nowrap;
  color: #333;

  span {
    font-size: 40px;
  }

  .slogan {
    position: relative;

    .text {
      position: absolute;
      overflow: hidden;
      text-align: left;
      margin: 0;
      background-color: $blue;
      color: $white;
      font-weight: 900;
      padding-left: 0.5rem;
      animation: openclose 1.5s ease-in-out infinite;
    }
  }
}

@keyframes openclose {
  0% {
    width: 0;
  }
  15% {
    width: 0;
  }
  45% {
    width: 235px;
  }
  90% {
    width: 235px;
  }
  100% {
    width: 0;
  }
}

/* projects */
.section {
  display: flex;
  flex-flow: column;
  justify-content: center;
  height: 100vh;
  padding: 0 5em !important;

  h2 {
    font-size: 50px;
    margin-bottom: 1em;
  }

  .button-container {
    display: flex;
    justify-content: end;
    padding-right: 1em;
    padding-top: 1em;
  }
}

@include mobile {
  h1 {
    font-size: 4em;
  }

  .section {
    h2 {
      margin-top: 1em;
    }
  }

  .message {
    position: absolute;
    left: 25%;
    /* top: 50%; */
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    transform: translateX(-50%);
    span{
      font-size: 30px;
    }
  }

  @keyframes openclose {
    0% {
      width: 0;
    }
    15% {
      width: 0;
    }
    45% {
      width: 180px;
    }
    90% {
      width: 180px;
    }
    100% {
      width: 0;
    }
  }

  .section {
    padding: 0 !important;

    .swiper {
      width: 100%;
    }

    .button-container {
      position: relative;
      pointer-events: none;
      z-index: 5;
      padding-right: 2em;
      transform: translateY(-40px);

      .button {
        height: 30px;
        font-size: 14px;
        padding: 7px 10px;
        z-index: 5;
      }
    }
  }
}

</style>
