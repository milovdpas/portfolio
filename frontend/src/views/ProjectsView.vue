<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>{{ $t('projects.title') }}</h1>
            <div class="underline"/>
            <p class="description">{{ $t('projects.description') }}</p>
            <a href="#projects" class="cta mt-4">
              <img v-once :src="icons.down" width="70" height="70" alt="down arrow"/>
            </a>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="projects" class="projects">
        <div class="row" v-if="!isMobile()">
          <div class="col-md-6 left">
            <div class="introduction">
              <h2>{{ $t('projects.myProjects') }}</h2>
              <p class="description">
                {{ $t('projects.introduction') }}
              </p>
            </div>
            <ImageCard v-for="project in columns.left" :key="project.slug"
                       :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug"
                       :date="project.date"></ImageCard>
          </div>
          <div class="col-md-6 right">
            <ImageCard v-for="project in columns.right" :key="project.slug"
                       :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug"
                       :date="project.date"></ImageCard>
          </div>
        </div>
        <div class="row" v-if="isMobile()">
          <div class="col-md-6">
            <div class="introduction">
              <h2>{{ $t('projects.myProjects') }}</h2>
              <p class="description">
                {{ $t('projects.introduction') }}
              </p>
            </div>
            <ImageCard v-for="project in projectsLoaded" :image="project.image" :tag="project.tag"
                       :title="project.title"
                       :description="project.description"
                       :slug="project.slug"
                       :date="project.date"></ImageCard>
          </div>
        </div>
        <div class="load-more-container">
          <span>{{ $t('projects.seenCount', {seen: length - projects.length, total: length}) }}</span>
          <div class="progress__bar">
            <div class="current__progress" :style="`width: ${(length - projects.length)/length * 100}%`"></div>
          </div>
          <div class="load-more" v-if="projects.length !== 0" @click="loadMore">
            <span>{{ (projects.length > steps ? $t('projects.loadMore') : $t('projects.loadLast')) }}</span>
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
import Footer from "@/components/Footer.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import {isMobile} from "@/utils/device";
import {publishedProjects} from "@/data/projects";

// Height (px) of the intro block that sits atop the left column, so the
// balancer knows the left column starts taller (see columns()).
const INTRO_HEIGHT = 175;
// Fallback card height used before a card has been measured, so the very
// first paint is already close to balanced.
const ESTIMATED_CARD_HEIGHT = 450;

export default {
  name: "ProjectsView",
  components: {
    Menu,
    Footer,
    ImageCard,
  },
  data() {
    // Clone is mandatory: loadProjects/loadMore shift() this array, and the
    // shared module array must stay intact across route visits.
    const projects = [...publishedProjects];
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href
      },
      limit: 4,
      steps: 4,
      length: projects.length,
      projects: projects,
      projectsLoaded: [],
      // slug -> measured card height (px); fills in after each render so the
      // two columns can be balanced by real height instead of card count.
      cardHeights: {},
    }
  },
  computed: {
    // Split the loaded projects across two columns, always adding the next
    // card to whichever column is currently shorter in pixels. The left column
    // starts "taller" because it carries the intro block, so the first card
    // lands top-right (level with the intro) and the columns stay level at the
    // bottom, keeping the interlocking masonry look without a dangling card.
    columns() {
      const left = [], right = [];
      let leftHeight = INTRO_HEIGHT, rightHeight = 0;
      for (const project of this.projectsLoaded) {
        const height = this.cardHeights[project.slug] || ESTIMATED_CARD_HEIGHT;
        if (leftHeight <= rightHeight) {
          left.push(project);
          leftHeight += height;
        } else {
          right.push(project);
          rightHeight += height;
        }
      }
      return {left, right};
    },
  },
  mounted() {
    this.loadProjects();
  },
  updated() {
    // Re-render can change which cards sit in which column; re-measure so the
    // balance settles. measureCards only writes when a height actually changes,
    // so this converges after a pass or two rather than looping.
    this.measureCards();
  },
  methods: {
    isMobile,
    loadProjects() {
      this.take(this.limit);
    },
    loadMore() {
      this.take(this.steps);
    },
    // Move the next `count` projects from the queue into the rendered list,
    // preserving the newest-first order from data/projects.js.
    take(count) {
      for (let index = 0; index < count && this.projects.length; index++) {
        this.projectsLoaded.push(this.projects.shift());
      }
      this.$nextTick(this.measureCards);
    },
    // Read each rendered card's height into cardHeights. The cards in each
    // column render in the same order as columns.left / columns.right, so we
    // map them back to their project by index.
    measureCards() {
      const read = (selector, projectsInColumn) => {
        const elements = this.$el.querySelectorAll(selector);
        elements.forEach((element, index) => {
          const project = projectsInColumn[index];
          if (!project) return;
          const height = element.offsetHeight;
          if (height && this.cardHeights[project.slug] !== height) {
            this.cardHeights[project.slug] = height;
          }
        });
      };
      read('.left .image-card', this.columns.left);
      read('.right .image-card', this.columns.right);
    },
  },
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
    @include full-height;
    width: 32.5%;
    background-color: $yellow;
  }
}

/* Projects */
.projects {
  position: relative;
  @include full-height(min-height);
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
    padding: 7.5px;
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
      width: 100%;
      max-width: 500px;
    }

    // Covers .left, .right AND the unclassed mobile column, so cards center
    // through flexbox with equal side margins from the .projects padding.
    .row > div {
      display: flex;
      flex-flow: column;
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
