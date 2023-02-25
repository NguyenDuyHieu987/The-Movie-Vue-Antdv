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
        <img class="pngegg" src="../assets/images/pngegg.png" />
        <p>
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

    .topic-item-info {
      left: 30px;
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

    .topic-item-info {
      left: 20px;
    }
  }

  .ant-carousel .slick-prev {
    font-size: 1.5em !important;
  }

  .ant-carousel .slick-next {
    font-size: 1.5em !important;
  }

  .pngegg {
    height: 40px;
  }
}

@media only screen and (max-width: 530px) {
  .topic-item {
    font-size: 7px;

    .ant-image {
      height: 300px;
      transition: all 0.3s;
    }

    .topic-item-info {
      left: 15px;
    }
  }

  .ant-carousel .slick-prev {
    font-size: 1.3em !important;
    left: calc(100% - 65px) !important;
  }

  .ant-carousel .slick-next {
    font-size: 1.3em !important;
    right: 45px !important;
  }
}

@media only screen and (max-width: 435px) {
  .topic-item {
    font-size: 7px;

    .ant-image {
      height: 250px;
      transition: all 0.3s;
    }
  }

  .ant-carousel .slick-prev {
    font-size: 1.3em !important;
  }

  .ant-carousel .slick-next {
    font-size: 1.3em !important;
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
</style>
