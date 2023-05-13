<template>
  <carousel
    v-if="data?.length"
    class="carousel-group"
    :items="5"
    :autoplay="true"
    :dots="false"
    :autoplayHoverPause="true"
    :autoplayTimeout="10000"
    :margin="7"
    :autoplaySpeed="500"
    :nav="false"
    :responsive="responsive"
  >
    <slot name="content" />

    <template #prev>
      <div class="owl-prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </div>
    </template>
    <template #next>
      <div class="owl-next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8L4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>
    </template>
  </carousel>
</template>

<script>
import carousel from 'vue-owl-carousel/src/Carousel';
export default {
  components: { carousel },
  props: {
    data: {
      type: Array,
    },
    responsive: {
      type: Object,
    },
  },
  setup() {
    return;
  },
};
</script>

<style lang="scss" src="./CarouselGroup.scss"></style>
