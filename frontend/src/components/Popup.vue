<template>
  <div id="popup" class="modal">
    <div class="modal-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  mounted(){
    const popup = document.getElementById('popup');
    popup.addEventListener('click', ev => {
      ev.preventDefault();
      popup.classList.toggle('active');
    });
  }
}
</script>

<style lang="scss" src="./Popup.scss"/>

