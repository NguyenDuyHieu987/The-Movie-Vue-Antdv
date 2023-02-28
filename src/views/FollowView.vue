<template>
  <div class="about">
    <h1>This is an follow page</h1>
  </div>
</template>

<script>
import { watch, createVNode } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    watch(route, () => {});

    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.

        if (!store.state.isLogin) {
          Modal.confirm({
            title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
            icon: createVNode(QuestionCircleOutlined),
            // content: createVNode('div', 'Bạn có muốn đăng nhập không?'),
            content: createVNode('div', {}, 'Đăng nhập ngay?'),
            okText: 'Có',
            okType: 'default',
            cancelText: 'Không',
            onOk() {
              next({ path: '/login' });
            },
            onCancel() {},
            class: 'require-login-confirm',
          });
        } else {
          next(); // go to wherever I'm going
        }
      } else {
        next(); // does not require auth, make sure to always call next()!
      }
    });

    document.title = 'Phimhay247 - Theo dõi';
  },
};
</script>
