<template>
  <div class="list-episodes">
    <h3 class="section-title" style="display: flex; align-items: center">
      <strong style="margin-right: 10px">
        {{ dataMovie?.name ? dataMovie?.name : dataMovie?.title }}
        - Tập
        {{ $route.query?.ep?.replace('tap-', '') }}
        |
        <!-- Phần -->
      </strong>
      <a-select
        ref="select"
        :value="selectedSeason"
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
            item.name.split(' ')[0] === 'Phần' || item.name === 'Specials'
              ? item.name
              : item.name.replace('Season', 'Phần')
          }}
        </a-select-option>
      </a-select>
    </h3>

    <!-- <h3 class="section-title width-fit" style="margin: 0px 15px 10px 0px">
      <strong> Chọn phần</strong>
    </h3> -->

    <ul>
      <li
        v-for="(item, index) in dataSeason?.episodes"
        :index="index"
        :key="index"
        :class="{ active: currentEpisode == item.episode_number }"
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
              // tap: 'tap-1',
            },
            query: {
              ep: `tap-${item.episode_number}`,
            },
          }"
        >
          {{
            item?.episode_number === dataSeason?.episodes?.length
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
import { useRoute } from 'vue-router';

export default {
  props: {
    dataMovie: Object,
  },
  setup(props) {
    const dataSeason = ref({});
    const selectedSeason = ref(props?.dataMovie?.number_of_seasons);
    const route = useRoute();
    const currentEpisode = ref(
      route.query?.ep.replace('tap-', '')
        ? +route.query?.ep.replace('tap-', '')
        : 1
    );

    onBeforeMount(() => {
      getMoviesBySeason(route.params?.id, selectedSeason.value)
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const handleChange = (value) => {
      selectedSeason.value = value;
    };

    watch(selectedSeason, () => {
      getMoviesBySeason(route.params?.id, selectedSeason.value)
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return { dataSeason, selectedSeason, currentEpisode, handleChange };
  },
};
</script>

<style scoped lang="scss">
.list-episodes {
  margin-top: 15px;

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
