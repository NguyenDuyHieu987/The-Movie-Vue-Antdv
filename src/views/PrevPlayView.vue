<template>
  <div class="prev-play-conainer">
    <div class="main-info">
      <div class="backdrop-img">
        <a-image
          :src="
            getPoster(
              dataMovie?.backdrop_path
                ? dataMovie?.backdrop_path
                : dataMovie?.poster_path
            )
          "
          :preview="true"
          v-lazy="
            getPoster(
              dataMovie?.backdrop_path
                ? dataMovie?.backdrop_path
                : dataMovie?.poster_path
            )
          "
        >
          <template #placeholder>
            <a-image
              :src="
                getPoster(
                  dataMovie?.backdrop_path
                    ? dataMovie?.backdrop_path
                    : dataMovie?.poster_path
                )
              "
            />
          </template>
        </a-image>
      </div>

      <div class="info-movie">
        <a-skeleton
          :loading="loading"
          :active="true"
          :paragraph="{ rows: 2 }"
          :title="false"
        >
          <h2>
            <strong>{{
              dataMovie?.name ? dataMovie?.name : dataMovie?.title
            }}</strong>
            <strong v-if="isEpisodes">
              {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
            </strong>
          </h2>

          <strong>
            {{
              dataMovie?.original_title
                ? dataMovie?.original_title
                : dataMovie?.original_name
            }}
            {{
              isEpisodes
                ? `(${
                    dataMovie?.last_air_date?.slice(0, 4)
                      ? dataMovie?.last_air_date?.slice(0, 4)
                      : dataMovie?.last_episode_to_air?.air_date?.slice(0, 4)
                  })`
                : `(${dataMovie?.release_date?.slice(0, 4)})`
            }}
          </strong>

          <strong v-if="isEpisodes">
            {{ ' - Season ' + dataMovie?.last_episode_to_air?.season_number }}
          </strong>
        </a-skeleton>

        <div v-if="loading" class="widget-skeleton">
          <a-skeleton-button
            :active="true"
            :size="'default'"
            :block="false"
            v-for="(item, index) in 3"
            :index="index"
            :key="index"
          >
          </a-skeleton-button>
        </div>

        <div v-else class="widget">
          <router-link
            v-if="isEpisodes && dataMovie?.id"
            :to="{
              name: 'play',
              params: {
                id: dataMovie?.id,
                name: dataMovie?.name
                  ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                  : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
                // tap: 'tap-1',
              },
              query: {
                ep: 'tap-1',
              },
            }"
            class="btn-play-now"
          >
            <font-awesome-icon icon="fa-solid fa-play" />
            <span> Play now</span>
          </router-link>
          <router-link
            v-else-if="!isEpisodes && dataMovie?.id"
            :to="{
              name: 'play',
              params: {
                id: dataMovie?.id,
                name: dataMovie?.name
                  ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                  : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              },
            }"
            class="btn-play-now"
          >
            <font-awesome-icon icon="fa-solid fa-play" />
            <span> Play now</span>
          </router-link>

          <span
            class="btn-trailer"
            id="btn-trailer"
            @click="
              () => {
                isOpenTrailerYoutube = !isOpenTrailerYoutube;
                if (isOpenTrailerYoutube) scrolltoTrailerYoutube();
              }
            "
          >
            <font-awesome-icon icon="fa-brands fa-youtube" />
            <span>Trailer</span>
          </span>
          <span class="btn-add-to-list">
            <font-awesome-icon icon="fa-solid fa-bookmark" />
            <span> Add to list</span>
          </span>
        </div>

        <div class="misc">
          <a-skeleton
            :loading="loading"
            :active="true"
            :paragraph="{ rows: 8 }"
            :title="false"
          >
            <p>
              <label>Đang phát: </label>
              <span style="color: red; font-weight: bold"> HD VietSub </span>
            </p>

            <p>
              <label>Ngày Phát Hành: </label>
              <router-link
                :to="{
                  path: `/filter/year/${
                    dataMovie?.last_air_date?.slice(0, 4)
                      ? dataMovie?.last_air_date?.slice(0, 4)
                      : dataMovie?.release_date?.slice(0, 4)
                  }`,
                }"
              >
                {{
                  dataMovie?.last_air_date?.slice(0, 4)
                    ? dataMovie?.last_air_date?.slice(0, 4)
                    : dataMovie?.release_date?.slice(0, 4)
                }}
              </router-link>
              {{
                dataMovie?.last_air_date?.slice(4, 10)
                  ? dataMovie?.last_air_date?.slice(4, 10)
                  : dataMovie?.release_date?.slice(
                      4,
                      dataMovie?.release_date.length
                    )
              }}
            </p>

            <p>
              <label>Quốc gia: </label>
              {{
                dataMovie?.production_countries
                  ? dataMovie?.production_countries[0]?.name
                  : null
              }}
            </p>
            <p>
              <label>Thể loại: </label>

              <router-link
                v-for="(item, index) in dataMovie?.genres"
                :key="item?.id"
                :index="index"
                :to="{ path: `/filter/genre/${item?.name}` }"
              >
                {{
                  index !== dataMovie?.genres.length - 1
                    ? item?.name + ', '
                    : item?.name
                }}
              </router-link>
            </p>

            <p>
              <label>Diểm IMDb: </label>
              <span style="color: yellow; font-weight: bold">
                {{ dataMovie?.vote_average?.toFixed(2) }}
              </span>
            </p>

            <p v-if="dataMovie?.number_of_episodes">
              <label>Số lượng tập: </label>
              {{
                dataMovie?.seasons?.find((item) =>
                  item?.season_number ===
                  dataMovie?.last_episode_to_air?.season_number
                    ? item
                    : null
                ).episode_count + ' tập'
              }}
            </p>

            <p>
              <label v-if="dataMovie?.episode_run_time">
                {{ 'Thờ lượng trên tập: ' }}
              </label>
              <label v-else>Thời lượng: </label>
              <span v-if="dataMovie?.episode_run_time">
                {{ dataMovie?.episode_run_time[0] + ' phút' }}
              </span>
              <span v-else>{{ dataMovie?.runtime + ' phút' }}</span>
            </p>

            <p>
              <label>Trạng thái: </label>
              {{ dataMovie?.status }}
            </p>
          </a-skeleton>
        </div>

        <div v-if="loading">
          <a-skeleton-button :active="true" :size="'default'" :block="false">
          </a-skeleton-button>
        </div>
        <Interaction v-else :dataMovie="dataMovie" />

        <a-skeleton
          style="margin-top: 15px"
          :loading="loading"
          :active="true"
          :paragraph="{ rows: 2 }"
          :title="false"
        >
          <RatingMovie
            v-if="dataMovie?.id"
            :voteAverage="dataMovie?.vote_average"
            :voteCount="dataMovie?.vote_count"
            :movieId="dataMovie?.id"
          />
        </a-skeleton>
      </div>
    </div>

    <LastestEpisodes
      v-if="isEpisodes"
      :dataMovie="dataMovie"
      :lastestEpisode="dataMovie?.last_episode_to_air?.episode_number"
      :numberOfEpisodes="
        dataMovie?.seasons?.find((item) =>
          item.season_number === dataMovie?.last_episode_to_air?.season_number
            ? item
            : null
        )?.episode_count
      "
      :loading="loading"
    />

    <h3 class="section-title" @click="$router.currentRoute">
      <strong>Nội dung phim</strong>
    </h3>

    <div class="movie-content">
      <a-skeleton
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 3, width: '40%' }"
        :title="false"
      >
        <p :class="{ open: isOpenContent }">
          {{ dataMovie?.overview }}
        </p>
        <strong class="toggle-content" @click="isOpenContent = !isOpenContent">
          {{ !isOpenContent ? 'Xem thêm >' : '< Ẩn' }}
        </strong>
      </a-skeleton>
    </div>

    <div id="trailer-youtube">
      <div class="trailer-youtube" :class="{ active: isOpenTrailerYoutube }">
        <h3 class="section-title">
          <strong>Trailer</strong>
        </h3>
        <iframe
          height="650px"
          width="100%"
          :src="
            dataMovie?.videos?.results?.length !== 0
              ? `https://www.youtube.com/embed/${
                  dataMovie?.videos?.results[
                    Math.floor(
                      Math.random() * dataMovie?.videos?.results?.length
                    )
                  ]?.key
                }`
              : 'https://www.youtube.com/embed/ndl1W4ltcmg'
          "
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media;
        gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="{0}"
        />
      </div>
    </div>

    <!-- <h3 class="section-title">
      <strong>Diễn viên</strong>
    </h3> -->

    <a-tabs v-model:activeKey="activeTabCast" class="section-title">
      <a-tab-pane key="1" tab="Diễn viên">
        <carousel
          v-if="dataCredit?.credits?.cast?.length"
          class="cast"
          :items="4"
          :autoplay="true"
          :loop="true"
          :dots="false"
          :autoplayHoverPause="true"
          :autoplayTimeout="5000"
          :margin="7"
          :autoplaySpeed="500"
          :navText="[btnPrev, btnNext]"
          :responsive="responsiveCarousel"
        >
          <CastCard
            v-for="(item, index) in dataCredit?.credits?.cast"
            :src="
              getPoster(
                item?.backdrop_path ? item?.backdrop_path : item?.poster_path
              )
            "
            :item="item"
            :index="index"
            :key="item.id"
            :loading="loading"
          />
        </carousel>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Đội ngũ" force-render>
        <carousel
          v-if="dataCredit?.credits?.crew?.length"
          class="cast"
          :items="4"
          :autoplay="true"
          :loop="true"
          :dots="false"
          :autoplayHoverPause="true"
          :autoplayTimeout="5000"
          :margin="7"
          :autoplaySpeed="500"
          :navText="[btnPrev, btnNext]"
          :responsive="responsiveCarousel"
        >
          <CastCard
            v-for="(item, index) in dataCredit?.credits?.crew"
            :src="
              getPoster(
                item?.backdrop_path ? item?.backdrop_path : item?.poster_path
              )
            "
            :item="item"
            :index="index"
            :key="item.id"
            :loading="loading"
          />
        </carousel>
      </a-tab-pane>
    </a-tabs>

    <MovieSuggest
      v-if="dataMovie?.id"
      :dataMovie="dataMovie"
      :isEpisodes="isEpisodes"
    />
  </div>
