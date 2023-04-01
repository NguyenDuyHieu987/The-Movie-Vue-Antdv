<template>
  <div class="lastest-episodes">
    <h3 class="section-title">
      <strong>Tập mới nhất</strong>
    </h3>

    <div v-if="loading" class="list-lastest-episodes skeleton">
      <a-skeleton-button
        :loading="loading"
        :active="true"
        :size="size"
        :shape="'default'"
        :block="block"
        v-for="(item, index) in Array.from(
          { length: dataMovie?.last_episode_to_air?.episode_number },
          (_, i) => i + 1
        )
          .reverse()
          .slice(0, 10)"
        :index="index"
        :key="index"
      >
      </a-skeleton-button>
    </div>

    <ul v-else class="list-lastest-episodes">
      <!-- <li
        v-for="(item, index) in Array.from(
          { length: dataMovie?.last_episode_to_air?.episode_number },
          (_, i) => i + 1
        )
          .reverse()
          .slice(0, 10)"


        :index="index"
        :key="index"
      >
        <router-link
          v-if="item === numberOfEpisodes"
          :to="{
            name: 'play',
            params: {
              id: dataMovie?.id,
              name: dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              // tap: 'tap-1',
            },
            query: {
              ep: `tap-${item}`,
            },
          }"
        >
          {{ 'Tập ' + item + '-End' }}
        </router-link>
        <router-link
          v-else-if="item !== numberOfEpisodes"
          :to="{
            name: 'play',
            params: {
              id: dataMovie?.id,
              name: dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              // tap: 'tap-1',
            },
            query: {
              ep: `tap-${item}`,
            },
          }"
        >
          {{ 'Tập ' + item }}
        </router-link>
      </li> -->

      <li
        v-for="(item, index) in dataSeason.episodes
          ?.slice(0, dataMovie?.last_episode_to_air?.episode_number)
          ?.slice(-10)
          .reverse()"
        :index="index"
        :key="index"
      >
        <router-link
          v-if="item?.episode_number === numberOfEpisodes"
          :to="{
            name: 'playtv',
            params: {
              id: dataMovie?.id,
              name: dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              tap: `tap-${item?.episode_number}`,
            },
          }"
        >
          {{ 'Tập ' + item?.episode_number + '-End' }}
        </router-link>
        <router-link
          v-else-if="item?.episode_number !== numberOfEpisodes"
          :to="{
            name: 'playtv',
            params: {
              id: dataMovie?.id,
              name: dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              tap: `tap-${item?.episode_number}`,
            },
          }"
        >
          {{ 'Tập ' + item?.episode_number }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import { getMoviesBySeason } from '@/services/MovieService';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  props: {
    dataMovie: { type: Object },
    numberOfEpisodes: { type: Number },
    loading: { type: Boolean },
  },
  components: {},
  setup(props) {
    const route = useRoute();
    const dataSeason = ref({});
    const loadingLastestEpisodes = ref(false);

    onBeforeMount(() => {
      loadingLastestEpisodes.value = true;
      getMoviesBySeason(
        route.params?.id,
        props.dataMovie?.last_episode_to_air?.season_number
      )
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;
          loadingLastestEpisodes.value = false;
        })
        .catch((e) => {
          loadingLastestEpisodes.value = false;
          if (axios.isCancel(e)) return;
        });
    });
    return { dataSeason, loadingLastestEpisodes };
  },
};
</script>

<style scoped lang="scss" src="./LastestEpisodes.scss"></style>
