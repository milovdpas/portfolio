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
              <img :src="icons.down" alt="down arrow"/>
            </a>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
      <section id="projects" class="projects">
        <div class="row">
          <div class="col-md-6 left">
            <div class="introduction">
              <h2>My Projects</h2>
              <p class="description">
                These are my projects that i'm most proud of.
              </p>
            </div>
            <ImageCard v-for="project in projectsLeftLoaded" :image="project.image" :tag="project.tag" :title="project.title"
                       :description="project.description"></ImageCard>
          </div>
          <div class="col-md-6 right">
            <ImageCard v-for="project in projectsRightLoaded" :image="project.image" :tag="project.tag" :title="project.title"
                       :description="project.description"></ImageCard>
          </div>
        </div>
        <div class="load-more-container">

        </div>
      </section>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Button from "../components/buttons/MoreButton.vue";
import Footer from "@/components/Footer.vue";
import ImageCard from "@/components/cards/ImageCard.vue";

export default {
  name: "ProjectsView",
  components: {
    Menu,
    Button,
    Footer,
    ImageCard,
  },
  data() {
    return {
      icons: {
        down: new URL(`../assets/images/icons/down-arrow.svg`, import.meta.url).href
      },
      projects: [
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
      length: 6,
      projectsLeftLoaded: [],
      projectsRightLoaded: []
    }
  },
  watch: {
    "$i18n.locale": async function (newVal, oldVal) {
    },
  }, mounted() {
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
    },
    loadMore() {
      const over = this.projects.length - this.length;
      if (over === 0) return;
      if(over < 3)
        this.length += over;
      else
        this.length += 3;
    },
  },
  computed: {
    projectsLeftLoaded() {
      return this.projects.slice(0, this.length).filter((a,i) => i%2===1);
    },
    projectsRightLoaded() {
      return this.projects.slice(0, this.length).filter((a,i) => i%2===0);
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
      img{
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
.projects{
  position: relative;
  min-height: 100vh;
  padding: 7em;
  .introduction{
    width: 300px;
    height: 175px;
    text-align: left;
    .description{
      font-size: 22.5px;
    }
  }
  .image-card{
    min-height: auto!important;
  }
  .right{
    display: flex !important;
    flex-flow: column;
    align-items: start;
  }
  .left{
    display: flex !important;
    flex-flow: column;
    align-items: end;
  }
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
  .projects{
    padding: 5em 1em;
    .left{
      align-items: center;
    }
    .right{
      align-items: center;
    }
  }
}

</style>
