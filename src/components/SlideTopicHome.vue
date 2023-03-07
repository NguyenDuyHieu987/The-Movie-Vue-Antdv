<template>
  <a-carousel :arrows="true" :autoplay="true" :dots="false" effect="fade">
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

    <SlideTopicItem
      v-for="(item, index) in trendings"
      :index="index"
      :key="item.id"
      :item="item"
    />
  </a-carousel>
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
  .ant-carousel {
    .slick-track {
      height: 70vh !important;
    }
  }
}

@media only screen and (max-width: 1670px) {
  .ant-carousel {
    .slick-track {
      height: 65vh !important;
    }
  }
}

@media only screen and (max-width: 1500px) {
  .ant-carousel {
    .slick-track {
      height: 550px !important;
    }
  }
}

@media only screen and (max-width: 1300px) {
  .ant-carousel {
    .slick-track {
      height: 500px !important;
    }
  }
}

@media only screen and (max-width: 1000px) {
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
</style>
