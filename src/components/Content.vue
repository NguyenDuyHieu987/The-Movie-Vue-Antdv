<template>
  <a-layout-content
    style="min-height: calc(100vh - 130px); background-color: #fff"
  >
    <BreadCrumb />
    <div
      style="
        padding: 15px 30px;
        background-color: var(--background-content-color);
        height: 100%;
      "
    >
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
<style lang="scss">
// .ant-breadcrumb span a {
//   color: #c9c9c9;
// }

// .ant-breadcrumb span:last-child a {
//   color: #fff;
// }
</style>
