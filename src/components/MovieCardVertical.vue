<template>
  <!-- <el-skeleton :loading="loading" animated class="movie-card-vertical-item">
    <template #template>
      <div class="img-box">
        <el-skeleton-item class="ant-image" variant="image" />
      </div>
      <div style="margin-top: 7px">
        <el-skeleton-item variant="text" />
        <el-skeleton-item variant="text" style="width: 60%" />
      </div>
    </template>

    <template #default> -->
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
    <div class="img-box">
      <a-image
        v-if="!loading"
        class="movie-card-img"
        :src="
          getPoster(item?.poster_path ? item?.poster_path : item?.backdrop_path)
        "
        :preview="false"
      >
      </a-image>

      <a-skeleton-image v-else class="ant-image" />

      <div v-if="!loading" class="duration-episode-box">
        <p class="duration-episode">
          {{
            isEpisodes
              ? dataMovie?.number_of_episodes
                ? dataMovie?.number_of_episodes + '-Tập'
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
        getLanguage(item?.original_language, $store.state.allCountries)?.name
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
              {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
            </span>
          </p>
          <div class="info-bottom">
            <p class="genres" v-if="item?.genres">
              {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
            </p>
            <p class="genres" v-else>
              {{ Array?.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
            </p>
          </div>
        </a-skeleton>
      </div>
    </a-tooltip>
  </router-link>
  <!-- </template>
  </el-skeleton> -->
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

      // genresName.value = await getAllGenresById(
      //   props.item?.genre_ids ? props.item?.genre_ids : dataMovie.value.genres
      // );
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
@media only screen and (max-width: 1150px) {
  .movie-group.vertical {
    // grid-template-columns: repeat(auto-fit, minmax(160px, auto));
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 220px !important;
    }
  }
}

@media only screen and (max-width: 1050px) {
  .movie-group.vertical {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 230px !important;
    }
  }
}

@media only screen and (max-width: 970px) {
  .movie-group.vertical {
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 230px !important;
    }
  }
}

@media only screen and (max-width: 800px) {
  .movie-group.vertical {
    grid-template-columns: repeat(auto-fit, minmax(140px, auto)) !important;
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 250px !important;
    }
  }
}

@media only screen and (max-width: 740px) {
  .movie-group.vertical {
    grid-template-columns: repeat(auto-fit, minmax(160px, auto)) !important;
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 230px !important;
    }
  }
}

@media only screen and (max-width: 410px) {
  .movie-group.vertical {
  }

  .movie-card-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 210px !important;
    }
  }
}

.movie-card-vertical-item {
  .img-box {
    height: 260px;
  }

  .ant-image {
    height: 100%;
    width: 100%;
  }

  .ant-skeleton-content .ant-skeleton-paragraph > li + li {
    margin-top: 10px;
  }
}

.owl-item {
  .movie-card-vertical-item {
    .img-box {
    }
  }
}
</style>
