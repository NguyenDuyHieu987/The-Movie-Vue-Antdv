<template>
  <a-carousel arrows autoplay :dots="false" effect="fade">
    <template #prevArrow>
      <div class="custom-slick-arrow">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow">
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </div>
    </template>

    <SlideTopicItem
      v-for="(item, index) in trendings"
      :item="item"
      :index="index"
      :key="item.id"
    />
  </a-carousel>

  <h2 class="carousel-title"><strong>Phim nổi bật</strong></h2>
  <carousel
    v-if="nowPlayings?.length"
    :items="4"
    :autoplay="true"
    :loop="true"
    :dots="false"
    :autoplayHoverPause="true"
    :autoplayTimeout="5000"
    :margin="7"
    :autoplaySpeed="500"
    :navText="[btnPrev, btnNext]"
    :responsive="{
      0: {
        items: 2,
      },
      590: {
        items: 2,
      },
      750: {
        items: 2,
      },
      830: {
        items: 3,
      },
      1000: {
        items: 4,
      },
      1175: {
        items: 4,
      },
      1300: {
        items: 4,
      },
      1400: {
        items: 5,
      },
      1550: {
        items: 6,
      },
      1700: {
        items: 6,
      },
      1900: {
        items: 7,
      },
      2200: {
        items: 8,
      },
    }"
  >
    <MovieCarouselCardHorizontal
      v-for="(item, index) in nowPlayings"
      :item="item"
      :index="index"
      :key="item.id"
    />
  </carousel>

  <h2 class="carousel-title"><strong>Phim mới cập nhật</strong></h2>
  <!-- <a-row type="flex" align="middle" :gutter="10">
    <a-col
      :span="4"
      :xs="{ span: 8 }"
      :sm="{ span: 7 }"
      :md="{ span: 6 }"
      :lg="{ span: 5 }"
      :xl="{ span: 4 }"
      :xxl="{ span: 3 }"
      v-for="(item, index) in upComings"
      :index="index"
      :key="item.id"
    >
      <MovieCarouselCardVertical :item="item" />
    </a-col>
  </a-row> -->

  <section class="movie-group upcoming">
    <MovieCarouselCardVertical
      v-for="(item, index) in upComings"
      :index="index"
      :key="item.id"
      :item="item"
    />
  </section>

  <h2 class="carousel-title"><strong>Trailer</strong></h2>
  <!-- <a-row type="flex" align="middle" 
      :gutter="10"
      :xs="{ span: 8 }"
      :sm="{ span: 7 }"
      :md="{ span: 6 }"
      :lg="{ span: 5 }"
      :xl="{ span: 4 }"
      :xxl="{ span: 3 }">
    <a-col
      :span="6"
      v-for="(item, index) in populars"
      :index="index"
      :key="item.id"
    >
      <MovieCarouselCardHorizontal :item="item" />
    </a-col>
  </a-row> -->

  <section class="movie-group popular">
    <MovieCarouselCardHorizontal
      v-for="(item, index) in populars"
      :index="index"
      :key="item.id"
      :item="item"
    />
  </section>

  <h2 class="carousel-title"><strong>Phim chiếu rạp mới</strong></h2>
  <carousel
    v-if="topRateds?.length"
    :items="4"
    :autoplay="true"
    :loop="true"
    :dots="false"
    :autoplayHoverPause="true"
    :autoplayTimeout="5000"
    :margin="7"
    :autoplaySpeed="500"
    :navText="[btnPrev, btnNext]"
    :responsive="{
      0: {
        items: 2,
      },
      590: {
        items: 2,
      },
      750: {
        items: 2,
      },
      830: {
        items: 3,
      },
      1000: {
        items: 4,
      },
      1175: {
        items: 4,
      },
      1300: {
        items: 6,
      },
      1400: {
        items: 6,
      },
      1550: {
        items: 7,
      },
      1700: {
        items: 8,
      },
      1900: {
        items: 9,
      },
      2200: {
        items: 10,
      },
    }"
  >
    <MovieCarouselCardVertical
      v-for="(item, index) in topRateds"
      :item="item"
      :index="index"
      :key="item.id"
    />
  </carousel>
</template>
<script>
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import carousel from 'vue-owl-carousel/src/Carousel';
import SlideTopicItem from './SlideTopicItem.vue';
import MovieCarouselCardHorizontal from './MovieCarouselCardHorizontal.vue';
import MovieCarouselCardVertical from './MovieCarouselCardVertical.vue';

import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getUpComing,
  getPoster,
} from '../services/MovieService';

export default {
  components: {
    SlideTopicItem,
    carousel,
    MovieCarouselCardHorizontal,
    MovieCarouselCardVertical,
  },
  setup() {
    const pageNowPlaying = ref(1);
    const pageUpComing = ref(1);
    const pagePopular = ref(1);
    const pageTopRated = ref(1);

    const trendings = ref(1);
    const nowPlayings = ref(1);
    const upComings = ref(1);
    const populars = ref(1);
    const topRateds = ref(1);

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    onBeforeMount(() => {
      Promise.all([
        getTrending(1),
        getNowPlaying(pageNowPlaying.value),
        getUpComing(pageUpComing.value),
        getPopular(pagePopular.value),
        getTopRated(pageTopRated.value),
      ])
        .then((res) => {
          // trendings.value = res[0].data.results.slice(0, 10);
          trendings.value = res[0].data.results;
          nowPlayings.value = res[1].data.results;
          // upComings.value = res[2].data.results.slice(0, 12);
          upComings.value = res[2].data.results;
          // populars.value = res[3].data.results.slice(0, 13);
          populars.value = res[3].data.results;
          // topRateds.value = res[4].data.results.slice(0, 12);
          topRateds.value = res[4].data.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return {
      trendings,
      nowPlayings,
      upComings,
      populars,
      topRateds,
      getPoster,
      btnPrev,
      btnNext,
    };
  },
};
</script>
<style scoped lang="scss">
.ant-carousel {
  .fa-chevron-right,
  .fa-chevron-left {
    padding: 10px 20px;
    background-color: #000000;
    border-radius: 5px;
    z-index: 10;
  }
}

.movie-group.upcoming {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, auto));
  margin-top: 10px;
  gap: 10px;
}

.movie-group.popular {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, auto));
  margin-top: 10px;
  gap: 10px;
}

.ant-carousel .slick-prev {
  top: 40%;
  left: calc(100% - 75px);
  font-size: 2em;
}

.ant-carousel .slick-next {
  right: 55px;
  font-size: 2em;
}

/* For demo */
.ant-carousel :deep(.slick-slide) {
  background: transparent;
  position: relative;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  color: #fff;
  background-color: #1f2d3d1c;
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

// .ant-col {
//   margin-bottom: 7px;
// }
</style>
