<template>
  <router-link
    :to="{
      name: item?.media_type == 'movie' ? 'info' : 'infoTV',
      params: {
        id: item?.id,
        name: item?.name?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="topic-item"
  >
    <el-image
      :src="getBackdrop(item?.backdrop_path)"
      :preview="false"
      loading="lazy"
    >
    </el-image>

    <div class="topic-item-info">
      <div class="topic-item-info-head">
        <img class="pngegg" src="/images/pngegg.png" />
        <p>
          <span class="release-date" v-if="item.media_type == 'movie'">
            {{ item?.release_date }}
          </span>
          <span v-else class="release-date">
            {{
              item?.last_air_date ? item?.last_air_date : item?.first_air_date
            }}
          </span>

          <span class="genres">
            {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
          </span>
        </p>
      </div>

      <h1 class="title">
        {{ item?.name }}
      </h1>

      <p class="overview">{{ item?.overview }}</p>
    </div>
  </router-link>
</template>
<script>
import { ref } from 'vue';
// import axios from 'axios';
import { getAllGenresById, getBackdrop } from '@/services/MovieService';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  setup() {
    const genresName = ref([]);
    const loading = ref(false);

    return {
      loading,
      genresName,
      getBackdrop,
      getAllGenresById,
    };
  },
};
</script>

<style lang="scss" src="./SlideTopicItem.scss"></style>
