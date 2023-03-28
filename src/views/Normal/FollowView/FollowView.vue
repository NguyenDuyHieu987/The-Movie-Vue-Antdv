<template>
  <div class="follow">
    <div v-if="isLogin" class="follow-container">
      <a-layout>
        <Teleport
          to="#topic-follow-column-teleport"
          v-if="dataList[0]?.backdrop_path"
        >
          <a-layout-sider class="topic-follow-column" :width="340">
            <div class="column-container">
              <div class="backdrop">
                <a-image
                  :src="getPoster(dataList[0]?.backdrop_path)"
                  :preview="false"
                >
                </a-image>
              </div>
              <img
                class="overlay-image"
                :src="getPoster(dataList[0]?.backdrop_path)"
              />
              <div class="info">
                <h2 class="title">
                  <strong>Video đã thêm vào danh sách phát</strong>
                </h2>
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
            <MovieCardHorizontalHistory
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
import MovieCardHorizontalHistory from '@/components/Normal/MovieCardHorizontalHistory/MovieCardHorizontalHistory.vue';
import {
  //  getList,
  getPoster,
  getMovies,
  getColorImage,
} from '@/services/MovieService';
import { useMeta } from 'vue-meta';
// import { extractColors } from 'extract-colors';

export default {
  components: { MovieCardHorizontalHistory },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);
    const dataList = ref([]);
    const internalInstance = getCurrentInstance();

    // document.title = 'Phimhay247 - Theo dõi';
    useMeta({
      title: '`Phimhay247 - Theo dõi',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    const getData = () => {
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

          getColorImage(dataList.value[0]?.backdrop_path)
            .then((colorResponse) => {
              const color = colorResponse.data?.color;
              // const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1), rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.75), rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5), rgba(15, 15, 15, 0.25), rgba(0, 0, 0, 0));`;
              const main_color = `linear-gradient(to bottom, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.33) 33%, rgba(0, 0, 0, 1) 100%);`;
              const topic_follow_column = document.getElementsByClassName(
                'topic-follow-column'
              )[0];

              topic_follow_column.style = `background-image: ${main_color}`;
              // topic_follow_column.style = `background: url("${getPoster(
              //   dataList.value[0]?.backdrop_path
              // )}");`;

              // topic_follow_column.style.setProperty(
              //   '--main-color',
              //   `${main_color}`
              // );
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          // const imageURL = getPoster(dataList.value[0]?.backdrop_path);

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
        })
        .catch((e) => {
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
      isLogin,
      dataList,
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
