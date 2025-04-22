<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>Projects</h1>
            <div class="underline"/>
            <p class="description">Projects made with passion</p>
            <a href="#projects" class="cta mt-4">
              <img v-once :src="icons.down" width="70" height="70" alt="down arrow"/>
            </a>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <UnderConstruction v-if="underConstruction" id="projects"/>
      <section v-else id="projects" class="projects">
        <div class="row" v-if="!isMobile()">
          <div class="col-md-6 left">
            <div class="introduction">
              <h2>My Projects</h2>
              <p class="description">
                These are my projects that i'm most proud of.
              </p>
            </div>
            <ImageCard v-for="project in projectsLeftLoaded" :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug" style="padding: 7.5px"></ImageCard>
          </div>
          <div class="col-md-6 right">
            <ImageCard v-for="project in projectsRightLoaded" :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug" style="padding: 7.5px"></ImageCard>
          </div>
        </div>
        <div class="row" v-if="isMobile()">
          <div class="col-md-6">
            <div class="introduction">
              <h2>My Projects</h2>
              <p class="description">
                These are my projects that i'm most proud of.
              </p>
            </div>
            <ImageCard v-for="project in projectsLoaded" :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug" style="padding: 7.5px"></ImageCard>
          </div>
        </div>
        <div class="load-more-container">
          <span>You have seen {{ length - projects.length }} of the {{ length }} projects</span>
          <div class="progress__bar">
            <div class="current__progress" :style="`width: ${(length - projects.length)/length * 100}%`"></div>
          </div>
          <div class="load-more" v-if="projects.length !== 0" @click="loadMore">
            <span>{{ (projects.length > steps ? 'Load more projects' : 'Load last projects') }}</span>
            <img v-once :src="icons.down" width="25" height="25" alt="down arrow"/>
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
import ImageCard from "@/components/cards/ImageCard.vue";
import UnderConstruction from "@/components/UnderConstruction.vue";

