<template>
  <div class="login-form-container">
    <h1 class="title-login">Log In</h1>
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
        label="Password"
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
            >Remember me</a-checkbox
          >
        </a-form-item>
        <a class="login-form-forgot" href="">Forgot password?</a>
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
          Log in
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
      <!-- <facebookLogin
        class="facebook-login"
        appId="820070179113499"
        @login="handleLoginFacebook"
        @logout="onLogout"
        @get-initial-status="getUserData"
        loginLabel="Log in with Facebook"
      ></facebookLogin> -->

      <button class="facebook-login" @click="handleLoginFacebook">
        Facebook log in
      </button>
    </div>

    <p style="text-align: center; margin: 20px 0px 15px 0px">Or</p>
    <div style="display: flex; justify-content: center">
      <router-link :to="{ name: 'signup' }">Register now!</router-link>
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
// import facebookLogin from 'facebook-login-vuejs';
import md5 from 'md5';
import { signIn } from '../services/MovieService';
import { fbLogin } from 'facebook-login-vuejs/src/helpers';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    // FacebookFilled,
    // facebookLogin,
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

    const handleLoginFacebook = async () => {
      // const { authResponse } = await new Promise(window.FB.login);
      const { authResponse } = await new Promise(fbLogin);
      console.log(authResponse);
    };

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
                message: 'Failed!',
                description: 'Account is not available.',
                icon: () =>
                  h(CloseCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }, 1000);
          } else {
            if (response.data.isLogin === true) {
              store.state.userAccount = response?.data?.result;
              window.localStorage.setItem('remember', formState.remember);
              window.localStorage.setItem(
                'userToken',
                response?.data?.result?.user_token
              );
              setTimeout(() => {
                loadingLogin.value = false;
                router.push({ path: '/' });
              }, 1000);
              reset();
            } else {
              setTimeout(() => {
                loadingLogin.value = false;
                notification.open({
                  message: 'Failed!',
                  description: 'Wrong username or password.',
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

      // axios
      //   .post(`${process.env.VUE_APP_SERVICE_URL}/auth/login1`, formState)
      //   .then((response) => {
      //     if (response.data.length == 0) {
      //       setTimeout(() => {
      //         loadingLogin.value = false;
      //         notification.open({
      //           message: 'Failed!',
      //           description: 'Wrong username or password.',
      //           icon: () =>
      //             h(CloseCircleFilled, {
      //               style: 'color: red',
      //             }),
      //         });
      //       }, 1000);
      //     } else {
      //       store.state.userAccount = response.data[0];
      //       if (formState.remember) {
      //         window.localStorage.setItem('remember', formState.remember);
      //         window.localStorage.setItem(
      //           'userToken',
      //           response.data[0].usertoken
      //         );
      //       }
      //       setTimeout(() => {
      //         loadingLogin.value = false;
      //         router.push({ path: '/' });
      //       }, 1000);
      //       reset();
      //     }
      //   })
      //   .catch((e) => {
      //     setTimeout(() => {
      //       loadingLogin.value = false;
      //       notification.open({
      //         message: 'Failed!',
      //         description: 'Some thing went wrong.',
      //         icon: () =>
      //           h(CloseCircleFilled, {
      //             style: 'color: red',
      //           }),
      //       });
      //     }, 1000);

      //     if (axios.isCancel(e)) return;
      //   });
    };

    return {
      formState,
      disabled,
      loadingLogin,
      onFinish,
      onFinishFailed,
      handleSubmit,
      handleLoginFacebook,
    };
  },
});
</script>

<style lang="scss">
.login-form {
  width: 420px;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

.login-form-button.facebook {
  background-color: #003465;
}

.login-form .ant-row.ant-form-item {
  display: flex;
  flex-direction: column;

  .ant-form-item-label {
    text-align: left;
  }
  .ant-col.ant-form-item-control {
    flex: 0 1 auto;

    .ant-input-affix-wrapper {
      background-color: transparent;
      padding: 7px 11px;
    }

    input {
      background-color: transparent;
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
  border: 0.5px solid #fff;
  z-index: 11;
}
.title-login {
  margin-bottom: 20px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color1),
    var(--sider-header-background-color2),
    var(--sider-header-background-color3)
  );
}

@media only screen and (max-width: 600px) {
  .login-form {
    width: 350px;
  }
}

@media only screen and (max-width: 500px) {
  .login-form {
    width: 300px;
  }
  .login-form-container {
    padding: 30px 50px;
  }
}

@media only screen and (max-width: 460px) {
  .login-form {
    width: 300px;
  }
  .login-form-container {
    padding: 20px 30px;
  }
}
</style>
