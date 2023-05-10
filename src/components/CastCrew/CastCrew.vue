<template>
  <div class="cast-crew">
    <a-tabs v-model:activeKey="activeTabCast" v-show="dataCredit?.cast?.length">
      <a-tab-pane key="1" tab="Diễn viên">
        <carousel
          v-if="dataCredit?.cast?.length"
          class="carousel-group"
          :items="4"
          :autoplay="true"
          :dots="false"
          :autoplayHoverPause="true"
          :autoplayTimeout="5000"
          :margin="7"
          :autoplaySpeed="500"
          :nav="false"
          :responsive="responsiveCarousel"
        >
          <CastCard
            v-for="(item, index) in dataCredit?.cast"
            :item="item"
            :index="index"
            :key="item.id"
            :loading="loading"
          />
          <template #prev>
            <div class="owl-prev">
              <font-awesome-icon icon="fa-solid fa-chevron-left" />
            </div>
          </template>
          <template #next>
            <div class="owl-next">
              <font-awesome-icon icon="fa-solid fa-chevron-right" />
            </div>
          </template>
        </carousel>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Đội ngũ" force-render>
        <carousel
          v-if="dataCredit?.crew?.length"
          class="carousel-group"
          :items="4"
          :autoplay="true"
          :loop="true"
          :dots="false"
          :autoplayHoverPause="true"
          :autoplayTimeout="5000"
          :margin="7"
          :autoplaySpeed="500"
          :nav="false"
          :responsive="responsiveCarousel"
        >
          <CastCard
            v-for="(item, index) in dataCredit?.crew"
            :item="item"
            :index="index"
            :key="item.id"
            :loading="loading"
          />
          <template #prev>
            <div class="owl-prev">
              <font-awesome-icon icon="fa-solid fa-chevron-left" />
            </div>
          </template>
          <template #next>
            <div class="owl-next">
              <font-awesome-icon icon="fa-solid fa-chevron-right" />
            </div>
          </template>
        </carousel>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { ref } from 'vue';
import carousel from 'vue-owl-carousel/src/Carousel';
import CastCard from '@/components/CastCard/CastCard.vue';

export default {
  components: {
    carousel,
    CastCard,
  },
  props: {
    dataCredit: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
  },
  setup() {
    const activeTabCast = ref('1');
    const responsiveCarousel = ref({
      0: {
        items: 2,
      },
      520: {
        items: 3,
      },
      750: {
        items: 4,
      },
      830: {
        items: 4,
      },
      1000: {
        items: 5,
      },
      1175: {
        items: 6,
      },
      1300: {
        items: 6,
      },
      1400: {
        items: 7,
      },
      1500: {
        items: 8,
      },
      1700: {
        items: 9,
      },
      2000: {
        items: 10,
      },
      2200: {
        items: 12,
      },
    });

    return {
      activeTabCast,
      responsiveCarousel,
    };
  },
};
</script>
