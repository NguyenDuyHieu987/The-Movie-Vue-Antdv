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
        <a-skeleton
          :loading="loading"
          :active="true"
          :paragraph="{ rows: 2 }"
          :title="false"
        >
          <p class="title">
            {{ item?.name ? item?.name : item?.title }}
          </p>
          <div class="info-bottom">
            <p class="genres" v-if="item?.genres">
              {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
            </p>
            <p class="genres" v-else-if="item?.genre_ids">
              {{ getAllGenresById(item?.genre_ids).join(' • ') }}
            </p>
          </div>
        </a-skeleton>
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
@media only screen and (max-width: 1150px) {
  .movie-group.upcoming {
    // grid-template-columns: repeat(auto-fit, minmax(160px, auto));
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 220px !important;
    }
  }
}

@media only screen and (max-width: 1050px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 230px !important;
    }
  }
}

@media only screen and (max-width: 970px) {
  .movie-group.upcoming {
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 250px !important;
    }
  }
}

@media only screen and (max-width: 800px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(140px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 210px !important;
    }
  }
}

@media only screen and (max-width: 740px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(160px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 250px !important;
    }
  }
}

@media only screen and (max-width: 410px) {
  .movie-group.upcoming {
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 210px !important;
    }
  }
}

.movie-carousel-vertical-item {
  .img-box {
    height: 280px;
  }
  .ant-image {
    height: 100%;
    width: 100%;
  }
}

// .movie-carousel-vertical-item {
//   color: #fff;
//   cursor: pointer;
//   position: relative;
//   display: block;
//   // overflow: hidden;

//   .img-box {
//     position: relative;
//   }

//   .ant-image {
//     width: 100%;

//     .ant-image-img {
//       border-top-right-radius: 5px;
//       border-top-left-radius: 5px;
//       transition: all 0.3s;
//       height: 100%;
//     }
//   }

//   &:hover {
//     img {
//       transform: scale(1.05);
//       opacity: 0.7;
//     }

//     .duration-episode-box {
//       background-size: 200% 100%;
//       background-position: -50px center;
//     }

//     .release-date-box {
//       background-size: 200% 100%;
//       background-position: -45px center;
//     }

//     .info {
//       color: #ffffff;
//     }
//   }

//   .duration-episode-box {
//     color: #fff;
//     background-image: linear-gradient(
//       to right,
//       var(--sider-header-background-color1),
//       var(--sider-header-background-color2),
//       var(--sider-header-background-color3)
//     );
//     background-size: 200% 100%;
//     position: absolute;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5px;
//     padding: 5px 10px;
//     box-shadow: #000000bf 0px 3px 10px;
//     left: 5px;
//     top: 5px;
//     transition: all 0.7s;
//     .duration-episode {
//       font-size: 12px;
//     }
//   }

//   .release-date-box {
//     color: #fff;
//     background-image: linear-gradient(
//       to right,
//       var(--sider-header-background-color3),
//       var(--sider-header-background-color2),
//       var(--sider-header-background-color1)
//     );
//     background-size: 200% 100%;
//     position: absolute;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5px;
//     padding: 5px 10px;
//     box-shadow: #000000bf 0px 3px 10px;
//     right: 5px;
//     bottom: 5px;
//     transition: all 0.7s;

//     .release-date {
//       font-size: 12px;
//     }
//   }

//   .info {
//     padding: 10px 0px;
//     color: #3b3b3b;

//     .title,
//     .genres {
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .info-bottom {
//       display: flex;

//       p + p {
//         margin-left: 5px;
//       }
//     }
//   }
// }
</style>
