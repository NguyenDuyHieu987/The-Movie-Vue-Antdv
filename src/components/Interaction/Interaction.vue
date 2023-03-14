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
      hashtags="phimhay247.site,vite"
      style="white-space: nowrap; display: block"
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

<style lang="scss" scoped src="./Interaction.scss"></style>
