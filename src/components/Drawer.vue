<template>
  <a-drawer
    :placement="placement"
    :visible="$store.state.openDrawer"
    @close="onClose"
    :width="250"
    :closable="true"
  >
    <template #extra>
      <div class="logo">
        <h1>Phimhay247</h1>
      </div>
    </template>
    <TheMenu />
  </a-drawer>
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
    const placement = ref('left');
    const visible = ref(false);

    const onClose = () => {
      store.state.openDrawer = false;
    };

    return {
      placement,
      visible,
      onClose,
    };
  },
});
</script>

<style lang="scss">
.ant-drawer-content {
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

  // .menu-sider-bar {
  //   .ant-menu-item:hover {
  //     background-color: var(--hover-regular-color) !important;
  //   }

  //   .ant-menu-item.ant-menu-item-selected {
  //     background-color: var(--hover-regular-color) !important;
  //   }

  //   .ant-menu-item:not(:last-child) {
  //     margin-bottom: 0px !important;
  //   }

  //   .ant-menu-item,
  //   .ant-menu-submenu-title {
  //     height: 45px;
  //     line-height: 45px;
  //     border-top-left-radius: 100px;
  //     border-bottom-left-radius: 100px;
  //     margin-left: 3px;
  //   }
  // }

  .ant-drawer-body {
    padding: 0px 0px 24px 0px;
  }
}
</style>
