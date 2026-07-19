<template>
  <textarea class="form-control" :aria-describedby="name" :placeholder="placeholder" :value="modelValue" v-on:input="updateValue($event.target.value)" :rows="rows" :cols="cols"></textarea>
</template>

<script>
export default {
  name: "TextArea",
  props: {
    modelValue: String,
    name: String,
    placeholder: String,
    rows: Number,
    cols: Number,

  },
  emits: ['update:modelValue'],
  methods: {
    updateValue: function (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style scoped lang="scss" src="./TextArea.scss"/>

