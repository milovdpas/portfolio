<template>
  <swiper v-if="isMobile()"
          :modules="modules"
          :slides-per-view="1"
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
  >
    <swiper-slide v-for="card in cards">
      <ImageCard :image="card.image" :title="card.title"
                 :description="card.description"></ImageCard>
    </swiper-slide>
  </swiper>
  <div v-else class="slide-show">
    <ImageCard v-for="card in cards" class="col-sm-12 col-md-4" :image="card.image" :title="card.title"
               :description="card.description"></ImageCard>
  </div>
</template>

<script>
// import Swiper core and required modules
import {Navigation, Pagination} from 'swiper';

// Import Swiper Vue.js components
import {Swiper, SwiperSlide} from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import ImageCard from "@/components/cards/ImageCard.vue";

export default {
  name: "SlideShow",
  props: {
    cards: Array,
    type: String
  },
  components: {
    Swiper,
    SwiperSlide,
    ImageCard
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log('slide change');
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination],
    };
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" src="./SlideShow.scss"/>

