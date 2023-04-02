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
        <!-- <font-awesome-icon icon="fa-solid fa-video-camera" /> -->
        <!-- <i class="fa-regular fa-video"></i> -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path
            d="M557.6 102.3c-11.53-7.406-25.88-8.391-38.28-2.688L416 147V128c0-35.35-28.65-64-64-64H64C28.65 64 0 92.65 0 128v256c0 35.35 28.65 64 64 64h288c35.35 0 64-28.65 64-64v-19.02l103.3 47.36c5.344 2.453 11.03 3.672 16.69 3.672c7.531 0 15.02-2.141 21.59-6.359C569.1 402.3 576 389.7 576 375.1V136C576 122.3 569.1 109.8 557.6 102.3zM368 384c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V128c0-8.822 7.178-16 16-16h288c8.822 0 16 7.178 16 16V384zM528 363.5L416 312.2V199.8l112-51.33V363.5z"
          />
        </svg>
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
        <!-- <i class="fa-sharp fa-light fa-calendar-days"></i> -->
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
        <!-- <font-awesome-icon icon="fa-solid fa-globe" /> -->
        <!-- <i class="fa-regular fa-globe"></i> -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M256 16C123.5 16 16 123.5 16 256s107.5 240 240 240s239.1-107.5 239.1-240S388.5 16 256 16zM422 160H373.3c-6.391-27.41-15.39-52.18-26.48-73.1C378.2 103.8 404.2 129.2 422 160zM336 256c0 16.98-1.295 32.82-3.176 48H179.2C177.3 288.8 176 272.1 176 256s1.295-32.82 3.176-48h153.6C334.7 223.2 336 239 336 256zM256 448c-21.79 0-50.87-36.42-67.28-96h134.6C306.9 411.6 277.8 448 256 448zM188.7 160C205.1 100.4 234.2 64 256 64s50.87 36.42 67.28 96H188.7zM165.2 86.9C154.1 107.8 145.1 132.6 138.7 160H89.98C107.8 129.2 133.8 103.8 165.2 86.9zM70.32 208h60.25C128.9 223.5 128 239.6 128 256S128.9 288.5 130.6 304H70.32C66.34 288.6 64 272.6 64 256S66.34 223.4 70.32 208zM89.98 352H138.7c6.391 27.41 15.39 52.18 26.48 73.1C133.8 408.2 107.8 382.8 89.98 352zM346.8 425.1C357.9 404.2 366.9 379.4 373.3 352h48.74C404.2 382.8 378.2 408.2 346.8 425.1zM441.7 304h-60.25c1.68-15.51 2.57-31.56 2.57-48s-.8907-32.49-2.57-48h60.25C445.7 223.4 448 239.4 448 256S445.7 288.6 441.7 304z"
          />
        </svg>
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
        <!-- <font-awesome-icon icon="fa-solid fa-bookmark" /> -->
        <span class="material-symbols-outlined"> playlist_play </span>
      </template>
      <router-link :to="{ name: 'follow' }"> <span>Theo dõi</span></router-link>
    </a-menu-item>

    <a-menu-item key="history">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-clock-rotate-left" />
      </template>
      <router-link :to="{ name: 'history' }">
        <span>Lịch sử Xem </span>
      </router-link>
    </a-menu-item>

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
        <!-- <font-awesome-icon icon="fa-solid fa-money-check-dollar" /> -->
        <!-- <i class="fa-regular fa-money-check-dollar-pen"></i> -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path
            d="M280 400h208c13.25 0 24-10.75 24-24S501.3 352 488 352h-208C266.8 352 256 362.8 256 376S266.8 400 280 400zM352 193.7V256h62.34c4.264 0 8.35-1.703 11.35-4.727l124.9-126l-67.88-67.88l-126 124.9C353.7 185.3 352 189.4 352 193.7zM600.5 75.38c10-10 10-26.12 0-36L568.6 7.5C563.7 2.5 557.2 0 550.7 0s-13.05 2.5-18.05 7.5l-27.25 27.25l67.88 67.88L600.5 75.38zM280 288h16C309.3 288 320 277.3 320 264S309.3 240 296 240h-16C266.8 240 256 250.8 256 264S266.8 288 280 288zM176 432c11.05 0 20.03-8.953 20.03-20v-10.56c22.24-4.807 37.97-18.51 41.58-39.33c7.484-43.17-33.92-55-56.16-61.36L176 299.2C152.5 292.3 153 289.1 153.8 284.7c1.359-7.75 16.45-9.672 29.95-7.562c5.578 .875 11.72 2.797 17.56 4.812c10.45 3.625 21.83-1.906 25.44-12.34C230.4 259.2 224.8 247.8 214.4 244.2C207.3 241.7 201.5 240.2 196 238.9V228c0-11.05-8.988-20-20.03-20S156 216.1 156 228v10.35C133.7 243.1 117.1 257 114.4 277.9c-7.391 42.67 33.06 54.58 50.34 59.66l5.75 1.656c29.09 8.328 28.61 11.08 27.75 16.08c-1.359 7.766-16.47 9.703-30.08 7.547c-6.938-1.031-15.83-4.25-23.67-7.078l-4.234-1.516c-10.33-3.656-21.84 1.734-25.53 12.16c-3.703 10.41 1.734 21.84 12.16 25.53l4.031 1.453c7.787 2.816 16.45 5.635 25.16 7.568V412C156 423 164.1 432 176 432zM581.1 140l-35.96 36.21C553.4 176.9 560 183.6 560 192v256c0 8.822-7.178 16-16 16H96c-8.822 0-16-7.178-16-16V192c0-8.822 7.178-16 16-16h227.5c2.422-6.1 6.013-11.74 10.72-16.42L366.1 128L96 127.1c-35.35 0-64 28.65-64 64V448c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V192C608 170.5 597.3 151.6 581.1 140z"
          />
        </svg>
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
import { removeVietnameseTones } from '@/utils/RemoveVietnameseTones';
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
