<template>
  <a-collapse :bordered="false">
    <!-- ghost -->
    <template #expandIcon="{ isActive }">
      <CaretRightFilled :rotate="isActive ? 90 : 0" />
    </template>

    <a-collapse-panel key="1" header="Tìm kiếm nâng cao">
      <div class="filter-bar">
        <div class="list-input-filter">
          <a-button
            class="filter-btn"
            :disabled="disableBtnFilter"
            @click="handleFilterMovie"
          >
            Lọc phim
          </a-button>

          <a-select
            ref="select"
            v-model:value="formSelect.country"
            style="width: 150px"
            @focus="focus"
            @change="handleChange"
            size="large"
          >
            <a-select-option value="">Quốc gia</a-select-option>
            <a-select-option
              v-for="(item, index) in countries"
              :index="index"
              :key="item?.iso_639_1"
              :value="item?.iso_639_1"
              >{{ item?.name }}
            </a-select-option>
          </a-select>

          <a-select
            ref="select"
            v-model:value="formSelect.year"
            style="width: 170px"
            @focus="focus"
            @change="handleChange"
            size="large"
          >
            <a-select-option value="">Năm phát hành</a-select-option>
            <a-select-option
              v-for="(item, index) in years"
              :index="index"
              :key="item?.name"
              :value="item?.name"
              >{{ item?.name }}
            </a-select-option>
          </a-select>

          <a-select
            ref="select"
            v-model:value="formSelect.genre"
            style="width: 170px"
            @focus="focus"
            @change="handleChange"
            size="large"
          >
            <a-select-option value="">Thể loại</a-select-option>
            <a-select-option
              v-for="(item, index) in genres"
              :index="index"
              :key="item?.id"
              :value="item?.id"
              >{{ item?.name_vietsub }}
            </a-select-option>
          </a-select>

          <a-select
            ref="select"
            v-model:value="formSelect.sortBy"
            style="width: 170px"
            @focus="focus"
            @change="handleChange"
            size="large"
          >
            <a-select-option value="">Sắp xếp theo</a-select-option>
            <a-select-option
              v-for="(item, index) in listSortBy"
              :index="index"
              :key="item?.id"
              :value="item?.id"
              >{{ item?.name }}
            </a-select-option>
          </a-select>

          <a-select
            ref="select"
            v-model:value="formSelect.type"
            style="width: 170px"
            @focus="focus"
            @change="handleChange"
            size="large"
          >
            <a-select-option value="all">Tất cả</a-select-option>
            <a-select-option value="movieall">Phim lẻ</a-select-option>
            <a-select-option value="tvall">Phim bộ</a-select-option>
          </a-select>

          <a-button
            class="cancel-filter-btn"
            :disabled="disableBtnFilter"
            @click="handleCancelFilter"
            :danger="true"
          >
            Hủy lọc
          </a-button>
        </div>
      </div>
      <template #extra>
        <font-awesome-icon icon="fa-solid fa-filter" />
      </template>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import { onBeforeMount, ref, reactive, computed, watch } from 'vue';
import {
  getAllGenre,
  getAllNational,
  getAllYear,
  FilterDataMovie,
} from '../services/MovieService';
import axios from 'axios';
import listSortBy from '../constants/Sortby';
import { CaretRightFilled } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';

export default {
  components: { CaretRightFilled },
  props: {
    type: String,
  },
  setup(props, { emit }) {
    const route = useRoute();

    const movieType = computed(() => {
      let str = '';
      if (route.params?.slug?.includes('movie')) {
        if (route.params?.slug2?.replace('/', '') == 'all') {
          str = 'movieall';
        } else {
          str = route.params?.slug2?.replace('/', '');
        }
      } else if (route.params?.slug?.includes('tv')) {
        if (route.params?.slug2?.replace('/', '') == 'all') {
          str = 'tvall';
        } else {
          str = route.params?.slug2?.replace('/', '');
        }
      } else if (route.params?.slug == 'search') {
        str = 'all';
      }
      return str;
    });

    const formSelect = reactive({
      type: movieType.value,
      sortBy: '',
      genre: '',
      year: '',
      country: '',
      pageFilter: 1,
    });

    // const movieType = computed(() => route.params.slug.replace('/', ''));
    // alert(movieType.value);

    watch(route, () => {
      resetFilter();
    });

    const genres = ref([]);
    const years = ref([]);
    const countries = ref([]);

    onBeforeMount(() => {
      Promise.all([getAllGenre(), getAllYear(), getAllNational()])
        .then((res) => {
          genres.value = res[0].data;
          years.value = res[1].data.sort(function (a, b) {
            return +b.name.slice(-4) - +a.name.slice(-4);
          });
          countries.value = res[2].data;
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    });

    const disableBtnFilter = computed(
      () =>
        formSelect.type == movieType.value &&
        formSelect.sortBy == '' &&
        formSelect.genre == '' &&
        formSelect.year == '' &&
        formSelect.country == ''
    );

    const handleFilterMovie = () => {
      FilterDataMovie(formSelect)
        .then((movieResponse) => {
          emit('dataFiltered', movieResponse?.data?.results, formSelect);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    };

    const resetFilter = () => {
      formSelect.type = movieType.value;
      formSelect.sortBy = '';
      formSelect.genre = '';
      formSelect.year = '';
      formSelect.country = '';
    };

    const handleCancelFilter = () => {
      resetFilter();
      emit('cancelFilter');
    };

    return {
      genres,
      years,
      countries,
      listSortBy,
      formSelect,
      disableBtnFilter,
      handleFilterMovie,
      handleCancelFilter,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .list-input-filter {
  }

  .ant-select {
    margin-left: 10px;
    margin-top: 10px;
    float: right;
    .ant-select-selector {
      display: inline-block;
    }
  }

  .cancel-filter-btn,
  .filter-btn {
    height: auto;
    float: right;
    margin-top: 10px;
    padding: 8px 25px;
    margin-left: 10px;
  }

  .filter-btn {
    background-color: #003b58;
  }
  .cancel-filter-btn {
    padding: 8px 30px;
  }
}
</style>
