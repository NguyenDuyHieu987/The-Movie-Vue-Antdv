<template>
  <div class="discover-container">
    <h2 class="carousel-title" style="margin-top: 0px">
      <strong>{{ metaHead }}</strong>
    </h2>
    <section class="movie-discovered">
      <MovieCarouselCardHorizontal
        v-for="(item, index) in dataMovieList"
        :index="index"
        :key="item.id"
        :item="item"
      />
    </section>

    <div class="control-page">
      <a-pagination
        v-model:current="page"
        :total="400"
        :showSizeChanger="false"
        @change="onChangePage"
      />
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getMovies } from '../services/MovieService';
import MovieCarouselCardHorizontal from '@/components/MovieCarouselCardHorizontal.vue';

export default {
  components: { MovieCarouselCardHorizontal },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const metaHead = ref();
    const dataMovieList = ref([]);
    const page = ref(route.query?.page ? +route.query?.page : 1);

    const setMetaHead = () => {
      switch (route.params?.slug) {
        case 'movie':
          metaHead.value = 'Phim lẻ';
          break;
        case 'series':
          metaHead.value = 'Phim bộ';
          break;
        case 'genres':
          metaHead.value = 'Thể loại';
          break;
        case 'years':
          metaHead.value = 'Năm';
          break;
        case 'countries':
          metaHead.value = 'Quốc gia';
          break;
        default:
          break;
      }
    };

    setMetaHead();

    watch(route, () => {
      setMetaHead();
      document.title = `Phimhay247 - ${metaHead.value}`;
    });

    document.title = `Phimhay247 - ${metaHead.value}`;

    onBeforeMount(() => {
      getMovies(page.value)
        .then((movieResponse) => {
          dataMovieList.value = movieResponse?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const onChangePage = (
      pageSelected
      // pageSize
    ) => {
      router.push({ query: { page: pageSelected } });

      getMovies(pageSelected)
        .then((movieResponse) => {
          dataMovieList.value = movieResponse?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };

    return { metaHead, page, dataMovieList, onChangePage };
  },
};
</script>

<style scoped lang="scss">
.movie-discovered {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, auto));
  margin-top: 10px;
  gap: 10px;
}
.control-page {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
