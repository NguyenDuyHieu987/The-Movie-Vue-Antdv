<template>
  <a-layout-footer class="footer">
    <div class="footer-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }">
          <img src="@/assets/images/film-reel.png" style="height: 50px" />
          <h1>Phimhay247</h1>
        </router-link>
      </div>
    </div>
    <p class="copyright">© Copyright by 2022 Phimhay247 All Right Reserved</p>
  </a-layout-footer>
</template>

<style scoped lang="scss" src="./Footer.scss"></style>
