<template>
  <div>
    <Menu></Menu>
    <main>
    </main>
    <Footer/>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Button from "../components/buttons/MoreButton.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Menu,
    Button,
    Footer
  },
  data() {
    return {
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
@include mobile {
}

</style>
