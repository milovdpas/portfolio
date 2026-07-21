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
          <span>{{ $t('home.always') }}</span>
          <span class="slogan">
              &#8203;
              <span id="slogan" class="text">
              {{ slogans[sloganIndex] }}
              </span>
            </span>
        </h2>
      </section>
      <section id="projects" class="section">
        <h2>{{ $t('home.projects') }}</h2>
        <SlideShow :cards="projectCards"/>
        <div class="button-container">
          <MoreButton link="/projects">{{ $t('home.showMore') }}</MoreButton>
        </div>
      </section>
      <section id="experience" class="section">
        <h2>{{ $t('home.experience') }}</h2>
        <SlideShow :cards="experienceCards"/>
        <div class="button-container">
          <MoreButton link="/experience">{{ $t('home.readMore') }}</MoreButton>
        </div>
      </section>
      <section id="about_me" class="section">
        <h2>{{ $t('home.aboutMe') }}</h2>
        <SlideShow :cards="aboutCards"/>
        <div class="button-container">
          <MoreButton link="/about_me">{{ $t('home.learnMore') }}</MoreButton>
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
import {isMobile} from "@/utils/device";
import {featuredProjects} from "@/data/projects";

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
      sloganIndex: 0,
      timeOut: 0,
      // ImageCard resolves the per-locale fields itself.
      projectCards: featuredProjects,
    }
  },
  computed: {
    slogans() {
      return this.$tm('home.slogans');
    },
    experienceCards() {
      const programPercentages = [80, 90, 85, 90, 60, 90];
      const socialPercentages = [80, 90, 80, 85, 90];
      return [
        {
          type: 'skill',
          title: this.$t('home.programSkills'),
          skills: this.$tm('home.programSkillsList').map((skill, index) => ({
            label: skill.label,
            placeholder: skill.level,
            percentage: programPercentages[index]
          })),
        },
        {
          type: 'skill',
          title: this.$t('home.socialSkills'),
          skills: this.$tm('home.socialSkillsList').map((label, index) => ({
            label: label,
            placeholder: '',
            percentage: socialPercentages[index]
          })),
        },
        {
          type: 'timeline',
          title: this.$t('home.jobs'),
          items: this.$tm('home.jobsList').map(job => ({
            title: job.title,
            timePeriod: job.timePeriod
          })),
        }
      ];
    },
    aboutCards() {
      const hobbyIcons = [
        {src: new URL(`../assets/images/icons/football.svg`, import.meta.url).href, alt: 'Football icon'},
        {src: new URL(`../assets/images/icons/waterpolo.svg`, import.meta.url).href, alt: 'Waterpolo icon'},
        {src: new URL(`../assets/images/icons/running.svg`, import.meta.url).href, alt: 'Running icon'},
        {src: new URL(`../assets/images/icons/friends.svg`, import.meta.url).href, alt: 'Friends icon'},
        {src: new URL(`../assets/images/icons/party.svg`, import.meta.url).href, alt: 'Party icon'},
      ];
      return [
        {
          type: 'text',
          title: this.$t('home.general'),
          text: this.$t('home.generalText', {age: this.getAge('2001-04-20')}),
        },
        {
          type: 'svg',
          title: this.$t('home.countryOfOrigin'),
          svg: svg,
          alt: 'netherlands image'
        },
        {
          type: 'bullet-points',
          title: this.$t('home.hobbies'),
          bulletPoints: this.$tm('home.hobbiesList').map((title, index) => ({
            icon: hobbyIcons[index],
            title: title,
          })),
        }
      ];
    }
  },
  mounted() {
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
        setInterval(this.nextSlogan, 1300);
      });
    },
    nextSlogan() {
      this.timeOut += 200;
      setTimeout(() => {
        if (this.sloganIndex === this.slogans.length - 1) {
          this.sloganIndex = 0;
          return;
        }
        this.sloganIndex++;
      }, this.timeOut)
    },
    getAge(dateString) {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    isMobile
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
  @include full-height;
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
  @include full-height;
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
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    transform: translateX(-50%);

    span {
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
