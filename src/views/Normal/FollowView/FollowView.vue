<template>
  <div class="follow">
    <div v-if="isLogin" class="follow-container">
      <a-layout>
        <a-layout-sider
          class="topic-follow-column-responsive"
          width="calc(100% + 40px)"
          v-show="!loading"
        >
          <div class="column-container">
            <div class="top">
              <div class="backdrop">
                <a-image :src="getPoster(topicImage)" :preview="false">
                </a-image>
              </div>
              <img class="overlay-image" :src="getPoster(topicImage)" />

              <div class="info">
                <h2 class="title">
                  <strong>Video đã thêm vào danh sách phát</strong>
                </h2>
              </div>
            </div>
            <div class="bottom">
              <div class="user-info">
                <p>
                  <strong>
                    {{ $store.state.userAccount?.username }}
                  </strong>
                </p>
                <p class="count-video">
                  {{ dataList?.length }} video
                  <span> Cập nhật hôm nay </span>
                </p>
              </div>
              <div class="widget">
                <a-input-search
                  class="search-follow"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @search="handleSearch"
                >
                  <template #enterButton>
                    <el-tooltip
                      title="Tìm kiếm"
                      content="Tìm kiếm"
                      effect="dark"
                      placement="top"
                    >
                      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    </el-tooltip>
                  </template>
                </a-input-search>
              </div>
            </div>
          </div>
        </a-layout-sider>
        <Teleport to="#topic-follow-column-teleport" v-if="!loading">
          <a-layout-sider class="topic-follow-column" :width="340">
            <div class="column-container">
              <div class="backdrop">
                <a-image :src="getPoster(topicImage)" :preview="false">
                </a-image>
              </div>
              <img class="overlay-image" :src="getPoster(topicImage)" />
              <div class="info">
                <h2 class="title">
                  <strong>Video đã thêm vào danh sách phát</strong>
                </h2>
                <p>
                  <strong>
                    {{ $store.state.userAccount?.username }}
                  </strong>
                </p>
                <p class="count-video">
                  {{ dataList?.length }} video
                  <span> Cập nhật hôm nay </span>
                </p>
              </div>

              <div class="widget">
                <a-input-search
                  class="search-follow"
                  placeholder="Tìm kiếm trong danh sách video..."
                  size="large"
                  allowClear
                  bordered
                  :loading="loadingSearch"
                  @search="handleSearch"
                >
                  <template #enterButton>
                    <el-tooltip
                      title="Tìm kiếm"
                      content="Tìm kiếm"
                      effect="dark"
                      placement="top"
                    >
                      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    </el-tooltip>
                  </template>
                </a-input-search>
              </div>
            </div>
          </a-layout-sider>
        </Teleport>

        <a-layout-content class="follow-main-content">
          <h2 class="gradient-title-default">
            <strong>Danh sách phát</strong>
          </h2>
          <!-- <el-scrollbar height="100vh"> -->
          <section class="movie-follow" v-show="dataList?.length">
            <MovieCardHorizontalFollow
              v-for="(item, index) in dataList"
              :index="index"
              :key="item.id"
              :item="item"
              :type="item?.media_type"
            />
          </section>
          <!-- </el-scrollbar> -->
        </a-layout-content>
      </a-layout>
    </div>

    <a-result v-else title="Bạn cần đăng nhập để sử dụng chức năng này">
      <template #extra>
        <a-button
          key="console"
          size="large"
          @click="$router.push({ path: '/login' })"
          >Đăng nhập ngay
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { watch, onBeforeMount, computed, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import MovieCardHorizontalFollow from '@/components/Normal/MovieCardHorizontalFollow/MovieCardHorizontalFollow.vue';
import {
  //  getList,
  getPoster,
  getMovies,
  getColorImage,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';
// import { extractColors } from 'extract-colors';

export default {
  components: { MovieCardHorizontalFollow },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const dataList = ref([]);
    const internalInstance = getCurrentInstance();
    const loading = ref(false);
    const topicImage = ref('');

    // document.title = 'Phimhay247 - Theo dõi';
    useMeta({
      title: '`Phimhay247 - Theo dõi',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    const setBackgroundColor = (color) => {
      const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1), rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5), rgba(0, 0, 0, 1));`;

      // const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.33) 33%, rgba(0, 0, 0, 1) 100%);`;
      const topic_follow_column = document.getElementsByClassName(
        'topic-follow-column'
      )[0];

      if (topic_follow_column) {
        topic_follow_column.style = `background-image: ${main_color}`;

        const search_follow =
          topic_follow_column.querySelector('.search-follow');

        const ant_input_affix_wrapper = search_follow.getElementsByClassName(
          'ant-input-affix-wrapper'
        )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      const topic_follow_column_responsive = document.getElementsByClassName(
        'topic-follow-column-responsive'
      )[0];

      if (topic_follow_column_responsive) {
        topic_follow_column_responsive.style = `background-image: ${main_color}`;

        const search_follow =
          topic_follow_column_responsive.querySelector('.search-follow');

        const ant_input_affix_wrapper = search_follow.getElementsByClassName(
          'ant-input-affix-wrapper'
        )[0];
        ant_input_affix_wrapper.style = `border-bottom: 2px solid rgb(${color[0]}, ${color[1]}, ${color[2]});`;
      }

      // topic_follow_column.style = `background: url("${getPoster(
      //   dataList.value[0]?.backdrop_path
      // )}");`;

      // topic_follow_column.style.setProperty(
      //   '--main-color',
      //   `${main_color}`
      // );
    };

    const getData = () => {
      loading.value = true;
      internalInstance.appContext.config.globalProperties.$Progress.start();

      // getList(store?.state.userAccount?.id)
      //   .then((movieRespone) => {
      //     dataList.value = movieRespone.data?.items?.reverse();

      //     setTimeout(() => {
      //       internalInstance.appContext.config.globalProperties.$Progress.finish();
      //     }, 500);
      //   })
      //   .catch((e) => {
      //     if (axios.isCancel(e)) return;
      //   });

      getMovies(1)
        .then((movieRespone) => {
          dataList.value = movieRespone.data?.results?.reverse();
          topicImage.value = dataList.value[2]?.backdrop_path;

          getColorImage(topicImage.value)
            .then((colorResponse) => {
              const color = colorResponse.data?.color;
              setBackgroundColor(color);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          // const imageURL = getPoster(topicImage.value);

          // const loadedImg = new Image();
          // loadedImg.crossOrigin = 'Anonymous';
          // loadedImg.src = imageURL;
          // loadedImg.setAttribute('crossOrigin', '');

          // extractColors(loadedImg.src)
          //   .then((color) => {
          //     console.log(color);
          //   })
          //   .catch(console.error);

          setTimeout(() => {
            internalInstance.appContext.config.globalProperties.$Progress.finish();
          }, 500);
          loading.value = false;
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });
    };

    onBeforeMount(() => {
      getData();
    });

    const getDataWhenRemoveList = (data) => {
      dataList.value = data;
    };

    watch(route, () => {
      // getData();
    });

    return {
      loading,
      isLogin,
      dataList,
      topicImage,
      getData,
      getPoster,
      getDataWhenRemoveList,
    };
  },
  // beforeRouteEnter() {
  //   alert('g');
  // },
};
</script>

<style lang="scss" src="./FollowView.scss"></style>
