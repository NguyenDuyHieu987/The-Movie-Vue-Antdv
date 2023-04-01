<template>
  <div class="history">
    <div v-if="isLogin" class="history-container">
      <a-layout>
        <a-layout-sider
          class="topic-history-column-responsive"
          width="calc(100% + 40px)"
          v-show="!loading"
        >
          <div class="column-container">
            <div class="top">
              <div class="backdrop">
                <a-image :src="getPoster(topicImage)" :preview="false">
                </a-image>
              </div>
              <img class="overlay-image" :src="getPoster(topicImage)" />

              <div class="info">
                <h2 class="title">
                  <strong>Video đã thêm vào danh sách phát</strong>
                </h2>

                <div class="user-info">
                  <p>
                    <strong>
                      {{ $store.state.userAccount?.username }}
                    </strong>
                  </p>
                  <p class="count-video">
                    {{ total }} video
                    <span> Cập nhật hôm nay </span>
                  </p>
                </div>

                <a-dropdown
                  :trigger="['click']"
                  placement="bottomRight"
                  class="dropdown-viewmore"
                >
                  <el-button
                    circle
                    shape="circle"
                    size="large"
                    class="viewmore-btn-history"
                    @click.prevent=""
                  >
                    <template #icon>
                      <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
                    </template>
                  </el-button>

                  <template #overlay>
                    <a-menu class="dropdown-viewmore">
                      <a-menu-item key="remove-list">
                        <template #icon>
                          <InfoCircleOutlined />
                        </template>
                        <span>Thông tin chi tiết</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <div class="bottom">
              <div class="box-btn">
                <el-button
                  round
                  type="primary"
                  shape="round"
                  class="remove-all-history-btn"
                >
                  <template #icon>
                    <span class="material-icons-outlined"> delete_sweep </span>
                  </template>
                  Xóa tất cả video đã xem
                </el-button>
              </div>

              <div class="widget">
                <a-input-search
                  class="search-history"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @search="handleSearch"
                >
                  <template #enterButton>
                    <el-tooltip
                      title="Tìm kiếm"
                      content="Tìm kiếm"
                      effect="dark"
                      placement="top"
                    >
                      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    </el-tooltip>
                  </template>
                </a-input-search>
              </div>
            </div>
          </div>
        </a-layout-sider>
        <Teleport to="#topic-history-column-teleport" v-if="!loading">
          <a-layout-sider class="topic-history-column" :width="340">
            <div class="column-container">
              <div class="backdrop">
                <a-image :src="getPoster(topicImage)" :preview="false">
                </a-image>
              </div>
              <img class="overlay-image" :src="getPoster(topicImage)" />
              <div class="info">
                <h2 class="title">
                  <strong>Video đã xem</strong>
                </h2>
                <div class="user-info">
                  <p>
                    <strong>
                      {{ $store.state.userAccount?.username }}
                    </strong>
                  </p>
                  <p class="count-video">
                    {{ total }} video
                    <span> Cập nhật hôm nay </span>
                  </p>
                  <a-dropdown
                    :trigger="['click']"
                    placement="bottomRight"
                    class="dropdown-viewmore"
                  >
                    <el-button
                      circle
                      shape="circle"
                      size="large"
                      class="viewmore-btn-history"
                      @click.prevent=""
                    >
                      <template #icon>
                        <font-awesome-icon
                          icon="fa-solid fa-ellipsis-vertical"
                        />
                      </template>
                    </el-button>

                    <template #overlay>
                      <a-menu class="dropdown-viewmore">
                        <a-menu-item key="remove-list">
                          <template #icon>
                            <InfoCircleOutlined />
                          </template>
                          <span>Thông tin chi tiết</span>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>

              <div class="widget">
                <a-input-search
                  class="search-history"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @search="handleSearch"
                >
                  <template #enterButton>
                    <el-tooltip
                      title="Tìm kiếm"
                      content="Tìm kiếm"
                      effect="dark"
                      placement="top"
                    >
                      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    </el-tooltip>
                  </template>
                </a-input-search>

                <el-button
                  round
                  type="primary"
                  shape="round"
                  class="remove-all-history-btn"
                  @click="removeAllHistoryList"
                >
                  <template #icon>
                    <span class="material-icons-outlined"> delete_sweep </span>
                  </template>
                  Xóa tất cả Video đã xem
                </el-button>
              </div>
            </div>
          </a-layout-sider>
        </Teleport>

        <a-layout-content class="history-main-content">
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
              :getDataWhenRemoveHistory="getDataWhenRemoveHistory"
            />
          </section>
        </a-layout-content>
      </a-layout>
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
import {
  watch,
  onBeforeMount,
  computed,
  ref,
  getCurrentInstance,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MovieCardHorizontalHistory from '@/components/Normal/MovieCardHorizontalHistory/MovieCardHorizontalHistory.vue';
import {
  getPoster,
  getColorImage,
  getHistory,
  // getMovies,
  removeAllItemHistory,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import disableScroll from 'disable-scroll';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';

export default {
  components: { MovieCardHorizontalHistory, InfoCircleOutlined },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const total = ref(0);
    const dataHistory = ref([]);
    const loading = ref(false);
    const topicImage = ref('/d0YSRmp819pMRnKLfGMgAQchpnR.jpg');
    const internalInstance = getCurrentInstance();

    // document.title = 'Phimhay247 - Theo dõi';
    useMeta({
      title: '`Phimhay247 - Lịch sử xem',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    const setBackgroundColor = (color) => {
      const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1), rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5), rgba(0, 0, 0, 1));`;

      // const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.33) 33%, rgba(0, 0, 0, 1) 100%);`;
      const topic_history_column = document.getElementsByClassName(
        'topic-history-column'
      )[0];

      if (topic_history_column) {
        topic_history_column.style = `background-image: ${main_color}`;

        const search_history =
          topic_history_column.querySelector('.search-history');

        const ant_input_affix_wrapper = search_history.getElementsByClassName(
          'ant-input-affix-wrapper'
        )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      const topic_history_column_responsive = document.getElementsByClassName(
        'topic-history-column-responsive'
      )[0];

      if (topic_history_column_responsive) {
        topic_history_column_responsive.style = `background-image: ${main_color}`;

        const search_history =
          topic_history_column_responsive.querySelector('.search-history');

        const ant_input_affix_wrapper = search_history.getElementsByClassName(
          'ant-input-affix-wrapper'
        )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      // topic_history_column.style = `background: url("${getPoster(
      //   dataList.value[0]?.backdrop_path
      // )}");`;

      // topic_history_column.style.setProperty(
      //   '--main-color',
      //   `${main_color}`
      // );
    };

    onMounted(() => {
      // const ant_btn = document.querySelector(
      //   '.topic-history-column .viewmore-btn-history'
      // );

      const ant_btn = document.getElementsByClassName(
        'viewmore-btn-history'
      )[0];

      ant_btn?.addEventListener('click', () => {
        if (ant_btn?.classList.contains('ant-dropdown-open')) {
          disableScroll.on();
        } else {
          disableScroll.off();
        }
      });

      ant_btn?.addEventListener('blur', () => {
        disableScroll.off();
      });
    });

    const getData = () => {
      loading.value = true;
      internalInstance.appContext.config.globalProperties.$Progress.start();

      getHistory(store?.state.userAccount?.id)
        // getMovies(1)
        .then((movieRespone) => {
          if (movieRespone.data?.items?.length > 0) {
            dataHistory.value = movieRespone.data?.items?.reverse();
            total.value = movieRespone.data?.items?.length;
            topicImage.value = dataHistory.value[0]?.backdrop_path;
          }

          getColorImage(topicImage.value)
            .then((colorResponse) => {
              const color = colorResponse.data?.color;
              setBackgroundColor(color);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          setTimeout(() => {
            internalInstance.appContext.config.globalProperties.$Progress.finish();
          }, 500);
          loading.value = false;
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      getData();
    });

    const getDataWhenRemoveHistory = (data) => {
      dataHistory.value = data;
      total.value = data?.length;
    };

    const removeAllHistoryList = () => {
      message.loading({ content: 'Đang xóa tất cả Lịch sử xem' });

      removeAllItemHistory(store?.state.userAccount?.id)
        .then((movieRespone) => {
          if (movieRespone.data?.success == true) {
            setTimeout(() => {
              dataHistory.value = movieRespone.data?.results;
              message.destroy();
              ElMessage({
                type: 'success',
                message: `Xóa thành công!`,
              });
            }, 500);
          } else {
            message.destroy();
            ElMessage({
              type: 'error',
              message: `Xóa thất bại!`,
            });
          }
        })
        .catch((e) => {
          message.destroy();
          ElMessage({
            type: 'error',
            message: `Xóa thất bại!`,
          });
          if (axios.isCancel(e)) return;
        });
    };

    watch(route, () => {
      // getData();
    });

    return {
      total,
      topicImage,
      loading,
      isLogin,
      dataHistory,
      getData,
      getPoster,
      getDataWhenRemoveHistory,
      removeAllHistoryList,
    };
  },
  // beforeRouteEnter() {
  //   alert('g');
  // },
};
</script>

<style lang="scss" src="./HistoryView.scss"></style>
