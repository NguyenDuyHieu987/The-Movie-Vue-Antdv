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
          <p class="genres">
            {{ getAllGenresById(item?.genre_ids).join(' • ') }}
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
    grid-template-columns: repeat(auto-fit, minmax(160px, auto));

    .ant-image {
      transition: all 0.3s;
      height: 220px;
    }
  }
}

.movie-carousel-vertical-item {
  color: #fff;
  cursor: pointer;
  display: block;

  .img-box {
    position: relative;
  }

  .ant-image {
    height: 270px;
    width: 100%;

    .ant-image-img {
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      transition: all 0.3s;
      height: 100%;
    }
  }

  &:hover {
    img {
      transform: scale(1.05);
      opacity: 0.8;
    }

    .duration-episode-box {
      background-size: 200% 100%;
      background-position: -50px center;
    }

    .release-date-box {
      background-size: 200% 100%;
      background-position: -45px center;
    }

    .info {
      color: #fff;
    }
  }

  .duration-episode-box {
    color: #fff;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color1),
      var(--sider-header-background-color2),
      var(--sider-header-background-color3)
    );
    background-size: 200% 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 5px 10px;
    box-shadow: #000000bf 0px 3px 10px;
    left: 5px;
    top: 5px;
    transition: all 0.7s;
    .duration-episode {
      font-size: 12px;
    }
  }

  .release-date-box {
    color: #fff;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color3),
      var(--sider-header-background-color2),
      var(--sider-header-background-color1)
    );
    background-size: 200% 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 5px 10px;
    box-shadow: #000000bf 0px 3px 10px;
    right: 5px;
    bottom: 5px;
    transition: all 0.7s;

    .release-date {
      font-size: 12px;
    }
  }

  .info {
    padding: 10px 0px;
    color: #3b3b3b;

    .title,
    .genres {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .info-bottom {
      display: flex;

      p + p {
        margin-left: 5px;
      }
    }
  }
}
</style>
