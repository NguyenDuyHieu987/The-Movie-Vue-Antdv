<template>
  <a-carousel
    :arrows="true"
    :autoplay="true"
    :dots="false"
    effect="fade"
    v-show="trendings?.length"
  >
    <template #prevArrow>
      <div class="custom-slick-arrow">
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow">
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </div>
    </template>
    <div v-for="(item, index) in trendings || []" :index="index" :key="item.id">
      <SlideTopicItem :item="item" />
    </div>
  </a-carousel>

  <el-carousel
    :interval="3000"
    type="card"
    height="80vh"
    loop
    trigger="click"
    v-show="trendings?.length"
  >
    <el-carousel-item
      v-for="(item, index) in trendings || []"
      :key="item.id"
      :index="index"
    >
      <SlideTopicItem :item="item" />
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import { onBeforeMount, ref } from 'vue';
import axios from 'axios';
import SlideTopicItem from '@/components/SlideTopicItem.vue';
import { getTrending } from '../services/MovieService';

export default {
  components: { SlideTopicItem },
  setup() {
    const trendings = ref([]);

    onBeforeMount(() => {
      getTrending(1)
        .then((response) => {
          trendings.value = response.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return {
      trendings,
    };
  },
};
</script>
<style lang="scss">
@media only screen and (min-width: 1500px) {
  .ant-carousel {
    .slick-prev {
      top: 44% !important;
    }
  }
}

@media only screen and (max-width: 1900px) {
  .el-carousel {
    .el-carousel__container {
      height: 60vh !important;
    }
  }
  .ant-carousel {
    .slick-track {
      height: 70vh !important;
    }
  }
}

@media only screen and (max-width: 1670px) {
  .el-carousel {
    .el-carousel__container {
      height: 55vh !important;
    }
  }
  .ant-carousel {
    .slick-track {
      height: 65vh !important;
    }
  }
}

@media only screen and (max-width: 1500px) {
  .el-carousel {
    .el-carousel__container {
      height: 520px !important;
    }
  }

  .ant-carousel {
    .slick-track {
      height: 550px !important;
    }
  }
}

@media only screen and (max-width: 1300px) {
  .el-carousel {
    .el-carousel__container {
      height: 500px !important;
    }
  }

  .ant-carousel {
    .slick-track {
      height: 500px !important;
    }
  }
}

@media only screen and (max-width: 1150px) {
  .el-carousel {
    .el-carousel__container {
      height: 450px !important;
    }
  }
}

@media only screen and (max-width: 1000px) {
  .el-carousel {
    .el-carousel__container {
      height: 400px !important;
    }
  }

  .ant-carousel {
    .slick-track {
      font-size: 9px;
      height: 450px !important;
      transition: all 0.3s;
    }

    .topic-item {
      font-size: 9px;
    }

    .slick-prev {
      top: 38% !important;
    }
  }
}

@media only screen and (max-width: 900px) {
  .el-carousel {
    .el-carousel__container {
      height: 350px !important;
    }
  }

  .ant-carousel {
    .slick-track {
      height: 400px !important;
      transition: all 0.3s;
    }

    .topic-item {
      .topic-item-info {
        left: 30px;
      }
    }

    .slick-prev {
      top: 37% !important;
    }
  }
}

@media only screen and (max-width: 790px) {
  .ant-carousel {
    .slick-track {
      height: 350px !important;
      transition: all 0.3s;
    }

    .topic-item {
      font-size: 8px;
      .topic-item-info {
        left: 20px;
      }
    }

    .slick-prev {
      font-size: 1.5em !important;
      left: calc(100% - 60px) !important;
    }

    .slick-next {
      right: 40px !important;
      font-size: 1.5em !important;
    }

    .fa-chevron-right,
    .fa-chevron-left {
      padding: 10px 17px !important;
    }

    .pngegg {
      height: 40px;
    }
  }
}

@media only screen and (max-width: 530px) {
  .ant-carousel {
    .slick-track {
      height: 300px !important;
      transition: all 0.3s;
    }

    .topic-item {
      font-size: 8px;
      .topic-item-info {
        left: 15px;
      }
    }

    .slick-prev {
      top: 36% !important;
      font-size: 1.3em !important;
    }

    .slick-next {
      font-size: 1.3em !important;
    }
  }
}

@media only screen and (max-width: 435px) {
  .ant-carousel {
    .slick-track {
      height: 250px !important;
      transition: all 0.3s;
    }

    .slick-prev {
      top: 34% !important;
    }
  }
}

.ant-carousel {
  display: none;
  .slick-list .slick-slide > div > div {
    height: 100%;
  }
}

.el-carousel {
  .el-carousel__item {
    border-radius: 5px;
    box-shadow: 0 3px 6px -4px #000000ba, 0 6px 16px 0 #00000098,
      0 9px 28px 8px #00000077;
  }

  .el-carousel__item--card {
    width: 70%;
    margin-left: -10%;
  }

  .el-carousel__indicators {
    margin-top: 10px;

    .el-carousel__button {
      height: 5px;
    }
  }

  .el-carousel__arrow {
    background-color: #00000063;
    padding: 22px;
    border-radius: 5px;

    .el-icon {
      font-size: 1.8rem;
    }

    &:hover {
      background-color: #00000088;
    }
  }
}
</style>
