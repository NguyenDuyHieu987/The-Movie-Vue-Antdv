<template>
  <div class="movie-history-item-wrapper">
    <p class="timeline" v-if="timeLine?.length">
      <span v-if="timeLine.includes('-')">
        {{ timeLine.split(' - ')[0] }}
        <span style="margin: 0px 5px">-</span>
        {{ timeLine.split(' - ')[1] }}
      </span>
      <span v-else>
        {{ timeLine }}
      </span>
    </p>
    <el-skeleton :loading="loading" animated class="movie-history-item">
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
      <template #default>
        <router-link
          :to="{
            name: isEpisodes ? 'infoTV' : 'info',
            params: {
              id: item?.id,
              name: item?.name?.replace(/\s/g, '+').toLowerCase(),
            },
          }"
          class="movie-history-item"
        >
          <div class="img-box">
            <img
              class="ant-image"
              v-lazy="getBackdrop(item?.backdrop_path, ',250')"
              :preview="false"
            />

            <div
              class="percent-viewed"
              :style="{ width: percent * 100 + '%' }"
            ></div>
            <div class="viewed-overlay-bar"></div>
          </div>

          <div class="info">
            <h2 class="title">
              <strong>
                {{ item?.name }}
                <strong v-if="isEpisodes">
                  {{
                    ' - Phần ' + dataMovie?.last_episode_to_air?.season_number
                  }}
                </strong>
              </strong>
            </h2>

            <p v-if="isEpisodes" class="duration-episode">
              Tập mới nhất:
              {{
                dataMovie?.last_episode_to_air?.episode_number
                  ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                  : ''
              }}
            </p>

            <p v-else class="duration-episode">
              Thời lượng:
              {{ dataMovie?.runtime ? dataMovie?.runtime + ' phút' : '' }}
            </p>

            <div class="year-views">
              <p class="year" v-if="!isEpisodes">
                Năm:
                {{ dataMovie?.release_date?.slice(0, 4) }}
              </p>

              <p class="year" v-else>
                Năm:
                {{
                  dataMovie?.last_air_date?.slice(0, 4)
                    ? dataMovie?.last_air_date?.slice(0, 4)
                    : dataMovie?.first_air_date?.slice(0, 4)
                }}
              </p>

              <p class="views">
                {{ ViewFormatter(dataMovie?.views) }} lượt xem
              </p>
            </div>

            <p class="overview">
              {{ dataMovie?.overview }}
            </p>

            <div class="action">
              <a-tooltip
                title="Xóa khỏi Lịch sử xem"
                content="Xóa khỏi Lịch sử xem"
                effect="dark"
                placement="bottom"
                :teleported="false"
              >
                <el-button
                  circle
                  shape="circle"
                  size="large"
                  class="remove-btn"
                  @click.prevent="handleRemoveFromHistory"
                >
                  <template #icon>
                    <!-- <Close /> -->
                    <i class="fa-light fa-xmark"></i>
                  </template>
                </el-button>
              </a-tooltip>

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
                          <!-- <i class="fa-sharp fa-regular fa-play"></i> -->
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

                        <router-link
                          v-if="isEpisodes && !loading"
                          :to="{
                            name: 'playTV',
                            params: {
                              id: item?.id,
                              name: item?.name
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
                                ?.replace(/\s/g, '+')
                                .toLowerCase(),
                            },
                          }"
                          class="btn-play-now"
                        >
                          <span>Đến trang xem phim</span>
                        </router-link>
                      </a-menu-item>
                      <a-menu-item key="add-list" @click="handelAddToList">
                        <template #icon>
                          <span
                            v-if="isAddToList"
                            class="material-icons-outlined"
                          >
                            playlist_add_check
                          </span>

                          <span v-else class="material-icons-outlined">
                            playlist_add
                          </span>
                        </template>
                        <span v-if="isAddToList">Xóa khỏi Danh sách phát</span>

                        <span v-else>Thêm vào Danh sách phát</span>
                      </a-menu-item>

                      <a-menu-item key="share">
                        <template #icon>
                          <!-- <font-awesome-icon icon="fa-solid fa-share" /> -->
                          <!-- <i class="fa-sharp fa-regular fa-share"></i> -->
                          <svg
                            class="icones share"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 256 256"
                          >
                            <path
                              fill="currentColor"
                              d="m240.49 103.52l-80-80A12 12 0 0 0 140 32v36.74c-25.76 3.12-53.66 15.89-76.75 35.47c-29.16 24.74-47.32 56.69-51.14 90A16 16 0 0 0 39.67 207c10.46-11.14 47-45.74 100.33-50.42V192a12 12 0 0 0 20.48 8.48l80-80a12 12 0 0 0 .01-16.96ZM164 163v-19a12 12 0 0 0-12-12c-49 0-86.57 21.56-109.79 40.11c7.13-18.16 19.63-35.22 36.57-49.59C101.3 103.41 128.67 92 152 92a12 12 0 0 0 12-12V61l51 51Z"
                            />
                          </svg>
                        </template>
                        <span>
                          <ShareNetwork
                            network="facebook"
                            :url="urlShare"
                            :title="dataMovie?.name"
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
                        key="remove-history"
                        class="remove-history"
                        @click="handleRemoveFromHistory"
                      >
                        <template #icon>
                          <font-awesome-icon icon="fa-solid fa-trash-can" />
                        </template>
                        <span>Xóa khỏi Lịch sử xem</span>
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
import { ref, onBeforeMount, computed, onMounted } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getBackdrop,
  getLanguage,
  removeItemHistory,
  getMovieById,
  getTvById,
  addItemList,
  removeItemList,
  // getItemList,
} from '@/services/MovieService';
import disableScroll from 'disable-scroll';
import axios from 'axios';
// import { useStore } from 'vuex';
// import { CloseOutlined } from '@ant-design/icons-vue';
// import { Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';
import { ViewFormatter } from '@/utils/convertViews';
import _ from 'lodash';

