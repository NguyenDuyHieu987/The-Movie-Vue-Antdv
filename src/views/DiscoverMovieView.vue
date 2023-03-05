<template>
  <div class="discover-container">
    <FilterBar
      @dataFiltered="(data, formSelect) => setDataFiltered(data, formSelect)"
      @cancelFilter="cancelFilter"
    />

    <h2 class="gradient-title-default">
      <strong>{{ metaHead }}</strong>

      <a-tabs
        v-model:activeKey="activeTabSearch"
        type="card"
        @change="handleChangeType"
        v-if="$route.params?.slug == 'search'"
      >
        <a-tab-pane key="all" tab="Tất cả"></a-tab-pane>
        <a-tab-pane key="movie" tab="Phim lẻ"></a-tab-pane>
        <a-tab-pane key="tv" tab="Phim bộ"></a-tab-pane>
      </a-tabs>
    </h2>
    <section
      class="movie-discovered"
      :class="{ collapse: $store.state.collapsed }"
    >
      <MovieCarouselCardHorizontal
        v-for="(item, index) in dataDiscover"
        :index="index"
        :key="item.id"
        :item="item"
      />
    </section>

    <div class="control-page">
      <a-pagination
        v-model:current="page"
        :total="totalPage"
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
  getTv,
  FilterDataMovie,
  getMoviesByGenres,
  getMoviesByYear,
  getMovieByCountry,
  getDaTaSearch,
  getNowPlaying,
  getUpComing,
  getPopular,
  getTopRated,
  getTvAiringToday,
  getTvOntheAir,
  getTvPopular,
  getTvTopRated,
  getGenresName,
} from '../services/MovieService';
import MovieCarouselCardHorizontal from '@/components/MovieCardHorizontal.vue';
import FilterBar from '@/components/FilterBar.vue';
import { useStore } from 'vuex';

