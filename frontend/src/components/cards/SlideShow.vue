<template>
  <swiper v-if="isMobile()"
          :modules="modules"
          :slides-per-view="1"
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
  >
    <swiper-slide v-for="card in cards">
      <ImageCard v-if="card.type === 'image'" :image="card.image" :tag="card.tag" :title="card.title"
                 :description="card.description"/>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <skill class="bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar">
            <div class="bar-inner" :style="'width: ' + skill.percentage + '%;'">{{skill.placeholder}}</div>
          </div>
        </skill>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'text'" :title="card.title">
        <div class="text" v-html="card.text"/>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'svg'" :title="card.title">
        <div class="svg-container" v-html="card.svg">
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'timeline'" :title="card.title">
        <div class="timeline">
          <div class="outer">
            <div class="timeline-card" v-for="item in card.items">
              <div class="info">
                <h3 class="title">{{item.title}}</h3>
                <p class="time-period">{{item.timePeriod}}</p>
              </div>
            </div>
          </div>
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'bullet-points'" :title="card.title">
        <ul class="bullet-points">
          <li v-for="bulletPoint in card.bulletPoints">
            <img :src="bulletPoint.icon.src" :alt="bulletPoint.icon.alt"/>
            <h3 class="title">{{bulletPoint.title}}</h3>
          </li>
        </ul>
      </NormalCard>
    </swiper-slide>
  </swiper>
  <div v-else class="slide-show">
    <div v-for="card in cards" class="d-flex justify-content-center">
      <ImageCard v-if="card.type === 'image'" :image="card.image" :tag="card.tag" :title="card.title"
                 :description="card.description"/>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <skill class="bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar">
            <div class="bar-inner" :style="'width: ' + skill.percentage + '%;'">{{skill.placeholder}}</div>
          </div>
        </skill>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'text'" :title="card.title">
        <div class="text" v-html="card.text"/>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'svg'" :title="card.title">
        <div class="svg-container" v-html="card.svg">
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'timeline'" :title="card.title">
        <div class="timeline">
          <div class="outer">
            <div class="timeline-card" v-for="item in card.items">
              <div class="info">
                <h3 class="title">{{item.title}}</h3>
                <p class="time-period">{{item.timePeriod}}</p>
              </div>
            </div>
          </div>
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'bullet-points'" :title="card.title">
        <ul class="bullet-points">
          <li v-for="bulletPoint in card.bulletPoints">
            <img :src="bulletPoint.icon.src" :alt="bulletPoint.icon.alt"/>
            <h3 class="title">{{bulletPoint.title}}</h3>
          </li>
        </ul>
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
    const startAnimation = (entries, observer) => {
      entries.forEach(entry => {
        const bar = entry.target.childNodes[1];
        const barInner = bar.childNodes[0];
        barInner.classList.toggle('slide', entry.isIntersecting);
      });
    };

    const options = { root: null, rootMargin: '0px', threshold: 1 };
    const observer = new IntersectionObserver(startAnimation, options);

    const elements = document.getElementsByTagName('skill');
    Object.keys(elements).forEach(key => {
      observer.observe(elements[key]);
    });
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  }
}
</script>

<style lang="scss" src="./SlideShow.scss" />

