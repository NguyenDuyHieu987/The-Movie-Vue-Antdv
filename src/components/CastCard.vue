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
import { getPosterCast } from '../services/MovieService';

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
<style lang="scss">
.cast-item {
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 1.6rem;

  .cast-img-box {
    position: relative;
  }

  .ant-image,
  .el-image {
    height: 200px;
    width: 100%;

    .ant-image-img {
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      transition: all 0.3s;
      height: 100%;
      object-fit: cover;
    }

    &.error {
      background: var(--el-fill-color-light);
    }
  }

  .info {
    padding: 0px 5px;
  }

  &:hover {
    img {
      transform: scale(1.05);
      opacity: 0.8;
    }

    .duration-episode-box {
      background-size: 200% 100%;
      background-position: -50px center;
    }

    .release-date-box {
      background-size: 200% 100%;
      background-position: -45px center;
    }

    .info {
      color: #fff;
    }
  }

  .info {
    // padding: 0px 0px !important;
    color: #3b3b3b;

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
