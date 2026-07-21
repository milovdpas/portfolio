<template>
  <div class="image-card" v-if="isMobile()" @click="toProject">
    <div class="card">
      <img v-once :src="image" class="card-img-top" width="1200" height="800" alt="card image">
      <div class="card-body">
        <span v-if="tag" :class="'badge mb-1 ' + tag.color">{{ localizedTagText }}</span>
        <h3 class="card-title">{{ localizedTitle }}</h3>
        <div class="card-text mb-3" v-html="localizedDescription"></div>
      </div>
    </div>
  </div>
  <div class="image-card" v-else>
    <div class="card">
      <img v-once :src="image" class="card-img-top" width="1200" height="800" alt="card image" @click="toProject">
      <div class="card-body">
        <span v-if="tag" :class="'badge mb-1 ' + tag.color">{{ localizedTagText }}</span>
        <h3 class="card-title"  @click="toProject">{{ localizedTitle }}</h3>
        <div class="card-text mb-3" v-html="localizedDescription"  @click="toProject"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {isMobile} from "@/utils/device";
import {localized} from "@/i18n";

export default {
  name: "ImageCard",
  props: {
    image: String,
    tag: Object,
    // Plain strings or per-locale objects {en, nl} — both are supported.
    title: [String, Object],
    description: [String, Object],
    slug: String,
  },
  components: {
  },
  computed: {
    // this.$i18n.locale is read to make these re-compute on locale switch.
    localizedTitle() {
      this.$i18n.locale;
      return localized(this.title);
    },
    localizedDescription() {
      this.$i18n.locale;
      return localized(this.description);
    },
    localizedTagText() {
      this.$i18n.locale;
      return this.tag ? localized(this.tag.text) : '';
    },
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
