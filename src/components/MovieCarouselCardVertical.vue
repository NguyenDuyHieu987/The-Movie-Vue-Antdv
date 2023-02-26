<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-carousel-vertical-item"
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
        class="movie-carousel-img"
        :src="
          getPoster(item?.poster_path ? item?.poster_path : item?.backdrop_path)
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
            :height="200"
            :preview="false"
          />
        </template> -->
      </a-image>

      <!-- <a-skeleton-image
        style="width: 100%; height: 100%"
        :active="true"
        v-else
      /> -->

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
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loadImage = ref(false);

    loadImage.value = true;
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

    setTimeout(() => {
      loadImage.value = false;
    }, 2000);
    return {
      genresName,
      isEpisodes,
      dataMovie,
      loadImage,
      getPoster,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>
<style lang="scss">
@media only screen and (max-width: 1150px) {
  .movie-group.upcoming {
    // grid-template-columns: repeat(auto-fit, minmax(160px, auto));

    .ant-image {
      transition: all 0.3s;
      height: 220px;
    }
  }
}

@media only screen and (max-width: 1050px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;

    .ant-image {
      transition: all 0.3s;
      height: 230px;
    }
  }
}

@media only screen and (max-width: 970px) {
  .movie-group.upcoming {
    .ant-image {
      transition: all 0.3s;
      height: 250px;
    }
  }
}

@media only screen and (max-width: 800px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(140px, auto)) !important;

    .ant-image {
      transition: all 0.3s;
      height: 210px;
    }
  }
}

@media only screen and (max-width: 740px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(160px, auto)) !important;

    .ant-image {
      transition: all 0.3s;
      height: 250px;
    }
  }
}

@media only screen and (max-width: 410px) {
  .movie-group.upcoming {
    .ant-image {
      transition: all 0.3s;
      height: 210px;
    }
  }
}

.movie-carousel-vertical-item {
  .ant-image {
    height: 250px;
  }
}
</style>
