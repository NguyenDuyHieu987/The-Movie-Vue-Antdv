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
                <router-link
                  v-if="
                    dataHistory[0]?.media_type == 'tv' && dataHistory[0]?.id
                  "
                  :to="{
                    name: 'playTV',
                    params: {
                      id: dataHistory[0]?.id,
                      name: dataHistory[0]?.name
                        ?.replace(/\s/g, '+')
                        .toLowerCase(),
                      tap: 'tap-1',
                    },
                  }"
                >
                  <img
                    class="ant-image"
                    v-lazy="getBackdrop(topicImage, ',250')"
                    :preview="false"
                  />

                  <div class="play-now">
                    <span>
                      <font-awesome-icon icon="fa-solid fa-play" />
                      PHÁT NGAY
                    </span>
                  </div>
                </router-link>
                <router-link
                  v-else-if="
                    dataHistory[0]?.media_type == 'movie' && dataHistory[0]?.id
                  "
                  :to="{
                    name: 'play',
                    params: {
                      id: dataHistory[0]?.id,
                      name: dataHistory[0]?.name
                        ?.replace(/\s/g, '+')
                        .toLowerCase(),
                    },
                  }"
                >
                  <img
                    class="ant-image"
                    v-lazy="getBackdrop(topicImage, ',250')"
                    :preview="false"
                  />

                  <div class="play-now">
                    <font-awesome-icon icon="fa-solid fa-play" />
                    <span>PHÁT NGAY</span>
                  </div>
                </router-link>
                <img
                  class="ant-image"
                  v-if="!dataHistory?.length"
                  v-lazy="getBackdrop(topicImage, ',250')"
                  :preview="false"
                />
              </div>
              <img class="overlay-image" v-lazy="getBackdrop(topicImage)" />

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
                            <!-- <InfoCircleOutlined /> -->
                            <i class="fa-regular fa-circle-info"></i>
                          </template>
                          <span>Thông tin chi tiết</span>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="box-btn">
                <el-button
                  round
                  type="primary"
                  shape="round"
                  class="remove-all-history-btn"
                  @click="removeAllHistoryList"
                >
                  <template #icon>
                    <!-- <span class="material-icons-outlined"> delete_sweep </span> -->
                    <i class="fa-sharp fa-regular fa-trash-can-list"></i>
                  </template>
                  Xóa tất cả video đã xem
                </el-button>
              </div>

              <div class="widget">
                <a-input
                  v-model:value="valueInput"
                  class="search-history"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @change="searchWatchList"
                >
                  <template #prefix>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                  </template>
                </a-input>
              </div>
            </div>
          </div>
        </a-layout-sider>
        <Teleport to="#topic-history-column-teleport" v-if="!loading">
          <a-layout-sider class="topic-history-column" :width="340">
            <div class="column-container">
              <div class="backdrop">
                <router-link
                  v-if="
                    dataHistory[0]?.media_type == 'tv' && dataHistory[0]?.id
                  "
                  :to="{
                    name: 'playTV',
                    params: {
                      id: dataHistory[0]?.id,
                      name: dataHistory[0]?.name
                        ?.replace(/\s/g, '+')
                        .toLowerCase(),
                      tap: 'tap-1',
                    },
                  }"
                >
                  <img
                    class="ant-image"
                    v-lazy="getBackdrop(topicImage, ',250')"
                    :preview="false"
                  />

                  <div class="play-now">
                    <span>
                      <font-awesome-icon icon="fa-solid fa-play" />
                      PHÁT NGAY
                    </span>
                  </div>
                </router-link>
                <router-link
                  v-else-if="
                    dataHistory[0]?.media_type == 'movie' && dataHistory[0]?.id
                  "
                  :to="{
                    name: 'play',
                    params: {
                      id: dataHistory[0]?.id,
                      name: dataHistory[0]?.name
                        ?.replace(/\s/g, '+')
                        .toLowerCase(),
                    },
                  }"
                >
                  <img
                    class="ant-image"
                    v-lazy="getBackdrop(topicImage, ',250')"
                    :preview="false"
                  />

                  <div class="play-now">
                    <font-awesome-icon icon="fa-solid fa-play" />
                    <span>PHÁT NGAY</span>
                  </div>
                </router-link>
                <img
                  class="ant-image"
                  v-if="!dataHistory?.length"
                  v-lazy="getBackdrop(topicImage, ',250')"
                  :preview="false"
                />
              </div>
              <img class="overlay-image" v-lazy="getBackdrop(topicImage)" />
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
                            <!-- <InfoCircleOutlined /> -->
                            <i class="fa-regular fa-circle-info"></i>
                          </template>
                          <span>Thông tin chi tiết</span>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>

              <div class="widget">
                <a-input
                  v-model:value="valueInput"
                  class="search-history"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @change="searchWatchList"
                >
                  <template #prefix>
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                  </template>
                </a-input>

                <el-button
                  round
                  type="primary"
                  shape="round"
                  class="remove-all-history-btn"
                  @click="removeAllHistoryList"
                >
                  <template #icon>
                    <!-- <span class="material-icons-outlined"> delete_sweep </span> -->
                    <i class="fa-sharp fa-regular fa-trash-can-list"></i>
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
              :prevItem="dataHistory[index - 1]"
              :type="item?.media_type"
              :getDataWhenRemoveHistory="getDataWhenRemoveHistory"
            />
          </section>
          <div class="skeleton-loadmore" v-if="loadMore">
            <el-skeleton
              :loading="true"
              animated
              v-for="index in 2"
              :key="index"
            >
              <template #template>
                <div class="img-box">
                  <el-skeleton-item class="image-skeleton" variant="image" />
                </div>
                <div style="margin-top: 7px" class="info">
                  <el-skeleton-item variant="text" style="width: 40%" />
                  <el-skeleton-item variant="text" style="width: 20%" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                  <div class="overview">
                    <el-skeleton-item variant="text" />
                    <el-skeleton-item variant="text" style="width: 50%" />
                  </div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </a-layout-content>
      </a-layout>
    </div>

    <RequireAuth v-else />
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
  createVNode,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MovieCardHorizontalHistory from '@/components/MovieCardHorizontalHistory/MovieCardHorizontalHistory.vue';
