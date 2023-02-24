<template>
  <h2 class="carousel-title"><strong>Có thể bạn quan tâm</strong></h2>
  <carousel
    v-if="dataSimilar?.length"
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
    }"
  >
    <MovieCarouselCardVertical
      v-for="(item, index) in dataSimilar"
      :item="item"
      :index="index"
      :key="item.id"
    />
  </carousel>

  <h2 class="carousel-title"><strong>Phim tương tự</strong></h2>
  <carousel
    v-if="dataRecommend?.length"
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
    }"
  >
    <MovieCarouselCardVertical
      v-for="(item, index) in dataRecommend"
      :item="item"
      :index="index"
      :key="item.id"
    />
  </carousel>
</template>

<script>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import carousel from 'vue-owl-carousel/src/Carousel';
import { getMovieBySimilar, getTrending } from '../services/MovieService';
import MovieCarouselCardVertical from './MovieCarouselCardVertical.vue';

export default {
  props: { dataMovie: Object, isEpisodes: Boolean },
  components: {
    carousel,
    MovieCarouselCardVertical,
  },
  setup(props) {
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    onBeforeMount(() => {
      getMovieBySimilar(
        props?.isEpisodes ? 'tv' : 'movie',
        props?.dataMovie?.genres[0],
        1
      )
        .then((movieResponed) => {
          dataSimilar.value = movieResponed?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getTrending(1)
        .then((movieResponed) => {
          dataRecommend.value = movieResponed?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return {
      dataSimilar,
      dataRecommend,
      btnPrev,
      btnNext,
    };
  },
};
</script>
