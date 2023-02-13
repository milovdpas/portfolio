<template>
  <div class="image-card">
    <div class="card">
      <img :src="image" class="card-img-top" alt="card image">
      <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <div class="card-text mb-3" v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import {SwiperSlide} from 'swiper/vue';

export default {
  name: "ImageCard",
  props: {
    image: String,
    title: String,
    description: String
  },
  components: {
    SwiperSlide,
  }
}
</script>

<style scoped lang="scss" src="./ImageCard.scss"/>
