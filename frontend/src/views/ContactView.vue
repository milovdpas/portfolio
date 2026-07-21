<template>
  <div>
    <Menu></Menu>
    <main>
      <section class="header">
        <div class="content">
          <div class="text">
            <h1>{{ $t('contact.title') }}</h1>
            <div class="underline"/>
            <p class="description">{{ $t('contact.description') }}</p>
            <div class="button-container">
              <CTA2 link="mailto:milovanderpas@mvdpsolutions.com" :icon="icons.mail">{{ $t('contact.mail') }}</CTA2>
              <CTA2 link="tel:+31637695327" :icon="icons.phone">{{ $t('contact.phone') }}</CTA2>
            </div>
          </div>
        </div>
        <div class="side-bar"></div>
      </section>
    </main>
    <section>
      <Footer/>
    </section>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import CTA2 from "../components/buttons/CTA2.vue";
import Footer from "@/components/Footer.vue";
import {isMobile} from "@/utils/device";

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
  methods: {
    isMobile
  }
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
    @include full-height;
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
