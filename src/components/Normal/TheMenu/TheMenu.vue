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
    <a-menu-item key="">
      <template #icon>
        <HomeOutlined />
      </template>
      <router-link :to="{ name: 'home' }"><span>Trang chủ</span> </router-link>
    </a-menu-item>

    <a-sub-menu key="movie">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-video-camera" />
      </template>
      <template #title>Phim lẻ</template>
      <a-menu-item key="all">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'all',
            },
          }"
        >
          <span>Tất cả</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="nowplaying">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'nowplaying',
            },
          }"
        >
          <span>Now playing</span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="popular">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'popular',
            },
          }"
        >
          <span>Phổ biến</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="toprated">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'toprated',
            },
          }"
        >
          <span>Top đánh giá</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="upcoming">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'upcoming',
            },
          }"
        >
          <span>Sắp công chiếu</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="tv">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-film" />
      </template>
      <template #title>Phim bộ</template>
      <a-menu-item key="tv">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'all',
            },
          }"
        >
          <span>Tất cả </span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="airingtoday">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'airingtoday',
            },
          }"
        >
          <span>Airing today </span>
        </router-link>
      </a-menu-item>

      <a-menu-item key="ontheair">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'ontheair',
            },
          }"
        >
          <span>On the air </span>
        </router-link> </a-menu-item
      ><a-menu-item key="tvpopular">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'tvpopular',
            },
          }"
        >
          <span>Phổ biến </span>
        </router-link> </a-menu-item
      ><a-menu-item key="tvtoprated">
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'tvtoprated',
            },
          }"
        >
          <span>Top đánh giá</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="genres">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-list" />
      </template>
      <template #title>Thể loại</template>
      <a-menu-item
        v-for="(item, index) in genres"
        :index="index"
        :key="item?.short_name"
      >
        <a-tooltip
          :title="item?.name_vietsub"
          placement="right"
          v-if="item?.name_vietsub?.length > 30"
        >
          <router-link
            :to="{
              name: 'discover',
              params: {
                slug: 'genres',
                slug2: item?.short_name,
              },
            }"
          >
            <span>{{ item?.name_vietsub }}</span>
          </router-link>
        </a-tooltip>
        <router-link
          v-else
          :to="{
            name: 'discover',
            params: {
              slug: 'genres',
              slug2: item?.short_name,
            },
          }"
        >
          <!-- @click="$store.state.breadCrumbValue = item?.name_vietsub" -->

          <span>{{ item?.name_vietsub }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="years">
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
                    ?.replaceAll(/\s/g, '-')
                    .toLowerCase(),
            },
          }"
        >
          <span>{{ item?.name }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="countries">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-globe" />
      </template>
      <template #title>Quốc gia</template>
      <a-menu-item
        v-for="(item, index) in countries"
        :index="index"
        :key="item?.short_name"
      >
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'countries',
              slug2: item?.short_name,
            },
          }"
        >
          <!-- @click="$store.state.breadCrumbValue = item?.name" -->

          <span>{{ item?.name }}</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-menu-item key="follow">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-bookmark" />
      </template>
      <router-link :to="{ name: 'follow' }"> <span>Theo dõi</span></router-link>
    </a-menu-item>
    <!-- style="margin-bottom: 55vh" -->
    <a-menu-item key="ranking">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-ranking-star" />
      </template>
      <router-link :to="{ name: 'ranking' }">
        <span>Xếp hạng</span></router-link
      >
    </a-menu-item>

    <a-menu-item key="pricing">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-money-check-dollar" />
      </template>
      <router-link :to="{ name: 'pricing' }"> <span>Pricing</span></router-link>
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
