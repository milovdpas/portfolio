<template>
  <swiper
      :direction="isMobile() ? 'horizontal' : 'vertical'"
      :modules="modules"
      :slides-per-view="1"
      :pagination="pagination"
      :speed="1000"
      class="timeline"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
  >
    <swiper-slide class="swiper-slide" v-for="timePeriod in timePeriods" :data-period="timePeriod.period.short">
      <div class="swiper-slide-content">
        <h4 class="timeline-title">{{timePeriod.title}}</h4>
        <span class="time-period">{{ timePeriod.period.long }}</span>
        <p class="timeline-text">{{timePeriod.description}}</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Navigation, Pagination} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default {
  name: "TimelineSlider",
  props: {
    timePeriods: Array
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data(){
    return {
      pagination: {
        type: 'bullets',
        bulletClass: 'swiper__bullet',
        bulletActiveClass: 'swiper__bullet--active',
        clickable: true,
        renderBullet: this.renderBullet,
      },
      modules: [Navigation, Pagination],
    }
  },
  methods: {
    renderBullet(index, className) {
      let year = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-period');
      if(this.isMobile()){
        year = year.replace(' ', '<br>');
      }
      return '<span class="' + className + '">' + year + '</span>';
    },
    onSwiper(swiper) {
    },
    onSlideChange() {
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" src="./TimelineSlider.scss"/>