export default {
  // components: { Close },
  props: {
    item: {
      type: Object,
    },
    prevItem: {
      type: Object,
    },
    type: {
      type: String,
    },
    getDataWhenRemoveHistory: {
      type: Function,
    },
  },
  setup(props) {
    // const store = useStore();
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);
    const urlShare = computed(() => window.location);
    const percent = ref(0);
    const isAddToList = ref(false);
    const differenceDate = ref(0);
    const timeLine = ref('');

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

    onBeforeMount(async () => {
      loading.value = true;
      percent.value = props.item?.percent;

      const prev_date_old = new Date(props.prevItem?.created_at);
      const date_old = new Date(props.item?.created_at);
      const date_new = new Date();
      // console.log(date_old.toISOString().slice(0, 10));
      // console.log(date_new.toISOString());
      differenceDate.value = date_new.getTime() - date_old.getTime();
      const totalDays = Math.round(differenceDate.value / (1000 * 3600 * 24));
      // console.log(totalDays + ' days to world Cup');

      const moment = require('moment');
      // const date_old1 = moment(date_old).format('DD/MM/YYYY');
      const date_old_moment_format =
        _.capitalize(moment(date_old).locale('vi').fromNow()) +
        ' - ' +
        moment(date_old).locale('vi').format('LL');
      // console.log(moment(date_old).locale('vi').format('dddd'));
      // console.log(moment(date_old).locale('vi').fromNow());

      if (props?.prevItem) {
        if (
          prev_date_old.toISOString().slice(0, 10) !=
          date_old.toISOString().slice(0, 10)
        ) {
          switch (totalDays) {
            case 0:
              timeLine.value = 'Hôm nay';
              break;
            case 1:
              timeLine.value = 'Hôm qua';
              break;
            // case 2:
            //   timeLine.value = '2 Ngày trước';
            //   break;
            // case 3:
            //   timeLine.value = '3 Ngày trước';
            //   break;
            // case 4:
            //   timeLine.value = '4 Ngày trước';
            //   break;
            // case 5:
            //   timeLine.value = '5 Ngày trước';
            //   break;
            // case 6:
            //   timeLine.value = '6 Ngày trước';
            //   break;
            // case 7:
            //   timeLine.value = '1 Tuần trước';
            //   break;
            default:
              timeLine.value = date_old_moment_format;
              break;
          }
        }
      } else {
        switch (totalDays) {
          case 0:
            timeLine.value = 'Hôm nay';
            break;
          case 1:
            timeLine.value = 'Hôm qua';
            break;
          // case 2:
          //   timeLine.value = '2 Ngày trước';
          //   break;
          // case 3:
          //   timeLine.value = '3 Ngày trước';
          //   break;
          // case 4:
          //   timeLine.value = '4 Ngày trước';
          //   break;
          // case 5:
          //   timeLine.value = '5 Ngày trước';
          //   break;
          // case 6:
          //   timeLine.value = '6 Ngày trước';
          //   break;
          // case 7:
          //   timeLine.value = '1 Tuần trước';
          //   break;
          default:
            timeLine.value = date_old_moment_format;
            break;
        }
      }

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            await getMovieById(props.item?.id)
              .then((movieResponed) => {
                isEpisodes.value = false;
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
            await getTvById(props.item?.id)
              .then((tvResponed) => {
                isEpisodes.value = true;
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
          await getTvById(props.item?.id)
            .then((tvResponed) => {
              isEpisodes.value = true;
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
          await getMovieById(props.item?.id)
            .then((movieResponed) => {
              isEpisodes.value = false;
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

      if (dataMovie.value?.in_list) {
        isAddToList.value = true;
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
    });

    const handelAddToList = () => {
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
    };

    const handleRemoveFromHistory = () => {
      message.loading({ content: 'Đang xóa' });

      removeItemHistory({
        media_id: props.item?.id,
      })
        .then((movieRespone) => {
          if (movieRespone.data?.success == true) {
            setTimeout(() => {
              // props.getDataWhenRemoveHistory(movieRespone.data?.results);
              props.getDataWhenRemoveHistory(props.item?.id);

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
      urlShare,
      percent,
      isAddToList,
      differenceDate,
      timeLine,
      getBackdrop,
      getAllGenresById,
      getLanguage,
      handleRemoveFromHistory,
      ViewFormatter,
      handelAddToList,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontalHistory.scss"></style>
