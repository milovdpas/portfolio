<template>
    <div class="normal-card">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">{{ title }}</h3>
          <slot/>
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "NormalCard",
  props: {
    title: String,
  },
  components: {
  }
}
</script>

<style scoped lang="scss" src="./NormalCard.scss"/>
