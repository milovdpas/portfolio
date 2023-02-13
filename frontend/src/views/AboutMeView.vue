<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>About me</h1>
            <p class="description">A little guide about who I am and what I love to do outside work</p>
          </div>
          <div class="ctas row">
            <CTA class="col-md-4" link="#general" color="yellow" :icon="icons.down">General</CTA>
            <CTA class="col-md-4 font-small" link="#country" color="green" :icon="icons.down">Country of origin</CTA>
            <CTA class="col-md-4" link="#hobbies" color="red" :icon="icons.down">Hobbies</CTA>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Button from "../components/buttons/MoreButton.vue";
import Footer from '../components/Footer.vue'
import CTA from "@/components/buttons/CTA.vue";

export default {
  name: "AboutMeView",
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
      }
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
      align-items: center;
      height: 75%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        width: 75%;
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
    background-color: $orange;
  }

  .font-small{
    font-size: 27.5px;
  }
}

@include mobile {
}

</style>
