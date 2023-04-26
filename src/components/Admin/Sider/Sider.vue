<template>
  <a-layout-sider
    v-model:collapsed="$store.state.collapsed"
    width="var(--sider-width)"
    collapsedWidth="var(--sider-collapsed-width)"
    style=""
    class="sider-bar-admin"
  >
    <a-layout-header class="sider-header">
      <div style="display: flex; justify-content: center; align-items: center">
        <!-- <a-skeleton
          :paragraph="{ rows: 1 }"
          :active="true"
          :title="false"
          :loading="$store.state.userAccount?.username == undefined"
        > -->

        <div
          class="user-image-container"
          v-if="!$store.state.collapsed && $store.state.isLogin"
        >
          <a-skeleton-avatar
            v-if="!$store.state?.isLogin"
            :loading="$store.state?.isLogin"
            :active="true"
            size="large"
            shape="circle"
          />
          <img
            v-else
            class="avatar"
            :src="
              !isNaN(+$store.state?.userAccount?.avatar)
                ? `/images/account_avatar/account${$store.state?.userAccount?.avatar}.jpg`
                : $store.state?.userAccount?.avatar
            "
          />
        </div>

        <a-skeleton
          :loading="!$store.state?.isLogin"
          :active="true"
          :paragraph="{ rows: 1 }"
          :title="false"
        >
          <h4 style="color: #fff" v-if="!$store.state.collapsed">
            {{ $store.state.userAccount?.username }}
          </h4>

          <a-tooltip
            v-else
            :title="$store.state.userAccount?.username"
            placement="rightTop"
          >
            <!-- <div class="user-name-container" shape="circle"> -->
            <a-avatar class="user-name-container">
              <h4 style="color: #fff">
                {{
                  $store.state.userAccount?.username?.slice(0, 2).toUpperCase()
                }}
              </h4>
            </a-avatar>
            <!-- </div> -->
          </a-tooltip>
        </a-skeleton>

        <!-- </a-skeleton> -->
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
    <a-layout-footer @click="$store.state.collapsed = !$store.state.collapsed">
      <div :class="['trigger-collapse', { active: $store.state.collapsed }]">
        <DoubleLeftOutlined
          style="transition: all 0.3s"
          v-if="!$store.state.collapsed"
        />
        <DoubleRightOutlined v-else />
        <span class="title-trigger-collapse">Đóng</span>
      </div>
    </a-layout-footer>
  </a-layout-sider>
</template>

<script>
import { ref } from 'vue';
import {} from 'ant-design-vue';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';
import TheMenu from '../TheMenu/TheMenu.vue';

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

<style lang="scss" src="./Sider.scss"></style>
