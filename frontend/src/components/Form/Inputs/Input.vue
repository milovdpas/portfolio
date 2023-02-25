<template>
  <input :type="(type ?? 'text')" class="form-control" :id="name" :name="name" :aria-describedby="name" :placeholder="placeholder" :value="modelValue" v-on:input="updateValue($event.target.value)">
  <small v-if="help" :id="'help'+name" class="form-text text-muted">{{ help }}</small>
</template>

<script>

export default {
  name: "Input",
  props:{
    modelValue: String,
    placeholder: String,
    type: String,
    name: String,
    help: String
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue: function (value) {
      const parent = document.getElementById(this.name).parentNode;
      if(parent.classList.contains('invalid'))
        parent.classList.replace('invalid', 'valid');
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style scoped lang="scss" src="./Input.scss"/>

