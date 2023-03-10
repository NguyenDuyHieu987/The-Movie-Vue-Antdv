<template>
  <router-link
    :to="{
      name: 'info',
      params: {
        id: item?.id,
        name: item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="movie-card-horizontal-item"
  >
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="img-box">
          <el-skeleton-item class="ant-image" variant="image" />
        </div>
        <div style="margin-top: 7px">
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" style="width: 60%" />
        </div>
      </template>

      <template #default>
        <div class="img-box">
          <a-image
            v-if="!loading"
            :src="
              getPoster(
                dataMovie?.backdrop_path
                  ? dataMovie?.backdrop_path
                  : dataMovie?.poster_path
              )
            "
            :preview="false"
          >
          </a-image>

          <!-- <a-skeleton-image v-else class="ant-image" /> -->

          <div v-show="!loading" class="duration-episode-box">
            <p class="duration-episode">
              {{
                isEpisodes
                  ? dataMovie?.number_of_episodes
                    ? dataMovie?.number_of_episodes + '-Tập'
                    : ''
                  : dataMovie?.runtime
                  ? dataMovie?.runtime + ' min'
                  : ''
              }}
            </p>
          </div>

          <div v-show="!loading" class="release-date-box">
            <p class="release-date">
              {{
                item?.release_date
                  ? item?.release_date?.slice(0, 4)
                  : item?.last_air_date?.slice(0, 4)
                  ? item?.last_air_date?.slice(0, 4)
                  : item?.first_air_date?.slice(0, 4)
              }}
            </p>
          </div>
        </div>
        <a-tooltip
          :title="
            getLanguage(item?.original_language, $store.state.allCountries)
              ?.name
              ? getLanguage(item?.original_language, $store.state.allCountries)
                  ?.name
              : ''
          "
        >
          <div class="info">
            <!-- <a-skeleton
              :loading="loading"
              :active="true"
              :paragraph="{ rows: 2 }"
              :title="false"
            > -->
            <p class="title">
              {{ item?.name ? item?.name : item?.title }}
              <span v-if="isEpisodes">
                {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
              </span>
            </p>
            <div class="info-bottom">
              <!-- <p class="genres" v-if="item?.genre_ids">
                {{
                  getAllGenresById(item?.genre_ids, $store.state?.allGenres).join(
                    ' • '
                  )
                }}
              </p> -->
              <p class="genres" v-if="item?.genres">
                {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
              </p>
              <p
                class="genres"
                v-else-if="item?.genres == undefined && dataMovie?.genres"
              >
                {{ Array.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
              </p>
            </div>
            <!-- </a-skeleton> -->
          </div>
        </a-tooltip>
      </template>
    </el-skeleton>
  </router-link>
</template>
<script>
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  getLanguage,
} from '../services/MovieService';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const genresName = ref([]);
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;

      getTvById(props.item?.id)
        .then((tvResponed) => {
          if (tvResponed?.data?.not_found === true)
            getMovieById(props.item?.id)
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

      setTimeout(() => {
        loading.value = false;
      }, 3000);
    });
    return {
      genresName,
      isEpisodes,
      dataMovie,
      loading,
      getPoster,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>
<style lang="scss">
@media only screen and (max-width: 1150px) {
  .movie-card-horizontal-item {
    .img-box {
      transition: all 0.3s;
      height: 130px !important;
    }
  }
}

@media only screen and (max-width: 1010px) {
  .movie-group.horizontal {
    grid-template-columns: repeat(auto-fit, minmax(170px, auto)) !important;
  }
}

@media only screen and (max-width: 435px) {
  .movie-group.horizontal {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
  }

  .movie-card-horizontal-item {
    .img-box {
      height: 110px !important;
    }
  }
}

.movie-card-horizontal-item {
  .img-box {
    height: 150px;
  }
  .ant-skeleton-content .ant-skeleton-paragraph > li + li {
    margin-top: 10px;
  }
}
</style>
