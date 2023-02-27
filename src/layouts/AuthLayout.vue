<template>
  <div class="auth-container">
    <img
      v-if="image == 1"
      src="../assets/images/background_auth/Background_Auth1.jpg"
      alt=""
    />
    <img
      v-else-if="image == 2"
      src="../assets/images/background_auth/Background_Auth2.jpg"
      alt=""
    />
    <img
      v-else-if="image == 3"
      src="../assets/images/background_auth/Background_Auth3.jpg"
      alt=""
    />
    <img
      v-else-if="image == 4"
      src="../assets/images/background_auth/Background_Auth4.jpg"
      alt=""
    />
    <slot />
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    return {
      image: ref(Math.floor(Math.random() * 4) + 1),
    };
  },
};
</script>
<style lang="scss">
.auth-container {
  img {
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 1;
    object-fit: cover;
  }
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>
