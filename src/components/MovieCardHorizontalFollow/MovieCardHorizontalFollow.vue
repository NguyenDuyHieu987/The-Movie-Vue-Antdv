<template>
  <div class="movie-follow-item-wrapper">
    <p class="index-item">{{ index + 1 }}</p>
    <el-skeleton :loading="loading" animated class="movie-follow-item">
      <template #template>
        <div class="item-skeleton">
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
        </div>
      </template>
      <template #default>
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
          class="movie-follow-item"
        >
          <div class="img-box">
            <!-- v-if="!loading" -->
            <a-image :src="getBackdrop(item?.backdrop_path)" :preview="false">
            </a-image>
            <div
              v-show="isInHistory"
              class="percent-viewed"
              :style="{ width: percent * 100 + '%' }"
            ></div>
            <div v-show="isInHistory" class="viewed-overlay-bar"></div>
          </div>

          <div class="info">
            <h2 class="title">
              <strong>
                {{ item?.name ? item?.name : item?.title }}
                <strong v-if="isEpisodes">
                  {{
                    ' - Phần ' + dataMovie?.last_episode_to_air?.season_number
                  }}
                </strong>
              </strong>
            </h2>

            <!-- <p class="release-date">
        Năm:
        {{ dataMovie?.release_date ? dataMovie?.release_date : dataMovie?.first_air_date }}
      </p> -->
            <p v-if="dataMovie?.last_episode_to_air" class="duration-episode">
              Tập mới nhất:
              {{
                dataMovie?.last_episode_to_air?.episode_number
                  ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                  : ''
              }}
            </p>

            <p v-else-if="dataMovie?.runtime" class="duration-episode">
              Thời lượng:
              {{ dataMovie?.runtime ? dataMovie?.runtime + ' phút' : '' }}
            </p>

            <div class="year-views">
              <p class="year">
                Năm:
                {{
                  dataMovie?.release_date
                    ? dataMovie?.release_date?.slice(0, 4)
                    : dataMovie?.last_air_date?.slice(0, 4)
                    ? dataMovie?.last_air_date?.slice(0, 4)
                    : dataMovie?.first_air_date?.slice(0, 4)
                }}
              </p>
              •
              <p class="views">
                {{ ViewFormatter(dataMovie?.views) }} lượt xem
              </p>
            </div>

            <p class="overview">
              {{ dataMovie?.overview }}
            </p>

            <div class="action">
              <a-dropdown
                :trigger="['click']"
                placement="bottomRight"
                class="dropdown-viewmore"
              >
                <el-button
                  circle
                  shape="circle"
                  size="large"
                  class="viewmore-btn"
                >
                  <template #icon>
                    <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
                  </template>
                </el-button>

                <template #overlay>
                  <a-menu class="dropdown-item-viewmore">
                    <div class="main-action">
                      <a-menu-item key="play">
                        <template #icon>
                          <!-- <font-awesome-icon icon="fa-solid fa-play" /> -->
                          <i class="fa-sharp fa-regular fa-play"></i>
                          <!-- <i class="fa-sharp fa-solid fa-play"></i> -->
                        </template>

                        <router-link
                          v-if="isEpisodes && !loading"
                          :to="{
                            name: 'playTV',
                            params: {
                              id: item?.id,
                              name: item?.name
                                ? item?.name?.replace(/\s/g, '+').toLowerCase()
                                : item?.title
                                    ?.replace(/\s/g, '+')
                                    .toLowerCase(),
                              tap: 'tap-1',
                            },
                          }"
                          class="btn-play-now"
                        >
                          <span> Đến trang xem phim </span>
                        </router-link>
                        <router-link
                          v-else-if="!isEpisodes && !loading"
                          :to="{
                            name: 'play',
                            params: {
                              id: item?.id,
                              name: item?.name
                                ? item?.name?.replace(/\s/g, '+').toLowerCase()
                                : item?.title
                                    ?.replace(/\s/g, '+')
                                    .toLowerCase(),
                            },
                          }"
                          class="btn-play-now"
                        >
                          <span>Đến trang xem phim</span>
                        </router-link>
                      </a-menu-item>
                      <a-menu-item key="share">
                        <template #icon>
                          <!-- <font-awesome-icon icon="fa-solid fa-share" /> -->
                          <i class="fa-sharp fa-regular fa-share"></i>
                        </template>
                        <span>
                          <ShareNetwork
                            network="facebook"
                            :url="urlShare"
                            :title="
                              dataMovie?.name
                                ? dataMovie?.name
                                : dataMovie?.title
                            "
                            hashtags="phimhay247.site,vite"
                            style="white-space: nowrap; display: block"
                          >
                            Chia sẻ
                          </ShareNetwork>
                        </span>
                      </a-menu-item>
                    </div>

                    <hr />
                    <div class="danger-zone">
                      <a-menu-item
                        key="remove-list"
                        class="remove-list"
                        @click="handleRemoveFromList"
                      >
                        <template #icon>
                          <font-awesome-icon icon="fa-solid fa-trash-can" />
                        </template>
                        <span>Xóa khỏi Danh sách phát</span>
                      </a-menu-item>
                    </div>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </router-link>
      </template>
    </el-skeleton>
  </div>
