<template>
  <nav>
    <div id="menu-icon" class="menu-icon" @click="toggle">
      M
    </div>
    <div class="menu">
      <router-link to="/projects" @click="toggle" class="menu-con" aria-describedby="to projects page">
        <p>Projects</p>
      </router-link>
      <router-link to="/experience" @click="toggle" class="menu-con" aria-describedby="to experience page">
        <p>Experience</p>
      </router-link>
      <router-link to="/about_me" @click="toggle" class="menu-con" aria-describedby="to about me page">
        <p>About me</p>
      </router-link>
      <router-link to="/contact" @click="toggle" class="menu-con" aria-describedby="to contact page">
        <p>Contact</p>
      </router-link>
      <div class="menu-con">
        <div class="icons">
          <router-link to="/home" @click="toggle" aria-describedby="to home page"><img :src="icons.home" class="icon" alt="home icon"/></router-link>
          <a href="mailto:vanderpasmilo@gmail.com" aria-describedby="Click to mail for help"><img :src="icons.mail" class="icon" alt="mail icon"/></a>
          <a href="#" @click="showInstaQr"><img :src="icons.insta" class="icon" alt="insta icon" aria-describedby="On click shows qr code for instagram"/></a>
          <a href="https://github.com/milovdpas?tab=repositories" target="_blank" aria-describedby="go to my GitHub"><img :src="icons.github" class="icon"
                                                                                       alt="github icon"/></a>
          <a href="https://www.linkedin.com/in/milo-van-der-pas-31b1761ba/" target="_blank" aria-describedby="go to my LinkedIn"><img :src="icons.linkedin"
                                                                                                 class="icon"
                                                                                                 alt="linkedin icon"/></a>
          <a href="tel:0637695327" aria-describedby="Click to call for help"><img :src="icons.phone" class="icon" alt="phone icon"/></a>
        </div>
      </div>
    </div>
    <PopupComponent>
      <p>Scan the qr code to go to my instagram page</p>
      <img class="qr-code" :src="instaQr" alt="insta qr code"/>
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
