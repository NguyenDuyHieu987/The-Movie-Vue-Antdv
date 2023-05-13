<template>
  <div class="similar-stage">
    <h2 class="gradient-title-default" v-show="dataSimilar?.length">
      <strong>Phim tương tự</strong>
    </h2>
    <CarouselGroup :data="dataSimilar" :responsive="responsive">
      <template #content>
        <MovieCardVertical
          v-for="(item, index) in dataSimilar"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item.media_type"
        />
      </template>
    </CarouselGroup>
  </div>

  <div class="recommend-stage">
    <h2 class="gradient-title-default" v-show="dataRecommend?.length">
      <strong>Có thể bạn quan tâm</strong>
    </h2>
    <CarouselGroup :data="dataRecommend" :responsive="responsive">
      <template #content>
        <MovieCardVertical
          v-for="(item, index) in dataRecommend"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item.media_type"
        />
      </template>
    </CarouselGroup>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onBeforeMount, watch } from 'vue';
import CarouselGroup from '@/components/CarouselGroup/CarouselGroup.vue';
import { getSimilar, getTrending } from '@/services/MovieService';
import MovieCardVertical from '../MovieCardVertical/MovieCardVertical.vue';

export default {
  props: {
    movieId: { type: Number },
    type: { type: String },
  },
  components: {
    CarouselGroup,
    MovieCardVertical,
  },
  setup(props) {
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const responsive = ref({
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
      1175: {
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

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    watch(props, () => {});

    onBeforeMount(() => {
      Promise.all([
        getSimilar(props?.type, props?.movieId),
        getTrending(Math.floor(Math.random() * 50) + 1),
      ])
        .then((response) => {
          dataSimilar.value = response[0]?.data?.results;
          dataRecommend.value = response[1]?.data?.results;
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
