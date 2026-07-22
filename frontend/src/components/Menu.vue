<template>
  <nav :class="{ open }">
    <button id="menu-icon" class="menu-icon" :class="{ open }" @click="toggle"
            :aria-expanded="open ? 'true' : 'false'" :aria-label="$t('menu.toggle')">
      {{ open ? 'X' : 'M' }}
    </button>
    <div class="menu">
      <router-link to="/projects" @click="toggle" class="menu-con">
        <p>{{ $t('menu.projects') }}</p>
      </router-link>
      <router-link to="/experience" @click="toggle" class="menu-con">
        <p>{{ $t('menu.experience') }}</p>
      </router-link>
      <router-link to="/about_me" @click="toggle" class="menu-con">
        <p>{{ $t('menu.aboutMe') }}</p>
      </router-link>
      <router-link to="/contact" @click="toggle" class="menu-con">
        <p>{{ $t('menu.contact') }}</p>
      </router-link>
      <div class="menu-con">
        <div class="icons">
          <router-link to="/home" @click="toggle" :aria-label="$t('menu.home')"><img v-once :src="icons.home" class="icon"
                                                                                       width="80" height="80"
                                                                                       alt="home icon"/></router-link>
          <a href="mailto:vanderpasmilo@gmail.com" :aria-label="$t('menu.mail')"><img v-once :src="icons.mail"
                                                                                                  class="icon"
                                                                                                  width="80" height="80"
                                                                                                  alt="mail icon"/></a>
          <a href="#" class="insta-link" @click="showInstaQr" :aria-label="$t('menu.instagram')"><img v-once :src="icons.insta" class="icon" width="80" height="80" alt="insta icon"/></a>
          <a href="https://github.com/milovdpas?tab=repositories" target="_blank"
             aria-label="GitHub"><img v-once :src="icons.github" class="icon" width="80" height="80"
                                                     alt="github icon"/></a>
          <a href="https://www.linkedin.com/in/milo-van-der-pas-31b1761ba/" target="_blank"
             aria-label="LinkedIn"><img v-once :src="icons.linkedin"
                                                       class="icon"
                                                       width="80" height="80"
                                                       alt="linkedin icon"/></a>
          <a href="tel:0637695327" class="phone-link" :aria-label="$t('menu.phone')"><img v-once :src="icons.phone" class="icon"
                                                                                  width="80" height="80"
                                                                                  alt="phone icon"/></a>
        </div>
      </div>
    </div>
    <PopupComponent>
      <p>{{ $t('menu.instaQrText') }}</p>
      <img class="qr-code" :src="instaQr" width="100" height="100" alt="insta qr code"/>
    </PopupComponent>
  </nav>
</template>

<script>
import {RouterLink} from 'vue-router'
import PopupComponent from "../components/Popup.vue";

export default {
  name: "Menu",
  props: {},
  components: {
    RouterLink,
    PopupComponent
  },
  data() {
    return {
      open: false,
      instaQr: new URL(`../assets/images/milovdpas_qr.png`, import.meta.url).href,
      icons: {
        home: new URL(`../assets/images/icons/home.svg`, import.meta.url).href,
        mail: new URL(`../assets/images/icons/mail.svg`, import.meta.url).href,
        insta: new URL(`../assets/images/icons/insta.svg`, import.meta.url).href,
        github: new URL(`../assets/images/icons/github.svg`, import.meta.url).href,
        linkedin: new URL(`../assets/images/icons/linkedin.svg`, import.meta.url).href,
        phone: new URL(`../assets/images/icons/phone.svg`, import.meta.url).href,
      }
    }
  },
  methods: {
    // The panels drop/retract via CSS transitions on .menu-con (staggered
    // transition-delay per panel in Menu.scss); this just flips the state.
    toggle() {
      this.open = !this.open;
    },
    showInstaQr() {
      document.getElementById('popup').classList.toggle('active');
    }
  },
}
</script>

<style scoped lang="scss" src="./Menu.scss"/>
