<template>
  <div class="discover-container">
    <FilterBar
      @dataFiltered="(data, formSelect) => setDataFiltered(data, formSelect)"
      @cancelFilter="cancelFilter"
    />

    <h2 class="carousel-title">
      <strong>{{ metaHead }}</strong>
    </h2>
    <section
      class="movie-discovered"
      :class="{ collapse: $store.state.collapsed }"
    >
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
import {
  getMovies,
  getMovieSeries,
  FilterDataMovie,
  getMoviesByGenres,
  getMoviesByYear,
  getMovieByCountry,
  getDaTaSearch,
} from '../services/MovieService';
import MovieCarouselCardHorizontal from '@/components/MovieCarouselCardHorizontal.vue';
import FilterBar from '@/components/FilterBar.vue';
import COUNTRIES from '../constants/Country';

export default {
  components: { MovieCarouselCardHorizontal, FilterBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const metaHead = ref();
    const dataMovieList = ref([]);
    const page = ref(route.query?.page ? +route.query?.page : 1);
    const isFilter = ref(false);
    const formFilterSelect = ref({});

    const setMetaHead = () => {
      if (isFilter.value) {
        FilterDataMovie(formFilterSelect.value)
          .then((movieResponse) => {
            dataMovieList.value = movieResponse?.data?.results;
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      } else {
        switch (route.params?.slug) {
          case 'search':
            metaHead.value = 'Kết quả tìm kiếm cho: ' + route.params?.slug2;
            getDaTaSearch(route.params?.slug2.replaceAll('+', ' '), page.value)
              .then((searchMovieResponse) => {
                dataMovieList.value = searchMovieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            break;
          case 'movie':
            metaHead.value = 'Phim lẻ';
            getMovies(page.value)
              .then((movieResponse) => {
                dataMovieList.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            break;
          case 'series':
            metaHead.value = 'Phim bộ';
            getMovieSeries(page.value)
              .then((movieResponse) => {
                dataMovieList.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            break;
          case 'genres':
            getMoviesByGenres(
              Array.from(
                route.params?.slug2 == 'sci-fi+&+fantasy'
                  ? 'sci-Fi+&+fantasy'.split('+')
                  : route.params?.slug2.split('+'),
                (x) => x.charAt(0).toUpperCase() + x.slice(1)
              ).join(' '),
              page.value
            )
              .then((movieResponse) => {
                dataMovieList.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            metaHead.value =
              'Thể loại: ' +
              Array.from(
                route.params?.slug2 == 'sci-fi+&+fantasy'
                  ? 'sci-Fi+&+fantasy'.split('+')
                  : route.params?.slug2.split('+'),
                (x) => x.charAt(0).toUpperCase() + x.slice(1)
              ).join(' ');
            break;
          case 'years':
            getMoviesByYear(route.params?.slug2, page.value)
              .then((movieResponse) => {
                dataMovieList.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            metaHead.value = /^\d+$/.test(route.params?.slug2)
              ? 'Năm ' + route.params?.slug2
              : 'Trước năm ' + route.params?.slug2?.slice(-4);

            break;
          case 'countries':
            getMovieByCountry(route.params?.slug2, page.value)
              .then((movieResponse) => {
                dataMovieList.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            metaHead.value =
              'Quốc gia: ' +
              COUNTRIES.find((country) =>
                country.name2 === route.params?.slug2 ? country : null
              ).name;
            break;
          default:
            router.push('/404');
            break;
        }
      }
    };

    watch(route, () => {
      isFilter.value = false;
      setMetaHead();
      document.title = `Phimhay247 - ${metaHead.value}`;
    });
    // setMetaHead();

    onBeforeMount(() => {
      isFilter.value = false;
      setMetaHead();
      document.title = `Phimhay247 - ${metaHead.value}`;
    });

    const onChangePage = (
      pageSelected
      // pageSize
    ) => {
      if (isFilter.value) {
        formFilterSelect.value['pageFilter'] = pageSelected;
        setMetaHead();
      } else {
        router.push({ query: { page: pageSelected } });
      }
    };

    const setDataFiltered = (data, formSelect) => {
      dataMovieList.value = data;
      formFilterSelect.value = formSelect;
      isFilter.value = true;
      page.value = formSelect.pageFilter;
      metaHead.value = 'Danh sách phim đã lọc';
    };

    const cancelFilter = () => {
      isFilter.value = false;
      setMetaHead();
    };

    return {
      metaHead,
      page,
      dataMovieList,
      onChangePage,
      setDataFiltered,
      cancelFilter,
    };
  },
};
</script>

<style scoped lang="scss">
@media only screen and (max-width: 1400px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(5, minmax(230px, auto)) !important;
  }
  .movie-discovered {
    // grid-template-columns: repeat(auto-fit, minmax(170px, auto)) !important;
    grid-template-columns: repeat(4, minmax(23%, auto)) !important;
  }
}

@media only screen and (max-width: 1010px) {
  .movie-discovered {
    // grid-template-columns: repeat(auto-fit, minmax(170px, auto)) !important;
    grid-template-columns: repeat(3, minmax(170px, auto)) !important;
  }
}

@media only screen and (max-width: 860px) {
  .movie-discovered {
    grid-template-columns: repeat(3, minmax(160px, auto)) !important;
  }
}

@media only screen and (max-width: 615px) {
  .movie-discovered {
    grid-template-columns: repeat(2, minmax(50%, auto)) !important;
  }
}

@media only screen and (max-width: 435px) {
  .movie-discovered {
    // grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
    grid-template-columns: repeat(2, minmax(150px, auto)) !important;
  }

  .movie-carousel-horizontal-item {
    .ant-image {
      height: 110px !important;
    }
  }
}

.movie-discovered {
  display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(230px, auto));
  // margin-top: 10px;
  gap: 10px;
  overflow: hidden;
  grid-template-columns: repeat(4, minmax(23%, auto));
  .movie-carousel-horizontal-item {
    float: left;
  }
}

.control-page {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
