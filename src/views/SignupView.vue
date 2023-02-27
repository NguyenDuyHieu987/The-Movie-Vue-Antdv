<template>
  <div class="signup-form-container">
    <h1 class="title-signup">Sign Up</h1>
    <a-form
      :model="formState"
      :rules="rules"
      name="normal_signup"
      class="signup-form"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Full Name"
        name="fullname"
        :rules="[
          {
            required: true,
            message: 'Please input your full name!',
            trigger: ['change', 'blur'],
          },
        ]"
      >
        <a-input v-model:value="formState.fullname">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Username"
        name="username"
        :rules="[
          {
            required: true,
            message: 'Please input username!',
            trigger: ['change', 'blur'],
          },
        ]"
      >
        <a-input v-model:value="formState.username" ref="usernameRef">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
        :rules="[
          {
            required: true,
            message: 'Please input correct format email!',
            pattern: new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
            trigger: ['change', 'blur'],
          },
        ]"
      >
        <a-input v-model:value="formState.email">
          <template #prefix>
            <font-awesome-icon icon="fa-solid fa-at" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[
          {
            required: true,
            message: 'Please input password!',
            trigger: ['change', 'blur'],
          },
        ]"
        has-feedback
      >
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item label="Confirm Password" name="checkPass" has-feedback>
        <a-input-password v-model:value="formState.checkPass">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-button
        :disabled="disabled"
        type="primary"
        html-type="submit"
        class="signup-form-button"
        size="large"
        @click="handleSubmit"
        style="background: transparent"
        :loading="loadingSignUp"
      >
        Sign up
      </a-button>
      <p style="text-align: center; margin: 20px 0px 15px 0px; color: #fff">
        Or
      </p>

      <div style="display: flex; justify-content: center">
        <router-link :to="{ name: 'login' }">Log in now!</router-link>
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
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import axios from 'axios';
import { signUp } from '../services/MovieService';
import md5 from 'md5';

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const formState = reactive({
      fullname: '',
      username: '',
      password: '',
      checkPass: '',
      email: '',
    });
    const loadingSignUp = ref(false);

    const reset = () => {
      formState.fullname = '';
      formState.username = '';
      formState.password = '';
      formState.checkPass = '';
      formState.email = '';
    };

    const onFinish = () => {
      // console.log('Success:', values);
    };

    const onFinishFailed = () => {
      // console.log('Failed:', errorInfo);
    };

    const disabled = computed(() => {
      return !(
        formState.fullname &&
        formState.username &&
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formState.email) &&
        formState.password &&
        formState.checkPass &&
        formState.password == formState.checkPass
      );
    });

    const checkConfirmPassword = async (_rule, value) => {
      if (value !== formState.password) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      checkPass: [
        {
          required: true,
          message: 'Please input password again!',
          trigger: ['change', 'blur'],
        },
        {
          validator: checkConfirmPassword,
          trigger: ['change', 'blur'],
        },
      ],
    };

    const rand = function () {
      return Math.random().toString(36).substring(2); // remove `0.`
    };

    const token = function () {
      return rand() + rand() + rand() + rand(); // to make it longer
    };

    const handleSubmit = () => {
      loadingSignUp.value = true;

      signUp({
        id: Date.now(),
        user_name: formState.username,
        email: formState.email,
        password: md5(formState.password),
        created_by: formState.fullname,
        avatar: `${Math.floor(Math.random() * 10) + 1}`,
        user_token: token(),
      })
        .then((response) => {
          if (response?.data?.isSignUp === true) {
            setTimeout(() => {
              loadingSignUp.value = false;
              notification.open({
                message: 'Congratulation!',
                description:
                  'You have successfully signed up account from Phimhay247.',
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
            }, 1000);
            reset();
          } else {
            setTimeout(() => {
              loadingSignUp.value = false;
              notification.open({
                message: 'Failed!',
                description: 'Account is already exists.',
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }, 1000);
          }
        })
        .catch((e) => {
          setTimeout(() => {
            loadingSignUp.value = false;
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
      //   .post(`${process.env.VUE_APP_SERVICE_URL}/auth/signup`, formState)
      //   .then((response) => {
      //     if (!response.data.accountExist) {
      //       if (response.data.success) {
      //         notification.open({
      //           message: 'Congratulation!',
      //           description: 'You have successfully signed up account.',
      //           icon: () =>
      //             h(CheckCircleFilled, {
      //               style: 'color: green',
      //             }),
      //         });
      //       } else {
      //         notification.open({
      //           message: 'Failed!',
      //           description: 'Something went wrong.',
      //           icon: () =>
      //             h(CheckCircleFilled, {
      //               style: 'color: red',
      //             }),
      //         });
      //       }
      //       reset();
      //     } else {
      //       notification.open({
      //         message: 'Failed!',
      //         description: 'Account is already exists.',
      //         icon: () =>
      //           h(CloseCircleFilled, {
      //             style: 'color: red',
      //           }),
      //       });
      //     }
      //   })
      //   .catch((e) => {
      //     notification.open({
      //       message: 'Failed!',
      //       description: 'Some thing went wrong.',
      //       icon: () =>
      //         h(CloseCircleFilled, {
      //           style: 'color: red',
      //         }),
      //     });
      //     if (axios.isCancel(e)) return;
      //   });
    };

    return {
      formState,
      disabled,
      rules,
      loadingSignUp,
      onFinish,
      onFinishFailed,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss">
@media only screen and (max-width: 660px) {
  .signup-form-container {
    padding: 30px 40px !important;
  }
}

@media only screen and (max-width: 600px) {
  .signup-form {
    width: 450px !important;
  }
}

@media only screen and (max-width: 550px) {
  .signup-form {
    width: 400px !important;
  }
  .signup-form-container {
    padding: 30px 30px !important;
  }
}

@media only screen and (max-width: 470px) {
  .signup-form {
    width: 350px !important;
  }
  .signup-form-container {
    padding: 20px 30px !important;
  }
}

@media only screen and (max-width: 430px) {
  .signup-form {
    width: 350px !important;
  }
  .signup-form-container {
    padding: 20px 20px !important;
  }
}

.signup-form-container {
  margin: auto auto;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 70px;
  // padding-top: 130px;
  border-radius: 5px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px 0 #00000014,
    0 9px 28px 8px #0000000d;
  z-index: 11;
  max-height: 95vh;
  overflow-y: scroll;
  border: 0.5px solid #919191;
  background-color: #0000002d;

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar {
    display: none;
  }

  .title-signup {
    margin-bottom: 20px;
    background-clip: text;
    text-align: center;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    background-image: linear-gradient(
      to right,
      var(--sider-header-background-color1) 0%,
      var(--sider-header-background-color2) 40%,
      var(--sider-header-background-color3) 65%
    );
  }

  .signup-form {
    width: 500px;
  }

  .signup-form-forgot {
    float: right;
  }

  .signup-form-button {
    width: 100%;
    color: #fff;
  }

  .signup-form .ant-row.ant-form-item {
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
</style>
