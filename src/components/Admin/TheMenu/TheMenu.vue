<template>
  <a-menu
    :forceSubMenuRender="true"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    class="menu-sider-bar"
    theme="dark"
    :subMenuCloseDelay="0.1"
    :subMenuOpenDelay="0.1"
  >
    <a-menu-item key="dashboard">
      <template #icon>
        <HomeOutlined />
      </template>
      <router-link :to="{ name: 'dashboard' }"
        ><span>Bảng điều khiển</span>
      </router-link>
    </a-menu-item>
    <a-sub-menu key="managefilm">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-film" />
      </template>

      <template #title>Quản lý phim</template>

      <a-menu-item key="movie">
        <router-link :to="{ name: 'managemovie' }"
          ><span>Phim lẻ</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="tv">
        <router-link :to="{ name: 'managetv' }"
          ><span>Phim bộ</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';
import { HomeOutlined } from '@ant-design/icons-vue';

import { useRoute } from 'vue-router';
import { removeVietnameseTones } from '@/utils/RemoveVietnameseTones';

export default {
  components: {
    HomeOutlined,
  },
  setup() {
    const route = useRoute();

    const state = reactive({
      selectedKeys: [
        route.path
          .replaceAll('add', '')
          .replaceAll('edit', '')
          .replaceAll('managefilm', '')
          .replaceAll('/', '')
          .replaceAll(route.params.id, ''),
      ],
      openKeys: [
        route.path
          .replaceAll('add', '')
          .replaceAll('edit', '')
          .replaceAll('tv', '')
          .replaceAll('movie', '')
          .replaceAll('/', '')
          .replaceAll(route.params.id, ''),
      ],
      // preOpenKeys: ['1'],
    });

    watch(route, () => {
      state.selectedKeys = [
        route.path
          .replaceAll('add', '')
          .replaceAll('edit', '')
          .replaceAll('managefilm', '')
          .replaceAll('/', '')
          .replaceAll(route.params.id, ''),
      ];

      state.openKeys = [
        route.path
          .replaceAll('add', '')
          .replaceAll('edit', '')
          .replaceAll('tv', '')
          .replaceAll('movie', '')
          .replaceAll('/', '')
          .replaceAll(route.params.id, ''),
      ];
    });

    return {
      ...toRefs(state),
      removeVietnameseTones,
    };
  },
};
</script>

<style lang="scss" src="./TheMenu.scss"></style>
