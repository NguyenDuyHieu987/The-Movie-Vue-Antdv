<template>
  <div class="home">
    <SlideTopicHome />
  </div>
</template>

<script>
// @ is an alias to /src
import SlideTopicHome from '@/components/SlideTopicHome.vue';

export default {
  name: 'Home',
  components: {
    SlideTopicHome,
  },
  setup() {
    document.title = 'Phimhay247';
  },
};
</script>
