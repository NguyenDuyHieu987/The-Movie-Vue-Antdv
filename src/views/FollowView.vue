<template>
  <div class="follow">
    <div v-if="isLogin" class="follow-container">
      <a-tabs v-model:activeKey="activeTabList">
        <a-tab-pane key="list" :tab="metaHead">
          <section
            v-if="dataList?.length"
            class="movie-group"
            :class="{ collapse: $store.state.collapsed }"
          >
            <MovieCardVerticalFollow
              v-for="(item, index) in dataList"
              :index="index"
              :key="item.id"
              :item="item"
              :activeTabList="activeTabList"
              :getDataWhenRemoveList="getDataWhenRemoveList"
            /></section
        ></a-tab-pane>
        <a-tab-pane key="history" tab="Lịch sử xem phim">
          <section
            v-if="dataHistory?.length"
            class="movie-group"
            :class="{ collapse: $store.state.collapsed }"
          >
            <MovieCardVerticalFollow
              v-for="(item, index) in dataHistory"
              :index="index"
              :key="item.id"
              :item="item"
              :activeTabList="activeTabList"
              :getDataWhenRemoveHistory="getDataWhenRemoveHistory"
            />
          </section>
        </a-tab-pane>
      </a-tabs>

      <!-- <a-layout>
        <a-layout-content>
          <h2 class="gradient-title-default" style="margin-top: 0px">
            <strong>{{ metaHead }}</strong>
          </h2>
        </a-layout-content>

        <a-layout-sider :width="300">
          <h2 class="gradient-title-default" style="margin-top: 0px">
            <strong>Lịch sử xem phim</strong>
          </h2>
        </a-layout-sider>
      </a-layout> -->
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
import { watch, onBeforeMount, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MovieCardVerticalFollow from '@/components/MovieCardVerticalFollow.vue';
import { getList, getWatchList } from '../services/MovieService';

export default {
  components: { MovieCardVerticalFollow },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const metaHead = ref('Theo dõi');
    const dataList = ref([]);
    const dataHistory = ref([]);
    const activeTabList = ref('list');

    const getData = () => {
      getList(store?.state.userAccount?.id)
        .then((movieRespone) => {
          dataList.value = movieRespone.data?.items;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      getWatchList(store?.state.userAccount?.id, 1)
        .then((movieRespone) => {
          dataHistory.value = movieRespone.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      // if (!store.state.isLogin) {
      //   Modal.confirm({
      //     title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
      //     icon: createVNode(QuestionCircleOutlined),
      //     // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
      //     content: createVNode('div', {}, 'Đăng nhập ngay?'),
      //     okText: 'Có',
      //     okType: 'default',
      //     cancelText: 'Không',
      //     onOk() {
      //       router.push({ path: '/login' });
      //     },
      //     onCancel() {},
      //     class: 'require-login-confirm',
      //   });
      // }

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

    document.title = 'Phimhay247 - Theo dõi';

    return {
      isLogin,
      metaHead,
      dataList,
      dataHistory,
      activeTabList,
      getData,
      getDataWhenRemoveList,
      getDataWhenRemoveHistory,
    };
  },
};
</script>

<style lang="scss">
@media only screen and (max-width: 1400px) {
  .follow {
    .movie-group {
      grid-template-columns: repeat(5, minmax(20%, auto)) !important;
    }

    .movie-group.collapse {
      grid-template-columns: repeat(6, minmax(20%, auto)) !important;
    }
  }
}

@media only screen and (max-width: 1010px) {
  .follow {
    .movie-group {
      grid-template-columns: repeat(3, minmax(170px, auto)) !important;
    }
  }
}

@media only screen and (max-width: 860px) {
  .follow {
    .movie-group {
      grid-template-columns: repeat(3, minmax(160px, auto)) !important;
    }
  }
}

@media only screen and (max-width: 615px) {
  .follow {
    .movie-group {
      grid-template-columns: repeat(3, minmax(160px, auto)) !important;
    }
  }
}

@media only screen and (max-width: 550px) {
  .follow {
    .movie-group {
      grid-template-columns: repeat(2, minmax(160px, auto)) !important;
    }
  }
}

.follow {
  .follow-container {
    background-color: #000;

    .ant-layout-content {
      padding-right: 20px;
    }

    .ant-layout-sider {
      background-color: #000;
    }

    .gradient-title-default {
      strong {
        cursor: pointer;
        background-color: red !important;
      }

      strong + strong {
        margin-left: 20px;
      }
    }

    .movie-group {
      display: grid;
      grid-template-columns: repeat(5, minmax(180px, auto));
      margin-top: 10px;
      gap: 10px;
    }

    .ant-tabs-nav-list {
      .ant-tabs-tab {
        .ant-tabs-tab-btn {
          font-weight: bold;
          font-size: 25px;
        }
      }

      .ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: transparent;
          display: inline;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-image: linear-gradient(
            to right,
            var(--sider-header-background-color1),
            var(--sider-header-background-color2),
            var(--sider-header-background-color3)
          );
        }
      }
    }
  }
}
</style>
