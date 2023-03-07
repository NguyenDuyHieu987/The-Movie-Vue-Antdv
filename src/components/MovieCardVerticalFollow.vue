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
      <!-- v-if="item?.id"
      :to="{
        name: 'info',
        params: {
          id: item?.id,
          name: item?.name
            ? item?.name?.replace(/\s/g, '+').toLowerCase()
            : item?.title?.replace(/\s/g, '+').toLowerCase(),
        },
      }" -->

      <div class="img-box">
        <a-image
          v-if="!loading"
          class="movie-carousel-img"
          :src="
            getPoster(
              item?.poster_path ? item?.poster_path : item?.backdrop_path
            )
          "
          :preview="false"
          v-lazy="
            getPoster(
              item?.poster_path ? item?.poster_path : item?.backdrop_path
            )
          "
        >
        </a-image>

        <a-skeleton-image v-else class="ant-image" />

        <div class="duration-episode-box">
          <p class="duration-episode">
            {{
              isEpisodes
                ? dataMovie?.number_of_episodes
                  ? dataMovie?.number_of_episodes + '-Tập'
                  : ''
                : dataMovie?.runtime
                ? dataMovie?.runtime + ' phút'
                : ''
            }}
          </p>
        </div>

        <div class="release-date-box">
          <p class="release-date">
            {{
              item?.release_date
                ? item?.release_date?.slice(0, 4)
                : item?.first_air_date?.slice(0, 4)
            }}
          </p>
        </div>
      </div>

      <div class="info">
        <a-skeleton
          :loading="loading"
          :active="true"
          :paragraph="{ rows: 2 }"
          :title="false"
        >
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
        </a-skeleton>
      </div>
    </router-link>
    <a-button style="width: 100%" danger @click="handleRemoveFromList()">
      <span v-if="activeTabList == 'list'">Xóa khỏi danh sách phát</span>
      <span v-else-if="activeTabList == 'history'">Xóa khỏi lịch sử xem</span>
    </a-button>
  </div>
</template>
<script>
import { ref, onBeforeMount, createVNode } from 'vue';
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
} from '../services/MovieService';
import { Modal, message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
    activeTabList: String,
    getDataWhenRemoveList: Function,
    getDataWhenRemoveHistory: Function,
  },
  setup(props) {
    const store = useStore();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const loading = ref(false);

    const getDataMovie = () => {
      getTvById(props.item?.id)
        .then((tvResponed) => {
          if (tvResponed?.data?.not_found === true)
            getMovieById(props.item?.id)
              .then((movieResponed) => {
                isEpisodes.value = false;
                dataMovie.value = movieResponed?.data;
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          else {
            isEpisodes.value = true;
            dataMovie.value = tvResponed?.data;
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };
    onBeforeMount(() => {
      loading.value = true;

      getDataMovie();

      setTimeout(() => {
        loading.value = false;
      }, 1500);
    });

    const handleRemoveFromList = () => {
      if (props.activeTabList == 'list') {
        Modal.confirm({
          title: `Bạn có mướn xóa phim: "${
            dataMovie.value?.name
              ? dataMovie.value?.name
              : dataMovie.value?.title
          }" khỏi danh sách theo dõi không?`,
          icon: createVNode(QuestionCircleOutlined),
          // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
          content: createVNode('div', {}, ''),
          okText: 'Có',
          okType: 'default',
          cancelText: 'Không',
          onOk() {
            removeItemList(store.state.userAccount?.id, {
              media_id: +dataMovie.value?.id,
            })
              .then((response) => {
                message.loading({
                  content: 'Đang xóa khỏi danh sách...',
                  duration: 2,
                });
                if (response.data?.success == true) {
                  setTimeout(() => {
                    message.success({
                      content: 'Xóa thành công!',
                      duration: 2,
                    });
                    props.getDataWhenRemoveList(response.data?.results);
                  }, 2200);
                }
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          },
          onCancel() {},
          class: 'require-login-confirm',
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
          class: 'require-login-confirm',
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
<style lang="scss">
@media only screen and (min-width: 2300px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(10, minmax(10%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
        }
      }
    }
  }
}

@media only screen and (max-width: 2300px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(9, minmax(11%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
        }
      }
    }
  }
}

@media only screen and (max-width: 2100px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(8, minmax(13%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
          height: 260px !important;
        }
      }
    }
  }
}

@media only screen and (max-width: 1800px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(7, minmax(14%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
        }
      }
    }
  }
}

@media only screen and (max-width: 1550px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(6, minmax(15%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
        }
      }
    }
  }
}

@media only screen and (max-width: 1250px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(5, minmax(17%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
        }
      }
    }
  }
}

@media only screen and (max-width: 1150px) {
  .follow-container {
    // grid-template-columns: repeat(auto-fit, minmax(160px, auto));

    .movie-group {
      grid-template-columns: repeat(5, minmax(17%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
          height: 230px !important;
        }
      }
    }
  }
}

@media only screen and (max-width: 1000px) {
  .follow-container {
    // grid-template-columns: repeat(3, minmax(160px, auto)) !important;

    .movie-group {
      grid-template-columns: repeat(4, minmax(25%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
          height: 220px !important;
        }
      }
    }
  }
}

@media only screen and (max-width: 900px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(3, minmax(33%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
          height: 250px !important;
        }
      }
    }
  }
}

@media only screen and (max-width: 600px) {
  .follow-container {
    .movie-group {
      grid-template-columns: repeat(2, minmax(50%, auto)) !important;

      .movie-card-vertical-item {
        .img-box {
          transition: all 0.3s;
          height: 250px !important;
        }
      }
    }
  }
}

.follow-container {
  .movie-group {
    display: grid;
    // grid-template-columns: repeat(8, minmax(10%, auto)) !important;

    .movie-card-vertical-item {
      .img-box {
        height: 280px;
        overflow: hidden;
      }
      .ant-image {
        height: 100%;
        width: 100%;
      }

      .remove-list-btn {
        cursor: pointer;
      }
      .ant-skeleton-content .ant-skeleton-paragraph > li + li {
        margin-top: 10px;
      }
      .ant-btn {
        white-space: normal;
      }
    }
  }
}
</style>