export default {
  components: { MovieCarouselCardHorizontal, FilterBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const metaHead = ref();
    const dataDiscover = ref([]);
    const dataMovie = ref([]);
    const dataTv = ref([]);
    const page = ref(route.query?.page ? +route.query?.page : 1);
    const totalPage = ref(100);
    const isFilter = ref(false);
    const formFilterSelect = ref({});
    const activeTabSearch = ref('all');

    const getData = () => {
      if (isFilter.value) {
        FilterDataMovie(formFilterSelect.value)
          .then((movieResponse) => {
            dataDiscover.value = movieResponse?.data?.results;
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
                dataDiscover.value = searchMovieResponse?.data?.results;
                dataMovie.value = searchMovieResponse?.data?.movie;
                dataTv.value = searchMovieResponse?.data?.tv;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            break;
          case 'movie':
            if (route.params?.slug2) {
              switch (route.params?.slug2) {
                case 'all':
                  metaHead.value = 'Phim lẻ: Tất cả';
                  getMovies(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'nowplaying':
                  metaHead.value = 'Phim lẻ: Now playing';

                  getNowPlaying(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'popular':
                  metaHead.value = 'Phim lẻ: Phổ biến';

                  getPopular(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'toprated':
                  metaHead.value = 'Phim lẻ: Top đánh giá';

                  getTopRated(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'upcoming':
                  metaHead.value = 'Phim lẻ: Sắp công chiéu';

                  getUpComing(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
              }
            }
            break;
          case 'tv':
            if (route.params?.slug2) {
              switch (route.params?.slug2) {
                case 'all':
                  metaHead.value = 'Phim bộ: Tất cả';
                  getTv(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });

                  break;

                case 'airingtoday':
                  metaHead.value = 'Phim bộ: Airing today';

                  getTvAiringToday(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'ontheair':
                  metaHead.value = 'Phim bộ: On the air';

                  getTvOntheAir(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'tvpopular':
                  metaHead.value = 'Phim bộ: Phổ biến';

                  getTvPopular(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
                case 'tvtoprated':
                  metaHead.value = 'Phim bộ: Top đánh giá';

                  getTvTopRated(page.value)
                    .then((movieResponse) => {
                      dataDiscover.value = movieResponse?.data?.results;
                      totalPage.value = movieResponse?.data?.total_pages * 10;
                    })
                    .catch((e) => {
                      if (axios.isCancel(e)) return;
                    });
                  break;
              }
            }
            break;
          case 'genres':
            getMoviesByGenres(
              Array.from(
                route.params?.slug2 == 'sci-fi+&+fantasy'
                  ? route.params?.slug2.split('+')
                  : route.params?.slug2.split('+'),
                (x) => x.charAt(0).toUpperCase() + x.slice(1)
              ).join(' '),
              page.value
            )
              .then((movieResponse) => {
                dataDiscover.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            metaHead.value =
              'Thể loại: ' +
              getGenresName(
                Array.from(
                  route.params?.slug2 == 'sci-fi+&+fantasy'
                    ? 'sci-Fi+&+fantasy'.split('+')
                    : route.params?.slug2.split('+'),
                  (x) => x.charAt(0).toUpperCase() + x.slice(1)
                ).join(' '),
                store.state?.allGenres
              ).name_vietsub;

            break;
          case 'years':
            getMoviesByYear(route.params?.slug2, page.value)
              .then((movieResponse) => {
                dataDiscover.value = movieResponse?.data?.results;
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
                dataDiscover.value = movieResponse?.data?.results;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
            metaHead.value =
              'Quốc gia: ' +
              store.state.allCountries.find((country) =>
                country.name2 === route.params?.slug2 ? country : null
              ).name;
            break;
          default:
            // router.push('/404');
            break;
        }
      }
    };

    watch(route, () => {
      isFilter.value = false;
      getData();
      document.title = `Phimhay247 - ${metaHead.value}`;
    });
    // setMetaHead();

    onBeforeMount(() => {
      isFilter.value = false;
      getData();
      document.title = `Phimhay247 - ${metaHead.value}`;
    });

    const onChangePage = (
      pageSelected
      // pageSize
    ) => {
      if (isFilter.value) {
        formFilterSelect.value['pageFilter'] = pageSelected;
        getData();
      } else {
        router.push({ query: { page: pageSelected } });
      }
    };

    const setDataFiltered = (data, formSelect) => {
      dataDiscover.value = data;
      formFilterSelect.value = formSelect;
      isFilter.value = true;
      page.value = formSelect.pageFilter;
      metaHead.value = 'Danh sách phim đã lọc';
    };

    const cancelFilter = () => {
      isFilter.value = false;
      getData();
    };

    const handleChangeType = (activeKey) => {
      switch (activeKey) {
        case 'all':
          dataDiscover.value = dataMovie.value.concat(dataTv.value);
          break;
        case 'movie':
          dataDiscover.value = dataMovie.value;
          break;
        case 'tv':
          dataDiscover.value = dataTv.value;
          break;
      }
    };

    return {
      metaHead,
      page,
      totalPage,
      dataDiscover,
      activeTabSearch,
      onChangePage,
      setDataFiltered,
      cancelFilter,
      handleChangeType,
    };
  },
};
</script>

<style scoped lang="scss">
@media only screen and (min-width: 2300px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(9, minmax(10%, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(8, minmax(10%, auto)) !important;
  }
}

@media only screen and (max-width: 2300px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(9, minmax(10%, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(8, minmax(10%, auto)) !important;
  }
}

@media only screen and (max-width: 2100px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(8, minmax(10%, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(7, minmax(10%, auto)) !important;
  }
}

@media only screen and (max-width: 2000px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(6, minmax(13%, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(6, minmax(15%, auto)) !important;
  }
}

@media only screen and (max-width: 1700px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(6, minmax(230px, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(5, minmax(15%, auto)) !important;
  }
}

@media only screen and (max-width: 1550px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(5, minmax(230px, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(5, minmax(15%, auto)) !important;
  }
}

@media only screen and (max-width: 1400px) {
  .movie-discovered.collapse {
    grid-template-columns: repeat(5, minmax(230px, auto)) !important;
  }
  .movie-discovered {
    grid-template-columns: repeat(4, minmax(23%, auto)) !important;
  }
}

@media only screen and (max-width: 1010px) {
  .movie-discovered {
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
.ant-tabs > .ant-tabs-nav,
.ant-tabs > div > .ant-tabs-nav {
  margin-bottom: 5px !important;
}
.gradient-title-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-page {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
