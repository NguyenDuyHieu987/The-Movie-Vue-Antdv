<template>
  <router-link
    :to="{
      name: 'info',
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
            v-show="!loading"
            :src="getPoster(dataMovie?.backdrop_path)"
            :preview="false"
          >
          </a-image>

          <!-- <a-skeleton-image v-else class="ant-image" /> -->

          <div v-show="!loading" class="duration-episode-box">
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

          <div v-show="!loading" class="release-date-box">
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
      <div class="img-box">
        <a-image
          class="ant-image"
          v-show="!loading"
          :src="getPoster(dataMovie?.backdrop_path)"
          :preview="false"
          @load="onLoadImg"
        >
        </a-image>
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
                :url="$route.fullPath"
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
                  path: `/info/${item?.id}/${
                    item?.name
                      ? item?.name?.replace(/\s/g, '+').toLowerCase()
                      : item?.title?.replace(/\s/g, '+').toLowerCase()
                  }`,
                }"
              >
                <a-button shape="circle" size="large">
                  <template #icon>
                    <InfoOutlined />
                  </template>
                </a-button>
              </router-link>
            </el-tooltip>
          </div>
        </div>
        <div class="info">
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
            <p
              class="genres"
              v-else-if="item?.genres == undefined && dataMovie?.genres"
            >
              {{ Array.from(dataMovie?.genres, (x) => x.name).join(' • ') }}
            </p>
          </div>

          <div class="country-imdb">
            <p v-if="isEpisodes">
              {{
                dataMovie?.seasons?.find((item) =>
                  item?.season_number ===
                  dataMovie?.last_episode_to_air?.season_number
                    ? item
                    : null
                ).episode_count + ' tập'
              }}
            </p>
            <p v-else>
              {{
                getLanguage(item?.original_language, $store.state.allCountries)
                  ?.name
                  ? getLanguage(
                      item?.original_language,
                      $store.state.allCountries
                    )?.name
                  : ''
              }}
            </p>

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
import { ref, onBeforeMount, createVNode, h, onMounted } from 'vue';
import {
  PlusOutlined,
  InfoOutlined,
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
  getList,
} from '@/services/MovieService';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  Modal,
  // message
} from 'ant-design-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  components: { PlusOutlined, InfoOutlined },
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const genresName = ref([]);
    const dataMovie = ref({});
    const isEpisodes = ref(false);
    const loading = ref(false);
    const dataAddToList = ref([]);
    const isAddToList = ref(false);

    onMounted(() => {
      const itemMovie = document.querySelectorAll(
        '.movie-card-horizontal-item'
      );

      itemMovie.forEach((x) => {
        x?.addEventListener('mouseenter', () => {
          const rect = x.getBoundingClientRect();
          const detailFlow = x.getElementsByClassName('detail-flow');
          if (rect.left <= 300) {
            detailFlow[0].style.left = '0';
            detailFlow[0].style.right = 'auto';
          }

          if (window.innerWidth - rect.right <= 37) {
            detailFlow[0].style.left = 'auto';
            detailFlow[0].style.right = '0';
          }
        });
      });
    });

    onBeforeMount(() => {
      loading.value = true;

      getTvById(props.item?.id)
        .then((tvResponed) => {
          if (tvResponed?.data?.not_found === true)
            getMovieById(props.item?.id)
              .then((movieResponed) => {
                isEpisodes.value = false;
                dataMovie.value = movieResponed?.data;

                setTimeout(() => {
                  loading.value = false;
                }, 1000);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          else {
            setTimeout(() => {
              loading.value = false;
            }, 1000);
            isEpisodes.value = true;
            dataMovie.value = tvResponed?.data;
          }
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });

      if (store.state.isLogin) {
        getList(store.state?.userAccount?.id)
          .then((movieRespone) => {
            dataAddToList.value = movieRespone?.data?.items;

            dataAddToList.value?.map((item) => {
              if (item?.id == dataMovie.value?.id) {
                isAddToList.value = true;
              }
            });
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
          ElMessageBox({
            title: 'Thông báo',
            message: h(
              'h3',
              null,
              'Bạn có muốn thêm phim vào danh sách theo dõi không?'
            ),
            showCancelButton: true,
            showClose: false,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonText = 'Đang thêm...';
                instance.confirmButtonLoading = true;
                addItemList(store.state?.userAccount?.id, {
                  media_type: isEpisodes.value ? 'tv' : 'movie',
                  media_id: dataMovie.value?.id,
                })
                  .then((response) => {
                    if (response.data.success == true) {
                      setTimeout(() => {
                        done();
                        setTimeout(() => {
                          isAddToList.value = true;
                          instance.confirmButtonLoading = false;
                        }, 300);
                      }, 2000);
                    } else {
                      ElMessage({
                        type: 'error',
                        message: `Thêm không thành công!`,
                      });
                    }
                  })
                  .catch((e) => {
                    isAddToList.value = false;
                    instance.confirmButtonLoading = false;
                    ElMessage({
                      type: 'error',
                      message: `Thêm không thành công!`,
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
              message: `Thêm thành công!`,
            });
          });

          // message.loading({ content: 'Đang thêm...', duration: 2 });
          // if (response.data.success == true) {
          //   setTimeout(() => {
          //     message.success({ content: 'Thêm thành công!', duration: 2 });
          //     isAddToList.value = true;
          //   }, 2200);
          // }
        } else {
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
                  .then((response) => {
                    if (response.data.success == true) {
                      setTimeout(() => {
                        done();
                        setTimeout(() => {
                          isAddToList.value = false;
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
                    isAddToList.value = true;
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
        }
      }
    };

    return {
      genresName,
      isEpisodes,
      dataMovie,
      loading,
      isAddToList,
      handelAddToList,
      getPoster,
      getAllGenresById,
      getLanguage,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontal.scss"></style>
