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
import SlideTopicItem from '@/components/SlideTopicItem/SlideTopicItem.vue';
import { getTrending } from '../../services/MovieService';

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
<style lang="scss" src="./SlideTopicHome.scss"></style>
