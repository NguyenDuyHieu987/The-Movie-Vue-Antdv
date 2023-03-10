<template>
  <div class="movie-card-horizontal-item">
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
        <div class="img-box" @click="handleClickTrailerIcon">
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

          <div v-if="!loading" class="duration-episode-box">
            <p class="duration-episode">
              {{
                isEpisodes
                  ? dataMovie?.last_episode_to_air?.episode_number
                    ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                    : ''
                  : dataMovie?.runtime
                  ? dataMovie?.runtime + ' min'
                  : ''
              }}
            </p>
          </div>

          <div class="youtub-icon" v-if="!loading">
            <font-awesome-icon icon="fa-brands fa-youtube" />
          </div>

          <div v-if="!loading" class="release-date-box">
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
                  {{
                    ' - Phần ' + dataMovie?.last_episode_to_air?.season_number
                  }}
                </span>
              </p>
              <div class="info-bottom">
                <!-- <p class="genres" v-if="item?.genre_ids">
                  {{
                    getAllGenresById(
                      item?.genre_ids,
                      $store.state?.allGenres
                    ).join(' • ')
                  }}
                </p> -->
                <p class="genres" v-if="dataMovie?.genres">
                  {{
                    Array?.from(dataMovie?.genres, (x) => x.name).join(' • ')
                  }}
                </p>
              </div>
              <!-- </a-skeleton> -->
            </div>
          </router-link>
        </a-tooltip>

        <a-modal
          v-model:visible="isOenModalTrailer"
          width="1300px"
          centered
          @ok="modal2Visible = false"
          class="modal-trailer"
        >
          <template #title>
            <p>Trailer: {{ item?.name ? item?.name : item?.title }}</p>
          </template>
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
          <template #footer>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <div style="max-width: 70%">
                <h3 style="display: flex">
                  <strong> {{ item?.name ? item?.name : item?.title }}</strong>
                </h3>

                <p
                  class="genres"
                  style="
                    display: flex;
                    text-align: left;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    display: -webkit-box;
                  "
                >
                  {{ dataMovie?.overview }}
                </p>
              </div>
              <div>
                <a-button key="back" size="large" @click="handleCancel"
                  >Đóng
                </a-button>
                <router-link
                  v-if="isEpisodes"
                  :to="{
                    name: 'playtv',
                    params: {
                      id: dataMovie?.id,
                      name: dataMovie?.name
                        ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                        : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
                      tap: 'tap-1',
                    },
                  }"
                  class="btn-play-now"
                >
                  <span> Xem ngay</span>
                </router-link>
                <router-link
                  v-else-if="!isEpisodes"
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
                  <span> Xem ngay</span>
                </router-link>
              </div>
            </div>
          </template>
        </a-modal>
      </template>
    </el-skeleton>
  </div>
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
} from '../../services/MovieService';

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
    const isOenModalTrailer = ref(false);

    onBeforeMount(() => {
      loading.value = true;

      getTvById(props.item?.id, 'videos')
        .then((tvResponed) => {
          if (tvResponed?.data?.not_found === true)
            getMovieById(props.item?.id, 'videos')
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

    const handleClickTrailerIcon = () => {
      isOenModalTrailer.value = true;
    };

    const handleCancel = () => {
      isOenModalTrailer.value = false;
    };

    return {
      genresName,
      isEpisodes,
      dataMovie,
      loading,
      isOenModalTrailer,
      getPoster,
      getAllGenresById,
      getLanguage,
      handleClickTrailerIcon,
      handleCancel,
    };
  },
};
</script>
<style lang="scss" scoped src="./MovieCardHorizontalTrailer.scss"></style>
