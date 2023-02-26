<template>
  <router-link
    v-if="item?.id"
    :to="{
      name: 'info',
      params: {
        id: item?.id,
        name: item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="movie-carousel-horizontal-item"
  >
    <!-- v-if="item?.id"
    :to="{
      name: 'info',
      params: {
        id: item?.id,
        name: item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase(),
      },
    }" -->
    <div class="img-box">
      <a-image
        :src="
          getPoster(
            item?.backdrop_path ? item?.backdrop_path : item?.poster_path
          )
        "
        :preview="false"
      >
        <!-- <template #placeholder>
            <a-image
              :src="
                getPoster(
                  item?.backdrop_path ? item?.backdrop_path : item?.poster_path
                )
              "
              :preview="false"
            />
          </template> -->
      </a-image>
      <div class="duration-episode-box">
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

      <div class="release-date-box">
        <p class="release-date">
          {{
            item?.release_date
              ? item?.release_date?.slice(0, 4)
              : item?.first_air_date?.slice(0, 4)
          }}
        </p>
      </div>
    </div>
    <a-tooltip :title="getLanguage(item?.original_language)?.english_name">
      <div class="info">
        <p class="title">
          {{ item?.name ? item?.name : item?.title }}
        </p>
        <div class="info-bottom">
          <p class="genres" v-if="item?.genre_ids">
            {{ getAllGenresById(item?.genre_ids).join(' • ') }}
          </p>
          <p class="genres" v-else-if="item?.genres">
            {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
          </p>
        </div>
      </div>
    </a-tooltip>
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
    const dataMovie = ref({});
    const isEpisodes = ref(false);

    onBeforeMount(() => {
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
    return {
      genresName,
      isEpisodes,
      dataMovie,
      getPoster,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>
<style lang="scss">
.owl-carousel .owl-item img {
  display: inline;
}

@media only screen and (max-width: 1150px) {
  .movie-carousel-horizontal-item {
    .ant-image {
      transition: all 0.3s;
      height: 130px !important;
    }
  }
}

@media only screen and (max-width: 1010px) {
  .movie-group.popular {
    grid-template-columns: repeat(auto-fit, minmax(170px, auto)) !important;
  }
}

@media only screen and (max-width: 435px) {
  .movie-group.popular {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
  }

  .movie-carousel-horizontal-item {
    .ant-image {
      height: 110px !important;
    }
  }
}

.movie-carousel-horizontal-item {
  .ant-image {
    height: 150px;
  }
}
</style>
