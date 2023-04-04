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
    class="movie-history-item"
  >
    <div class="img-box">
      <a-image :src="getPoster(item?.backdrop_path)" :preview="false">
      </a-image>
      <div class="percent-viewed" :style="{ width: percent * 100 + '%' }"></div>
      <div class="viewed-overlay-bar"></div>
    </div>

    <div class="info">
      <h2 class="title">
        <strong>
          {{ item?.name ? item?.name : item?.title }}
          <strong v-if="isEpisodes">
            {{ ' - Phần ' + dataMovie?.last_episode_to_air?.season_number }}
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
        <p class="views">{{ ViewFormatter(dataMovie?.views) }} lượt xem</p>
      </div>

      <p class="overview">
        {{ dataMovie?.overview }}
      </p>
    </div>

    <div class="action">
      <el-tooltip
        title="Xóa khỏi Lịch sử xem"
        content="Xóa khỏi Lịch sử xem"
        effect="dark"
        placement="bottom"
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
      </el-tooltip>

      <a-dropdown
        :trigger="['click']"
        placement="bottomRight"
        class="dropdown-viewmore"
      >
        <el-button circle shape="circle" size="large" class="viewmore-btn">
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
                        : item?.title?.replace(/\s/g, '+').toLowerCase(),
                    },
                  }"
                  class="btn-play-now"
                >
                  <span>Đến trang xem phim</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="add-list" @click="handelAddToList">
                <template #icon>
                  <span v-if="isAddToList" class="material-icons-outlined">
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
                  <i class="fa-sharp fa-regular fa-share"></i>
                </template>
                <span>
                  <ShareNetwork
                    network="facebook"
                    :url="urlShare"
                    :title="
                      dataMovie?.name ? dataMovie?.name : dataMovie?.title
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
  </router-link>
</template>
<script>
import { ref, onBeforeMount, computed, onMounted } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getLanguage,
  removeItemHistory,
  getMovieById,
  getTvById,
  addItemList,
  removeItemList,
  getItemList,
} from '@/services/MovieService';
import disableScroll from 'disable-scroll';
import axios from 'axios';
import { useStore } from 'vuex';
// import { CloseOutlined } from '@ant-design/icons-vue';
// import { Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';
import { ViewFormatter } from '@/utils/convertViews';

export default {
  // components: { Close },
  props: {
    item: {
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
    const store = useStore();
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);
    const urlShare = computed(() => window.location);
    const percent = ref(0);
    const isAddToList = ref(false);

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
      percent.value = props.item?.percent;

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            getMovieById(props.item?.id)
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
            getTvById(props.item?.id)
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
          getTvById(props.item?.id)
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
          getMovieById(props.item?.id)
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

      getItemList(store.state?.userAccount?.id, props.item?.id)
        .then((movieRespone) => {
          if (movieRespone?.data.success == true) {
            isAddToList.value = true;
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const handelAddToList = () => {
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
    };

    const handleRemoveFromHistory = () => {
      message.loading({ content: 'Đang xóa' });

      removeItemHistory(store.state?.userAccount?.id, {
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
      getPoster,
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
