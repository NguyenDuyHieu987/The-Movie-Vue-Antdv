<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    mode="inline"
    style="
      background-image: linear-gradient(
        to right,
        var(--sider-header-background-color3),
        var(--sider-header-background-color2)
      );
    "
    class="menu-sider-bar"
    theme="dark"
  >
    <a-menu-item key="/">
      <template #icon>
        <HomeOutlined />
      </template>
      <router-link :to="{ name: 'home' }"><span>Trang chủ</span> </router-link>
    </a-menu-item>

    <a-menu-item key="/movie">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-video-camera" />
      </template>
      <router-link
        :to="{
          name: 'typemovie',
          params: {
            slug: 'movie',
          },
        }"
      >
        <span>Phim lẻ</span>
      </router-link>
    </a-menu-item>

    <a-menu-item key="/tv">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-film" />
      </template>
      <router-link
        :to="{
          name: 'typemovie',
          params: {
            slug: 'tv',
          },
        }"
      >
        <span>Phim bộ</span></router-link
      >
    </a-menu-item>

    <a-sub-menu key="/genres">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-list" />
      </template>
      <template #title>Thể loại</template>
      <a-menu-item
        v-for="(item, index) in genres"
        :index="index"
        :key="item?.id"
      >
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'genres',
              slug2: item?.name?.replace(/\s/g, '+').toLowerCase(),
            },
          }"
          style="display: flex"
        >
          <span>{{ item?.name }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/years">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-calendar-days" />
      </template>
      <template #title>Năm phát hành</template>
      <a-menu-item
        v-for="(item, index) in years"
        :index="index"
        :key="item?.name"
      >
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'years',
              slug2: /^\d+$/.test(item?.name)
                ? item?.name
                : removeVietnameseTones(item?.name)
                    ?.replace(/\s/g, '-')
                    .toLowerCase(),
            },
          }"
          style="display: flex"
        >
          <span>{{ item?.name }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="/countries">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-globe" />
      </template>
      <template #title>Quốc gia</template>
      <a-menu-item
        v-for="(item, index) in countries"
        :index="index"
        :key="item?.iso_639_1"
      >
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'countries',
              slug2: item?.name2,
            },
          }"
          style="display: flex"
          @click="$store.state.breadCrumbValue = item?.name"
        >
          <span>{{ item?.name }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-menu-item key="/follow">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-bookmark" />
      </template>
      <router-link :to="{ name: 'follow' }"> <span>Theo dõi</span></router-link>
    </a-menu-item>

    <a-menu-item key="/ranking" style="margin-bottom: 52vh">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-ranking-star" />
      </template>
      <router-link :to="{ name: 'ranking' }">
        <span>Xếp hạng</span></router-link
      >
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
} from '../services/MovieService';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { removeVietnameseTones } from '../untils/RemoveVietnameseTones';

export default {
  components: {
    HomeOutlined,
  },
  setup() {
    const route = useRoute();

    const state = reactive({
      selectedKeys: [route.path],
      openKeys: ['1'],
      preOpenKeys: ['1'],
    });

    const genres = ref([]);
    const years = ref([]);
    const countries = ref([]);

    watch(
      () => state.openKeys,
      (_val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    onBeforeMount(() => {
      Promise.all([getAllGenre(), getAllYear(), getAllNational()])
        .then((res) => {
          genres.value = res[0].data;
          years.value = res[1].data;
          countries.value = res[2].data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
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

<style lang="scss">
.menu-sider-bar {
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );
  overflow: hidden;

  .ant-menu-item:hover {
    background-color: var(--hover-regular-color) !important;
  }

  .ant-menu-item.ant-menu-item-selected {
    background-color: var(--hover-regular-color) !important;
  }

  .ant-menu-item:not(:last-child) {
    margin-bottom: 0px;
  }

  .ant-menu-item {
    height: 45px;
    line-height: 45px;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    margin-left: 3px !important;
  }

  .ant-menu-submenu {
    margin-left: 3px !important;
  }

  .ant-menu-submenu {
    .ant-menu-item {
      padding-left: 24px;
      // margin-left: 30px;
    }
  }
}
</style>
