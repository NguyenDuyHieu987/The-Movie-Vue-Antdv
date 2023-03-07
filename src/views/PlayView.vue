<template>
  <div class="play-container">
    <div class="video-player">
      <iframe
        v-if="isEpisodes"
        width="100%"
        height="100%"
        :src="`//ok.ru/videoembed/${
          urlCodeMovie ? urlCodeMovie : '3056793684585'
        }`"
        frameborder="0"
        allow="autoplay"
        allowfullscreen
      ></iframe>

      <iframe
        v-else
        width="100%"
        height="100%"
        :src="`//ok.ru/videoembed/${'3056793684585'}`"
        frameborder="0"
        allow="autoplay"
        allowfullscreen
      ></iframe>
    </div>

    <ListEpisodes
      v-if="isEpisodes"
      :dataMovie="dataMovie"
      :numberOfEpisodes="
        dataMovie?.seasons?.find((item) =>
          item.season_number === dataMovie?.last_episode_to_air?.season_number
            ? item
            : null
        )?.episode_count
      "
      @setUrlCodeMovie="(data) => getUrlCodeMovie(data)"
    />

    <h3 class="section-title width-fit" style="margin-top: 10px">
      <strong> Đánh giá phim</strong>
    </h3>

    <div v-if="loading">
      <a-skeleton-button :active="true" :size="'default'" :block="false">
      </a-skeleton-button>
    </div>
    <Interaction v-else :dataMovie="dataMovie" />

    <div style="margin-top: 15px">
      <a-skeleton
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 1, width: '40%' }"
        :title="false"
      >
        <RatingMovie
          v-if="dataMovie?.id"
          :voteAverage="dataMovie?.vote_average"
          :voteCount="dataMovie?.vote_count"
          :movieId="dataMovie?.id"
          :isEpisodes="isEpisodes"
        />
      </a-skeleton>
    </div>

    <h3 class="section-title">
      <strong>
        {{ dataMovie?.name ? dataMovie?.name : dataMovie?.title }}
        {{
          ` (${
            dataMovie?.last_air_date?.slice(0, 4)
              ? dataMovie?.last_air_date?.slice(0, 4)
              : dataMovie?.release_date?.slice(0, 4)
          })`
        }}
      </strong>
    </h3>
    <div class="movie-content">
      <a-skeleton
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 3, width: '40%' }"
        :title="false"
      >
        <p :class="{ open: isOpenContent }">
          {{ dataMovie?.overview }}
          <router-link
            v-if="dataMovie?.id"
            :to="{
              name: 'info',
              params: {
                id: dataMovie?.id,
                name: dataMovie?.name
                  ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                  : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              },
            }"
          >
            <strong class="toggle-content"> Chi tiết </strong>
          </router-link>
        </p>
      </a-skeleton>
    </div>

    <h3 class="section-title">
      <strong> Bình luận</strong>
    </h3>
    <div
      class="fb-comments"
      :data-href="urlComment"
      data-width="100%"
      data-numposts="10"
    ></div>

    <MovieSuggest
      v-if="dataMovie?.id"
      :dataMovie="dataMovie"
      :isEpisodes="isEpisodes"
    />
  </div>
</template>

<script>
import { ref, onBeforeMount, watch, computed, onMounted } from 'vue';
import {
  useRoute,
  //  useRouter
} from 'vue-router';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  // getMovieByCredit,
} from '../services/MovieService';
import Interaction from '@/components/Interaction.vue';
import RatingMovie from '@/components/RatingMovieAnt.vue';
import MovieSuggest from '@/components/MovieSuggest.vue';
import ListEpisodes from '@/components/ListEpisodes.vue';

export default {
  components: {
    Interaction,
    RatingMovie,
    MovieSuggest,
    ListEpisodes,
  },
  setup() {
    const route = useRoute();
    // const router = useRouter();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const dataCredit = ref([]);
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const isOpenContent = ref(false);
    const isOpenTrailerYoutube = ref(false);
    const urlComment = computed(() => window.location);
    const loading = ref(false);
    const urlCodeMovie = ref('');

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    const getData = () => {
      loading.value = true;

      getTvById(route.params?.id)
        .then((tvResponed) => {
          if (tvResponed?.data?.not_found === true)
            getMovieById(route.params?.id)
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
          loading.value = false;
          if (axios.isCancel(e)) return;
        });

      setTimeout(() => {
        loading.value = false;
      }, 2500);
    };

    onBeforeMount(() => {
      getData();
    });

    onMounted(() => {
      // getData();
    });

    watch(route, () => {
      // router.push({ path: newVal.path }).then(() => {
      //   router.go();
      // });
      // console.log(router);
      // router.go();
    });

    const getUrlCodeMovie = (data) => {
      urlCodeMovie.value = data;
    };

    document.title = `${Array.from(
      route.params?.name.split('+'),
      (x) => x.charAt(0).toUpperCase() + x.slice(1)
    ).join(' ')} - Xem phim`;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    return {
      genresName,
      isEpisodes,
      dataMovie,
      dataCredit,
      isOpenContent,
      isOpenTrailerYoutube,
      dataSimilar,
      dataRecommend,
      btnPrev,
      btnNext,
      urlComment,
      loading,
      urlCodeMovie,
      getPoster,
      getAllGenresById,
      getUrlCodeMovie,
    };
  },
};
</script>

<style lang="scss">
@media only screen and (max-width: 2050px) {
  .play-container {
    .video-player {
      height: 75vh !important;
    }
  }
}

@media only screen and (max-width: 1900px) {
  .play-container {
    .video-player {
      height: 70vh !important;
    }
  }
}

@media only screen and (max-width: 1800px) {
  .play-container {
    .video-player {
      height: 65vh !important;
    }
  }
}

@media only screen and (max-width: 1650px) {
  .play-container {
    .video-player {
      height: 60vh !important;
    }
  }
}

@media only screen and (max-width: 1500px) {
  .play-container {
    .video-player {
      height: 500px !important;
    }
  }
}

@media only screen and (max-width: 1300px) {
  .play-container {
    .video-player {
      height: 500px !important;
    }
  }
}

@media only screen and (max-width: 1100px) {
  .play-container {
    .video-player {
      height: 450px !important;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .play-container {
    .video-player {
      height: 450px !important;
    }
  }
}

@media only screen and (max-width: 850px) {
  .play-container {
    .video-player {
      height: 350px !important;
    }
  }
}

@media only screen and (max-width: 750px) {
  .play-container {
    .video-player {
      height: 300px !important;
    }
  }
}

@media only screen and (max-width: 650px) {
  .play-container {
    .video-player {
      height: 250px !important;
    }
  }
}

.play-container {
  .video-player {
    height: 80vh;
  }

  .movie-content {
    padding: 0px 10px;
    color: #fff;

    p {
      text-align: justify;
    }
  }
}

.list-episodes {
  .ant-skeleton {
    margin: 7px 7px 0px 0px;

    .ant-skeleton-button {
      padding: 19px 35px;
    }
  }
}
</style>
