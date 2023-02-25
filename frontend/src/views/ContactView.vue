<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>Contact</h1>
            <div class="underline"/>
            <p class="description">Please contact me for questions or business proposals</p>
            <div class="button-container">
              <CTA2 link="mailto:milovanderpas@mvdpsolutions.com" :icon="icons.mail">Mail</CTA2>
              <CTA2 link="tel:+31637695327" :icon="icons.phone">Phone</CTA2>
            </div>
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
import CTA2 from "../components/buttons/CTA2.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Menu,
    CTA2,
    Footer
  },
  data() {
    return {
      icons: {
        mail: new URL(`../assets/images/icons/mail.svg`, import.meta.url).href,
        phone: new URL(`../assets/images/icons/phone.svg`, import.meta.url).href
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
      height: 100%;

      h1 {
        font-size: 60px;
        font-weight: bold;
      }

      .description {
        font-size: 22.5px;
        font-weight: normal;
        max-width: 400px;
      }
    }
  }
  .button-container{
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: 10%;
  }

  .side-bar {
    height: 100vh;
    width: 32.5%;
    background-color: $green;
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
      background-color: $green;
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