import RequireAuth from '@/components/RequireAuth/RequireAuth.vue';
import {
  getBackdrop,
  getColorImage,
  getHistory,
  searchHistory,
  removeAllItemHistory,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';
import {
  // InfoCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import disableScroll from 'disable-scroll';
import { ElMessage } from 'element-plus';
import { message, Modal } from 'ant-design-vue';
import _ from 'lodash';

export default {
  components: {
    MovieCardHorizontalHistory,
    // InfoCircleOutlined
    RequireAuth,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const valueInput = ref('');
    const debounce = ref();
    const total = ref(0);
    const skip = ref(1);
    const dataHistory = ref([]);
    const loading = ref(false);
    const isScroll = ref(false);
    const loadingSearch = ref(false);
    const loadMore = ref(false);
    const topicImage = ref('/d0YSRmp819pMRnKLfGMgAQchpnR.jpg');
    const internalInstance = getCurrentInstance();

    // document.title = 'Phimhay247 - Theo dõi';
    useMeta({
      title: 'Phimhay247 - Lịch sử xem',
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

        // const search_history =
        //   topic_history_column.querySelector('.search-history');

        const ant_input_affix_wrapper =
          topic_history_column.getElementsByClassName(
            'ant-input-affix-wrapper'
          )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      const topic_history_column_responsive = document.getElementsByClassName(
        'topic-history-column-responsive'
      )[0];

      if (topic_history_column_responsive) {
        topic_history_column_responsive.style = `background-image: ${main_color}`;

        // const search_history =
        //   topic_history_column_responsive.querySelector('.search-history');

        const ant_input_affix_wrapper =
          topic_history_column_responsive.getElementsByClassName(
            'ant-input-affix-wrapper'
          )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      // topic_history_column.style = `background: url("${getBackdrop(
      //   dataHistory.value[0]?.backdrop_path
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

      getHistory()
        // getMovies(1)
        .then((movieRespone) => {
          if (movieRespone.data?.result?.items?.length > 0) {
            dataHistory.value = movieRespone.data?.result?.items;
            total.value = movieRespone.data?.total;
            topicImage.value = dataHistory.value[0]?.backdrop_path;

            setTimeout(() => {
              const color = dataHistory.value[0]?.dominant_backdrop_color;
              setBackgroundColor(color);
            });
          }

          if (dataHistory.value?.length == 0) {
            getColorImage(topicImage.value)
              .then((colorResponse) => {
                const color = colorResponse.data?.color;
                setBackgroundColor(color);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          }

          // setTimeout(() => {
          internalInstance.appContext.config.globalProperties.$Progress.finish();
          loading.value = false;
          // }, 500);
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      getData();

      const scrollBottom = require('scroll-bottom');
      window.addEventListener('scroll', () => {
        isScroll.value = true;
      });

      window.onscroll = () => {
        if (
          Math.floor(scrollBottom()) == 0 &&
          isScroll.value == true &&
          total.value > 20 &&
          dataHistory.value?.length < total.value
        ) {
          loadMore.value = true;
          getHistory(skip.value)
            .then((movieRespone) => {
              if (movieRespone.data?.result?.length > 0) {
                setTimeout(() => {
                  loadMore.value = false;
                  dataHistory.value = dataHistory.value.concat(
                    movieRespone.data?.result
                  );
                }, 2000);
                skip.value += 1;
              }
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });
        }
      };
    });

    const getDataWhenRemoveHistory = (data) => {
      // dataHistory.value = data;
      dataHistory.value = _.reject(dataHistory.value, (x) => {
        return x.id === data;
      });
      // total.value = data?.length;
    };

    const removeAllHistoryList = () => {
      if (dataHistory.value?.length > 0) {
        Modal.confirm({
          title: 'Thông Báo',
          icon: createVNode(QuestionCircleOutlined),
          content: createVNode(
            'h3',
            {},
            'Bạn có muốn xóa toàn bộ Lịch sử xem không?'
          ),
          okText: 'Có',
          okType: 'primary',
          okButtonProps: {
            type: 'primary',
            danger: true,
          },
          cancelText: 'Không',
          centered: true,
          onOk() {
            message.loading({ content: 'Đang xóa tất cả Lịch sử xem' });

            removeAllItemHistory()
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
          },
          onCancel() {},
        });
      }
    };

    watch(route, () => {
      // getData();
    });

    const searchWatchList = (e) => {
      if (e.target.value.length >= 0) {
        loadingSearch.value = true;

        clearTimeout(debounce.value);
        debounce.value = setTimeout(() => {
          searchHistory(e.target.value)
            .then((movieRespone) => {
              dataHistory.value = movieRespone?.data?.results;
              setTimeout(() => {
                loadingSearch.value = false;
              }, 500);
            })
            .catch((e) => {
              loadingSearch.value = false;
              if (axios.isCancel(e)) return;
            });
        }, 500);
      }
      // else if (valueInput.value.length == 0) {
      //   dataHistory.value = [];
      // }
    };

    return {
      valueInput,
      loadingSearch,
      total,
      topicImage,
      loading,
      loadMore,
      isLogin,
      dataHistory,
      getData,
      getBackdrop,
      getDataWhenRemoveHistory,
      removeAllHistoryList,
      searchWatchList,
    };
  },
  // beforeRouteEnter() {
  //   alert('g');
  // },
};
</script>

<style lang="scss" src="./HistoryView.scss"></style>
