<template>
  <router-link
    :to="{
      name: item?.type ? 'infoTV' : 'info',
      params: {
        id: item?.id,
        name: item?.name?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="movie-search-item"
  >
    <div class="img-box">
      <!-- v-if="!loading" -->
      <img
        class="ant-image"
        v-lazy="getPoster(item?.poster_path)"
        :preview="false"
      />

      <!-- <a-skeleton-image v-else class="ant-image" /> -->
    </div>

    <div class="info">
      <h3 class="title">
        {{ item?.name }}
        <span v-if="isEpisodes">
          {{ ' - Phần ' + item?.last_episode_to_air?.season_number }}
        </span>
      </h3>
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

      <p class="views">
        <!-- Lượt xem: -->
        {{ item?.views ? ViewFormatter(item?.views) + ' lượt xem' : '' }}
      </p>
    </div>
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
import { ViewFormatter } from '@/utils/convertViews';

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
      ViewFormatter,
    };
  },
};
</script>
<style lang="scss" src="./SearchCard.scss"></style>
