<template>
  <div class="login-form-container">
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <h1 class="title-login">
        <strong>Đăng nhập </strong>
      </h1>

      <a-form-item
        label="Email"
        name="username"
        :rules="[
          {
            required: true,
            message: 'Please input correct format email!',
            pattern: new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
            trigger: ['change', 'blur'],
          },
        ]"
      >
        <a-input v-model:value="formState.username" placeholder="Email...">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Mật khẩu"
        name="password"
        :rules="[
          {
            required: true,
            message: 'Please input your password!',
            trigger: ['change', 'blur'],
          },
        ]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="Mật khẩu..."
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox
            v-model:checked="formState.remember"
            style="user-select: none"
            >Tự động đăng nhập</a-checkbox
          >
        </a-form-item>
        <a class="login-form-forgot" href="">Quên mật khẩu?</a>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
          size="large"
          @click="handleSubmit"
          :loading="loadingLogin"
          style="background: transparent"
        >
          Đăng nhập
        </a-button>

        <router-link class="play-now" :to="{ path: '/' }"
          >Xem phim ngay</router-link
        >
      </a-form-item>

      <div class="social-login">
        <el-button
          class="facebook-login-btn"
          @click="handleFacebookLogin"
          size="large"
          :loading="loadingFacebookLogin"
        >
          <el-icon class="el-icon--right">
            <font-awesome-icon icon="fa-brands fa-facebook-f" />
          </el-icon>
          <!-- <template #icon>
            <font-awesome-icon icon="fa-brands fa-facebook-f" />
          </template> -->
          <span>Đăng nhập bằng Facebook</span>
        </el-button>

        <el-button
          class="google-login-btn"
          @click="handleGoogleLogin"
          size="large"
          :loading="loadingGoogleLogin"
        >
          <!-- <template #icon>
            <img src="/images/socials/icons8-google-48.png" alt="" />
          </template> -->
          <el-icon class="el-icon--right">
            <img src="/images/socials/icons8-google-48.png" alt="" />
          </el-icon>
          <span>Đăng nhập bằng Google</span>
        </el-button>

        <GoogleLogin
          :callback="handleGoogleLogin"
          prompt
          class="google-login-btn"
        />
      </div>

      <p style="text-align: center; margin: 20px 0px 15px 0px; color: #fff">
        Hoặc
      </p>
      <div style="display: flex; justify-content: center">
        <router-link :to="{ name: 'signup' }">Dăng ký ngay!</router-link>
      </div>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, reactive, computed, h, ref } from 'vue';
