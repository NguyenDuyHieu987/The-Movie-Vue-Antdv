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
import {
  ref,
  onBeforeMount,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  // getMovieByCredit,
} from '@/services/MovieService';
import Interaction from '@/components/Interaction/Interaction.vue';
import RatingMovie from '@/components/RatingMovie/RatingMovie.vue';
import MovieSuggest from '@/components/MovieSuggest/MovieSuggest.vue';
import ListEpisodes from '@/components/ListEpisodes/ListEpisodes.vue';

export default {
  components: {
    Interaction,
    RatingMovie,
    MovieSuggest,
    ListEpisodes,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
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
    const internalInstance = getCurrentInstance();

    const getData = () => {
      loading.value = true;
      internalInstance.appContext.config.globalProperties.$Progress.start();

      document.title = `${Array?.from(
        route.params?.name?.split('+'),
        (x) => x.charAt(0).toUpperCase() + x.slice(1)
      ).join(' ')} - Xem phim`;

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
        internalInstance.appContext.config.globalProperties.$Progress.finish();
      }, 2500);
    };

    onBeforeMount(() => {
      getData();
    });

    onMounted(() => {
      // getData();
    });

    router.beforeEach((to) => {
      if (to.params.slug == 'play') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });

        dataCredit.value = [];

        getData();
      }
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

<style lang="scss" src="./PlayView.scss"></style>
