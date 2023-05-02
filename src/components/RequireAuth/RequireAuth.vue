<template>
  <a-result title="Bạn cần đăng nhập để sử dụng chức năng này">
    <template #extra>
      <a-button
        key="console"
        size="large"
        @click="$router.push({ path: '/login' })"
        >Đăng nhập ngay
      </a-button>
    </template>
  </a-result>
</template>