import {
  UserOutlined,
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  // FacebookFilled,
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import md5 from 'md5';
import { signIn, loginFacebook } from '@/services/MovieService';
import { setWithExpiry } from '@/utils/LocalStorage';
// import { googleAuthCodeLogin } from 'vue3-google-login';
import { ElNotification } from 'element-plus';
// import { notification } from 'ant-design-vue';
import { useMeta } from 'vue-meta';
import { accountService } from '@/utils/accountService';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const loadingLogin = ref(false);
    const loadingFacebookLogin = ref(false);
    const loadingGoogleLogin = ref(false);
    const router = useRouter();
    const store = useStore();
    const formState = reactive({
      username: '',
      password: '',
      remember: false,
    });

    const reset = () => {
      formState.username = '';
      formState.password = '';
      formState.remember = false;
    };

    useMeta({
      title: 'Phimhay247 - Đăng nhập',
      htmlAttrs: { lang: 'vi', amp: true },
    });

    const onFinish = () => {
      // console.log('Success:', values);
    };

    const onFinishFailed = () => {
      // console.log('Failed:', errorInfo);
    };

    const disabled = computed(() => {
      return !(
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          formState.username
        ) && formState.password
      );
    });

    // const rand = function () {
    //   return Math.random().toString(36).substring(2); // remove `0.`
    // };

    // const token = function () {
    //   return rand() + rand() + rand() + rand(); // to make it longer
    // };

    const randomToken = require('random-token').create(
      'abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    );

    const handleSubmit = () => {
      loadingLogin.value = true;

      signIn({
        email: formState.username,
        password: md5(formState.password),
        user_token: randomToken(40),
      })
        .then((response) => {
          if (response.data?.isNotExist == true) {
            setTimeout(() => {
              loadingLogin.value = false;

              ElNotification.error({
                title: 'Lỗi!',
                message: 'Tài khoản không tồi tại.',
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }, 1000);
          } else if (response.data?.isLogin == true) {
            store.state.userAccount = response?.data?.result;

            // window.localStorage.setItem('remember', formState.remember);

            if (formState.remember) {
              store.state.userAccount = response?.data?.result;
              store.state.isLogin = true;

              window.localStorage.setItem(
                'userAccount',
                JSON.stringify({ value: response?.data?.result })
              );
            } else {
              store.state.userAccount = response?.data?.result;
              store.state.isLogin = true;

              // setWithExpiry('isLogin', true, 30);
              setWithExpiry('userAccount', response?.data?.result, 30);
            }

            if (response?.data?.result?.role == 'admin') {
              store.state.role = response?.data?.result?.role;

              setTimeout(() => {
                loadingLogin.value = false;
                router.push({ path: '/dashboard' });
              }, 1000);
            } else if (response?.data?.result?.role == 'normal') {
              store.state.role = response?.data?.result?.role;

              setTimeout(() => {
                loadingLogin.value = false;
                router.push({ path: '/' });
              }, 1000);
            }

            reset();
          } else if (response.data?.isWrongPassword == true) {
            setTimeout(() => {
              loadingLogin.value = false;

              ElNotification.error({
                title: 'Lỗi!',
                message: 'Sai tài khoản hoặc mật khẩu.',
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }, 1000);
          }
        })
        .catch((e) => {
          setTimeout(() => {
            loadingLogin.value = false;

            ElNotification.error({
              title: 'Failed!',
              message: 'Some thing went wrong.',
              icon: () =>
                h(CloseCircleFilled, {
                  style: 'color: red',
                }),
            });
          }, 1000);
          if (axios.isCancel(e)) return;
        });
    };

    const handleFacebookLogin = async () => {
      const { authResponse } = await new Promise(window.FB.login);

      if (!authResponse) return;

      const profileUser = await accountService.apiAuthenticate(
        authResponse.accessToken
      );

      // console.log(profileUser);

      loadingFacebookLogin.value = true;

      loginFacebook({
        id: profileUser.id,
        full_name: profileUser.name,
        email: profileUser?.email ? profileUser?.email : '',
        user_token: authResponse.accessToken,
        avatar: profileUser.picture.data.url,
      })
        .then((response) => {
          console.log(response.data?.result);

          if (response.data.isSignUp == true) {
            ElNotification.success({
              title: 'Thành công!',
              message:
                'Bạn đã đăng nhập bằng Facebook thành công tại Phimhay247.',
              icon: () =>
                h(CheckCircleFilled, {
                  style: 'color: green',
                }),
            });
            store.state.userAccount = response?.data?.result;
            setWithExpiry('userAccount', response?.data?.result, 30);

            setTimeout(() => {
              loadingFacebookLogin.value = false;
              router.push({ path: '/' });
            });
          } else if (response.data.isLogin == true) {
            store.state.userAccount = response?.data?.result;
            setWithExpiry('userAccount', response?.data?.result, 30);

            setTimeout(() => {
              loadingFacebookLogin.value = false;
              router.push({ path: '/' });
            });
          }
        })
        .catch((e) => {
          loadingFacebookLogin.value = false;

          setTimeout(() => {
            ElNotification.error({
              title: 'Failed!',
              message: 'Some thing went wrong.',
              icon: () =>
                h(CloseCircleFilled, {
                  style: 'color: red',
                }),
            });
          }, 1000);
          if (axios.isCancel(e)) return;
        });
    };

    const handleGoogleLogin = (response) => {
      console.log('Handle the response', response);
    };

    return {
      formState,
      disabled,
      loadingLogin,
      loadingFacebookLogin,
      loadingGoogleLogin,
      onFinish,
      onFinishFailed,
      handleSubmit,
      handleFacebookLogin,
      handleGoogleLogin,
    };
  },
});
</script>

<style lang="scss" src="./LoginView.scss"></style>
