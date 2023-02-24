<template>
  <a-layout-sider
    v-model:collapsed="$store.state.collapsed"
    width="var(--sider-width)"
    collapsedWidth="var(--sider-collapsed-width)"
    style=""
    class="sider-bar"
  >
    <a-layout-header class="ant-list-header">
      <div style="display: flex; justify-content: center; align-items: center">
        <h3 style="color: #fff" v-if="!$store.state.collapsed">
          {{ $store.state.userAccount.fullname }}
        </h3>
        <a-tooltip
          v-else
          :title="$store.state.userAccount.fullname"
          placement="rightTop"
        >
          <div class="user-name-container" shape="circle">
            <h4 style="color: #fff">
              {{ $store.state.userAccount.fullname.slice(0, 2).toUpperCase() }}
            </h4>
          </div>
        </a-tooltip>
      </div>
    </a-layout-header>

    <!-- <a-list>
      <template #header>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <h3 style="color: #fff" v-if="!$store.state.collapsed">DuyHieu</h3>
          <div v-else class="user-name-container">
            <h4 style="color: #fff">
              {{ 'DuyHieu'.slice(0, 2).toUpperCase() }}
            </h4>
          </div>
        </div>
      </template>
    <TheMenu />
    </a-list> -->

    <TheMenu />
    <a-layout-footer
      style=""
      @click="$store.state.collapsed = !$store.state.collapsed"
    >
      <div :class="['trigger-collapse', { active: $store.state.collapsed }]">
        <DoubleLeftOutlined
          style="transition: all 0.3s"
          v-if="!$store.state.collapsed"
        />
        <DoubleRightOutlined v-else />
        <span class="title-trigger-collapse">Collapse sidebar</span>
      </div>
    </a-layout-footer>
  </a-layout-sider>
</template>

<script>
import { ref } from 'vue';
import {} from 'ant-design-vue';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';

import TheMenu from './TheMenu.vue';

export default {
  components: {
    TheMenu,
    DoubleLeftOutlined,
    DoubleRightOutlined,
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

<style lang="scss">
.ant-layout-sider.sider-bar {
  position: fixed;
  left: 0;
  top: var(--header-height);
  bottom: 0;
  border-right: 1px solid var(--border-regular);
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );

  .ant-layout-footer {
    position: sticky;
    bottom: 0;
    z-index: 2;
    height: var(--header-height);
    display: flex;
    align-items: center;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color3),
      var(--sider-header-background-color2)
    );
    border-top: 1px solid var(--border-regular);
    padding: 0px;
    cursor: pointer;
    color: #fff;
  }
}
.ant-list-split .ant-list-header {
  border-bottom: 1px solid var(--border-regular);
}

.ant-layout-sider-trigger {
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color1),
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );
  border-top: 1px solid var(--border-regular);
  border-right: 1px solid var(--border-regular);
}

.ant-layout-sider-children {
  min-height: 100%;
  overflow-y: scroll;
  .ant-spin-container {
    margin-bottom: 30px;
  }
}

.ant-list-header {
  position: sticky;
  top: 0;
  z-index: 2;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );
  border-bottom: 1px solid var(--border-regular);
  padding: 0px;
}

.ant-layout-sider-children::-webkit-scrollbar {
  display: none;
}

.user-name-container {
  height: 35px;
  width: 35px;
  border-radius: 50%;
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
}

.ant-dropdown-menu-item:not(:last-child) {
  border-bottom: 0.5px solid var(--border-regular);
}

.trigger-collapse {
  white-space: nowrap;
  padding: 0px 20px;
  padding-left: 24px;
  transition: padding 0.1s cubic-bezier(0.215, 0.61, 0.355, 1);

  .title-trigger-collapse {
    margin-left: 10px;
    user-select: none;
    opacity: 1;
    transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s,
      color 0.3s;
  }
}

.trigger-collapse.active {
  left: 0;
  // padding: 0 calc(50% - 16px / 2);
  padding: 0px calc((var(--sider-collapsed-width) - 16px) / 2);
  overflow: hidden;

  .title-trigger-collapse {
    opacity: 0;
  }
}

.ant-menu-title-content {
  user-select: none;
}
</style>