export default {
  name: "ProjectsView",
  components: {
    UnderConstruction,
    Menu,
    Button,
    Footer,
    ImageCard,
  },
  data() {
    const projects = [
      {
        type: 'image',
        image: new URL(`../assets/images/projects/shooting-stars-banner.png`, import.meta.url).href,
        tag: {
          color: 'blue',
          text: 'Hobby Project'
        },
        slug: "shooting-stars",
        title: "Shooting stars meme generator",
        description: "Learn how a backflip fail inspired the creation of a Shooting Stars meme generator!"
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/player0.0.png`, import.meta.url).href,
        tag: {
          color: 'black',
          text: 'Livewall Group'
        },
        title: "Player 0.0",
        description: "Player 0.0 is a cool gaming experience that we developed for Heineken 0.0 and has been released in 16 countries",
        slug: 'player0.0'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/soundzam-app.png`, import.meta.url).href,
        tag: {
          color: 'blue',
          text: 'Hobby Project'
        },
        slug: "soundzam",
        title: "SoundZam app",
        description: "After graduating I made an app for recognizing SoundCloud songs."
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/internship/banner.png`, import.meta.url).href,
        title: "Real-Time flex place reservation app",
        tag: {
          color: 'purple',
          text: 'Internship at IO'
        },
        description: `For my final internship of school, me and Wessel made a real-time app for reserving a flex workplace for the office of IO.`,
        slug: 'internship-io'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/motm.jpg`, import.meta.url).href,
        tag: {
          color: 'black',
          text: 'Livewall Group'
        },
        title: "Line-up, Substitution and MOTM tool",
        description: "During my part-time job I made a line-up, substitution and player of the match tool for DPG Media for the 2022 World Cup.",
        slug: 'dpg-motm'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/accessibility/banner.png`, import.meta.url).href,
        title: "Accessibility questionnaire app",
        tag: {
          color: 'avans',
          text: 'Avans university'
        },
        description: "We build a questionnaire app for the dutch accessibility organization",
        slug: 'accessibility'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/trainingsplatform.png`, import.meta.url).href,
        title: "Trainingsplatform",
        tag: {
          color: 'black',
          text: 'Livewall Group'
        },
        description: "During my part-time job, I created a training platform that enables local police officers, BOAs and bailiffs to recognize the signals of unusual possession better, faster and more effectively.",
        slug: 'nh-samen-veilig'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/internship-livewall/banner.jpg`, import.meta.url).href,
        title: "My first internship",
        tag: {
          color: 'black',
          text: 'Internship at Livewall Group'
        },
        description: "My first internship at LiveWall: backend development, exciting projects, and real-world growth!",
        slug: 'internship-livewall'
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/tegelogy/banner.png`, import.meta.url).href,
        tag: {
          color: 'blue',
          text: 'Hobby Project'
        },
        slug: "tegelogy",
        title: "Tegelogy",
        description: "How a fake university course helped my friend crash student parties and score cheap beer—meet Tegelogy!"
      },
      {
        type: 'image',
        image: new URL(`../assets/images/projects/city-life/banner.png`, import.meta.url).href,
        tag: {
          color: 'blue',
          text: 'Hobby Project'
        },
        slug: "city-life-game",
        title: "Monopoly Simulation Game",
        description: "Building a Java game inspired by CityInc: huge numbers, save systems, and a summer of coding!"
      },
    ];
    return {
      underConstruction: false,
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href
      },
      limit: 4,
      steps: 4,
      length: projects.length,
      projects: projects,
      projectsLoaded: [],
      projectsLeftLoaded: [],
      projectsRightLoaded: []
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {
    this.loadProjects();
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    loadProjects() {
      const length = this.projects.length;
      for (let index = 0; index < length && index < this.limit; index++) {
        const project = this.projects.shift();
        if (index % 2 === 0)
          this.projectsRightLoaded.push(project);
        else
          this.projectsLeftLoaded.push(project);
        this.projectsLoaded.push(project);
      }
    },
    loadMore() {
      const length = this.projects.length;
      if (length === 0) return;
      for (let index = 0; index < length && index < this.steps; index++) {
        const project = this.projects.shift();
        if (this.projectsRightLoaded.length > this.projectsLeftLoaded.length)
          this.projectsLeftLoaded.push(project);
        else
          this.projectsRightLoaded.push(project);
        this.projectsLoaded.push(project);
      }
    },
  },
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
      height: 100%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        font-size: 22.5px;
        font-weight: normal;
      }
    }

    .cta {
      height: 25%;
      width: 100%;
      margin: 0;

      img {
        width: 70px;
        height: 70px;
      }
    }
  }

  .side-bar {
    height: 100vh;
    width: 32.5%;
    background-color: $yellow;
  }
}

/* Projects */
.projects {
  position: relative;
  min-height: 100vh;
  padding: 7em 7em 15em 7em;

  .introduction {
    width: 300px;
    height: 175px;
    text-align: left;

    .description {
      font-size: 22.5px;
    }
  }

  .image-card {
    min-height: auto !important;
  }

  .right {
    display: flex !important;
    flex-flow: column;
    align-items: start;
  }

  .left {
    display: flex !important;
    flex-flow: column;
    align-items: end;
  }

  .load-more-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    gap: 5px;
    margin-top: 3em;

    span {
      font-size: 20px;
    }

    .progress__bar {
      display: flex;
      justify-content: start;
      width: 50%;
      height: 1rem;
      background: #EAEAEA;

      .current__progress {
        height: 100%;
        background: $primary;
      }
    }

    .load-more {
      cursor: pointer;

      span {
        font-size: 25px;
        font-weight: bold;
        margin-right: 0.25em;
      }

      img {
        width: auto;
        height: 25px;
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
    }

    .underline {
      background-color: $yellow;
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
  .projects {
    padding: 5em 1em 10em 1em;

    .introduction {
      height: auto;
    }

    .left {
      align-items: center;
    }

    .right {
      align-items: center;
    }

    .load-more-container {
      .progress__bar {
        width: 90%;
      }
    }
  }
}

</style>
