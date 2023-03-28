<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-history-item"
  >
    <div class="img-box">
      <!-- v-if="!loading" -->
      <a-image
        class="movie-carousel-img"
        :src="getPoster(item?.backdrop_path)"
        :preview="false"
      >
      </a-image>
    </div>

    <div class="info">
      <h2 class="title">
        <strong>
          {{ item?.name ? item?.name : item?.title }}
          <strong v-if="isEpisodes">
            {{ ' - Phần ' + item?.last_episode_to_air?.season_number }}
          </strong>
        </strong>
      </h2>

      <p class="genres" v-if="item?.genres">
        Thể loại: {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
      </p>
      <p class="genres" v-else-if="item?.genre_ids">
        Thể loại:
        {{
          getAllGenresById(item?.genre_ids, $store.state?.allGenres).join(' • ')
        }}
      </p>
      <p class="release-date">
        Năm:
        {{ item?.release_date ? item?.release_date : item?.first_air_date }}
      </p>
      <p v-if="item?.last_episode_to_air" class="duration-episode">
        Tập mới nhất:
        {{
          item?.last_episode_to_air?.episode_number
            ? 'Tập ' + item?.last_episode_to_air?.episode_number
            : ''
        }}
      </p>
      <p v-else-if="item?.runtime" class="duration-episode">
        Thời lượng:
        {{ item?.runtime ? item?.runtime + ' phút' : '' }}
      </p>

      <p class="overview">
        {{ item?.overview }}
      </p>
    </div>

    <a-dropdown :trigger="['click']" class="dropdown-viewmore">
      <a-button circle shape="circle" size="large" @click.prevent="">
        <template #icon>
          <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
        </template>
      </a-button>

      <template #overlay>
        <a-menu class="dropdown-viewmore">
          <a-menu-item key="my-profile"> hieu</a-menu-item>
          <a-menu-item key="my-profile"> hieu</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </router-link>
</template>
<script>
import { ref, onBeforeMount } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  getLanguage,
} from '@/services/MovieService';
import axios from 'axios';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            getMovieById(props.item?.id)
              .then((movieResponed) => {
                isEpisodes.value = false;
                dataMovie.value = movieResponed?.data;

                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                loading.value = false;
                if (axios.isCancel(e)) return;
              });
            break;
          case 'tv':
            getTvById(props.item?.id)
              .then((tvResponed) => {
                isEpisodes.value = true;
                dataMovie.value = tvResponed?.data;

                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                loading.value = false;
                if (axios.isCancel(e)) return;
              });
            break;
          default:
            break;
        }
      } else {
        if (props?.item?.media_type == 'tv' || props?.item?.type) {
          getTvById(props.item?.id)
            .then((tvResponed) => {
              isEpisodes.value = true;
              dataMovie.value = tvResponed?.data;

              setTimeout(() => {
                loading.value = false;
              }, 1000);
            })
            .catch((e) => {
              loading.value = false;
              if (axios.isCancel(e)) return;
            });
        } else {
          getMovieById(props.item?.id)
            .then((movieResponed) => {
              isEpisodes.value = false;
              dataMovie.value = movieResponed?.data;

              setTimeout(() => {
                loading.value = false;
              }, 1000);
            })
            .catch((e) => {
              loading.value = false;
              if (axios.isCancel(e)) return;
            });
        }
      }
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
<style lang="scss" src="./MovieCardHorizontalHistory.scss"></style>
