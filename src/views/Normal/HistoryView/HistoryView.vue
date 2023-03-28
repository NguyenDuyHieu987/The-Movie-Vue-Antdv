<template>
  <div class="history">
    <div v-if="isLogin" class="history-container">
      <h2 class="gradient-title-default">
        <strong>Lịch sử xem</strong>
      </h2>
      <section class="movie-history" v-show="dataHistory?.length">
        <MovieCardHorizontalHistory
          v-for="(item, index) in dataHistory"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item?.media_type"
        />
      </section>
    </div>

    <a-result v-else title="Bạn cần đăng nhập để sử dụng chức năng này">
      <template #extra>
        <a-button
          key="console"
          size="large"
          @click="$router.push({ path: '/login' })"
          >Đăng nhập ngay
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { watch, onBeforeMount, computed, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MovieCardHorizontalHistory from '@/components/Normal/MovieCardHorizontalHistory/MovieCardHorizontalHistory.vue';
import {
  getMovies,
  // getWatchList,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';

export default {
  components: { MovieCardHorizontalHistory },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const dataList = ref([]);
    const dataHistory = ref([]);
    const internalInstance = getCurrentInstance();

    // document.title = 'Phimhay247 - Theo dõi';
    useMeta({
      title: '`Phimhay247 - Lịch sử xem',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    const getData = () => {
      internalInstance.appContext.config.globalProperties.$Progress.start();

      getMovies(1)
        .then((movieRespone) => {
          dataHistory.value = movieRespone.data?.results?.reverse();

          setTimeout(() => {
            internalInstance.appContext.config.globalProperties.$Progress.finish();
          }, 500);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      getData();
    });

    const getDataWhenRemoveList = (data) => {
      dataList.value = data;
    };

    const getDataWhenRemoveHistory = (data) => {
      dataHistory.value = data;
    };

    watch(route, () => {
      // getData();
    });

    return {
      isLogin,
      dataHistory,
      getData,
      getDataWhenRemoveList,
      getDataWhenRemoveHistory,
    };
  },
  // beforeRouteEnter() {
  //   alert('g');
  // },
};
</script>

<style lang="scss" src="./HistoryView.scss"></style>
