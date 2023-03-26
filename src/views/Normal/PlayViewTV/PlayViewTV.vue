<template>
  <div class="play-container">
    <div class="video-player">
      <iframe
        width="100%"
        height="100%"
        :src="`//ok.ru/videoembed/${
          urlCodeMovie ? urlCodeMovie : '3056793684585'
        }`"
        frameborder="0"
        allow="autoplay"
        allowfullscreen
      ></iframe>
    </div>

    <ListEpisodes
      v-if="!checkEmptyDataMovies"
      :dataMovie="dataMovie"
      :numberOfEpisodes="
        dataMovie?.seasons?.find((item) =>
          item.season_number === dataMovie?.last_episode_to_air?.season_number
            ? item
            : null
        )?.episode_count
      "
      @setUrlCodeMovie="(data) => getUrlCodeMovie(data)"
    />

    <h3 class="section-title width-fit" style="margin-top: 15px">
      <strong> Đánh giá phim</strong>
    </h3>

    <div class="reaction-view">
      <a-skeleton-button
        v-if="loading"
        :loading="loading"
        :active="true"
        :size="'default'"
        :block="false"
        class="skeleton-interaction"
      >
      </a-skeleton-button>
      <Interaction v-else :dataMovie="dataMovie" />
      <a-skeleton-button
        v-if="loading"
        :loading="loading"
        :active="true"
        :size="'default'"
        :block="false"
        class="skeleton-add-to-list"
      >
      </a-skeleton-button>
      <a-button
        v-else
        round
        shape="round"
        type="primary"
        class="add-to-list-btn"
        :class="{ active: isAddToList }"
        @click="handelAddToList"
      >
        <template #icon>
          <font-awesome-icon v-if="isAddToList" icon="fa-solid fa-check" />
          <PlusOutlined v-else />
        </template>
        <span v-if="!isAddToList"> Thêm vòa danh sách</span>
        <span v-else style="margin-left: 8px"> Xóa khỏi danh sách</span>
      </a-button>
    </div>

    <div>
      <a-skeleton
        style="margin-top: 15px"
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 1, width: 360 }"
        :title="false"
      >
        <RatingMovie
          v-show="!checkEmptyDataMovies"
          :voteAverage="dataMovie?.vote_average"
          :voteCount="dataMovie?.vote_count"
          :movieId="dataMovie?.id"
          :isEpisodes="isEpisodes"
        />
      </a-skeleton>
    </div>

    <h3 class="section-title">
      <strong v-if="!checkEmptyDataMovies">
        {{ dataMovie?.name ? dataMovie?.name : dataMovie?.title }}
        {{
          ` (${
            dataMovie?.last_air_date?.slice(0, 4)
              ? dataMovie?.last_air_date?.slice(0, 4)
              : dataMovie?.release_date?.slice(0, 4)
          })`
        }}
      </strong>
      <strong v-else> Nội dung phim </strong>
    </h3>
    <div class="movie-content">
      <a-skeleton
        :loading="loading"
        :active="true"
        :paragraph="{ rows: 3, width: '40%' }"
        :title="false"
      >
        <p :class="{ open: isOpenContent }">
          {{ dataMovie?.overview }}
          <router-link
            :to="{
              name: 'info',
              params: {
                id: dataMovie?.id,
                name: dataMovie?.name
                  ? dataMovie?.name?.replace(/\s/g, '+').toLowerCase()
                  : dataMovie?.title?.replace(/\s/g, '+').toLowerCase(),
              },
            }"
          >
            <strong class="toggle-content"> Chi tiết </strong>
          </router-link>
        </p>
      </a-skeleton>
    </div>

    <h3 class="section-title">
      <strong> Bình luận</strong>
    </h3>
    <div
      class="fb-comments"
      :data-href="urlComment"
      data-width="100%"
      data-numposts="10"
    ></div>

    <MovieSuggest
      v-if="!checkEmptyDataMovies"
      :dataMovie="dataMovie"
      :isEpisodes="isEpisodes"
    />
  </div>
</template>

<script>
import {
  ref,
  onBeforeMount,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
  createVNode,
  h,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getTvById,
  getList,
  addItemList,
  removeItemList,
} from '@/services/MovieService';
import Interaction from '@/components/Normal/Interaction/Interaction.vue';
import RatingMovie from '@/components/Normal/RatingMovie/RatingMovie.vue';
import MovieSuggest from '@/components/Normal/MovieSuggest/MovieSuggest.vue';
import ListEpisodes from '@/components/Normal/ListEpisodes/ListEpisodes.vue';
import { useMeta } from 'vue-meta';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Modal,
  // message
} from 'ant-design-vue';

export default {
  components: {
    Interaction,
    RatingMovie,
    MovieSuggest,
    ListEpisodes,
    PlusOutlined,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const dataMovie = ref({});
    const dataCredit = ref([]);
    const dataSimilar = ref([]);
    const dataRecommend = ref([]);
    const isOpenContent = ref(false);
    const isOpenTrailerYoutube = ref(false);
    const urlComment = computed(() => window.location);
    const loading = ref(false);
    const urlCodeMovie = ref('');
    const isAddToList = ref(false);
    const dataAddToList = ref([]);

    const btnPrev = ref('<i class="fa-solid fa-chevron-left "></i>');
    const btnNext = ref('<i class="fa-solid fa-chevron-right "></i>');
    const internalInstance = getCurrentInstance();

    const getData = () => {
      loading.value = true;
      internalInstance.appContext.config.globalProperties.$Progress.start();

      useMeta({
        title:
          'Phimhay247 - Xem phim - ' +
          Array?.from(
            route.params?.name?.split('+'),
            (x) => x.charAt(0).toUpperCase() + x.slice(1)
          ).join(' ')
            ? 'Phimhay247 - Xem phim - ' +
              Array?.from(
                route.params?.name?.split('+'),
                (x) => x.charAt(0).toUpperCase() + x.slice(1)
              ).join(' ')
            : 'Phimhay247 - Xem phim - ' +
              Array?.from(
                route.params?.name?.split('+'),
                (x) => x.charAt(0).toUpperCase() + x.slice(1)
              ).join(' '),
        htmlAttrs: { lang: 'vi', amp: true },
      });

      getTvById(route.params?.id)
        .then((tvResponed) => {
          isEpisodes.value = true;
          dataMovie.value = tvResponed?.data;

          setTimeout(() => {
            loading.value = false;
            internalInstance.appContext.config.globalProperties.$Progress.finish();
          }, 1500);
        })
        .catch((e) => {
          loading.value = false;
          internalInstance.appContext.config.globalProperties.$Progress.finish();
          if (axios.isCancel(e)) return;
        });

      if (store.state.isLogin) {
        getList(store.state?.userAccount?.id)
          .then((movieRespone) => {
            dataAddToList.value = movieRespone?.data?.items;

            dataAddToList.value?.map((item) => {
              if (item?.id == route.params?.id) {
                isAddToList.value = true;
              }
            });
          })
          .catch((e) => {
            if (axios.isCancel(e)) return;
          });
      }
    };

    onBeforeMount(() => {
      getData();
    });

    onMounted(() => {
      // getData();
    });

    router.beforeEach(() => {
      // if (to.params.slug == 'play') {
      //   dataCredit.value = [];
      //   getData();
      // }
    });

    watch(route, () => {});

    const getUrlCodeMovie = (data) => {
      urlCodeMovie.value = data;
    };

    const checkEmptyDataMovies = computed(() => {
      if (Object.keys(dataMovie.value).length == 0) return true;
      else return false;
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

          // removeItemList(store.state?.userAccount?.id, {
          //   media_id: dataMovie.value?.id,
          // }).then((response) => {
          //   message.loading({ content: 'Đang xóa...', duration: 2 });

          //   if (response.data.success == true) {
          //     setTimeout(() => {
          //       message.success({ content: 'Xóa thành công!', duration: 2 });
          //       isAddToList.value = false;
          //     }, 2200);
          //   }
          // });
        }
      }
    };

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    return {
      genresName,
      isEpisodes,
      dataMovie,
      dataCredit,
      isOpenContent,
      isOpenTrailerYoutube,
      dataSimilar,
      dataRecommend,
      btnPrev,
      btnNext,
      urlComment,
      loading,
      urlCodeMovie,
      checkEmptyDataMovies,
      isAddToList,
      getPoster,
      getAllGenresById,
      getUrlCodeMovie,
      handelAddToList,
    };
  },
};
</script>

<style lang="scss" src="./PlayViewTV.scss"></style>
