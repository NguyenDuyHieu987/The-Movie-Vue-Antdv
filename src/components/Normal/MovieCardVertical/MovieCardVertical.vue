<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-card-vertical-item"
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
            class="movie-card-img"
            :src="
              getPoster(
                item?.poster_path ? item?.poster_path : item?.backdrop_path
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
                  ? dataMovie?.runtime + ' phút'
                  : ''
              }}
            </p>
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
          <div class="info">
            <a-skeleton
              :loading="loading"
              :active="true"
              :paragraph="{ rows: 2 }"
              :title="false"
            >
              <p class="title">
                {{ item?.name ? item?.name : item?.title }}
                <span v-if="isEpisodes">
                  {{
                    ' - Phần ' + dataMovie?.last_episode_to_air?.season_number
                  }}
                </span>
              </p>
              <div class="info-bottom">
                <p class="genres" v-if="item?.genres">
                  {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
                </p>
                <p
                  class="genres"
                  v-else-if="item?.genres == undefined && dataMovie?.genres"
                >
                  {{
                    Array?.from(dataMovie?.genres, (x) => x.name).join(' • ')
                  }}
                </p>
              </div>
            </a-skeleton>
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
} from '@/services/MovieService';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
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
                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          else {
            isEpisodes.value = true;
            dataMovie.value = tvResponed?.data;

            setTimeout(() => {
              loading.value = false;
            }, 1000);
          }
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });

      // genresName.value = await getAllGenresById(
      //   props.item?.genre_ids ? props.item?.genre_ids : dataMovie.value.genres
      // );
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
<style lang="scss" src="./MovieCardVertical.scss"></style>
