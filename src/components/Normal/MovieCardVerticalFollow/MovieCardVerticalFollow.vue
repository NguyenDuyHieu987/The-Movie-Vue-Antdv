<template>
  <div style="display: flex; flex-direction: column">
    <router-link
      :to="{
        path: `/info/${item?.id}/${
          item?.name
            ? item?.name?.replace(/\s/g, '+').toLowerCase()
            : item?.title?.replace(/\s/g, '+').toLowerCase()
        }`,
      }"
      class="movie-card-vertical-item"
    >
      <el-skeleton :loading="loading" animated style="margin-bottom: 10px">
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
              v-if="!loading"
              class="movie-card-img"
              :src="getPoster(dataMovie?.poster_path)"
              :preview="false"
            >
            </a-image>

            <!-- <a-skeleton-image v-else class="ant-image" /> -->

            <div class="duration-episode-box" v-if="!loading">
              <p class="duration-episode">
                {{
                  isEpisodes
                    ? dataMovie?.last_episode_to_air?.episode_number
                      ? 'Tập ' + dataMovie?.last_episode_to_air?.episode_number
                      : ''
                    : dataMovie?.runtime
                    ? dataMovie?.runtime + ' phút'
                    : ''
                }}
              </p>
            </div>

            <div class="release-date-box" v-if="!loading">
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
              <p class="genres" v-if="item?.genres">
                {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
              </p>
              <p class="genres" v-else>
                {{ Array.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
              </p>
            </div>
            <!-- </a-skeleton> -->
          </div>
        </template>
      </el-skeleton>
    </router-link>
    <a-button style="width: 100%" danger @click="handleRemoveFromList()">
      <span v-if="activeTabList == 'list'">Xóa khỏi danh sách</span>
      <span v-else-if="activeTabList == 'history'">Xóa khỏi lịch sử xem</span>
    </a-button>
  </div>
</template>
<script>
import { ref, onBeforeMount, createVNode, h } from 'vue';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getMovieById,
  getLanguage,
  removeItemList,
  handleWatchList,
  getWatchList,
} from '@/services/MovieService';
import { Modal, message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
    type: {
      type: String,
    },
    activeTabList: {
      type: String,
    },
    getDataWhenRemoveList: {
      type: Function,
    },
    getDataWhenRemoveHistory: {
      type: Function,
    },
  },
  setup(props) {
    const store = useStore();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;

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
        if (props?.item?.type) {
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
      //       isEpisodes.value = true;
      //       dataMovie.value = tvResponed?.data;

      //       setTimeout(() => {
      //         loading.value = false;
      //       }, 1000);
      //     }
      //   })
      //   .catch((e) => {
      //     loading.value = false;
      //     if (axios.isCancel(e)) return;
      //   });
    });

    const handleRemoveFromList = () => {
      if (props.activeTabList == 'list') {
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
                media_id: dataMovie.value?.id,
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
                      message: `Xóa không thành công!`,
                    });
                  }
                })
                .catch((e) => {
                  instance.confirmButtonLoading = false;
                  ElMessage({
                    type: 'error',
                    message: `Xóa không thành công!`,
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
      } else if (props.activeTabList == 'history') {
        Modal.confirm({
          title: `Bạn có mướn xóa phim: "${
            dataMovie.value?.name
              ? dataMovie.value?.name
              : dataMovie.value?.title
          }" khỏi lịch sử xem không?`,
          icon: createVNode(QuestionCircleOutlined),
          // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
          content: createVNode('div', {}, ''),
          okText: 'Có',
          okType: 'default',
          cancelText: 'Không',
          onOk() {
            handleWatchList(store.state.userAccount?.id, {
              media_id: +dataMovie.value?.id,
              watchlist: false,
            });

            message.loading({
              content: 'Đang xóa khỏi lịch sử xem...',
              duration: 2,
            });
            setTimeout(() => {
              message.success({ content: 'Xóa thành công!', duration: 2 });

              getWatchList(store?.state.userAccount?.id, 1)
                .then((movieRespone) => {
                  props.getDataWhenRemoveHistory(movieRespone.data?.results);
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
            }, 2200);
          },
          onCancel() {},
        });
      }
    };

    return {
      genresName,
      isEpisodes,
      dataMovie,
      loading,
      getPoster,
      getAllGenresById,
      getLanguage,
      handleRemoveFromList,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardVerticalFollow.scss"></style>
