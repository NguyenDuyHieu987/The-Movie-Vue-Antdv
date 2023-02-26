<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { computed, onBeforeMount, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { CloseCircleFilled } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { getUserToken } from '../src/services/MovieService';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      const remember = window.localStorage.getItem('remember');
      const userToken = window.localStorage.getItem('userToken');

      if (remember == 'true') {
        if (userToken != null) {
          getUserToken({ user_token: userToken })
            .then((accountResponse) => {
              if (accountResponse.data.isLogin === true) {
                store.state.userAccount = accountResponse?.data?.result;
              }
            })
            .catch((e) => {
              notification.open({
                message: 'Failed!',
                description: 'Some thing went wrong.',
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
              if (axios.isCancel(e)) return;
            });
        }
      } else {
        if (window.localStorage.getItem('userToken') == null) {
          router.push({ path: '/login' });
        }
      }
    });
    return {
      layout: computed(() => (route.meta.layout || 'default') + '-layout'),
    };
  },
};
</script>

<style lang="scss"></style>
