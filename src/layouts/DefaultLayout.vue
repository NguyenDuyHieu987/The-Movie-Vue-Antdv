<template>
  <a-layout>
    <Header />
    <a-layout :class="[$store.state.collapsed ? 'expand' : '', 'body-content']">
      <Sider />
      <a-layout>
        <BreadCrumb />
        <a-layout-content class="container">
          <slot />
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
    <Drawer />
  </a-layout>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Header/Header.vue';
import Drawer from '@/components/Drawer/Drawer.vue';
import Sider from '@/components/Sider/Sider.vue';
// import Content from '@/components/Content.vue';
import Footer from '@/components/Footer/Footer.vue';
import BreadCrumb from '@/components/BreadCrumb/BreadCrumb.vue';

export default {
  components: {
    Header,
    Sider,
    BreadCrumb,
    Footer,
    Drawer,
  },
  data() {
    return {
      selectedKeys1: ref(['2']),
      selectedKeys2: ref(['1']),
      collapsed: ref(false),
      openKeys: ref(['sub1']),
    };
  },
};
</script>
<style lang="scss" scoped>
.body-content {
  margin-left: var(--sider-width);
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
  transition: all 0.2s;
}

.body-content.expand {
  margin-left: var(--sider-collapsed-width);
}

.ant-layout-content {
  // min-height: calc(100vh - 130px);
  background-color: #000;
  padding: 15px 20px;
  background-color: var(--background-content-color);
}

@media only screen and (max-width: 900px) {
  .ant-layout-content {
    .container {
      padding: 15px 15px;
    }
  }
}
</style>
