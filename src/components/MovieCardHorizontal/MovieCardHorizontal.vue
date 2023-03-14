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
            class="ant-image"
            v-show="!loading"
            :src="
              getPoster(
                dataMovie?.backdrop_path
                  ? dataMovie?.backdrop_path
                  : dataMovie?.poster_path
              )
            "
            :preview="false"
            @load="onLoadImg"
          >
          </a-image>

          <!-- <a-skeleton-image v-else class="ant-image" /> -->

          <div v-show="!loading" class="duration-episode-box">
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
            setTimeout(() => {
              loading.value = false;
            }, 1000);
            isEpisodes.value = true;
            dataMovie.value = tvResponed?.data;
          }
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });
    });

    const onLoadImg = () => {};
    return {
      genresName,
      isEpisodes,
      dataMovie,
      loading,
      getPoster,
      getAllGenresById,
      getLanguage,
      onLoadImg,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontal.scss"></style>
