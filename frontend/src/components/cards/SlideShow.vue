<template>
  <swiper v-if="isMobile()"
          :modules="modules"
          :slides-per-view="1"
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
  >
    <swiper-slide v-for="card in cards">
      <ImageCard v-if="card.type === 'image'" :image="card.image" :title="card.title"
                 :description="card.description"></ImageCard>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <skill class="bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar" :data-width="skill.percentage + '%'">
            <div class="bar-inner">{{skill.placeholder}}</div>
          </div>
        </skill>
      </NormalCard>
    </swiper-slide>
  </swiper>
  <div v-else class="slide-show">
    <div v-for="card in cards" class="col-sm-12 col-md-4">
      <ImageCard v-if="card.type === 'image'" :image="card.image" :title="card.title"
                 :description="card.description"></ImageCard>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <skill class="bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar" :data-width="skill.percentage + '%'">
            <div class="bar-inner">{{skill.placeholder}}</div>
          </div>
        </skill>
      </NormalCard>
    </div>
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
import NormalCard from "@/components/cards/NormalCard.vue";

export default {
  name: "SlideShow",
  props: {
    cards: Array
  },
  components: {
    Swiper,
    SwiperSlide,
    ImageCard,
    NormalCard
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
  mounted(){
    const skills =document.getElementsByTagName('skill');
    Object.keys(skills).forEach(key => {
      const bar = skills[key].childNodes[1];
      const barInner = bar.childNodes[0];
      const width = bar.getAttribute("data-width");
      barInner.animate({
        width: width
      }, 2000)
      setTimeout(()=> {
        barInner.style.width = width;
      }, 2000)
    });
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" src="./SlideShow.scss"/>

