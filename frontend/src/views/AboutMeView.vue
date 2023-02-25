<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>About me</h1>
            <div class="underline"/>
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
      <section id="general" class="general">
          <div class="row h-100">
            <div class="col-md-7 introduction">
              <h2>Hi, I'm Milo</h2>
              <p>
                Full Stack developer and ux designer fascinated by the possibilities code gives.
              </p>
              <p>
                Currently finishing my bachelor in computer science at Avans university in Den Bosch.
              </p>
            </div>
            <div class="col-md-5 image">
              <img :src="me" alt="Picture of me"/>
            </div>
          </div>
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
      },
      me: new URL(`../assets/images/me.jpg`, import.meta.url).href
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
    background-color: $orange;
  }

  .font-small{
    font-size: 27.5px;
  }
}

/* General */
.general{
  position: relative;
  height: 100vh;
  padding: 3em 5em;
  background-color: $yellow;
  .introduction{
    text-align: left;
  }
  .image{
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      max-width: 100%;
      max-height: 600px;
      border-radius: 0 15px 0 15px;
    }
  }
  p {
    font-size: 27.5px;
  }
  h2{
    font-size: 50px;
  }
}

@include mobile {
  .header {
    .content {
      width: 100%;
      h1{
        z-index: 1;
      }
      .text{
        height: 60%;
      }
      .ctas{
        height: 40%;
      }
    }

    .underline{
      background-color: $orange;
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
}

</style>
