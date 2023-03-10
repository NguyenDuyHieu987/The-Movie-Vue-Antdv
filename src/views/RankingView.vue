<template>
  <div class="ranking-container">
    <a-layout>
      <a-layout-content>
        <h2 class="gradient-title-default">
          <strong>Trending</strong>
        </h2>

        <section class="movie-group vertical">
          <MovieCarouselCardVertical
            v-for="(item, index) in trendings"
            :index="index"
            :key="item.id"
            :item="item"
          />
        </section>
        <div class="control-page">
          <!-- <a-pagination
            v-if="trendings?.length"
            v-model:current="pageTrending"
            :total="totalPage"
            :showSizeChanger="false"
            @change="onChangePage"
          /> -->

          <el-pagination
            v-model:current-page="pageTrending"
            background
            layout="prev, pager, next, total"
            :total="totalPage"
          />
          <!-- @current-change="onChangePage" -->
        </div>
      </a-layout-content>
      <a-layout-sider :width="450" class="sider-rank">
        <h2 class="gradient-title-default">
          <strong> Top xem phim</strong>
        </h2>
        <ul class="tabs-rank">
          <li
            v-for="(item, index) in allTabs"
            :key="item.key"
            :index="index"
            :class="[activeTab == item.key ? 'active' : '', item.key]"
            @click="handleTabClick(item.key)"
          >
            <span> {{ item.tabName }} </span>
          </li>
        </ul>

        <!-- <el-radio-group
          v-model="activeTab"
          @change="handleTabClick"
          class="rank"
        >
          <el-radio-button size="large" label="day" border
            >Top ngày</el-radio-button
          >
          <el-radio-button size="large" label="week" border
            >Top tuần</el-radio-button
          >
          <el-radio-button size="large" label="month" border
            >Top tháng</el-radio-button
          >
          <el-radio-button size="large" label="all" border
            >Tất cả</el-radio-button
          >
        </el-radio-group> -->
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from 'vue';
import MovieCarouselCardVertical from '@/components/MovieCardVertical.vue';
import { getTrending } from '../services/MovieService';
export default {
  components: {
    MovieCarouselCardVertical,
  },
  setup() {
    const activeTab = ref('day');
    const trendings = ref([]);
    const pageTrending = ref(1);
    const totalPage = ref(100);
    const allTabs = ref([
      {
        key: 'day',
        tabName: 'Top ngày',
      },
      {
        key: 'week',
        tabName: 'Top tuần',
      },
      {
        key: 'month',
        tabName: 'Top tháng',
      },
      {
        key: 'all',
        tabName: 'Tất cả',
      },
    ]);

    onBeforeMount(() => {
      getTrending(pageTrending.value).then((movieRespone) => {
        trendings.value = movieRespone.data?.results;
        totalPage.value = movieRespone.data?.total_pages * 10;
      });
    });

    watch(pageTrending, () => {
      getTrending(pageTrending.value).then((movieRespone) => {
        trendings.value = movieRespone.data?.results;
      });
    });

    const handleTabClick = (activeKey) => {
      switch (activeKey) {
        case 'day':
          activeTab.value = activeKey;
          break;
        case 'week':
          activeTab.value = activeKey;
          break;
        case 'month':
          activeTab.value = activeKey;
          break;
        case 'all':
          activeTab.value = activeKey;
          break;
      }
    };

    document.title = 'Phimhay247 - Xếp hạng';

    return {
      activeTab,
      trendings,
      pageTrending,
      totalPage,
      allTabs,
      handleTabClick,
    };
  },
};
</script>

<style lang="scss">
@media only screen and (max-width: 1400px) {
  .ranking-container {
    .movie-group.vertical {
      grid-template-columns: repeat(auto-fit, minmax(145px, auto));
    }

    .movie-card-vertical-item {
      .img-box {
        transition: all 0.3s;
        height: 220px !important;
      }
    }

    .ant-layout-sider.sider-rank {
      flex: 0 1 auto !important;
      width: 350px !important;
      max-width: auto !important;
      min-width: auto !important;
      .tabs-rank li span {
        font-size: 1.4rem;
      }
    }
  }
}
@media only screen and (max-width: 1100px) {
  .ranking-container {
    .ant-layout {
      display: flex;
      flex-direction: column-reverse;
    }
    .ant-layout-content {
      width: 100% !important;
      margin-right: 0px !important;
    }

    .ant-layout-sider.sider-rank {
      width: 100% !important;
      max-width: 100% !important;

      .tabs-rank li span {
        font-size: 1.6rem;
        padding: 10px 0px;
      }
    }
  }
}

.ranking-container {
  .ant-layout,
  .ant-layout-content,
  .el-main,
  .ant-layout-sider.sider-rank,
  .el-aside.sider-rank {
    background-color: #000;
  }
  .gradient-title-default {
    margin-top: 0px;
  }

  .ant-layout-content,
  .el-main {
    margin-right: 15px;
  }

  .ant-layout-sider.sider-rank,
  .el-aside.sider-rank {
    padding: 0px 0px;
    // background-color: #0e0e0e;
  }

  .tabs-rank {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(4, minmax(25%, auto));
    gap: 0px;
  }

  .el-radio-group.rank {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(4, minmax(10%, auto));
    gap: 0px;
  }

  .tabs-rank li span {
    text-align: center;
    display: block;
    padding: 7px 0px;
    width: 100%;
    font-size: 1.6rem;
    transition: all 0.3s;
    border-radius: 3px;
    position: relative;

    &:hover {
      background-color: #00607e;
    }
  }

  .tabs-rank li {
    width: 100%;
    cursor: pointer;
    border-radius: 3px;
    user-select: none;
    white-space: nowrap;

    &.active {
      background-color: #00607e;

      span {
        &::before {
          content: '';
          position: absolute;
          border-top: 10px solid #007ca1;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;

          // border-top-left-radius: 0px;
          // border-bottom-left-radius: 0px;
          // border-top-right-radius: 0px;
          // border-bottom-right-radius: 30px;

          // box-shadow: 10px 0px 0px 0px #00607e;
          width: 15px;
          height: 10px;
          // bottom: 0px;
          // left: -15px;
          bottom: -10px;
          left: 50%;
          transform: translate(-50%);
        }

        // &::after {
        //   content: '';
        //   position: absolute;
        //   border-top-left-radius: 0px;
        //   border-bottom-left-radius: 0px;
        //   border-top-right-radius: 30px;
        //   border-bottom-right-radius: 0px;
        //   transform: rotate(180deg);

        //   box-shadow: 10px 0px 0px 0px #00607e;
        //   width: 15px;
        //   height: 10px;
        //   bottom: 0px;
        //   right: -15px;
        //   // left: 50%;
        //   // transform: translate(-50%);
        // }
      }
    }
  }

  .control-page {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
