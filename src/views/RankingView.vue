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
          <a-pagination
            v-if="trendings?.length"
            v-model:current="pageTrending"
            :total="totalPage"
            :showSizeChanger="false"
            @change="onChangePage"
          />
        </div>
      </a-layout-content>
      <a-layout-sider :width="450">
        <h2 class="gradient-title-default">
          <strong> Top xem phim</strong>
        </h2>
        <ul class="tabs-filter">
          <li
            v-for="(item, index) in allTabs"
            :key="item.key"
            :index="index"
            :class="[activeTab == item.key ? 'active' : '', item.key]"
            @click="handleTabClick(item.key)"
          >
            <span> {{ item.tabName }} </span>
          </li>

          <!-- <li
            class="week"
            @click="handleWeekClick"
            :class="{ active: activeTab == 'week' }"
          >
            <span> Top Tuần </span>
          </li>

          <li
            class="month"
            @click="handleMonthClick"
            :class="{ active: activeTab == 'month' }"
          >
            <span>Top Tháng </span>
          </li>

          <li
            class="all"
            @click="handleAllClick"
            :class="{ active: activeTab == 'all' }"
          >
            <span> Tất Cả </span>
          </li> -->
        </ul>
        <!-- <a-tabs v-model:activeKey="activeTab" type="card">
          <a-tab-pane key="day" tab="Top ngày"> </a-tab-pane>
          <a-tab-pane key="week" tab="Top tuần"> </a-tab-pane>
          <a-tab-pane key="month" tab="Top tháng"> </a-tab-pane>
          <a-tab-pane key="Tất cả" tab="Tất cả"> </a-tab-pane>
        </a-tabs> -->
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
.ranking-container {
  .ant-layout,
  .ant-layout-content,
  .ant-layout-sider {
    background-color: #000;
  }
  .gradient-title-default {
    margin-top: 0px;
  }

  .ant-layout-content {
    margin-right: 15px;
  }

  .ant-layout-sider {
    padding: 0px 10px;
    background-color: rgb(14, 14, 14);
  }

  .tabs-filter {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(4, minmax(25%, auto));
    gap: 0px;
  }

  .tabs-filter li span {
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

  .tabs-filter li {
    width: 100%;
    cursor: pointer;
    border-radius: 3px;
    user-select: none;

    &.active {
      background-color: #00607e;

      span {
        &::before {
          content: '';
          position: absolute;
          // border-top: 10px solid #007ca1;
          // border-right: 10px solid transparent;
          // border-left: 10px solid transparent;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 30px;
          // transform: rotate(90deg);

          box-shadow: 10px 0px 0px 0px #00607e;
          width: 15px;
          height: 10px;
          bottom: 0px;
          left: -15px;
          // left: 50%;
          // transform: translate(-50%);
        }
        &::after {
          content: '';
          position: absolute;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 0px;
          transform: rotate(180deg);

          box-shadow: 10px 0px 0px 0px #00607e;
          width: 15px;
          height: 10px;
          bottom: 0px;
          right: -15px;
          // left: 50%;
          // transform: translate(-50%);
        }
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
