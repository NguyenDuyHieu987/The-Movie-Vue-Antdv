<template>
  <div class="slide-topic-home">
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
      <div v-for="(item, index) in trendings" :index="index" :key="item.id">
        <SlideTopicItem :item="item" />
      </div>
    </a-carousel>

    <div class="overlay-backdrop">
      <img :src="getPoster('/vgLBiFtDCf33W5adaXnSkCtSwgl.jpg')" />
    </div>

    <el-carousel
      :interval="3000"
      type="card"
      height="80vh"
      loop
      trigger="click"
    >
      <el-carousel-item
        v-for="(item, index) in trendings"
        :key="item.id"
        :index="index"
      >
        <SlideTopicItem :item="item" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import { onBeforeMount, ref, onMounted } from 'vue';
import axios from 'axios';
import SlideTopicItem from '../SlideTopicItem/SlideTopicItem.vue';
import { getTrending, getPoster } from '@/services/MovieService';

export default {
  components: { SlideTopicItem },
  setup() {
    const trendings = ref([]);

    onMounted(() => {
      const el_carousel_btn = document.querySelectorAll('.el-carousel__arrow');
      const overlay_backdrop =
        document.getElementsByClassName('overlay-backdrop')[0];
      const img_overlay_backdrop = overlay_backdrop.querySelector('img');

      el_carousel_btn?.forEach((btn) => {
        btn.addEventListener('click', () => {
          const img_silde_topic_item_active = document.querySelector(
            '.el-carousel__item.is-active .el-image img'
          );
          img_overlay_backdrop.src = img_silde_topic_item_active.src;
        });
      });
    });

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
      getPoster,
    };
  },
};
</script>
<style lang="scss" src="./SlideTopicHome.scss"></style>
