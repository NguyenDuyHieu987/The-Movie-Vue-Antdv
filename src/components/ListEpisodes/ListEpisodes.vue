<template>
  <div class="list-episodes">
    <div class="control-episodes">
      <el-button
        type="primary"
        plain
        :disabled="currentEpisode == 1"
        @click="$router.push({ params: { tap: `tap-${--currentEpisode}` } })"
      >
        Tập trước
      </el-button>
      <el-button
        type="primary"
        plain
        :disabled="
          dataMovie?.last_episode_to_air?.season_number == selectedSeason
            ? currentEpisode == dataMovie?.last_episode_to_air?.episode_number
            : currentEpisode == dataSeason?.episodes?.length
        "
        @click="$router.push({ params: { tap: `tap-${++currentEpisode}` } })"
      >
        Tập tiếp
      </el-button>
    </div>
    <h3 class="section-title" style="display: flex; align-items: center">
      <strong style="margin-right: 10px">
        {{ dataMovie?.name ? dataMovie?.name : dataMovie?.title }}
        - Tập
        {{ $route.params?.tap?.replace('tap-', '') }}
        |
        {{
          dataSeason?.name?.split(' ')[0] === 'Phần' ||
          dataSeason?.name === 'Specials'
            ? dataSeason?.name
            : dataSeason?.name?.replace('Season', 'Phần')
        }}
      </strong>
      <a-select
        ref="select"
        v-model:value="selectedSeason"
        style="width: 150px"
        @change="handleChange"
      >
        <a-select-option
          v-for="(item, index) in dataMovie.seasons"
          :key="item?.id"
          :index="index"
          :value="item?.season_number"
          >{{
            item.name?.split(' ')[0] === 'Phần' || item.name === 'Specials'
              ? item.name
              : item.name.replace('Season', 'Phần')
          }}
        </a-select-option>
      </a-select>
    </h3>

    <!-- <h3 class="section-title width-fit" style="margin: 0px 15px 10px 0px">
      <strong> Chọn phần</strong>
    </h3> -->

    <div
      v-if="loading"
      class="ul-list"
      v-loading="loading"
      element-loading-text="Đang tải tập..."
    >
      <a-skeleton-button
        :active="true"
        :shape="'default'"
        v-for="(item, index) in dataSeason?.episodes?.slice(
          0,
          dataMovie?.last_episode_to_air?.season_number == selectedSeason
            ? dataMovie?.last_episode_to_air?.episode_number
            : dataSeason?.episodes.length
        )"
        :index="index"
        :key="index"
      >
      </a-skeleton-button>
    </div>

    <ul class="ul-list" v-else>
      <li
        v-for="(item, index) in dataSeason?.episodes?.slice(
          0,
          dataMovie?.last_episode_to_air?.season_number == selectedSeason
            ? dataMovie?.last_episode_to_air?.episode_number
            : dataSeason?.episodes.length
        )"
        :index="index"
        :key="item.id"
        :class="{ active: currentEpisode == item?.episode_number }"
      >
        <router-link
          v-if="dataMovie?.id"
          :to="{
            name: 'playtv',
            params: {
              id: dataMovie?.id,
              name: dataMovie?.name
                ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              tap: `tap-${item.episode_number}`,
            },
          }"
        >
          {{
            item?.episode_number === dataSeason?.episodes.length
              ? item?.episode_number < 10
                ? '0' + item?.episode_number + '-End'
                : item?.episode_number + '-End'
              : +item?.episode_number < 10
              ? '0' + item?.episode_number
              : item?.episode_number
          }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch, computed } from 'vue';
import axios from 'axios';
import { getMoviesBySeason } from '../../services/MovieService';
import { useRoute, useRouter } from 'vue-router';

export default {
  props: {
    dataMovie: Object,
    numberOfEpisodes: Number,
  },
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const dataSeason = ref({});
    const selectedSeason = ref(props?.dataMovie?.number_of_seasons);

    const currentEpisode = computed(() =>
      route.params?.tap?.replace('tap-', '')
        ? +route.params?.tap?.replace('tap-', '')
        : 1
    );
    const loading = ref(false);

    const emitUrlCode = (dataSeason) => {
      const url_code_movie = dataSeason.episodes?.find(
        (item) => item.episode_number == currentEpisode.value
      )?.url_code;

      emit('setUrlCodeMovie', url_code_movie);
    };

    onBeforeMount(() => {
      loading.value = true;

      getMoviesBySeason(route.params?.id, selectedSeason.value)
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;
          emitUrlCode(dataSeason.value);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      setTimeout(() => {
        loading.value = false;
      }, 1500);
    });

    const handleChange = (value) => {
      selectedSeason.value = value;
    };

    watch(selectedSeason, () => {
      loading.value = true;
      router.push({ params: { tap: 'tap-1' } });

      getMoviesBySeason(route.params?.id, selectedSeason.value)
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;

          emitUrlCode(dataSeason.value);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });

    watch(route, () => {
      // currentEpisode.value = +newVal.params?.tap?.replace('tap-', '');
      emitUrlCode(dataSeason.value);
    });

    return {
      dataSeason,
      selectedSeason,
      currentEpisode,
      loading,
      handleChange,
    };
  },
};
</script>

<style scoped lang="scss" src="./ListEpisodes.scss"></style>
