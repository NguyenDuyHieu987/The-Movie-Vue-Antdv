<template>
  <router-link
    v-if="item?.id"
    :to="{
      name: 'info',
      params: {
        id: item?.id,
        name: item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="topic-item"
  >
    <el-image
      :src="
        getPoster(item?.backdrop_path ? item?.backdrop_path : item?.poster_path)
      "
      :preview="false"
      loading="lazy"
      @load="onLoadImage"
    >
    </el-image>

    <div class="topic-item-info">
      <div class="topic-item-info-head">
        <img class="pngegg" src="@/assets/images/pngegg.png" />
        <p>
          <span class="release-date">
            {{
              item?.release_date
                ? item?.release_date
                : item?.last_air_date
                ? item?.last_air_date
                : item?.first_air_date
            }}
          </span>

          <span class="genres">
            {{
              getAllGenresById(item?.genre_ids, $store.state?.allGenres).join(
                ' • '
              )
            }}
          </span>
          <!-- {{ getAllGenresById(item?.genres).join(' • ') }} -->
          <!-- <span class="genres" v--else-if="data?.genres">
              {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
            </span> -->
        </p>
      </div>
      <h1 class="title">
        {{ item?.name ? item?.name : item?.title }}
      </h1>
      <p class="overview">{{ item?.overview }}</p>
    </div>
  </router-link>
</template>
<script>
import { ref } from 'vue';
// import axios from 'axios';
import { getAllGenresById, getPoster } from '../../services/MovieService';

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

    const onLoadImage = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      });
    };

    return {
      loading,
      genresName,
      getPoster,
      getAllGenresById,
      onLoadImage,
    };
  },
};
</script>

<style lang="scss" src="./SlideTopicItem.scss"></style>
