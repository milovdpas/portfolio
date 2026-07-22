<template>
  <div>
    <Menu></Menu>
    <div class="container">
      <div class="blog">
        <div v-for="projectItem in blocks">
          <template v-if="projectItem.type==='title'">
            <h1 v-html="projectItem.content"></h1>
            <p v-if="relativeDate" class="project-date">{{ relativeDate }}</p>
          </template>
          <div v-if="projectItem.type==='image'" class="image" :style="`background: ${projectItem.background};`">
            <img :width="projectItem.width" :src="projectItem.src" :alt="projectItem.alt"/>
          </div>
          <div v-if="projectItem.type==='video'" class="video" :style="`background: ${projectItem.background};`">
            <video controls :width="projectItem.width">
              <source :src="projectItem.src" type="video/mp4" />

              Download the
              <a :href="projectItem.src">MP4</a>
              video.
            </video>
          </div>
          <p v-if="projectItem.type==='paragraph'" class="paragraph" v-html="projectItem.content"></p>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>

import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";
import {getProject} from "@/data/projects";
import {localized} from "@/i18n";
import {relativeTime} from "@/utils/relativeTime";

export default {
  name: "ProjectView",
  props: {},
  components: {Footer, Menu},
  data() {
    return {
      project: getProject(this.$route.params.slug),
    }
  },
  created() {
    if (!this.project) {
      // An unknown slug used to render a blank page — send it to the 404 view.
      this.$router.replace({name: 'not_found'});
    }
  },
  computed: {
    blocks() {
      // this.$i18n.locale is read so the page re-renders on locale switch.
      this.$i18n.locale;
      if (!this.project) {
        return [];
      }
      return this.project.blocks.map(block => ({
        ...block,
        content: localized(block.content),
      }));
    },
    relativeDate() {
      this.$i18n.locale;
      return this.project ? relativeTime(this.project.date) : '';
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  padding: 5em 24px;

  .blog {
    max-width: 720px;
    text-align: left;

    .project-date {
      margin: -12px 0 24px;
      font-style: italic;
      color: #8a8a8a;
    }

    div {
      max-width: 100%;
      margin-bottom: 24px;

      .image {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;

        img {
          max-width: 100%;
        }
      }

      .video {
        display: flex;
        justify-content: center;
        min-width: 100%;

        video {
          max-width: 100%;
        }
      }

      .paragraph {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
