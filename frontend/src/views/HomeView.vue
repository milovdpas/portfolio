<template>
  <div>
    <Menu></Menu>
    <main class="home">
      <section class="header">
        <div class="title">
          <h1>MilovdPas</h1>
          <h1>MilovdPas</h1>
        </div>
        <div id="message">
          <h2>
            <span>always</span>
            <div class="message">
              <div class="word1">coding</div>
              <div class="word2">sporting</div>
              <div class="word3">creating</div>
            </div>
          </h2>
        </div>
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
      ],
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {
    if(this.isMobile()) {
      const projects = document.getElementById('projects');
      const swiper = document.getElementsByClassName('swiper')[0];
      const swiperPagination = document.getElementsByClassName('swiper-pagination')[0];
      swiperPagination.style.bottom = '0';
      swiperPagination.style.position = 'relative';
      swiperPagination.style.margin = '0';
      swiper.removeChild(swiperPagination);
      projects.insertBefore(swiperPagination, projects.children[2]);
    }
    setTimeout(() => this.scrollFix(this.$route.hash));
  },
  methods: {
    scrollFix(hash) {
      if (!hash)
        return;
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const top = element.offsetTop;
        window.scrollTo(0, top);
      }
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
#message {
  display: flex;
  justify-content: center;
  height: fit-content;
  margin-top: 250px;
  margin-right: 220px;

  h2 {
    color: #333;
    font-family: tahoma, serif;
    font-size: 3rem;
    font-weight: 100;
    line-height: 1.5;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    width: 800px;
  }

  h2 span {
    font-size: 40px;
  }
}

.message {
  background-color: $blue;
  color: $white;
  display: block;
  font-weight: 900;
  overflow: hidden;
  position: absolute;
  padding-left: 0.5rem;
  top: 0.2rem;
  margin-left: 485px;
  margin-right: auto;
  left: 0;
  right: 0;
  animation: openclose 5s ease-in-out infinite;
}

.word1, .word2, .word3 {
  font-family: tahoma, serif;
}

@keyframes openclose {
  0% {
    top: 0.2rem;
    width: 0;
  }
  5% {
    width: 0;
  }
  15% {
    width: 235px;
  }
  30% {
    top: 0.2rem;
    width: 235px;
  }
  33% {
    top: 0.2rem;
    width: 0;
  }
  35% {
    top: 0.2rem;
    width: 0;
  }
  38% {
    top: -4.5rem;

  }
  48% {
    top: -4.5rem;
    width: 290px;
  }
  62% {
    top: -4.5rem;
    width: 290px;
  }
  66% {
    top: -4.5rem;
    width: 0;
    text-indent: 0;
  }
  71% {
    top: -9rem;
    width: 0;
    text-indent: 5px;
  }
  86% {
    top: -9rem;
    width: 290px;
  }
  95% {
    top: -9rem;
    width: 290px;
  }
  98% {
    top: -9rem;
    width: 0;
    text-indent: 5px;
  }
  100% {
    top: 0;
    width: 0;
    text-indent: 0;
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
    padding: 0 !important;

    .swiper{
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
