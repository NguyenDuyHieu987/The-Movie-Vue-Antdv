<template>
  <!-- <a-drawer
    placement="left"
    :visible="$store.state.openDrawer"
    @close="onClose"
    :width="250"
    :closable="true"
  >
    <template #extra>
      <div class="logo">
        <router-link :to="{ path: '/' }">
          <h1>Phimhay247</h1>
        </router-link>
      </div>
    </template>
    <TheMenu />
  </a-drawer> -->

  <el-drawer
    v-model="$store.state.openDrawer"
    direction="ltr"
    :before-close="handleClose"
    placement="left"
  >
    <template #header>
      <div class="logo">
        <router-link :to="{ path: '/' }">
          <h1>Phimhay247</h1>
        </router-link>
      </div>
    </template>
    <TheMenu />
  </el-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
// import { MenufoldOutlined } from '@ant-design/icons-vue';
import TheMenu from './TheMenu.vue';

export default defineComponent({
  components: {
    TheMenu,
    // MenufoldOutlined,
  },
  setup() {
    const store = useStore();
    const visible = ref(false);

    const onClose = () => {
      store.state.openDrawer = false;
    };

    return {
      visible,
      onClose,
    };
  },
});
</script>

<style lang="scss">
@media only screen and (min-width: 800px) {
  .ant-drawer-content,
  .el-drawer,
  .el-overlay,
  .ant-drawer-mask {
    display: none;
  }
}
.ant-drawer-content,
.el-drawer {
  width: 250px !important;
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );

  .ant-drawer-header {
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color3),
      var(--sider-header-background-color2)
    );
    height: var(--header-height);
    justify-content: start;
    border-bottom: none;

    .ant-drawer-header-title {
      flex: auto 0 1;
    }
  }

  .el-drawer__close-btn {
    font-size: 2.8rem;
  }

  .ant-drawer-body,
  .el-drawer__body {
    padding: 0px 0px 24px 0px;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      // background: #383838;
      background: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: #acacac;
    }
  }
}
</style>
