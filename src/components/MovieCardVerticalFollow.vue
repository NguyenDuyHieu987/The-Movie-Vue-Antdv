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
      class="movie-carousel-vertical-item"
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
          </p>
          <div class="info-bottom">
            <p class="genres" v-if="item?.genres">
              {{ Array.from(item?.genres, (x) => x.name).join(' • ') }}
            </p>
            <p class="genres" v-else-if="item?.genre_ids">
              {{ getAllGenresById(item?.genre_ids).join(' • ') }}
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
  getMovieSeriesById,
  getMovieById,
  getLanguage,
  removeItemList,
  handleWatchList,
  getList,
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
      getMovieSeriesById(props.item?.id)
        .then((tvResponed) => {
          if (tvResponed?.data === null)
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
            });

            message.loading({
              content: 'Đang xóa khỏi danh sách...',
              duration: 2,
            });
            setTimeout(() => {
              message.success({ content: 'Xóa thành công!', duration: 2 });

              getList(store?.state.userAccount?.id)
                .then((movieRespone) => {
                  props.getDataWhenRemoveList(movieRespone.data?.items);
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
            }, 2200);
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
@media only screen and (max-width: 1150px) {
  .movie-group.upcoming {
    // grid-template-columns: repeat(auto-fit, minmax(160px, auto));
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 220px !important;
    }
  }
}

@media only screen and (max-width: 1050px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(150px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 230px !important;
    }
  }
}

@media only screen and (max-width: 970px) {
  .movie-group.upcoming {
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 250px !important;
    }
  }
}

@media only screen and (max-width: 800px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(140px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 210px !important;
    }
  }
}

@media only screen and (max-width: 740px) {
  .movie-group.upcoming {
    grid-template-columns: repeat(auto-fit, minmax(160px, auto)) !important;
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 250px !important;
    }
  }
}

@media only screen and (max-width: 410px) {
  .movie-group.upcoming {
  }

  .movie-carousel-vertical-item {
    .img-box {
      transition: all 0.3s;
      height: 210px !important;
    }
  }
}

.movie-carousel-vertical-item {
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
}

// .movie-carousel-vertical-item {
//   color: #fff;
//   cursor: pointer;
//   position: relative;
//   display: block;
//   // overflow: hidden;

//   .img-box {
//     position: relative;
//   }

//   .ant-image {
//     width: 100%;

//     .ant-image-img {
//       border-top-right-radius: 5px;
//       border-top-left-radius: 5px;
//       transition: all 0.3s;
//       height: 100%;
//     }
//   }

//   &:hover {
//     img {
//       transform: scale(1.05);
//       opacity: 0.7;
//     }

//     .duration-episode-box {
//       background-size: 200% 100%;
//       background-position: -50px center;
//     }

//     .release-date-box {
//       background-size: 200% 100%;
//       background-position: -45px center;
//     }

//     .info {
//       color: #ffffff;
//     }
//   }

//   .duration-episode-box {
//     color: #fff;
//     background-image: linear-gradient(
//       to right,
//       var(--sider-header-background-color1),
//       var(--sider-header-background-color2),
//       var(--sider-header-background-color3)
//     );
//     background-size: 200% 100%;
//     position: absolute;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5px;
//     padding: 5px 10px;
//     box-shadow: #000000bf 0px 3px 10px;
//     left: 5px;
//     top: 5px;
//     transition: all 0.7s;
//     .duration-episode {
//       font-size: 12px;
//     }
//   }

//   .release-date-box {
//     color: #fff;
//     background-image: linear-gradient(
//       to right,
//       var(--sider-header-background-color3),
//       var(--sider-header-background-color2),
//       var(--sider-header-background-color1)
//     );
//     background-size: 200% 100%;
//     position: absolute;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5px;
//     padding: 5px 10px;
//     box-shadow: #000000bf 0px 3px 10px;
//     right: 5px;
//     bottom: 5px;
//     transition: all 0.7s;

//     .release-date {
//       font-size: 12px;
//     }
//   }

//   .info {
//     padding: 10px 0px;
//     color: #3b3b3b;

//     .title,
//     .genres {
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }

//     .info-bottom {
//       display: flex;

//       p + p {
//         margin-left: 5px;
//       }
//     }
//   }
// }
</style>
