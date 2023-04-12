<template>
  <div class="movie-table">
    <el-table
      v-loading="loading"
      element-loading-text="Đang tải dữ liệu..."
      :data="tableDataMovie"
      style="width: 100%"
      table-layout="fixed"
      :border="true"
      height="80vh"
      :lazy="true"
      :fit="true"
    >
      <el-table-column
        fixed
        label="STT"
        :width="60"
        :min-width="60"
        type="index"
        header-align="center"
        align="center"
      />
      <el-table-column fixed prop="id" label="Id" :width="100" />
      <el-table-column prop="title" label="Tên phim" />
      <el-table-column prop="original_title" label="Tên phim gốc" />
      <el-table-column label="Quốc gia" prop="original_language">
        <template #default="props">
          {{
            getLanguage(props.row?.original_language, $store.state.allCountries)
              ?.name
              ? getLanguage(
                  props.row?.original_language,
                  $store.state.allCountries
                )?.name
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column prop="release_date" label="Ngày phát hành" />
      <el-table-column prop="genres" label="Thể loại">
        <template #default="props">
          {{ Array?.from(props.row?.genres, (x) => x.name).join(', ') }}
        </template>
      </el-table-column>
      <el-table-column
        label="Xem thêm"
        type="expand"
        :width="100"
        class="view-more"
      >
        <template #default="props">
          <p class="overview">
            <strong>Nội dung: </strong>{{ props.row?.overview }}
          </p>
          <p class="vote_average">
            <strong>Điểm trung bình: </strong
            >{{ props.row?.vote_average.toFixed(2) }}
          </p>
          <p class="vote_count">
            <strong>Số lượt vote: </strong>{{ props.row?.vote_count }}
          </p>
          <p class="budget">
            <strong>Kinh phí: </strong
            >{{
              props.row?.budget
                .toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }}
          </p>
          <p class="revenue">
            <strong>Doanh thu: </strong
            >{{
              props.row?.revenue
                .toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }}
          </p>
          <p class="status">
            <strong>Trạng thái: </strong>{{ props.row?.status }}
          </p>
          <p class="runtime">
            <strong>Thời lượng: </strong>{{ props.row?.runtime + ' Phút' }}
          </p>
          <p class="views">
            <strong>Lượt xem: </strong
            >{{ ViewFormatter(props.row?.views) + ' lượt xem' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="Ảnh" align="center">
        <el-table-column
          prop="poster"
          label="Poster"
          :width="130"
          align="center"
        >
          <template #default="props">
            <div class="image-container">
              <el-image
                class="poster"
                :src="getPoster(props.row.poster_path)"
                :preview="false"
                loading="lazy"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="backdrop"
          label="Backdrop"
          :width="300"
          align="center"
        >
          <template #default="props">
            <div class="image-container">
              <el-image
                class="backdrop"
                :src="getBackdrop(props.row.backdrop_path)"
                :preview="false"
                loading="lazy"
              >
                <!-- <template #placeholder>
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    Đang tải<span class="dot">...</span>
                  </div>
                </template> -->
              </el-image>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="Thao tác" align="center">
        <template #default="props">
          <el-dropdown trigger="click">
            <el-button type="primary">
              Các thao tác
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link
                    :to="{
                      name: 'editmovie',
                      params: { id: props.row.id },
                    }"
                  >
                    <el-button link>Cập nhật phim</el-button>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link
                    :to="{
                      name: 'editmovie',
                      params: { id: props.row.id },
                    }"
                  >
                    <el-button link>Đổi ảnh</el-button>
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button link type="danger">Xóa phim</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      style="width: 100%"
      @click="$router.push({ name: 'addmovie' })"
      size="large"
    >
      Thêm phim
    </el-button>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import {
  getMovies,
  getLanguage,
  getPoster,
  getBackdrop,
} from '@/services/MovieService';
import axios from 'axios';
import { ArrowDown } from '@element-plus/icons-vue';
import { ViewFormatter } from '@/utils/convertViews';

export default {
  components: {
    ArrowDown,
  },
  setup() {
    const tableDataMovie = ref([]);
    const tableTabActive = ref('movie');
    const loading = ref(false);

    onBeforeMount(() => {
      loading.value = true;
      getMovies(1)
        .then((movieResponse) => {
          tableDataMovie.value = movieResponse?.data?.results;
          setTimeout(() => {
            loading.value = false;
          }, 1000);
        })
        .catch((e) => {
          loading.value = false;
          if (axios.isCancel(e)) return;
        });
    });

    return {
      loading,
      tableTabActive,
      tableDataMovie,
      getLanguage,
      getPoster,
      getBackdrop,
      ViewFormatter,
    };
  },
};
</script>

<style lang="scss" scoped src="./MovieTable.scss"></style>
