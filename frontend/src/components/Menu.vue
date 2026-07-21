<template>
  <nav>
    <button id="menu-icon" class="menu-icon" @click="toggle" :aria-expanded="open ? 'true' : 'false'"
            :aria-label="$t('menu.toggle')">
      M
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
    toggle() {
      document.getElementsByTagName('nav')[0].classList.toggle('open');
      const menuIcon = document.getElementById('menu-icon');
      menuIcon.classList.toggle('open');
      menuIcon.textContent = this.open ? 'M' : 'X';

      let i;
      if (this.open === false) {
        for (i = 0; i < 5; i++) {
          this.drop(i)
        }
        this.open = true
      } else if (this.open === true) {
        for (i = 0; i < 5; i++) {
          this.close(i);
        }
        this.open = false;
      }
    },
    drop(n) {
      const elem = document.getElementsByClassName("menu-con")[n];
      let pos = -1 * window.innerHeight - n * 100;
      const id = setInterval(frame, 5);

      function frame() {
        if (pos >= -10) {
          clearInterval(id);
          elem.style.top = 0 + 'px';
        } else {
          pos += 10;
          elem.style.top = pos + 'px';
        }
      }
    },
    close(n) {
      const elems = document.getElementsByClassName("menu-con")[n];
      let poss = 0;
      const ids = setInterval(frames, 5);

      function frames() {
        if (poss <= -1 * window.innerHeight) {
          clearInterval(ids);
          elems.style.top = -1 * window.innerHeight + 'px';
        } else {
          poss += -7 - n * 2;
          elems.style.top = poss + 'px';
        }
      }
    },
    showInstaQr() {
      document.getElementById('popup').classList.toggle('active');
    }
  },
}
</script>

<style scoped lang="scss" src="./Menu.scss"/>
