<template>
  <a-layout>
    <Header />
    <a-layout :class="[$store.state.collapsed ? 'expand' : '', 'body-content']">
      <Sider />
      <Drawer />
      <a-layout>
        <BreadCrumb />
        <a-layout-content class="container">
          <div>
            <slot />
          </div>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Normal/Header/Header.vue';
import Drawer from '@/components/Normal/Drawer/Drawer.vue';
import Sider from '@/components/Normal/Sider/Sider.vue';
// import Content from '@/components/Content.vue';
import Footer from '@/components/Normal/Footer/Footer.vue';
import BreadCrumb from '@/components/Normal/BreadCrumb/BreadCrumb.vue';

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
  padding: 15px 20px;
  background-color: var(--background-content-color);
}
.ant-layout-content.container {
  & > div {
    overflow: hidden;
  }
}

@media (prefers-color-scheme: dark) {
  .ant-layout-content {
    background-color: var(--background-content-color);
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
