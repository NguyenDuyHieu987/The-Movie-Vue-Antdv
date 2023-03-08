<template>
  <div class="like-share">
    <div
      class="fb-like"
      :data-href="urlShare"
      data-width=""
      data-layout=""
      data-action=""
      data-size=""
      data-share="true"
    ></div>

    <ShareNetwork
      network="facebook"
      :url="urlShare"
      :title="dataMovie?.name ? dataMovie?.name : dataMovie?.title"
      :description="dataMovie?.overview"
      quote="The hot reload is so fast it\'s near instant. - Evan You"
      hashtags="phimhay247,vite"
      style="white-space: nowrap"
    >
      <a-button round type="primary" shape="round">
        <template #icon>
          <share-alt-outlined />
        </template>
        Chia sẻ
      </a-button>
    </ShareNetwork>
  </div>
</template>

<script>
import { computed } from 'vue';
// import { useRoute } from 'vue-router';
import { ShareAltOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    ShareAltOutlined,
  },
  props: {
    dataMovie: Object,
  },
  setup() {
    // const route = useRoute();

    // alert(window.location);
    const urlShare = computed(() => window.location);
    // alert(encodeURIComponent(urlShare.value));

    return { urlShare };
  },
};
</script>

<style lang="scss" scoped>
.like-share {
  margin-top: 10px;
  // display: flex;
  // flex-direction: column;

  // a {
  //   color: #fff;
  //   padding: 5px 10px;
  //   background-color: #0072ca;
  //   border-radius: 3px;
  //   transition: all 0.3s;

  //   &:hover {
  //     background-color: #0072caa6;
  //   }
  // }
}
</style>
