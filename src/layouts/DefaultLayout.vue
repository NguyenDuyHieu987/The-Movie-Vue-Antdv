<template>
  <a-layout>
    <Header />
    <a-layout :class="[$store.state.collapsed ? 'expand' : '', 'body-content']">
      <Sider />
      <div style="width: 100%">
        <Content>
          <slot />
        </Content>
        <Footer />
      </div>
    </a-layout>
  </a-layout>
  <Drawer />
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import Drawer from '@/components/Drawer.vue';
import Sider from '@/components/Sider.vue';
import Content from '@/components/Content.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Sider,
    Content,
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
</style>
