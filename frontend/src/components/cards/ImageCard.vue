<template>
  <div class="image-card" v-if="isMobile()" @click="toProject">
    <div class="card">
      <img v-once :src="image" class="card-img-top" width="1200" height="800" alt="card image">
      <div class="card-body">
        <span v-if="tag" :class="'badge mb-1 ' + tag.color">{{tag.text}}</span>
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-text mb-3" v-html="description"></div>
      </div>
    </div>
  </div>
  <div class="image-card" v-else>
    <div class="card">
      <img v-once :src="image" class="card-img-top" width="1200" height="800" alt="card image" @click="toProject">
      <div class="card-body">
        <span v-if="tag" :class="'badge mb-1 ' + tag.color">{{tag.text}}</span>
        <h3 class="card-title"  @click="toProject">{{ title }}</h3>
        <div class="card-text mb-3" v-html="description"  @click="toProject"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {isMobile} from "@/utils/device";

export default {
  name: "ImageCard",
  props: {
    image: String,
    tag: Object,
    title: String,
    description: String,
    slug: String,
  },
  components: {
  },
  methods: {
    isMobile,
    toProject(){
      this.$router.push({
        name: 'project',
        params: {
          slug: this.slug
        }
      });
    }
  }
}
</script>

<style scoped lang="scss" src="./ImageCard.scss"/>
