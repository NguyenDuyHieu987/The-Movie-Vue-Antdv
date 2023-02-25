<template>
  <a-breadcrumb style="">
    <a-breadcrumb-item
      ><router-link :to="{ path: '/' }"> Trang chủ </router-link>
    </a-breadcrumb-item>
    <!-- <a-breadcrumb-item>
      <a :href="this.$route.path"
        >{{ $route.params.name?.replaceAll('+', ' ') }}
      </a>
      <a :href="this.$route.path" v-if="this.$route.path == '/'"> </a>
      <a :href="this.$route.path" v-else>{{
        this.$route.path.charAt(1).toUpperCase() + this.$route.path.slice(2)
      }}</a>
    </a-breadcrumb-item> -->
    <a-breadcrumb-item
      v-for="(item, index) in path"
      :index="index"
      :key="index"
    >
      <router-link
        :to="{ path: $route.path }"
        style="text-transform: capitalize"
        >{{ item?.replaceAll('+', ' ') }}</router-link
      >
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
export default {
  setup() {
    const route = useRoute();

    // path.value = route.path.slice(1).replaceAll('/', ', ').split(', ');

    const path = computed(() => [route.params.name]);

    return { path };
  },
};
</script>

<style scoped lang="scss">
.ant-breadcrumb {
  padding: 15px 30px;
  background-color: var(--breadcrumb-background-color);
  border-bottom: 1px solid var(--border-regular);
}

@media only screen and (max-width: 900px) {
  .ant-breadcrumb {
    padding: 15px 15px;
  }
}
</style>
