<template>
  <router-link
    :to="{
      name: isEpisodes ? 'infoTV' : 'info',
      params: {
        id: item?.id,
        name: item?.name?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="movie-card-vertical-item"
  >
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="img-box">
          <el-skeleton-item class="ant-image" variant="image" />
        </div>
        <div style="margin-top: 7px">
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" style="width: 60%" />
        </div>
      </template>

      <template #default>
        <div class="img-box">
          <img
            class="ant-image"
            v-if="!loading"
            v-lazy="getPoster(item?.poster_path)"
            :preview="false"
          />

          <!-- <a-skeleton-image v-else class="ant-image" /> -->

          <div
            v-if="isInHistory"
            class="percent-viewed"
            :style="{ width: percent * 100 + '%' }"
          ></div>
          <div v-if="isInHistory" class="viewed-overlay-bar"></div>

          <div v-if="!loading" class="duration-episode-box">
            <p v-if="!isEpisodes" class="duration-episode">
              {{ item?.runtime + ' min' }}
            </p>
            <p v-else class="duration-episode">
              {{
                dataMovie?.last_episode_to_air?.episode_number
                  ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                  : ''
              }}
            </p>
          </div>

          <div v-if="!loading" class="release-date-box">
            <p class="release-date" v-if="!isEpisodes">
              {{ item?.release_date?.slice(0, 4) }}
            </p>
            <p v-else class="release-date">
              {{
                item?.last_air_date?.slice(0, 4)
                  ? item?.last_air_date?.slice(0, 4)
                  : item?.first_air_date?.slice(0, 4)
              }}
            </p>
          </div>
        </div>

        <a-tooltip
          :title="
            getLanguage(item?.original_language, $store.state.allCountries)
              ?.name
              ? getLanguage(item?.original_language, $store.state.allCountries)
                  ?.name
              : ''
          "
        >
          <div class="info">
            <a-skeleton
              :loading="loading"
              :active="true"
              :paragraph="{ rows: 2 }"
              :title="false"
            >
              <p class="title">
                {{ item?.name }}
                <span v-if="isEpisodes">
                  {{
                    ' - Phần ' + dataMovie?.last_episode_to_air?.season_number
                  }}
                </span>
              </p>
              <div class="info-bottom">
                <p class="genres">
                  {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
                </p>
              </div>
            </a-skeleton>
          </div>
        </a-tooltip>
      </template>
    </el-skeleton>

    <div class="detail-flow" v-if="!loading">
      <div class="backdrop-box">
        <img
          class="ant-image"
          v-lazy="getBackdrop(item?.backdrop_path, ',250')"
          :preview="false"
        />
        <div
          v-if="isInHistory"
          class="percent-viewed"
          :style="{ width: percent * 100 + '%' }"
        ></div>
        <div v-if="isInHistory" class="viewed-overlay-bar"></div>
      </div>

      <div class="bottom-content">
        <div class="widget">
          <div class="left">
            <el-tooltip :teleported="false" content="Xem ngay" placement="top">
              <router-link
                v-if="isEpisodes"
                :to="{
                  name: 'playTV',
                  params: {
                    id: item?.id,
                    name: item?.name?.replace(/\s/g, '+').toLowerCase(),
                    tap: 'tap-1',
                  },
                }"
                class="btn-play-now"
              >
                <a-button shape="circle" size="large" type="text">
                  <template #icon>
                    <!-- <font-awesome-icon icon="fa-solid fa-play" /> -->
                    <svg
                      class="icones play"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path fill="#fff" d="M8 5v14l11-7z" />
                    </svg>
                  </template>
                </a-button>
              </router-link>
              <router-link
                v-else
                :to="{
                  name: 'play',
                  params: {
                    id: item?.id,
                    name: item?.name?.replace(/\s/g, '+').toLowerCase(),
                  },
                }"
                class="btn-play-now"
              >
                <a-button shape="circle" size="large" type="text">
                  <template #icon>
                    <!-- <font-awesome-icon icon="fa-solid fa-play" /> -->
                    <svg
                      class="icones play"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path fill="#fff" d="M8 5v14l11-7z" />
                    </svg>
                  </template>
                </a-button>
              </router-link>
            </el-tooltip>

            <el-tooltip
              :teleported="false"
              :content="
                !isAddToList ? 'Thêm vào danh sách' : 'Xóa khỏi danh sách'
              "
              placement="top"
            >
              <a-button
                shape="circle"
                size="large"
                type="text"
                @click.prevent="handelAddToList"
              >
                <template #icon>
                  <font-awesome-icon
                    v-if="isAddToList"
                    icon="fa-solid fa-check"
                  />
                  <PlusOutlined v-else />
                </template>
              </a-button>
            </el-tooltip>

            <el-tooltip :teleported="false" content="Chia sẻ" placement="top">
              <ShareNetwork
                network="facebook"
                :url="urlShare"
                :title="dataMovie?.name"
                hashtags="phimhay247.site,vite"
                style="white-space: nowrap; display: block"
              >
                <a-button
                  shape="circle"
                  size="large"
                  type="text"
                  @click.prevent=""
                >
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-share" />
                  </template>
                </a-button>
              </ShareNetwork>
            </el-tooltip>
          </div>

          <div class="right">
            <el-tooltip
              :teleported="false"
              content="Chi tiết phim"
              placement="top"
            >
              <router-link
                :to="{
                  name: isEpisodes ? 'infoTV' : 'info',
                  params: {
                    id: item?.id,
                    name: item?.name?.replace(/\s/g, '+').toLowerCase(),
                  },
                }"
              >
                <a-button shape="circle" size="large" type="text">
                  <template #icon>
                    <InfoOutlined />
                    <!-- <i class="fa-sharp fa-solid fa-info"></i> -->
                  </template>
                </a-button>
              </router-link>
            </el-tooltip>
          </div>
        </div>
        <div class="info">
          <h3 class="title">
            {{ item?.name }}
            <span v-if="isEpisodes">
              {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
            </span>
          </h3>

          <div class="info-bottom">
            <p class="genres">
              {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
            </p>
          </div>

          <div class="views-imdb">
            <p class="views">{{ ViewFormatter(dataMovie?.views) }} lượt xem</p>

            <p>
              <span
                style="color: green; font-weight: bold"
                v-if="dataMovie?.vote_average >= 8"
              >
                {{ dataMovie?.vote_average.toFixed(2) }}
              </span>
              <span
                style="color: yellow; font-weight: bold"
                v-if="
                  dataMovie?.vote_average >= 5 && dataMovie?.vote_average < 8
                "
              >
                {{ dataMovie?.vote_average.toFixed(2) }}
              </span>
              <span
                style="color: red; font-weight: bold"
                v-if="dataMovie?.vote_average < 5"
              >
                {{ dataMovie?.vote_average.toFixed(2) }}
              </span>
              diểm /
              {{ dataMovie?.vote_count + ' lượt' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>
import { ref, onBeforeMount, createVNode, onMounted, computed } from 'vue';
import {
  PlusOutlined,
  InfoOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getBackdrop,
  getTvById,
  getMovieById,
  getLanguage,
  addItemList,
  removeItemList,
  // getItemList,
  // getItemHistory,
} from '@/services/MovieService';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  Modal,
  // message
} from 'ant-design-vue';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';
import { ViewFormatter } from '@/utils/convertViews';

export default {
  components: {
    PlusOutlined,
    InfoOutlined,
  },
  props: {
    item: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);
    // const dataAddToList = ref([]);
    const isAddToList = ref(false);
    const isInHistory = ref(false);
    const percent = ref(0);
    const urlShare = computed(() => window.location);

    onMounted(() => {
      const itemMovie = document.querySelectorAll('.movie-card-vertical-item');

      itemMovie.forEach((x) => {
        x?.addEventListener('mouseenter', (e) => {
          // const rect = x.getBoundingClientRect();

          const detailFlow = x.getElementsByClassName('detail-flow')[0];

          if (detailFlow?.style) {
            // if (rect.left <= 300) {
            if (e.x - x.offsetWidth <= 230) {
              detailFlow.style.left = '10px';
              detailFlow.style.right = 'auto';
              detailFlow.style.transform =
                'translateX(0%) translateY(-50%) scale(1.1)';
            }

            if (window.innerWidth - e.x <= x.offsetWidth) {
              detailFlow.style.left = 'auto';
              detailFlow.style.right = '10px';
              detailFlow.style.transform =
                'translateX(0%) translateY(-50%) scale(1.1)';
            }
          }
        });
      });
    });

    onBeforeMount(async () => {
      loading.value = true;

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            isEpisodes.value = false;
            await getMovieById(props.item?.id)
              .then((movieResponed) => {
                dataMovie.value = movieResponed?.data;

                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                loading.value = false;
                if (axios.isCancel(e)) return;
              });
            break;
          case 'tv':
            isEpisodes.value = true;
            await getTvById(props.item?.id)
              .then((tvResponed) => {
                dataMovie.value = tvResponed?.data;

                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                loading.value = false;
                if (axios.isCancel(e)) return;
              });
            break;
          default:
            break;
        }
      } else {
        if (props?.item?.media_type == 'tv' || props?.item?.type) {
          isEpisodes.value = true;
          await getTvById(props.item?.id)
            .then((tvResponed) => {
              dataMovie.value = tvResponed?.data;

              setTimeout(() => {
                loading.value = false;
              }, 1000);
            })
            .catch((e) => {
              loading.value = false;
              if (axios.isCancel(e)) return;
            });
        } else {
          isEpisodes.value = false;
          await getMovieById(props.item?.id)
            .then((movieResponed) => {
              dataMovie.value = movieResponed?.data;

              setTimeout(() => {
                loading.value = false;
              }, 1000);
            })
            .catch((e) => {
              loading.value = false;
              if (axios.isCancel(e)) return;
            });
        }
      }

      if (store.state.isLogin) {
        if (dataMovie.value?.in_list) {
          isAddToList.value = true;
        }

        if (dataMovie.value?.in_history) {
          isInHistory.value = true;
          percent.value = dataMovie.value?.history_progress?.percent;
        }

        // getItemList( props.item?.id)
        //   .then((movieRespone) => {
        //     if (movieRespone?.data.success == true) {
        //       isAddToList.value = true;
        //     }
        //   })
        //   .catch((e) => {
        //     if (axios.isCancel(e)) return;
        //   });

        // getItemHistory( props.item?.id)
        //   .then((movieRespone) => {
        //     if (movieRespone?.data.success == true) {
        //       isInHistory.value = true;
        //       percent.value = movieRespone?.data?.result?.percent;
        //     }
        //   })
        //   .catch((e) => {
        //     if (axios.isCancel(e)) return;
        //   });
      }
    });

    const handelAddToList = () => {
      if (!store.state.isLogin) {
        Modal.confirm({
          title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
          icon: createVNode(QuestionCircleOutlined),
          // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
          content: createVNode('h3', {}, 'Đăng nhập ngay?'),
          okText: 'Có',
          okType: 'primary',
          cancelText: 'Không',
          centered: true,
          onOk() {
            router.push({ path: '/login' });
          },
          onCancel() {},
          class: 'require-login-confirm',
        });
      } else {
        if (isAddToList.value == false) {
          isAddToList.value = true;
          message.loading({ content: 'Đang thêm' });
          addItemList({
            media_type: isEpisodes.value ? 'tv' : 'movie',
            media_id: dataMovie.value?.id,
          })
            .then((response) => {
              if (response.data.success == true) {
                setTimeout(() => {
                  message.destroy();
                  ElMessage({
                    type: 'success',
                    message: `Thêm thành công!`,
                  });
                }, 500);
              } else {
                message.destroy();
                isAddToList.value = false;
                ElMessage({
                  type: 'error',
                  message: `Thêm thất bại!`,
                });
              }
            })
            .catch((e) => {
              message.destroy();
              isAddToList.value = false;
              ElMessage({
                type: 'error',
                message: `Thêm thất bại!`,
              });
              if (axios.isCancel(e)) return;
            });
        } else {
          isAddToList.value = false;
          message.loading({ content: 'Đang xóa' });

          removeItemList({
            media_id: dataMovie.value?.id,
          })
            .then((movieRespone) => {
              if (movieRespone.data?.success == true) {
                setTimeout(() => {
                  message.destroy();
                  ElMessage({
                    type: 'success',
                    message: `Xóa thành công!`,
                  });
                }, 500);
              } else {
                message.destroy();
                isAddToList.value = true;
                ElMessage({
                  type: 'error',
                  message: `Xóa thất bại!`,
                });
              }
            })
            .catch((e) => {
              message.destroy();
              isAddToList.value = true;
              ElMessage({
                type: 'error',
                message: `Xóa thất bại!`,
              });
              if (axios.isCancel(e)) return;
            });
        }
      }
    };

    return {
      isEpisodes,
      isAddToList,
      dataMovie,
      loading,
      isInHistory,
      percent,
      urlShare,
      handelAddToList,
      getPoster,
      getBackdrop,
      getAllGenresById,
      getLanguage,
      ViewFormatter,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardVertical.scss"></style>
