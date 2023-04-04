<template>
  <router-link
    :to="{
      name: isEpisodes ? 'infoTV' : 'info',
      params: {
        id: item?.id,
        name: item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase(),
      },
    }"
    class="movie-card-horizontal-item"
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
          <a-image
            class="ant-image"
            :src="getPoster(dataMovie?.backdrop_path)"
            :preview="false"
          >
          </a-image>

          <!-- <a-skeleton-image v-else class="ant-image" /> -->

          <div class="duration-episode-box">
            <p class="duration-episode">
              {{
                isEpisodes
                  ? dataMovie?.last_episode_to_air?.episode_number
                    ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                    : ''
                  : dataMovie?.runtime
                  ? dataMovie?.runtime + ' min'
                  : ''
              }}
            </p>
          </div>

          <div class="release-date-box">
            <p class="release-date">
              {{
                item?.release_date
                  ? item?.release_date?.slice(0, 4)
                  : item?.last_air_date?.slice(0, 4)
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
            <!-- <a-skeleton
              :loading="loading"
              :active="true"
              :paragraph="{ rows: 2 }"
              :title="false"
            > -->
            <p class="title">
              {{ item?.name ? item?.name : item?.title }}
              <span v-if="isEpisodes">
                {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
              </span>
            </p>
            <div class="info-bottom">
              <!-- <p class="genres" v-if="item?.genre_ids">
                {{
                  getAllGenresById(item?.genre_ids, $store.state?.allGenres).join(
                    ' • '
                  )
                }}
              </p> -->
              <p class="genres" v-if="item?.genres">
                {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
              </p>
              <p
                class="genres"
                v-else-if="item?.genres == undefined && dataMovie?.genres"
              >
                {{ Array.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
              </p>
            </div>
            <!-- </a-skeleton> -->
          </div>
        </a-tooltip>
      </template>
    </el-skeleton>
    <div class="detail-flow" v-if="!loading">
      <div class="backdrop-box">
        <a-image
          class="ant-image"
          v-show="!loading"
          :src="getPoster(dataMovie?.backdrop_path)"
          :preview="false"
        >
        </a-image>

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
            <el-tooltip content="Xem ngay" placement="top">
              <router-link
                v-if="isEpisodes"
                :to="{
                  name: 'playtv',
                  params: {
                    id: item?.id,
                    name: item?.name
                      ? item?.name?.replace(/\s/g, '+').toLowerCase()
                      : item?.title?.replace(/\s/g, '+').toLowerCase(),
                    tap: 'tap-1',
                  },
                }"
                class="btn-play-now"
              >
                <a-button shape="circle" size="large">
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-play" />
                  </template>
                </a-button>
              </router-link>
              <router-link
                v-else
                :to="{
                  name: 'play',
                  params: {
                    id: item?.id,
                    name: item?.name
                      ? item?.name?.replace(/\s/g, '+').toLowerCase()
                      : item?.title?.replace(/\s/g, '+').toLowerCase(),
                  },
                }"
                class="btn-play-now"
              >
                <a-button shape="circle" size="large">
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-play" />
                  </template>
                </a-button>
              </router-link>
            </el-tooltip>

            <el-tooltip content="Thêm vào danh sách" placement="top">
              <a-button
                shape="circle"
                size="large"
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

            <el-tooltip content="Chia sẻ" placement="top">
              <ShareNetwork
                network="facebook"
                :url="urlShare"
                :title="dataMovie?.name ? dataMovie?.name : dataMovie?.title"
                hashtags="phimhay247.site,vite"
                style="white-space: nowrap; display: block"
              >
                <a-button shape="circle" size="large" @click.prevent="">
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-share" />
                  </template>
                </a-button>
              </ShareNetwork>
            </el-tooltip>
          </div>

          <div class="right">
            <el-tooltip content="Chi tiết phim" placement="top">
              <router-link
                :to="{
                  name: isEpisodes ? 'infoTV' : 'info',
                  params: {
                    id: item?.id,
                    name: item?.name
                      ? item?.name?.replace(/\s/g, '+').toLowerCase()
                      : item?.title?.replace(/\s/g, '+').toLowerCase(),
                  },
                }"
              >
                <a-button shape="circle" size="large">
                  <template #icon>
                    <!-- <InfoOutlined /> -->
                    <i class="fa-sharp fa-solid fa-info"></i>
                  </template>
                </a-button>
              </router-link>
            </el-tooltip>
          </div>
        </div>
        <div class="info">
          <h3 class="title">
            {{ item?.name ? item?.name : item?.title }}
            <span v-if="isEpisodes">
              {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
            </span>
          </h3>
          <div class="info-bottom">
            <p class="genres" v-if="item?.genres">
              {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
            </p>
            <p
              class="genres"
              v-else-if="item?.genres == undefined && dataMovie?.genres"
            >
              {{ Array.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
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
  // InfoOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  getLanguage,
  addItemList,
  removeItemList,
  // getList,
  getItemList,
  getItemHistory,
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
    //  InfoOutlined
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
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);
    // const dataAddToList = ref([]);
    const isAddToList = ref(false);
    const isInHistory = ref(false);
    const percent = ref(0);
    const urlShare = computed(() => window.location);

    onMounted(() => {
      const itemMovie = document.querySelectorAll(
        '.movie-card-horizontal-item'
      );

      itemMovie.forEach((x) => {
        x?.addEventListener('mouseenter', (e) => {
          // const rect = x.getBoundingClientRect();

          const detailFlow = x.getElementsByClassName('detail-flow')[0];

          if (detailFlow?.style) {
            // if (rect.left <= 300) {
            if (e.x - x.offsetWidth <= 250) {
              detailFlow.style.left = '0';
              detailFlow.style.right = 'auto';
              detailFlow.style.transform =
                'translateX(0%) translateY(-50%) scale(1.05)';
            }

            // console.log('e: ', e.x);
            // console.log('x:', x.offsetWidth);
            // console.log('rect: ', rect.right);

            if (window.innerWidth - e.x <= x.offsetWidth) {
              detailFlow.style.left = 'auto';
              detailFlow.style.right = '0';
              detailFlow.style.transform =
                'translateX(0%) translateY(-50%) scale(1.05)';
            }
          }
        });
      });
    });

    onBeforeMount(() => {
      loading.value = true;

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            isEpisodes.value = false;
            getMovieById(props.item?.id)
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
            getTvById(props.item?.id)
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
          getTvById(props.item?.id)
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
          getMovieById(props.item?.id)
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

      // getTvById(props.item?.id)
      //   .then((tvResponed) => {
      //     if (tvResponed?.data?.not_found === true)
      //       getMovieById(props.item?.id)
      //         .then((movieResponed) => {
      //           isEpisodes.value = false;
      //           dataMovie.value = movieResponed?.data;

      //           setTimeout(() => {
      //             loading.value = false;
      //           }, 1000);
      //         })
      //         .catch((e) => {
      //           loading.value = false;
      //           if (axios.isCancel(e)) return;
      //         });
      //     else {
      //       setTimeout(() => {
      //         loading.value = false;
      //       }, 1000);
      //       isEpisodes.value = true;
      //       dataMovie.value = tvResponed?.data;
      //     }
      //   })
      //   .catch((e) => {
      //     loading.value = false;
      //     if (axios.isCancel(e)) return;
      //   });

      if (store.state.isLogin) {
        // getList(store.state?.userAccount?.id)
        //   .then((movieRespone) => {
        //     dataAddToList.value = movieRespone?.data?.items;

        //     dataAddToList.value?.map((item) => {
        //       if (item?.id == dataMovie.value?.id) {
        //         isAddToList.value = true;
        //       }
        //     });
        //   })
        //   .catch((e) => {
        //     if (axios.isCancel(e)) return;
        //   });

        getItemList(store.state?.userAccount?.id, props.item?.id)
          .then((movieRespone) => {
            if (movieRespone?.data.success == true) {
              isAddToList.value = true;
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });

        getItemHistory(store.state?.userAccount?.id, props.item?.id)
          .then((movieRespone) => {
            if (movieRespone?.data.success == true) {
              isInHistory.value = true;
              percent.value = movieRespone?.data?.result?.percent;
            }
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
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
          addItemList(store.state?.userAccount?.id, {
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

          removeItemList(store.state?.userAccount?.id, {
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
      dataMovie,
      loading,
      isAddToList,
      isInHistory,
      percent,
      urlShare,
      handelAddToList,
      getPoster,
      getAllGenresById,
      getLanguage,
      ViewFormatter,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontal.scss"></style>
