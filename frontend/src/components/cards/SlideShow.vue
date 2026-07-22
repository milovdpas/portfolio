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
                 :description="card.description" :slug="card.slug" :date="card.date"/>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <div class="skill bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar">
            <div class="bar-inner" :style="'width: ' + skill.percentage + '%;'">{{skill.placeholder}}</div>
          </div>
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'text'" :title="card.title">
        <div class="text" v-html="card.text"/>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'svg'" :title="card.title">
        <div class="svg-container" v-html="card.svg">
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'timeline'" :title="card.title">
        <div class="timeline-container">
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
            <img :src="bulletPoint.icon.src" width="50" height="50" :alt="bulletPoint.icon.alt"/>
            <h3 class="title">{{bulletPoint.title}}</h3>
          </li>
        </ul>
      </NormalCard>
    </swiper-slide>
  </swiper>
  <div v-else class="slide-show">
    <div v-for="card in cards" class="d-flex justify-content-center">
      <ImageCard v-if="card.type === 'image'" :image="card.image" :tag="card.tag" :title="card.title"
                 :description="card.description" :slug="card.slug" :date="card.date"/>
      <NormalCard v-else-if="card.type === 'skill'" :title="card.title">
        <div class="skill bar-container" v-for="skill in card.skills">
          <div class="title">{{ skill.label }}</div>
          <div class="bar">
            <div class="bar-inner" :style="'width: ' + skill.percentage + '%;'">{{skill.placeholder}}</div>
          </div>
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'text'" :title="card.title">
        <div class="text" v-html="card.text"/>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'svg'" :title="card.title">
        <div class="svg-container" v-html="card.svg">
        </div>
      </NormalCard>
      <NormalCard v-else-if="card.type === 'timeline'" :title="card.title">
        <div class="timeline-container">
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
            <img :src="bulletPoint.icon.src" width="30" height="30" :alt="bulletPoint.icon.alt"/>
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
import {isMobile} from "@/utils/device";

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
    const onSwiper = () => {
    };
    const onSlideChange = () => {
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination],
    };
  },
  mounted(){
    const startAnimation = (entries) => {
      entries.forEach(entry => {
        const barInner = entry.target.querySelector('.bar-inner');
        if (barInner) {
          barInner.classList.toggle('slide', entry.isIntersecting);
        }
      });
    };

    const options = { root: null, rootMargin: '0px', threshold: 1 };
    const observer = new IntersectionObserver(startAnimation, options);

    this.$el.querySelectorAll('.skill').forEach(element => {
      observer.observe(element);
    });
  },
  methods: {
    isMobile
  }
}
</script>

<style lang="scss" src="./SlideShow.scss" />

