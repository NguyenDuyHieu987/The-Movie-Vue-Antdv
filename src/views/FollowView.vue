<template>
  <div class="about">
    <h1>This is an follow page</h1>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.

        if (!store.state.isLogin) {
          next({ name: 'login' });
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
