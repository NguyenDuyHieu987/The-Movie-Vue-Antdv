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
  </a-menu>
</template>

<script>
import { reactive, toRefs, watch, onBeforeMount, ref } from 'vue';
import { HomeOutlined } from '@ant-design/icons-vue';
import {
  getAllGenre,
  getAllNational,
  getAllYear,
} from '@/services/MovieService';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { removeVietnameseTones } from '@/untils/RemoveVietnameseTones';
import { useStore } from 'vuex';

export default {
  components: {
    HomeOutlined,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const state = reactive({
      selectedKeys: [
        route.path
          .replaceAll('discover', '')
          .replaceAll(route.params?.slug ? route.params?.slug : '', '')
          .replaceAll(route.params?.id ? route.params?.id : '', '')
          .replaceAll(route.params?.name ? route.params?.name : '', '')
          .replaceAll('/', ''),
      ],
      openKeys: [
        route.path
          .replaceAll('discover', '')
          .replaceAll(route.params?.slug2 ? route.params?.slug2 : '', '')
          .replaceAll(route.params?.id ? route.params?.id : '', '')
          .replaceAll(route.params?.name ? route.params?.name : '', '')
          .replaceAll('/', ''),
      ],
      // preOpenKeys: ['1'],
    });

    const genres = ref([]);
    const years = ref([]);
    const countries = ref([]);

    onBeforeMount(() => {
      Promise.all([getAllGenre(), getAllYear(), getAllNational()])
        .then((res) => {
          genres.value = res[0].data;
          years.value = res[1].data.sort(function (a, b) {
            return +b.name.slice(-4) - +a.name.slice(-4);
          });
          countries.value = res[2].data;

          store.state.allGenres = res[0].data;
          store.state.allCountries = res[2].data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    watch(route, () => {
      state.selectedKeys = [
        route.path
          .replaceAll('discover', '')
          .replaceAll(route.params?.slug ? route.params?.slug : '', '')
          .replaceAll(route.params?.id ? route.params?.id : '', '')
          .replaceAll(route.params?.name ? route.params?.name : '', '')
          .replaceAll('/', ''),
      ];

      state.openKeys = [
        route.path
          .replaceAll('discover', '')
          .replaceAll(route.params?.slug2 ? route.params?.slug2 : '', '')
          .replaceAll(route.params?.id ? route.params?.id : '', '')
          .replaceAll(route.params?.name ? route.params?.name : '', '')
          .replaceAll('/', ''),
      ];
    });

    return {
      ...toRefs(state),
      genres,
      years,
      countries,
      removeVietnameseTones,
    };
  },
};
</script>

<style lang="scss" src="./TheMenu.scss"></style>
