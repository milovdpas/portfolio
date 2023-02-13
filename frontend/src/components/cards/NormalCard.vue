<template>
  <swiper-slide>
    <div class="color-card mb-3 col-sm-12 col-md-4">
      <div class="card text-start col-md-12">
        <div class="card-body">
          <h5 class="card-title">{{ title }}</h5>
          <slot/>
        </div>
      </div>
    </div>
  </swiper-slide>
</template>

<script>
// Import Swiper Vue.js components
import {SwiperSlide} from 'swiper/vue';

export default {
  name: "NormalCard",
  props: {
    title: String,
  },
  components: {
    SwiperSlide,
  }
}
</script>

<style scoped lang="scss" src="NormalCard.scss"/>