</template>
<script>
import { ref, onBeforeMount, watch, onMounted } from 'vue';
import {
  useRoute,
  // useRouter
} from 'vue-router';
import axios from 'axios';
import carousel from 'vue-owl-carousel/src/Carousel';
import {
  getAllGenresById,
  getPoster,
  getMovieSeriesById,
  getMovieById,
  getLanguage,
  getMovieByCredit,
  // getMovieBySimilar,
  // getTrending,
} from '../services/MovieService';
import Interaction from '@/components/Interaction.vue';
import RatingMovie from '@/components/RatingMovieAnt.vue';
import LastestEpisodes from '@/components/LastestEpisodes.vue';
import CastCard from '@/components/CastCard.vue';
import MovieSuggest from '@/components/MovieSuggest.vue';

export default {
  components: {
    carousel,
    Interaction,
    RatingMovie,
    LastestEpisodes,
    CastCard,
    MovieSuggest,
  },
  setup() {
    const route = useRoute();
    // const router = useRouter();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const dataCredit = ref([]);
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const responsiveCarousel = ref({
      0: {
        items: 2,
      },
      590: {
        items: 2,
      },
      750: {
        items: 4,
      },
      830: {
        items: 5,
      },
      1000: {
        items: 5,
      },
      1175: {
        items: 6,
      },
      1300: {
        items: 6,
      },
      1400: {
        items: 7,
      },
      1500: {
        items: 8,
      },
      1700: {
        items: 9,
      },
      2000: {
        items: 10,
      },
      2200: {
        items: 12,
      },
    });
    const isOpenContent = ref(false);
    const isOpenTrailerYoutube = ref(false);
    const loading = ref(false);
    const tooltipRating = ref([
      'Dở tệ',
      'Dở',
      'Không hay',
      'Không hay lắm',
      'Bình thường',
      'Xem được',
      'Có vẻ hay',
      'Hay',
      'Rất hay',
      'Tuyệt hay',
    ]);

    const btnPrev = ref('<i class="fa-solid fa-chevron-left"></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right"></i>');

    const getData = () => {
      getMovieSeriesById(route.params?.id)
        .then((tvResponed) => {
          if (tvResponed?.data === null)
            getMovieById(route.params?.id)
              .then((movieResponed) => {
                isEpisodes.value = false;
                dataMovie.value = movieResponed?.data;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          else {
            isEpisodes.value = true;
            dataMovie.value = tvResponed?.data;
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getMovieByCredit(isEpisodes.value ? 'tv' : 'movie', route.params?.id)
        .then((movieResponed) => {
          dataCredit.value = movieResponed?.data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      loading.value = true;
      getData();

      setTimeout(() => {
        loading.value = false;
      }, 1500);
    });

    const scrolltoTrailerYoutube = () => {
      const trailer_youtube = document.getElementById('trailer-youtube');
      trailer_youtube.scrollIntoView();
    };

    onMounted(() => {
      // btn_trailer.scrollIntoView();
    });

    watch(route, () => {
      // router.push({ path: newVal.path }).then(() => {
      //   router.go();
      // });

      // console.log(router);
      // router.go();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      dataCredit.value = [];
      loading.value = true;

      getData();

      setTimeout(() => {
        loading.value = false;
      }, 1500);
    });

    document.title = `${Array.from(
      route.params?.name.split('+'),
      (x) => x.charAt(0).toUpperCase() + x.slice(1)
    ).join(' ')} - Info`;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    return {
      responsiveCarousel,
      genresName,
      isEpisodes,
      dataMovie,
      dataCredit,
      isOpenContent,
      isOpenTrailerYoutube,
      dataSimilar,
      dataRecommend,
      btnPrev,
      btnNext,
      loading,
      activeTabCast: ref('1'),
      tooltipRating,
      getPoster,
      getAllGenresById,
      getLanguage,
      scrolltoTrailerYoutube,
    };
  },
};
</script>

<style lang="scss">
@media only screen and (max-width: 1900px) {
  .prev-play-conainer {
    .trailer-youtube {
      iframe {
        height: 70vh !important;
      }
    }
  }
}

@media only screen and (max-width: 1600px) {
  .prev-play-conainer {
    .trailer-youtube {
      iframe {
        height: 650px !important;
      }
    }
  }
}

@media only screen and (max-width: 1400px) {
  .prev-play-conainer {
    .backdrop-img {
      height: 450px !important;
    }

    .trailer-youtube {
      iframe {
        height: 550px !important;
      }
    }
  }
}

@media only screen and (max-width: 1130px) {
  .prev-play-conainer {
    .main-info {
      display: flex;
      flex-direction: column;

      .backdrop-img {
        width: 100%;
      }

      .info-movie.skeleton {
        width: 100% !important;
      }

      .info-movie {
        width: 100%;
        margin-top: 20px;
        padding-left: 0px;
      }
    }

    .trailer-youtube {
      iframe {
        height: 450px;
      }
    }
  }
}

@media only screen and (max-width: 920px) {
  .prev-play-conainer {
    .backdrop-img {
      height: 400px !important;
    }

    .trailer-youtube {
      iframe {
        height: 400px !important;
      }
    }
  }
}

@media only screen and (max-width: 800px) {
  .prev-play-conainer {
    .backdrop-img {
      height: 350px !important;
    }

    .trailer-youtube {
      iframe {
        height: 350px !important;
      }
    }
  }
}

@media only screen and (max-width: 530px) {
  .prev-play-conainer {
    .backdrop-img {
      height: 300px !important;
    }

    .trailer-youtube {
      iframe {
        height: 300px !important;
      }
    }
  }
}

@media only screen and (max-width: 435px) {
  .prev-play-conainer {
    .backdrop-img {
      height: 250px !important;
    }

    .trailer-youtube {
      iframe {
        height: 250px !important;
      }
    }
  }
}

.prev-play-conainer {
  .main-info {
    display: flex;
  }

  .backdrop-img {
    // height: 450px;
    height: 55vh;
    width: 62%;
    position: relative;

    .ant-image {
      height: 100%;
      width: 100%;

      .ant-image-img {
        height: 100%;
        width: 100%;
        // object-fit: cover;
      }
    }
  }

  .info-movie {
    padding: 0px 0px 10px 15px;
  }

  .widget {
    margin-top: 7px;

    a,
    span.btn-add-to-list,
    span.btn-trailer {
      margin-right: 7px;
      margin-top: 7px;
      color: #fff;
      padding: 10px 15px;
      border-radius: 3px;
      transition: all 0.3s;
      display: inline-block;
      white-space: nowrap;
      cursor: pointer;

      span {
        margin-left: 3px;
      }
    }

    .btn-play-now {
      background-color: #006b8f;

      &:hover {
        background-color: #006b8fb0;
      }
    }

    .btn-trailer {
      background-color: #db0832;

      &:hover {
        background-color: #db0832ad;
      }
    }

    .btn-add-to-list {
      background-color: #505050;

      &:hover {
        background-color: #505050a9;
      }
    }
  }

  .misc {
    margin-top: 15px;

    p {
      line-height: 1.7;
    }

    label {
      font-weight: bold;
    }

    a {
      &:hover {
      }
    }
  }

  .movie-content {
    padding: 0px 10px;
    text-align: justify;

    p {
    }

    p:not(.open) {
      position: relative;
      text-overflow: ellipsis;
      max-height: 100px;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          rgba(28, 28, 28, 0.25),
          rgba(0, 0, 0, 0.55),
          rgba(0, 0, 0, 0.85)
        );
        height: 25px;
      }
    }

    .toggle-content {
      cursor: pointer;
      display: inline-block;

      strong {
        display: block;
      }

      &:hover {
        color: #494949;
      }
    }
  }

  .trailer-youtube {
    display: none;

    iframe {
      height: 82vh;
    }

    &.active {
      display: block;
    }
  }
}

.widget-skeleton {
  .ant-skeleton {
    margin-right: 7px;

    .ant-skeleton-button {
      padding: 22px 55px;
    }
  }
}

.list-lastest-episodes.skeleton {
  .ant-skeleton {
    margin: 7px 7px 0px 0px;

    .ant-skeleton-button {
      padding: 19px 40px;
    }
  }
}
</style>
