<template>
  <el-skeleton :loading="loading" animated class="cast-item">
    <template #template>
      <div class="cast-img-box">
        <el-skeleton-item class="ant-image" variant="image" />
      </div>
      <div style="margin-top: 7px">
        <el-skeleton-item variant="text" style="width: 90%" />
      </div>
    </template>

    <template #default>
      <div class="cast-item">
        <div class="cast-img-box">
          <el-image
            class="ant-image"
            :src="getPosterCast(item?.profile_path)"
            v-lazy="getPosterCast(item?.profile_path)"
            :preview="false"
            loading="lazy"
          >
            <!-- v-if="!loading" -->
            <template #error>
              <div
                class="ant-image error"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                Đang tải<span class="dot">...</span>
              </div>
            </template>
          </el-image>

          <!-- <a-skeleton-image v-else class="ant-image" /> -->
        </div>

        <div class="info">
          <p class="name">
            {{ item?.name ? item?.name : item?.title }}
          </p>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
<script>
import { getPosterCast } from '../../services/MovieService';

export default {
  components: {},
  props: {
    item: {
      type: Object,
    },
    loading: Boolean,
  },
  setup() {
    return {
      getPosterCast,
    };
  },
};
</script>
<style lang="scss" src="./CastCard.scss"></style>
