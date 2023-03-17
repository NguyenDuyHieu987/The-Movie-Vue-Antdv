<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-rank-item"
  >
    <div class="img-box">
      <!-- v-if="!loading" -->
      <a-image
        class="movie-carousel-img"
        :src="
          getPoster(item?.poster_path ? item?.poster_path : item?.backdrop_path)
        "
        :preview="false"
      >
      </a-image>

      <!-- <a-skeleton-image v-else class="ant-image" /> -->
    </div>

    <!-- <a-tooltip :title="getLanguage(item?.original_language)?.english_name"> -->
    <div class="info">
      <p class="title">
        {{ item?.name ? item?.name : item?.title }}
        <span v-if="isEpisodes">
          {{ ' - Phần ' + item?.last_episode_to_air?.season_number }}
        </span>
      </p>
      <p class="genres" v-if="item?.genres">
        {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
      </p>
      <p class="genres" v-else-if="item?.genre_ids">
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
    </div>
    <!-- </a-tooltip> -->
  </router-link>
</template>
<script>
import { ref, onBeforeMount } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  // getTvById,
  // getMovieById,
  getLanguage,
} from '@/services/MovieService';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  setup() {
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;
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
<style lang="scss" src="./RankCard.scss"></style>
