<template>
  <a-layout-content>
    <BreadCrumb />
    <div class="container">
      <slot />
    </div>
  </a-layout-content>
</template>
<script>
import BreadCrumb from './BreadCrumb.vue';

export default {
  components: {
    BreadCrumb,
  },
};
</script>
<style lang="scss" scoped>
.ant-layout-content {
  min-height: calc(100vh - 130px);
  background-color: #000;
  .container {
    padding: 15px 20px;
    background-color: var(--background-content-color);
    height: 100%;
  }
}

@media only screen and (max-width: 900px) {
  .ant-layout-content {
    .container {
      padding: 15px 15px;
    }
  }
}
</style>
