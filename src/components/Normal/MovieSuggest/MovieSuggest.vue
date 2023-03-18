<template>
  <h2 class="gradient-title-default" v-show="dataSimilar?.length">
    <strong>Phim tương tự</strong>
  </h2>
  <carousel
    v-if="dataSimilar?.length"
    class="similar-container"
    :items="4"
    :autoplay="true"
    :loop="true"
    :dots="false"
    :autoplayHoverPause="true"
    :autoplayTimeout="5000"
    :margin="7"
    :autoplaySpeed="500"
    :navText="[btnPrev, btnNext]"
    :responsive="responsive"
  >
    <MovieCarouselCardVertical
      v-for="(item, index) in dataSimilar"
      :index="index"
      :key="item.id"
      :item="item"
    />
  </carousel>

  <h2 class="gradient-title-default" v-show="dataRecommend?.length">
    <strong>Có thể bạn quan tâm</strong>
  </h2>
  <carousel
    v-if="dataRecommend?.length"
    class="recommend-container"
    :items="4"
    :autoplay="true"
    :loop="true"
    :dots="false"
    :autoplayHoverPause="true"
    :autoplayTimeout="5000"
    :margin="7"
    :autoplaySpeed="500"
    :navText="[btnPrev, btnNext]"
    :responsive="responsive"
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
import { getMovieBySimilar, getTrending } from '@/services/MovieService';
import MovieCarouselCardVertical from '../MovieCardVertical/MovieCardVertical.vue';

export default {
  props: { dataMovie: Object, isEpisodes: Boolean },
  components: {
    carousel,
    MovieCarouselCardVertical,
  },
  setup(props) {
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const responsive = ref({
      0: {
        items: 2,
      },
      500: {
        items: 2,
      },
      550: {
        items: 3,
      },
      700: {
        items: 4,
      },
      800: {
        items: 3,
      },
      900: {
        items: 4,
      },
      1175: {
        items: 5,
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
      2000: {
        items: 10,
      },
      2200: {
        items: 11,
      },
    });

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    onBeforeMount(() => {
      getMovieBySimilar(
        props?.isEpisodes ? 'tvall' : 'movieall',
        props?.dataMovie?.genres[0],
        1
      )
        .then((movieResponed) => {
          dataSimilar.value = movieResponed?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getTrending(Math.floor(Math.random() * 50) + 1)
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
      responsive,
    };
  },
};
</script>

<style lang="scss" src="./MovieSuggest.scss"></style>
