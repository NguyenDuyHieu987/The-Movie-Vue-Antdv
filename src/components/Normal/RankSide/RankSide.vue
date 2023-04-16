<template>
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
    <div
      class="rank-data"
      v-loading="loading"
      element-loading-text="Đang tải..."
      element-loading-background="rgba(0, 0, 0, 0.75)"
    >
      <el-scrollbar height="75vh">
        <RankCard
          v-for="(item, index) in rankData"
          :index="index"
          :key="item.id"
          :item="item"
          :type="item.media_type"
        />
      </el-scrollbar>
    </div>
  </a-layout-sider>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import RankCard from '@/components/Normal/RankCard/RankCard.vue';
import { getRanking } from '@/services/MovieService';
import axios from 'axios';

export default {
  components: {
    RankCard,
  },
  setup() {
    const activeTab = ref('day');
    const loading = ref(false);
    const rankData = ref([]);
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
      loading.value = true;
      switch (activeKey) {
        case 'day':
          getRanking(1)
            .then((movieRespone) => {
              rankData.value = movieRespone.data?.results;
              setTimeout(() => {
                loading.value = false;
              }, 1500);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          activeTab.value = activeKey;
          break;
        case 'week':
          getRanking(2)
            .then((movieRespone) => {
              rankData.value = movieRespone.data?.results;
              setTimeout(() => {
                loading.value = false;
              }, 1500);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          activeTab.value = activeKey;
          break;
        case 'month':
          getRanking(3)
            .then((movieRespone) => {
              rankData.value = movieRespone.data?.results;
              setTimeout(() => {
                loading.value = false;
              }, 1500);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          activeTab.value = activeKey;
          break;
        case 'all':
          getRanking(4)
            .then((movieRespone) => {
              rankData.value = movieRespone.data?.results;
              setTimeout(() => {
                loading.value = false;
              }, 1500);
            })
            .catch((e) => {
              if (axios.isCancel(e)) return;
            });

          activeTab.value = activeKey;
          break;
      }
    };

    onBeforeMount(() => {
      getDataRanking(activeTab.value);
    });

    const handleTabClick = (activeKey) => {
      getDataRanking(activeKey);
    };

    return {
      activeTab,
      loading,
      rankData,
      allTabs,
      handleTabClick,
    };
  },
};
</script>

<style lang="scss" src="./RankSide.scss"></style>
