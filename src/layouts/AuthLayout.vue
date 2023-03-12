<template>
  <div class="auth-container">
    <div class="image-auth">
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
    </div>
    <div class="image-auth responsive">
      <img
        v-if="image == 1"
        src="../assets/images/background_auth_responsive/Background_Auth1.jpg"
        alt=""
      />
      <img
        v-else-if="image == 2"
        src="../assets/images/background_auth_responsive/Background_Auth2.jpg"
        alt=""
      />
      <img
        v-else-if="image == 3"
        src="../assets/images/background_auth_responsive/Background_Auth3.jpg"
        alt=""
      />
    </div>

    <slot />
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    return {
      image: ref(Math.floor(Math.random() * 3) + 1),
    };
  },
};
</script>
<style lang="scss">
@media only screen and (max-width: 500px) {
  .image-auth:not(.image-auth.responsive) {
    display: none;
  }

  .image-auth.responsive {
    display: block !important;
  }
}

.auth-container {
  overflow-y: scroll;
  height: 100vh;
  display: flex;
  align-items: center;

  .image-auth {
    height: 100%;
    width: 100%;
    position: absolute;
  }

  .image-auth.responsive {
    display: none;
  }

  img {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 1;
    object-fit: cover;
  }
}
</style>
