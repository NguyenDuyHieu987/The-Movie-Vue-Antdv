<template>
  <div class="like-share">
    <div
      class="fb-like"
      data-href="https://www.youtube.com/watch?v=2KptY2bFBXA"
      data-width=""
      data-layout=""
      data-action=""
      data-size=""
      data-share="true"
    ></div>

    <ShareNetwork
      network="facebook"
      :url="urlShare"
      title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
      description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
      quote="The hot reload is so fast it\'s near instant. - Evan You"
      hashtags="vuejs,vite"
    >
      <span>Chia sẻ</span>
    </ShareNetwork>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {},
  setup() {
    const route = useRoute();

    const urlShare = computed(() => [route.path]);

    return { urlShare };
  },
};
</script>

<style lang="scss" scoped>
.like-share {
  margin-top: 10px;
  // display: flex;
  // flex-direction: row;

  a {
    color: #fff;
    padding: 5px 10px;
    background-color: #0072ca;
    border-radius: 3px;
    transition: all 0.3s;

    &:hover {
      background-color: #0072caa6;
    }
  }
}
</style>