</template>
<script>
import { ref, onBeforeMount, computed, h, onMounted } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getBackdrop,
  getLanguage,
  removeItemList,
  getMovieById,
  getTvById,
  getItemHistory,
} from '@/services/MovieService';
import axios from 'axios';
import disableScroll from 'disable-scroll';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { message } from 'ant-design-vue';
import { ViewFormatter } from '@/utils/convertViews';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
    type: {
      type: String,
    },
    getDataWhenRemoveList: {
      type: Function,
    },
  },
  setup(props) {
    const store = useStore();
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);
    const isInHistory = ref(false);
    const percent = ref(0);
    const urlShare = computed(() => window.location);

    onMounted(() => {
      const ant_btn = document.querySelectorAll('.action .viewmore-btn');

      ant_btn?.forEach((btn) => {
        btn?.addEventListener('click', () => {
          if (btn?.classList.contains('ant-dropdown-open')) {
            disableScroll.on();
          } else {
            disableScroll.off();
          }
        });

        btn?.addEventListener('blur', () => {
          disableScroll.off();
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
    });

    const temp = () => {
      ElMessageBox({
        title: 'Thông báo',
        message: h(
          'h3',
          null,
          'Bạn có muốn xóa phim khỏi danh sách theo dõi không?'
        ),
        showCancelButton: true,
        showClose: false,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonText = 'Đang xóa...';
            instance.confirmButtonLoading = true;
            removeItemList(store.state?.userAccount?.id, {
              media_id: props.item?.id,
            })
              .then((movieRespone) => {
                if (movieRespone.data?.success == true) {
                  setTimeout(() => {
                    done();
                    setTimeout(() => {
                      props.getDataWhenRemoveList(movieRespone.data?.results);
                      instance.confirmButtonLoading = false;
                    }, 300);
                  }, 2000);
                } else {
                  ElMessage({
                    type: 'error',
                    message: `Xóa thất bại!`,
                  });
                }
              })
              .catch((e) => {
                instance.confirmButtonLoading = false;
                ElMessage({
                  type: 'error',
                  message: `Xóa thất bại!`,
                });
                if (axios.isCancel(e)) return;
              });
          } else {
            done();
          }
        },
      }).then(() => {
        ElMessage({
          type: 'success',
          message: `Xóa thành công!`,
        });
      });
    };

    const handleRemoveFromList = () => {
      message.loading({ content: 'Đang xóa' });

      removeItemList(store.state?.userAccount?.id, {
        media_id: props.item?.id,
      })
        .then((movieRespone) => {
          if (movieRespone.data?.success == true) {
            setTimeout(() => {
              // props.getDataWhenRemoveList(movieRespone.data?.results);
              props.getDataWhenRemoveList(props.item?.id);
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

    return {
      dataMovie,
      isEpisodes,
      loading,
      isInHistory,
      percent,
      urlShare,
      getBackdrop,
      getAllGenresById,
      getLanguage,
      handleRemoveFromList,
      ViewFormatter,
      temp,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontalFollow.scss"></style>
