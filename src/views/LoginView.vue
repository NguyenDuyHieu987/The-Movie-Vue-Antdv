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
        <a-input v-model:value="formState.username">
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
        <a-input-password v-model:value="formState.password">
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
      </a-form-item>

      <div class="social-login">
        <a-button
          class="facebook-login"
          @click="handleLoginFacebook"
          size="large"
        >
          <font-awesome-icon icon="fa-brands fa-facebook-f" />
          <span>Đăng nhập bằng Facebook</span>
        </a-button>

        <GoogleLogin :callback="handleGoogleFacebook" prompt />
        <!-- @click="handleGoogleFacebook" -->
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
  CloseCircleFilled,
  // FacebookFilled,
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import md5 from 'md5';
import { signIn } from '../services/MovieService';
import { setWithExpiry } from '../untils/LocalStorage';
// import { googleAuthCodeLogin } from 'vue3-google-login';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const loadingLogin = ref(false);
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

    const rand = function () {
      return Math.random().toString(36).substring(2); // remove `0.`
    };

    const token = function () {
      return rand() + rand() + rand() + rand(); // to make it longer
    };

    const handleSubmit = () => {
      loadingLogin.value = true;

      signIn({
        email: formState.username,
        password: md5(formState.password),
        user_token: token(),
      })
        .then((response) => {
          if (response.data?.success === false) {
            setTimeout(() => {
              loadingLogin.value = false;
              notification.open({
                message: 'Lỗi!',
                description: 'Tài khoản không tồi tại.',
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }, 1000);
          } else {
            if (response.data?.isLogin === true) {
              store.state.userAccount = response?.data?.result;

              // window.localStorage.setItem('remember', formState.remember);

              if (formState.remember) {
                window.localStorage.setItem(
                  'isLogin',
                  JSON.stringify({ value: true })
                );
                window.localStorage.setItem(
                  'userAccount',
                  JSON.stringify({ value: response?.data?.result })
                );
                window.localStorage.setItem(
                  'userToken',
                  JSON.stringify({ value: response?.data?.result?.user_token })
                );
              } else {
                setWithExpiry('isLogin', true, 30);
                setWithExpiry('userAccount', response?.data?.result, 30);
                setWithExpiry(
                  'userToken',
                  response?.data?.result?.user_token,
                  30
                );
              }

              setTimeout(() => {
                loadingLogin.value = false;
                router.push({ path: '/' });
              }, 1000);
              reset();
            } else {
              setTimeout(() => {
                loadingLogin.value = false;
                notification.open({
                  message: 'Lỗi!',
                  description: 'Sai tài khoản hoặc mật khẩu.',
                  icon: () =>
                    h(CloseCircleFilled, {
                      style: 'color: red',
                    }),
                });
              }, 1000);
            }
          }
        })
        .catch((e) => {
          setTimeout(() => {
            loadingLogin.value = false;
            notification.open({
              message: 'Failed!',
              description: 'Some thing went wrong.',
              icon: () =>
                h(CloseCircleFilled, {
                  style: 'color: red',
                }),
            });
          }, 1000);
          if (axios.isCancel(e)) return;
        });
    };
    const handleLoginFacebook = async () => {
      const { authResponse } = await new Promise(window.FB.login);
      console.log(authResponse);
    };

    const handleGoogleFacebook = (response) => {
      // googleAuthCodeLogin().then((response) => {
      //   console.log('Handle the response', response);
      // });

      console.log('Handle the response', response);
    };
    return {
      formState,
      disabled,
      loadingLogin,
      onFinish,
      onFinishFailed,
      handleSubmit,
      handleLoginFacebook,
      handleGoogleFacebook,
    };
  },
});
</script>

<style lang="scss">
@media only screen and (max-width: 600px) {
  .login-form-container {
    width: 500px !important;
  }
}

@media only screen and (max-width: 500px) {
  .login-form {
    padding: 30px 50px !important;
  }
  .login-form-container {
    width: 450px !important;
  }
}

@media only screen and (max-width: 460px) {
  .login-form {
    padding: 20px 30px !important;
  }
  .login-form-container {
    width: 400px !important;
  }
}

.login-form-container {
  position: relative;
  margin: auto auto;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // padding: 40px 70px;
  border-radius: 5px;
  // box-shadow: 0 3px 6px -4px #00000077, 0 6px 16px 0 #00000054,
  //   0 9px 28px 8px #0000002d;
  box-shadow: 0 3px 6px -4px #000000ba, 0 6px 16px 0 #00000098,
    0 9px 28px 8px #00000077;
  // border: 0.5px solid #919191;
  z-index: 1;
  background-color: #0000002d;
  overflow: hidden;
  width: 550px;
  min-height: 96vh;

  .login-form {
    position: absolute;
    inset: 3px;
    // width: 420px;
    z-index: 3;
    display: block;
    background-color: #000000;
    padding: 40px 70px;
    border-radius: 5px;

    .title-login {
      text-align: center;
      margin-bottom: 20px;

      strong {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(
          to right,
          var(--sider-header-background-color5),
          var(--sider-header-background-color1),
          var(--sider-header-background-color3)
        );
      }
    }

    .ant-row.ant-form-item {
      display: flex;
      flex-direction: column;

      .ant-form-item-label {
        text-align: left;

        & > label {
          color: #fff;
        }
      }

      .anticon {
      }

      .ant-checkbox-wrapper {
        color: #fff;
      }

      .ant-col.ant-form-item-control {
        flex: 0 1 auto;

        .ant-input-affix-wrapper {
          background-color: transparent;
          padding: 7px 11px;
        }

        input {
          color: #fff;
          background-color: transparent;
        }
      }
    }

    .login-form-forgot {
      float: right;
    }

    .login-form-button {
      width: 100%;
      // color: #fff;
    }

    .social-login {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .facebook-login {
        flex-grow: 1;

        .fa-facebook-f {
          color: #1890ff;
        }

        span {
          width: 100%;
        }
      }
    }

    &::-webkit-scrollbar {
      display: none !important;
    }

    &::-webkit-scrollbar-thumb {
      display: none !important;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 600px;
    height: 600px;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color5),
      var(--sider-header-background-color1),
      var(--sider-header-background-color3)
    );
    z-index: 2;
    animation: animate 6s linear infinite;
    transform-origin: bottom right;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 600px;
    height: 600px;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color5),
      var(--sider-header-background-color1),
      var(--sider-header-background-color3)
    );
    z-index: 1;
    animation: animate 6s linear infinite;
    transform-origin: bottom right;
    animation-delay: -3s;
  }
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
