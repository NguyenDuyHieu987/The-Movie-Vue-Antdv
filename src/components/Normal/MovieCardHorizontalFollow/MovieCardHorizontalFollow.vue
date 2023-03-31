<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-follow-item"
  >
    <div class="img-box">
      <!-- v-if="!loading" -->
      <a-image :src="getPoster(item?.backdrop_path)" :preview="false">
      </a-image>
    </div>

    <div class="info">
      <h2 class="title">
        <strong>
          {{ item?.name ? item?.name : item?.title }}
          <strong v-if="isEpisodes">
            {{ ' - Phần ' + item?.last_episode_to_air?.season_number }}
          </strong>
        </strong>
      </h2>

      <p class="genres" v-if="item?.genres">
        Thể loại: {{ Array?.from(item?.genres, (x) => x.name).join(' • ') }}
      </p>
      <p class="genres" v-else-if="item?.genre_ids">
        Thể loại:
        {{
          getAllGenresById(item?.genre_ids, $store.state?.allGenres).join(' • ')
        }}
      </p>
      <!-- <p class="release-date">
        Năm:
        {{ item?.release_date ? item?.release_date : item?.first_air_date }}
      </p> -->
      <p v-if="item?.last_episode_to_air" class="duration-episode">
        Tập mới nhất:
        {{
          item?.last_episode_to_air?.episode_number
            ? 'Tập ' + item?.last_episode_to_air?.episode_number
            : ''
        }}
      </p>
      <p v-else-if="item?.runtime" class="duration-episode">
        Thời lượng:
        {{ item?.runtime ? item?.runtime + ' phút' : '' }}
      </p>

      <p class="overview">
        {{ item?.overview }}
      </p>
    </div>

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
          @click.prevent=""
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
                  <font-awesome-icon icon="fa-solid fa-play" />
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
              <a-menu-item key="share">
                <template #icon>
                  <font-awesome-icon icon="fa-solid fa-share" />
                </template>
                <span>
                  <ShareNetwork
                    network="facebook"
                    :url="urlShare"
                    :title="item?.name ? item?.name : item?.title"
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
  </router-link>
</template>
<script>
import { ref, onBeforeMount, computed, h } from 'vue';
// import axios from 'axios';
import {
  getAllGenresById,
  getPoster,
  getLanguage,
  removeItemList,
} from '@/services/MovieService';
import axios from 'axios';
import disableScroll from 'disable-scroll';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import { message } from 'ant-design-vue';

export default {
  components: {},
  props: {
    item: {
      type: Object,
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
    const genresName = ref([]);
    const isEpisodes = ref(false);
    const loading = ref(false);
    const urlShare = computed(() => window.location);

    onBeforeMount(() => {
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

      loading.value = true;

      if (props?.type) {
        switch (props?.type) {
          case 'movie':
            isEpisodes.value = false;
            loading.value = false;

            break;
          case 'tv':
            isEpisodes.value = true;
            loading.value = false;
            break;
          default:
            break;
        }
      } else {
        if (props?.item?.media_type == 'tv' || props?.item?.type) {
          isEpisodes.value = true;
          loading.value = false;
        } else {
          isEpisodes.value = false;
          loading.value = false;
        }
      }
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
              props.getDataWhenRemoveList(movieRespone.data?.results);
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
      genresName,
      isEpisodes,
      loading,
      urlShare,
      getPoster,
      getAllGenresById,
      getLanguage,
      handleRemoveFromList,
      temp,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontalFollow.scss"></style>
