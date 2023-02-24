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

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      if (window.localStorage.getItem('remember') == 'true') {
        if (window.localStorage.getItem('userToken') != null) {
          axios
            .post(`${process.env.VUE_APP_SERVICE_URL}/auth/keeplogin1`, {
              usertoken: window.localStorage.getItem('userToken'),
            })
            .then((response) => {
              if (response.data.length == 0) {
                notification.open({
                  message: 'Failed!',
                  description: 'Some thing went wrong.',
                  icon: () =>
                    h(CloseCircleFilled, {
                      style: 'color: red',
                    }),
                });
              } else {
                store.state.userAccount = response.data[0];
                // router.push({ path: '/' });
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
