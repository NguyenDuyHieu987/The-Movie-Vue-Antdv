<template>
  <component :is="layout">
    <router-view />
    <div id="components-back-top-demo-custom">
      <a-back-top class="ant-back-top-inner" :visibilityHeight="600">
        <font-awesome-icon icon="fa-solid fa-chevron-up" />
      </a-back-top>
    </div>
  </component>
</template>

<script>
import { computed, onBeforeMount, h } from 'vue';
import { useStore } from 'vuex';
import {
  // useRouter,
  useRoute,
} from 'vue-router';
import axios from 'axios';
import { CloseCircleFilled } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { getUserToken } from './services/MovieService';
import { getWithExpiry } from './untils/LocalStorage';

export default {
  components: {},
  setup() {
    const store = useStore();
    // const router = useRouter();
    const route = useRoute();

    onBeforeMount(() => {
      // const remember = window.localStorage.getItem('remember');
      // const userToken = window.localStorage.getItem('userToken');
      // const isLogin = window.localStorage.getItem('isLogin');

      // const remember = getWithExpiry('userToken');
      const userToken = getWithExpiry('userToken');
      // const isLogin = getWithExpiry('userToken');

      if (store.state.isLogin) {
        // if (remember) {
        if (userToken != null) {
          getUserToken({ user_token: userToken })
            .then((accountResponse) => {
              if (accountResponse.data.isLogin == true) {
                window.localStorage.setItem(
                  'userAccount',
                  JSON.stringify(accountResponse?.data?.result)
                );
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
          // }
        } else {
          // if (window.localStorage.getItem('userToken') == null) {
          //   router.push({ path: '/login' });
          // }
          // console.log(router);
        }
      }
    });
    return {
      layout: computed(() => (route.meta.layout || 'default') + '-layout'),
    };
  },
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 1000px) {
  #components-back-top-demo-custom .ant-back-top {
    bottom: 30px !important;
    right: 30px !important;
  }
}

@media only screen and (max-width: 680px) {
  #components-back-top-demo-custom .ant-back-top {
    bottom: 20px !important;
    right: 20px !important;
  }
}

#components-back-top-demo-custom .ant-back-top {
  bottom: 50px;
  right: 50px;
}
#components-back-top-demo-custom .ant-back-top-inner {
  height: 40px;
  width: 43px;
  line-height: 40px;
  border-radius: 4px;
  border: 1px solid #fff;
  background-color: #0056785f;
  color: #fff;
  text-align: center;
  font-size: 20px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px 0 #00000014,
    0 9px 28px 8px #0000000d;
}
</style>
