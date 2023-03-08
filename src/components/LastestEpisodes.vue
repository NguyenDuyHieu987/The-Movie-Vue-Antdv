<template>
  <div class="lastest-episodes">
    <h3 class="section-title">
      <strong>Tập mới nhất</strong>
    </h3>

    <div v-if="loading" class="list-lastest-episodes skeleton">
      <a-skeleton-button
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
          .slice(0, dataMovie?.last_episode_to_air?.episode_number)
          .slice(-10)
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
import { getMoviesBySeason } from '../services/MovieService';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  props: {
    dataMovie: Object,
    numberOfEpisodes: Number,
    loading: Boolean,
  },
  components: {},
  setup(props) {
    const route = useRoute();
    const dataSeason = ref({});

    onBeforeMount(() => {
      getMoviesBySeason(
        route.params?.id,
        props.dataMovie?.last_episode_to_air?.season_number
      )
        .then((episodesRespones) => {
          dataSeason.value = episodesRespones?.data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });
    return { dataSeason };
  },
};
</script>

<style scoped lang="scss">
.lastest-episodes {
  margin-top: 15px;

  .list-lastest-episodes.skeleton {
    .ant-skeleton {
      margin: 7px 7px 0px 0px;
    }
  }

  ul,
  .list-lastest-episodes {
    // display: flex;
    // flex-direction: row;
    overflow: hidden;
    list-style-type: none;
    margin-top: 7px;
    padding: 0px 10px;

    & > li,
    li + li {
      margin-top: 7px;
      margin-right: 7px;
    }

    li {
      float: left;

      a {
        padding: 7px 15px;
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
          background-position: -75px center;
        }
      }
    }
  }
}
</style>
