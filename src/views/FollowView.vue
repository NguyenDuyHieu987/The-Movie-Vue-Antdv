<template>
  <div class="follow">
    <div v-if="isLogin">
      <h1>This is an follow page</h1>
    </div>

    <a-result v-else title="Bạn cần đăng nhập để sử dụng chức năng này">
      <template #extra>
        <a-button
          key="console"
          size="large"
          @click="$router.push({ path: '/login' })"
          >Đăng nhập ngay
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import { watch, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.isLogin);

    onBeforeMount(() => {
      // if (!store.state.isLogin) {
      //   Modal.confirm({
      //     title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
      //     icon: createVNode(QuestionCircleOutlined),
      //     // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
      //     content: createVNode('div', {}, 'Đăng nhập ngay?'),
      //     okText: 'Có',
      //     okType: 'default',
      //     cancelText: 'Không',
      //     onOk() {
      //       router.push({ path: '/login' });
      //     },
      //     onCancel() {},
      //     class: 'require-login-confirm',
      //   });
      // }
    });

    watch(route, () => {});

    document.title = 'Phimhay247 - Theo dõi';

    return { isLogin };
  },
};
</script>
