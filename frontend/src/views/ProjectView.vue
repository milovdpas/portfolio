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
          <div v-if="projectItem.type==='image'" class="image clickable" :style="`background: ${projectItem.background};`"
               @click="openGallery(projectItem.galleryIndex)">
            <img :width="projectItem.width" :src="projectItem.src" :alt="projectItem.alt"/>
          </div>
          <div v-if="projectItem.type==='video'" class="video clickable" :style="`background: ${projectItem.background};`"
               @click="openGallery(projectItem.galleryIndex)">
            <video controls :width="projectItem.width" @click.stop>
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
    <MediaGallery v-if="galleryOpen" :items="galleryItems" :start-index="galleryStart" @close="galleryOpen = false"/>
    <Footer/>
  </div>
</template>

<script>

import Menu from "@/components/Menu.vue";
import Footer from "@/components/Footer.vue";
import MediaGallery from "@/components/MediaGallery.vue";
import {getProject} from "@/data/projects";
import {localized} from "@/i18n";
import {relativeTime} from "@/utils/relativeTime";
import {setPageMeta, resetPageMeta} from "@/utils/seo";

// Block types that appear in the fullscreen media gallery.
const GALLERY_TYPES = ['image', 'video'];

export default {
  name: "ProjectView",
  props: {},
  components: {Footer, Menu, MediaGallery},
  data() {
    return {
      project: getProject(this.$route.params.slug),
      galleryOpen: false,
      galleryStart: 0,
    }
  },
  created() {
    if (!this.project) {
      // An unknown slug used to render a blank page — send it to the 404 view.
      this.$router.replace({name: 'not_found'});
    }
  },
  mounted() {
    this.applySeo();
  },
  watch: {
    // Keep the title/description in sync with the active language.
    '$i18n.locale'() {
      this.applySeo();
    },
  },
  beforeUnmount() {
    // Restore the site's default tags so other pages don't inherit this
    // project's title/description/OG image.
    resetPageMeta();
  },
  computed: {
    blocks() {
      // this.$i18n.locale is read so the page re-renders on locale switch.
      this.$i18n.locale;
      if (!this.project) {
        return [];
      }
      // Assign each image/video block its position within the gallery so a
      // click can open the lightbox on the right item.
      let galleryIndex = -1;
      return this.project.blocks.map(block => {
        const mapped = {...block, content: localized(block.content)};
        if (GALLERY_TYPES.includes(block.type)) {
          mapped.galleryIndex = ++galleryIndex;
        }
        return mapped;
      });
    },
    // All image and video blocks, in order, for the lightbox to page through.
    galleryItems() {
      if (!this.project) {
        return [];
      }
      return this.project.blocks
        .filter(block => GALLERY_TYPES.includes(block.type))
        .map(block => ({type: block.type, src: block.src, alt: block.alt}));
    },
    relativeDate() {
      this.$i18n.locale;
      return this.project ? relativeTime(this.project.date) : '';
    },
  },
  methods: {
    openGallery(index) {
      this.galleryStart = index;
      this.galleryOpen = true;
    },
    // Give this project its own title, description, canonical URL and share
    // image so the blog page is indexed and previewed on its own merits.
    applySeo() {
      if (!this.project) return;
      const url = window.location.origin + this.$route.path;
      setPageMeta({
        title: localized(this.project.title),
        description: localized(this.project.description),
        image: this.project.image,
        url,
      });
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

        &.clickable {
          cursor: zoom-in;

          img {
            transition: opacity 0.15s ease;
          }

          &:hover img {
            opacity: 0.9;
          }
        }
      }

      .video {
        display: flex;
        justify-content: center;
        min-width: 100%;
        padding: 28px 0;
        border-radius: 8px;

        &.clickable {
          cursor: zoom-in;
        }

        video {
          max-width: 100%;
          border-radius: 6px;
          cursor: auto; // its own controls handle interaction
        }
      }

      .paragraph {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
