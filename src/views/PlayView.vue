<template>
  <div class="play-container">
    <div class="video-player">
      <iframe
        width="100%"
        height="100%"
        src="//ok.ru/videoembed/3056793684585"
        frameborder="0"
        allow="autoplay"
        allowfullscreen
      ></iframe>
    </div>
    <Interaction />
    <RatingMovie
      :voteAverage="dataMovie?.vote_average"
      :voteCount="dataMovie?.vote_count"
      :isEpisodes="isEpisodes"
      :movieId="dataMovie?.id"
    />

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
      <p :class="{ open: isOpenContent }">
        {{ dataMovie?.overview }}
        <router-link
          :to="{
            path: `/info/${dataMovie?.id}/${
              dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase()
            }`,
          }"
        >
          <strong class="toggle-content" id="toggle-content"> Chi tiết </strong>
        </router-link>
      </p>
    </div>

    <div
      class="fb-comments"
      data-href="https://www.youtube.com/watch?v=ZQkZRpGle-U"
      data-width="100%"
      data-numposts="10"
    ></div>

    <MovieSuggest :dataMovie="dataMovie" :isEpisodes="isEpisodes" />
  </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getMovieSeriesById,
  getMovieById,
  getLanguage,
  getMovieByCredit,
  getMovieBySimilar,
  getTrending,
} from '../services/MovieService';
import Interaction from '@/components/Interaction.vue';
import RatingMovie from '@/components/RatingMovie.vue';
import MovieSuggest from '@/components/MovieSuggest.vue';

export default {
  components: {
    Interaction,
    RatingMovie,
    MovieSuggest,
  },
  setup() {
    const route = useRoute();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const dataCredit = ref([]);
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const isOpenContent = ref(false);
    const isOpenTrailerYoutube = ref(false);

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');

    onBeforeMount(() => {
      getMovieSeriesById(route.params?.id)
        .then((tvResponed) => {
          if (tvResponed?.data === null)
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
          if (axios.isCancel(e)) return;
        });

      getMovieByCredit(isEpisodes.value ? 'tv' : 'movie', route.params?.id)
        .then((movieResponed) => {
          dataCredit.value = movieResponed?.data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getMovieBySimilar(
        isEpisodes.value ? 'tv' : 'movie',
        // dataMovie.value?.genres[0],
        1
      )
        .then((movieResponed) => {
          dataSimilar.value = movieResponed?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getTrending(1)
        .then((movieResponed) => {
          dataRecommend.value = movieResponed?.data.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
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
      getPoster,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>

<style lang="scss" scoped>
.play-container {
  .video-player {
    height: 80vh;
  }
}
</style>
