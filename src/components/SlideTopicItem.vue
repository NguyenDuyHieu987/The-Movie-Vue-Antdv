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
      v-lazy="
        getPoster(item?.backdrop_path ? item?.backdrop_path : item?.poster_path)
      "
      loading="lazy"
      @load="onLoadImage"
    >
    </el-image>

    <div class="topic-item-info">
      <div class="topic-item-info-head">
        <img class="pngegg" src="../assets/images/pngegg.png" />
        <p>
          <span class="release-date">
            {{ item?.release_date ? item?.release_date : item?.last_air_date }}
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
import { getAllGenresById, getPoster } from '../services/MovieService';

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

<style lang="scss">
@media only screen and (max-width: 900px) {
  .topic-item {
    .overview {
      -webkit-line-clamp: 2 !important;
    }
    .topic-item-info {
      h1 {
        font-size: 3em !important;
      }
    }
  }
}

.topic-item {
  font-size: 10px;
  height: 100%;

  .ant-image,
  .el-image {
    // height: 82vh;
    height: 100%;
    width: 100%;

    img {
      object-fit: cover;
      height: 100%;
    }
  }

  .topic-item-info {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 50px;
    transition: opacity 0.85s ease-in-out;
    color: #fff;

    .topic-item-info-head {
      display: flex;
      flex-direction: row;
      align-items: center;

      p {
        max-width: 70%;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        display: -webkit-box;
      }

      span {
        margin-left: 20px;
        font-size: 2em;
      }
    }

    h1 {
      font-size: 3.5em;
      font-weight: bold;
      max-width: 70%;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
    }

    .overview {
      margin-top: 10px;
      font-size: 1.6em;
      max-width: 70%;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
    }
  }
}
</style>
