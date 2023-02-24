<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="topic-item"
  >
    <a-image
      :src="
        getPoster(item?.backdrop_path ? item?.backdrop_path : item?.poster_path)
      "
      :preview="false"
    >
      <!-- <template #placeholder>
        <a-image
          :src="
            getPoster(
              item?.backdrop_path ? item?.backdrop_path : item?.poster_path
            )
          "
          :preview="false"
        />
      </template> -->
    </a-image>
    <div class="topic-item-info">
      <div class="topic-item-info-head">
        <img src="../assets/images/pngegg.png" />
        <span class="release-date">
          {{
            item?.release_date
              ? item?.release_date?.slice(0, 4)
              : item?.first_air_date?.slice(0, 4)
          }}
        </span>
        <span class="genres">{{
          getAllGenresById(item?.genre_ids).join(' • ')
        }}</span>
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

    return {
      genresName,
      getPoster,
      getAllGenresById,
    };
  },
};
</script>
<style lang="scss">
.topic-item {
  font-size: 10px;

  .ant-image {
    height: 550px;
    width: 100%;
    img {
      object-fit: cover;
      height: 100%;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .topic-item {
    font-size: 9px;

    .ant-image {
      height: 450px;
      transition: all 0.3s;
    }
  }

  .ant-carousel .slick-prev {
    top: 38% !important;
  }
}

@media only screen and (max-width: 900px) {
  .topic-item {
    .ant-image {
      height: 400px;
      transition: all 0.3s;
    }
  }

  .ant-carousel .slick-prev {
    top: 37% !important;
  }
}

@media only screen and (max-width: 790px) {
  .topic-item {
    font-size: 8px;

    .ant-image {
      height: 350px;
      transition: all 0.3s;
    }
  }

  .ant-carousel .slick-prev {
    font-size: 1.5em !important;
  }

  .ant-carousel .slick-next {
    font-size: 1.5em !important;
  }
}

.topic-item-info {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50px;
  transition: opacity 0.85s ease-in-out;
  color: #fff;
  max-width: 70%;

  .topic-item-info-head {
    display: flex;
    flex-direction: row;
    align-items: center;

    span {
      margin-left: 20px;
      font-size: 2em;
    }
  }

  h1 {
    font-size: 3.5em;
    font-weight: bold;
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
</style>
