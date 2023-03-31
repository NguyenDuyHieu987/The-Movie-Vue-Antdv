<template>
  <router-link
    :to="{
      path: `/info/${item?.id}/${
        item?.name
          ? item?.name?.replace(/\s/g, '+').toLowerCase()
          : item?.title?.replace(/\s/g, '+').toLowerCase()
      }`,
    }"
    class="movie-history-item"
  >
    <div class="img-box">
      <a-image :src="getPoster(item?.backdrop_path)" :preview="false">
      </a-image>
      <div class="percent-viewed" :style="{ width: percent * 100 + '%' }"></div>
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
          @click.prevent=""
        >
          <template #icon>
            <Close />
          </template>
        </el-button>
      </el-tooltip>

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
              <a-menu-item key="add-list">
                <template #icon>
                  <span class="material-icons-outlined"> playlist_add </span>
                </template>
                <span>Thêm vào Danh sách phát</span>
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
} from '@/services/MovieService';
import disableScroll from 'disable-scroll';
import axios from 'axios';
import { useStore } from 'vuex';
// import { CloseOutlined } from '@ant-design/icons-vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { message } from 'ant-design-vue';

export default {
  components: { Close },
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
    const isEpisodes = ref(false);
    const loading = ref(false);
    const urlShare = computed(() => window.location);
    const percent = ref(0);

    onMounted(() => {});

    onBeforeMount(() => {
      loading.value = true;
      percent.value = props.item?.percent;
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

    const handleRemoveFromHistory = () => {
      message.loading({ content: 'Đang xóa' });

      removeItemHistory(store.state?.userAccount?.id, {
        media_id: props.item?.id,
      })
        .then((movieRespone) => {
          if (movieRespone.data?.success == true) {
            setTimeout(() => {
              props.getDataWhenRemoveHistory(movieRespone.data?.results);
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
      isEpisodes,
      loading,
      urlShare,
      percent,
      getPoster,
      getAllGenresById,
      getLanguage,
      handleRemoveFromHistory,
    };
  },
};
</script>
<style lang="scss" src="./MovieCardHorizontalHistory.scss"></style>
