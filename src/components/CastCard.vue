<template>
  <div class="cast-item">
    <div class="cast-img-box">
      <a-image
        class="movie-carousel-img"
        :src="getPosterCast(item?.profile_path)"
        :preview="false"
      >
        <!-- <template #placeholder>
            <a-image
              :src="
                getPosterCast(
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
    </div>

    <div class="info">
      <p class="name">
        {{ item?.name ? item?.name : item?.title }}
      </p>
    </div>
  </div>
</template>
<script>
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPosterCast,
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
      getPosterCast,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>
<style lang="scss">
.cast-item {
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 1.6rem;

  .cast-img-box {
    position: relative;
  }

  .ant-image {
    height: 200px;
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

  .info {
    // padding: 0px 0px !important;
    color: #3b3b3b;

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
