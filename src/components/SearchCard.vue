<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-search-item"
  >
    <div class="img-box">
      <a-image
        v-if="!loading"
        class="movie-carousel-img"
        :src="
          getPoster(item?.poster_path ? item?.poster_path : item?.backdrop_path)
        "
        :preview="false"
        v-lazy="
          getPoster(item?.poster_path ? item?.poster_path : item?.backdrop_path)
        "
      >
      </a-image>

      <a-skeleton-image v-else class="ant-image" />
    </div>

    <!-- <a-tooltip :title="getLanguage(item?.original_language)?.english_name"> -->
    <div class="info">
      <a-skeleton
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 4 }"
        :title="false"
      >
        <p class="title">
          {{ item?.name ? item?.name : item?.title }}
        </p>
        <p class="genres" v-if="item?.genre_ids">
          {{ getAllGenresById(item?.genre_ids).join(' • ') }}
        </p>
        <p class="genres" v-else-if="item?.genres">
          {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
        </p>
        <p class="release-date">
          Năm:
          {{ item?.release_date ? item?.release_date : item?.first_air_date }}
        </p>
        <p class="duration-episode">
          Thời lượng:
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
      </a-skeleton>
    </div>
    <!-- </a-tooltip> -->
  </router-link>
</template>
<script>
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getMovieSeriesById,
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
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;

      getMovieSeriesById(props.item?.id)
        .then((tvResponed) => {
          if (tvResponed?.data === null)
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
    });

    setTimeout(() => {
      loading.value = false;
    }, 1500);

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
.movie-search-item {
  display: flex;
  padding: 10px 5px;

  &:hover {
    .info {
      color: #fff;
    }
  }

  .ant-image {
    height: 130px;
    width: 100px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    font-size: 1.4rem;
    margin-left: 10px;
    color: #3b3b3b;

    .duration-episode {
      // margin-left: 10px;
    }
  }
}
.movie-search-item + .movie-search-item {
  border-top: 1px solid #6d6d6d;
}
</style>
