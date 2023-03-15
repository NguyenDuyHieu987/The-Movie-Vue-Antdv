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
            :pager-count="5"
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
import MovieCarouselCardVertical from '@/components/MovieCardVertical/MovieCardVertical.vue';
import { getTrending } from '../../services/MovieService';
import { useMeta } from 'vue-meta';

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

    const getDataRanking = (activeKey) => {
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
      getDataRanking(activeKey);
    };

    useMeta({
      title: '`Phimhay247 | Xếp hạng',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    // document.title = 'Phimhay247 - Xếp hạng';

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

<style lang="scss" src="./RankingView.scss"></style>
