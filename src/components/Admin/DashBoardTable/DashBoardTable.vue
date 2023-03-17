<template>
  <div class="movie-table"></div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import {
  getMovies,
  getTv,
  getLanguage,
  getPoster,
} from '@/services/MovieService';
import axios from 'axios';

export default {
  components: {},
  setup() {
    const tableDataMovie = ref([]);
    const tableDataTV = ref([]);
    const tableTabActive = ref('movie');

    onBeforeMount(() => {
      Promise.all([getMovies(1), getTv(1)])
        .then((movieResponse) => {
          tableDataMovie.value = movieResponse[0]?.data?.results;
          tableDataTV.value = movieResponse[1]?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return {
      tableTabActive,
      tableDataMovie,
      tableDataTV,
      getLanguage,
      getPoster,
    };
  },
};
</script>

<style lang="scss" scoped src="./DashBoardTable.scss"></style>
