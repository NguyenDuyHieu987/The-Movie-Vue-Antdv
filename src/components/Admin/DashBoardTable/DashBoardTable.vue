<template>
  <div class="dashboard-table">
    <el-tabs
      v-model="tableTabActive"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="Phim lẻ" name="movie">
        <el-table
          :data="tableDataMovie"
          style="width: 100%"
          table-layout="fixed"
          :border="true"
          height="500"
        >
          <el-table-column type="expand" fixed>
            <template #default="props">
              <div class="image-container">
                <el-image
                  class="poster"
                  :src="getPoster(props.row.poster_path)"
                  :preview="false"
                  loading="lazy"
                ></el-image>
                <el-image
                  class="backdrop"
                  :src="getPoster(props.row.backdrop_path)"
                  :preview="false"
                  loading="lazy"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed prop="id" label="Id" :width="100" />
          <el-table-column prop="title" label="Title" :width="150" />
          <el-table-column
            prop="original_title"
            label="Original title"
            :width="150"
          />
          <el-table-column label="Original language" :width="150">
            <template #default="props">
              {{
                getLanguage(
                  props.row?.original_language,
                  $store.state.allCountries
                )?.name
                  ? getLanguage(
                      props.row?.original_language,
                      $store.state.allCountries
                    )?.name
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="release_date"
            label="Release date"
            :width="130"
          />
          <el-table-column prop="genres" label="Genres" :width="200" />
          <el-table-column prop="image" label="Image" align="center">
            <el-table-column prop="poster" label="Poster" :width="100" />
            <el-table-column prop="backdrop" label="Backdrop" :width="300" />
          </el-table-column>
          <el-table-column fixed="right" label="Operations" :width="130">
            <template #default>
              <el-button link type="info" size="small" @click="handleClick"
                >Detail
              </el-button>
              <el-button link type="primary" size="small">Edit</el-button>
              <el-button link type="danger" size="small">Delete </el-button>
            </template>
          </el-table-column>
        </el-table></el-tab-pane
      >
      <el-tab-pane label="Phim bộ" name="tv">
        <el-table
          :data="tableDataTV"
          style="width: 100%"
          table-layout="fixed"
          :border="true"
          height="500"
        >
          <el-table-column fixed prop="id" label="Id" :width="100" />
          <el-table-column prop="name" label="Name" :width="150" />
          <el-table-column
            prop="original_name"
            label="Original name"
            :width="150"
          />
          <el-table-column label="Original language" :width="150">
            <template #default="props">
              {{
                getLanguage(
                  props.row?.original_language,
                  $store.state.allCountries
                )?.name
                  ? getLanguage(
                      props.row?.original_language,
                      $store.state.allCountries
                    )?.name
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="first_air_date"
            label="First air date"
            :width="130"
          />
          <el-table-column
            prop="last_air_date"
            label="Last air date"
            :width="130"
          />

          <el-table-column prop="genres" label="Genres" :width="200" />
          <el-table-column prop="image" label="Image" align="center">
            <el-table-column prop="poster" label="Poster" :width="100" />
            <el-table-column prop="backdrop" label="Backdrop" :width="300" />
          </el-table-column>
          <el-table-column fixed="right" label="Operations" :width="130">
            <template #default>
              <el-button link type="info" size="small" @click="handleClick"
                >Detail
              </el-button>
              <el-button link type="primary" size="small">Edit</el-button>
              <el-button link type="danger" size="small">Delete </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import {
  getMovies,
  getTv,
  getLanguage,
  getPoster,
} from '@/services/MovieService';
import axios from 'axios';
export default {
  setup() {
    const tableDataMovie = ref([]);
    const tableDataTV = ref([]);

    const tableTabActive = ref('movie');

    onBeforeMount(() => {
      Promise.all([getMovies(1), getTv(1)])
        .then((movieResponse) => {
          tableDataMovie.value = movieResponse[0]?.data?.results;
          tableDataTV.value = movieResponse[1]?.data?.results;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    return {
      tableTabActive,
      tableDataMovie,
      tableDataTV,
      getLanguage,
      getPoster,
    };
  },
};
</script>

<style lang="scss" scoped src="./DashBoardTable.scss"></style>
