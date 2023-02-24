<template>
  <div class="auth-container">
    <img src="../assets/images/Background_Auth2.jpg" alt="" />
    <slot />
  </div>
</template>
<style lang="scss">
.auth-container {
  img {
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    opacity: 0.7;
    object-fit: cover;
  }
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>
