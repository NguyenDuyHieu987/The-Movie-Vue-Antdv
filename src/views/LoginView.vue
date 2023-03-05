<template>
  <div class="login-form-container">
    <h1 class="title-login">Đăng nhập</h1>
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
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
      <!-- <a-button
          type="primary"
          html-type="button"
          class="login-form-button facebook"
          size="large"
          @click="handleLoginFacebook"
        >
          <template #icon> <FacebookFilled /> </template>
          <span> Log in with Facebook</span>
    
        </a-button> -->
    </a-form>
    <div style="width: 100%">
      <button class="facebook-login" @click="handleLoginFacebook">
        Đăng nhập bằng Facebook
      </button>

      <!-- <div
        class="fb-login-button"
        data-width="100%"
        data-size=""
        data-button-type=""
        data-layout=""
        data-auto-logout-link="false"
        data-use-continue-as="false"
      ></div> -->

      <GoogleLogin :callback="handleGoogleFacebook" />
    </div>

    <p style="text-align: center; margin: 20px 0px 15px 0px; color: #fff">
      Hoặc
    </p>
    <div style="display: flex; justify-content: center">
      <router-link :to="{ name: 'signup' }">Dăng ký ngay!</router-link>
    </div>
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

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    // FacebookFilled,
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
      // This callback will be triggered when the user selects or login to
      // his Google account from the popup
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
  .login-form {
    width: 350px !important;
  }
}

@media only screen and (max-width: 500px) {
  .login-form {
    width: 300px !important;
  }
  .login-form-container {
    padding: 30px 50px !important;
  }
}

@media only screen and (max-width: 460px) {
  .login-form {
    width: 300px !important;
  }
  .login-form-container {
    padding: 20px 30px !important;
  }
}

.login-form-container {
  margin: auto auto;
  vertical-align: center;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 70px;
  border-radius: 5px;
  box-shadow: 0 3px 6px -4px #00000077, 0 6px 16px 0 #00000054,
    0 9px 28px 8px #0000002d;
  border: 0.5px solid #919191;
  z-index: 11;
  background-color: #0000002d;

  .login-form {
    width: 420px;
  }

  .title-login {
    margin-bottom: 20px;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color1),
      var(--sider-header-background-color2),
      var(--sider-header-background-color3)
    );
  }

  .login-form-forgot {
    float: right;
  }

  .login-form-button {
    width: 100%;
    color: #fff;
  }

  .login-form-button.facebook {
    background-color: #003465;
  }

  .login-form .ant-row.ant-form-item {
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
}

.container.facebook-login {
  button {
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      // display: none;
      height: 20px;
      width: 20px;
    }
  }
}
</style>
