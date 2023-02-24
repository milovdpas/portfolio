<template>
  <div class="image-card">
    <div class="card">
      <img :src="image" class="card-img-top" alt="card image">
      <div class="card-body">
        <h3 class="card-title">{{ title }}</h3>
        <div class="card-text mb-3" v-html="description"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ImageCard",
  props: {
    image: String,
    title: String,
    description: String
  },
  components: {
  }
}
</script>

<style scoped lang="scss" src="./ImageCard.scss"/>
