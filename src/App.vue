<template>
  <div>
    <metainfo>
      <template v-slot:title="{ content }">{{
        content ? `${content}` : `Phimhay247`
      }}</template>
    </metainfo>
    <vue-progress-bar />

    <div v-if="loadingHomePage" class="loading-page">
      <div class="loading-page-container">
        <img src="/images/logo.png" alt="" />
        <div class="logo"><h2>Phimhay247</h2></div>
      </div>
    </div>

    <component v-else :is="$route.meta.layout?.component">
      <!-- <router-view :key="$route.fullPath" /> -->
      <router-view :key="$route.path" />

      <div id="components-back-top-demo-custom">
        <a-back-top class="ant-back-top-inner" :visibilityHeight="600">
          <font-awesome-icon icon="fa-solid fa-chevron-up" />
        </a-back-top>
      </div>
    </component>
  </div>
</template>

<script>
import {
  computed,
  onBeforeMount,
  h,
  // createVNode,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { CloseCircleFilled } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { getUserToken } from '@/services/MovieService';
import { getWithExpiry } from '@/utils/LocalStorage';
// import { Modal } from 'ant-design-vue';
// import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { SpringSpinner } from 'epic-spinners';

export default {
  components: { SpringSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const loadingHomePage = ref(false);

    const layout = computed(() => (route.meta.layout || 'loading') + '-layout');

    onBeforeMount(() => {
      // const remember = getWithExpiry('remember');
      // const userToken = getWithExpiry('userAccount')?.user_token;
      // const isLogin = getWithExpiry('isLogin');

      if (store.state.isLogin) {
        // if (remember) {
        getUserToken({ user_token: getWithExpiry('userAccount')?.user_token })
          .then((accountResponse) => {
            // console.log(accountResponse.data?.result);
            if (accountResponse.data?.isLogin == true) {
              store.state.isLogin = true;
              store.state.userAccount = accountResponse.data?.result;
              store.state.role = accountResponse?.data?.result?.role;
            } else {
              window.localStorage.removeItem('userAccount');
              window.localStorage.removeItem('userToken');
              window.localStorage.removeItem('remember');
              window.localStorage.removeItem('isLogin');
              store.state.userAccount = {};
              store.state.role = 'normal';
              store.state.isLogin = false;
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
    });

    router.beforeResolve((to, from, next) => {
      // if (to.matched.some((record) => record.meta.requiresAuth)) {
      //   if (!store.state.isLogin) {
      //     if (to.matched.some((record) => record.meta.requiresAdmin)) {
      //       next({ path: '/404' });
      //     } else {
      //       Modal.confirm({
      //         title: 'Bạn cần đăng nhập để sử dụng chức năng này.',
      //         icon: createVNode(QuestionCircleOutlined),
      //         content: createVNode('h3', {}, 'Đăng nhập ngay?'),
      //         okText: 'Có',
      //         okType: 'primary',
      //         cancelText: 'Không',
      //         centered: true,
      //         onOk() {
      //           next({ path: '/login' });
      //         },
      //         onCancel() {},
      //       });
      //     }
      //   } else {
      //     next();
      //   }
      // } else

      if (to.matched.some((record) => record.name == 'home')) {
        if (store.state.loadingHomePage == true) {
          next();
        } else {
          store.state.loadingHomePage = true;
          loadingHomePage.value = true;

          setTimeout(() => {
            loadingHomePage.value = false;
            next();
          }, 2000);
        }
      } else {
        next();
      }
    });

    return {
      layout,
      loadingHomePage,
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

.loading-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: var(--loading-background);
  .loading-page-container {
    display: flex;
    flex-direction: column;
    gap: 15px;

    img {
      width: 64px;
      height: 64px;
    }

    // h3 {
    //   margin: 10px 0px;
    // }
  }
}

#components-back-top-demo-custom .ant-back-top {
  bottom: 40px;
  right: 40px;
}
#components-back-top-demo-custom .ant-back-top-inner {
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.72) !important;
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
  transition: all 0.25s;

  &:active {
    opacity: 0.8;
  }
}
</style>
