<template>
  <div class="home-container">
    <SlideTopicHome :trendings="trendings" />
    <div class="home-section outstanding">
      <h2 class="gradient-title-default" v-show="nowPlayings?.length">
        <strong>Phim nổi bật</strong>
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'nowplaying',
            },
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </router-link>
      </h2>

      <!-- :navText="[btnPrev, btnNext]" -->

      <CarouselGroup :data="nowPlayings" :responsive="responsiveHorizoltal">
        <template #content>
          <MovieCardHorizontal
            v-for="(item, index) in nowPlayings"
            :item="item"
            :index="index"
            :key="item.id"
            :type="item.media_type"
          />
        </template>
      </CarouselGroup>
    </div>

    <div
      class="home-section recommend"
      v-if="$store.state?.isLogin"
      v-show="recommends?.length"
    >
      <h2 class="gradient-title-default">
        <strong>Gợi ý cho bạn</strong>
      </h2>

      <section
        class="movie-group vertical"
        :class="{ viewmore: viewMoreRecommend }"
      >
        <MovieCardVertical
          v-for="(item, index) in recommends"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item.media_type"
        />
        <el-button
          class="loadmore-btn"
          type="primary"
          :loading="loadMoreRecommend"
          @click="handleLoadMoreRecommend"
        >
          <template #icon>
            <!-- <i class="fa-light fa-plus"></i> -->
            <PlusOutlined />
          </template>
          {{ loadMoreRecommend ? 'Đang tải...' : 'Tải thêm' }}
        </el-button>
      </section>

      <div
        class="viewmore-group"
        @click="viewMoreRecommend = !viewMoreRecommend"
      >
        <el-tooltip
          :teleported="false"
          :content="!viewMoreRecommend ? 'Hiện thêm' : 'Ẩn bớt'"
          placement="bottom"
        >
          <i v-if="!viewMoreRecommend" class="fa-light fa-chevron-down"></i>
          <i v-else class="fa-light fa-chevron-up"></i>
        </el-tooltip>
      </div>
    </div>

    <div class="home-section cartoon">
      <h2 class="gradient-title-default" v-show="cartoons?.length">
        <strong>Hoạt hình - Anime đặc sắc</strong>
        <NuxtLink
          :to="{
            path: `/discover/genres/hoat-hinh`,
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </NuxtLink>
      </h2>

      <CarouselGroup :data="cartoons" :responsive="responsiveHorizoltal">
        <template #content>
          <MovieCardHorizontal
            v-for="(item, index) in cartoons"
            :item="item"
            :index="index"
            :key="item.id"
            :type="item.media_type"
          />
        </template>
      </CarouselGroup>
    </div>

    <div class="home-section tv-new" v-show="tvAiringTodays?.length">
      <h2 class="gradient-title-default">
        <strong>Phim bộ mới</strong>
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'tv',
              slug2: 'airingtoday',
            },
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </router-link>
      </h2>

      <CarouselGroup :data="tvAiringTodays" :responsive="responsiveVertical">
        <template #content>
          <MovieCardVertical
            v-for="(item, index) in tvAiringTodays"
            :index="index"
            :key="item.id"
            :item="item"
            :type="item.media_type"
          />
        </template>
      </CarouselGroup>
    </div>

    <div class="home-section trailer" v-show="upComings?.length">
      <h2 class="gradient-title-default">
        <strong>Trailer</strong>

        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'upcoming',
            },
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </router-link>
      </h2>

      <section class="movie-group horizontal trailer">
        <MovieCardHorizontalTrailer
          v-for="(item, index) in upComings"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item.me_typed"
        />
      </section>
    </div>

    <div class="home-section theater">
      <h2 class="gradient-title-default" v-show="topRateds?.length">
        <strong>Phim chiếu rạp mới</strong>
        <router-link
          :to="{
            name: 'discover',
            params: {
              slug: 'movie',
              slug2: 'toprated',
            },
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </router-link>
      </h2>

      <CarouselGroup :data="topRateds" :responsive="responsiveVertical">
        <template #content>
          <MovieCardVertical
            v-for="(item, index) in topRateds"
            :item="item"
            :index="index"
            :key="item.id"
            :type="item.me_typed"
          />
        </template>
      </CarouselGroup>
    </div>

    <div class="home-section on-the-air">
      <h2 class="gradient-title-default" v-show="tvOnTheAirs?.length">
        <strong>TV On the air</strong>
        <NuxtLink
          :to="{
            path: `/discover/tv/ontheair`,
          }"
        >
          <strong class="view-all">Xem tất cả</strong>
        </NuxtLink>
      </h2>

      <CarouselGroup :data="tvOnTheAirs" :responsive="responsiveHorizoltal">
        <template #content>
          <MovieCardHorizontal
            v-for="(item, index) in tvOnTheAirs"
            :item="item"
            :index="index"
            :key="item.id"
            :type="item.media_type"
          />
        </template>
      </CarouselGroup>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import CarouselGroup from '@/components/CarouselGroup/CarouselGroup.vue';
