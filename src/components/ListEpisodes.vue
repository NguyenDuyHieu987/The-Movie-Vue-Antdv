<template>
  <div class="list-episodes">
    <div class="control-episodes">
      <a-button
        size="large"
        :disabled="currentEpisode == 1"
        @click="$router.push({ params: { tap: `tap-${--currentEpisode}` } })"
      >
        Tập trước
      </a-button>
      <a-button
        size="large"
        :disabled="
          dataMovie?.last_episode_to_air?.season_number == selectedSeason
            ? currentEpisode == dataMovie?.last_episode_to_air?.episode_number
            : currentEpisode == dataSeason?.episodes?.length
        "
        @click="$router.push({ params: { tap: `tap-${++currentEpisode}` } })"
      >
        Tập tiếp
      </a-button>
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
        @focus="focus"
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

    <div v-if="loading" class="ul-list">
      <a-skeleton-button
        :active="true"
        :size="size"
        :shape="'default'"
        :block="block"
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
            name: 'play',
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
              : item?.episode_number < 10
              ? '0' + item?.episode_number
              : item?.episode_number
          }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from 'vue';
import axios from 'axios';
import { getMoviesBySeason } from '../services/MovieService';
import { useRoute, useRouter } from 'vue-router';

export default {
  props: {
    dataMovie: Object,
    numberOfEpisodes: Number,
  },
  setup(props, { emit }) {
    const dataSeason = ref({});
    const selectedSeason = ref(props?.dataMovie?.number_of_seasons);
    const route = useRoute();
    const router = useRouter();

    const currentEpisode = ref(
      route.params?.tap.replace('tap-', '')
        ? +route.params?.tap.replace('tap-', '')
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

    watch(route, (newVal) => {
      currentEpisode.value = +newVal.params?.tap?.replace('tap-', '');
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

<style scoped lang="scss">
.list-episodes {
  margin-top: 15px;

  .control-episodes {
    display: flex;
    justify-content: center;
  }

  .ul-list,
  ul {
    // display: flex;
    // flex-direction: row;
    list-style-type: none;
    margin-top: 7px;
    padding-left: 15px;
    padding-bottom: 7px;
    overflow: hidden;

    & > li,
    li + li {
      margin-top: 7px;
      margin-right: 7px;
    }

    li {
      float: left;

      a {
        padding: 7px 23px;
        color: #fff;
        transition: all 0.5s;
        border-radius: 3px;
        white-space: nowrap;
        vertical-align: middle;
        display: inline-block;
        // background-color: #00516c;
        background-image: linear-gradient(
          to right,
          #006a88,
          var(--sider-header-background-color2),
          var(--sider-header-background-color1)
        );
        background-size: 200% 100%;

        &:hover {
          //   background-color: #006b8fb0;
          background-size: 200% 100%;
          background-position: -65px center;
        }
      }
      &.active {
        a {
          background-image: none;
          background-color: #006a88;
          transition: all 0.7s ease;
          animation: episode-fade-out 2s infinite linear;
        }

        @keyframes episode-fade-out {
          0% {
            box-shadow: 0 0 0 0 #006a88;
          }
          40% {
            box-shadow: 0 0 0 5px #004b5f;
          }
          80% {
            box-shadow: 0 0 0 5px #003746;
          }
          100% {
            box-shadow: 0 0 0 5px #001d25;
          }
        }
      }
    }
  }
}
</style>
