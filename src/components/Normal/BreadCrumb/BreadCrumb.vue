<template>
  <a-breadcrumb style="">
    <a-breadcrumb-item>
      <router-link :to="{ path: '/' }"> Trang chủ </router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="!path.length">{{ '' }}</a-breadcrumb-item>

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
        >{{ item?.name?.replaceAll('+', ' ') }}</router-link
      >
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getGenresNameByShortName } from '@/services/MovieService';
// import ALLCOUNTRY from '../constants/Country';

export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    // path.value = route.path.slice(1).replaceAll('/', ', ').split(', ');

    const path = computed(() => {
      const breadList = [];

      switch (
        route.path
          .replaceAll(route.params?.slug ? route.params?.slug : '', '')
          .replaceAll(route.params?.slug2 ? route.params?.slug2 : '', '')
          .replaceAll(route.params?.id ? route.params?.id : '', '')
          .replaceAll(route.params?.name ? route.params?.name : '', '')
          .replaceAll('/', '')
      ) {
        case 'follow':
          breadList.push({ params: 'follow', name: 'Theo dõi' });
          break;
        case 'ranking':
          breadList.push({ params: 'ranking', name: 'Xếp hạng' });
          break;
        case 'discover':
          breadList.push({ params: 'discover', name: 'Khám phá' });
          break;
        case 'info':
          breadList.push({ params: 'info', name: 'Thông tin' });
          break;
        case 'play':
          breadList.push({ params: 'play', name: 'Xem phim' });
          break;
        default:
          break;
      }

      switch (route.params?.slug) {
        case 'movie':
          breadList.push({ params: 'movie', name: 'Phim lẻ' });
          break;
        case 'tv':
          breadList.push({ params: 'tv', name: 'Phim bộ' });
          break;
        case 'genres':
          breadList.push({
            params: 'genres',
            // name: route.params?.slug2
            name: getGenresNameByShortName(
              route.params?.slug2,
              store.state?.allGenres
            )?.name_vietsub,
          });
          break;
        case 'years':
          breadList.push({ params: 'years', name: route.params?.slug2 });
          break;
        case 'countries':
          breadList.push({
            params: 'countries',
            // name: store.state.breadCrumbValue,
            name: store.state.allCountries.find(
              (country) => country.short_name === route.params?.slug2
            )?.name,
          });
          break;
        default:
          break;
      }

      if (route.params?.name) {
        breadList.push({ params: 'years', name: route.params.name });
      }

      return breadList;
    });

    return { path };
  },
};
</script>

<style scoped lang="scss" src="./BreadCrumb.scss"></style>