import SlideTopicHome from '@/components/SlideTopicHome/SlideTopicHome.vue';
import MovieCardHorizontal from '@/components/MovieCardHorizontal/MovieCardHorizontal.vue';
import MovieCardVertical from '@/components/MovieCardVertical/MovieCardVertical.vue';
import MovieCardHorizontalTrailer from '@/components/MovieCardHorizontalTrailer/MovieCardHorizontalTrailer.vue';
import {
  getNowPlaying,
  getTvAiringToday,
  getTopRated,
  getUpComing,
  getMyRecommend,
  getTrending,
  getTvOntheAir,
  getMoviesByGenres,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';
import { useStore } from 'vuex';
import { PlusOutlined } from '@ant-design/icons-vue';

export default {
  name: 'home',
  components: {
    SlideTopicHome,
    CarouselGroup,
    MovieCardHorizontal,
    MovieCardVertical,
    MovieCardHorizontalTrailer,
    PlusOutlined,
  },
  setup() {
    const store = useStore();
    const trendings = ref([]);
    const nowPlayings = ref([]);
    const upComings = ref([]);
    const tvAiringTodays = ref([]);
    const topRateds = ref([]);
    const tvOnTheAirs = ref([]);
    const cartoons = ref([]);
    const recommends = ref([]);
    const viewMoreRecommend = ref(false);
    const loadMoreRecommend = ref(false);
    const skipRecommend = ref(2);

    const responsiveHorizoltal = ref({
      0: {
        items: 2,
        slideBy: 2,
      },
      590: {
        items: 2,
        slideBy: 2,
      },
      750: {
        items: 3,
        slideBy: 3,
      },
      800: {
        items: 2,
        slideBy: 2,
      },
      900: {
        items: 3,
        slideBy: 3,
      },
      1150: {
        items: 4,
        slideBy: 4,
      },
      1500: {
        items: 5,
        slideBy: 5,
      },
      1800: {
        items: 6,
        slideBy: 6,
      },
      2050: {
        items: 7,
        slideBy: 7,
      },
      2200: {
        items: 8,
        slideBy: 8,
      },
    });

    const responsiveVertical = ref({
      0: {
        items: 2,
        slideBy: 2,
      },
      500: {
        items: 2,
        slideBy: 2,
      },
      520: {
        items: 3,
        slideBy: 3,
      },
      700: {
        items: 4,
        slideBy: 4,
      },
      800: {
        items: 3,
        slideBy: 3,
      },
      900: {
        items: 4,
        slideBy: 4,
      },
      1000: {
        items: 4,
        slideBy: 4,
      },
      1150: {
        items: 5,
        slideBy: 5,
      },
      1300: {
        items: 6,
        slideBy: 6,
      },
      1400: {
        items: 6,
        slideBy: 6,
      },
      1550: {
        items: 7,
        slideBy: 7,
      },
      1700: {
        items: 8,
        slideBy: 8,
      },
      1900: {
        items: 9,
        slideBy: 9,
      },
      2000: {
        items: 10,
        slideBy: 10,
      },
      2200: {
        items: 11,
        slideBy: 11,
      },
    });

    useMeta({
      title: 'Phimhay247',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    onBeforeMount(() => {
      getTrending(1)
        .then((response) => {
          trendings.value = response.data?.results.slice(0, 11);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      Promise.all([
        getNowPlaying(1),
        getUpComing(1),
        getTvAiringToday(1),
        getTopRated(1),
        getTvOntheAir(1),
        getMoviesByGenres('hoat-hinh', 1, 'views_desc'),
        store.state?.isLogin ? getMyRecommend(1) : null,
      ])
        .then((response) => {
          nowPlayings.value = response[0].data?.results.slice(0, 10);
          upComings.value = response[1].data?.results.slice(0, 10);
          tvAiringTodays.value = response[2]?.data.results.slice(0, 10);
          topRateds.value = response[3].data?.results.slice(0, 10);
          tvOnTheAirs.value = response[4].data?.results.slice(0, 10);
          cartoons.value = response[5].data?.results.slice(0, 10);

          if (store.state?.isLogin) {
            recommends.value = response[6].data?.results;
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const handleLoadMoreRecommend = () => {
      loadMoreRecommend.value = true;
      getMyRecommend(store.state.userAccount?.id, skipRecommend.value)
        .then((movieResponse) => {
          if (movieResponse.data?.results?.length > 0) {
            setTimeout(() => {
              recommends.value = recommends.value.concat(
                movieResponse.data?.results
              );
              loadMoreRecommend.value = false;
            }, 1000);
            skipRecommend.value += 1;
          } else {
            setTimeout(() => {
              loadMoreRecommend.value = false;
            }, 700);
          }
        })
        .catch((e) => {
          loadMoreRecommend.value = false;
          if (axios.isCancel(e)) return;
        });
    };

    return {
      trendings,
      nowPlayings,
      upComings,
      tvAiringTodays,
      tvOnTheAirs,
      cartoons,
      topRateds,
      recommends,
      viewMoreRecommend,
      loadMoreRecommend,
      responsiveHorizoltal,
      responsiveVertical,
      handleLoadMoreRecommend,
    };
  },
};
</script>

<style lang="scss" src="./HomeView.scss"></style>
