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

      <a-form-item label="Role" name="role" style="flex-direction: row">
        <a-select v-model:value="formState.role" style="width: 90px">
          <a-select-option value="admin">Admin</a-select-option>
          <a-select-option value="normal">Normal</a-select-option>
        </a-select>
      </a-form-item>

      <a-button
        :disabled="disabled"
        type="primary"
        html-type="submit"
        class="signup-form-button"
        size="large"
        @click="handleSubmit"
        style="background: transparent"
      >
        Sign up
      </a-button>
      <p style="text-align: center; margin: 20px 0px 15px 0px">Or</p>

      <div style="display: flex; justify-content: center">
        <router-link :to="{ name: 'login' }">Log in now!</router-link>
      </div>
    </a-form>
  </div>
</template>
<script>
import { defineComponent, reactive, computed, h } from 'vue';
import {
  UserOutlined,
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import axios from 'axios';

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
      role: 'admin',
    });

    const reset = () => {
      formState.fullname = '';
      formState.username = '';
      formState.password = '';
      formState.checkPass = '';
      formState.role = 'admin';
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

    const handleSubmit = () => {
      formState['usertoken'] = Date.now();
      axios
        .post(`${process.env.VUE_APP_SERVICE_URL}/auth/signup`, formState)
        .then((response) => {
          if (!response.data.accountExist) {
            if (response.data.success) {
              notification.open({
                message: 'Congratulation!',
                description: 'You have successfully signed up account.',
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: green',
                  }),
              });
            } else {
              notification.open({
                message: 'Failed!',
                description: 'Something went wrong.',
                icon: () =>
                  h(CheckCircleFilled, {
                    style: 'color: red',
                  }),
              });
            }
            reset();
          } else {
            notification.open({
              message: 'Failed!',
              description: 'Account is already exists.',
              icon: () =>
                h(CloseCircleFilled, {
                  style: 'color: red',
                }),
            });
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
    };

    return {
      formState,
      disabled,
      rules,
      onFinish,
      onFinishFailed,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss">
.signup-form {
  width: 500px;
}

.signup-form-forgot {
  float: right;
}

.signup-form-button {
  width: 100%;
}

.signup-form .ant-row.ant-form-item {
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

.signup-form-container {
  margin: auto auto;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 50px 70px;
  padding-top: 130px;
  border-radius: 5px;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px 0 #00000014,
    0 9px 28px 8px #0000000d;
  z-index: 11;
  max-height: 95vh;
  overflow-y: scroll;
  border: 0.5px solid #fff;

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar {
    display: none;
  }
}

.ant-modal-body::-webkit-scrollbar {
  width: 0px;
  display: none;
}

.ant-modal-body::-webkit-scrollbar-thumb {
  width: 0px;
  display: none;
}

.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  background-color: transparent;
}

.title-signup {
  margin-bottom: 20px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(
    to right,
    #8e2de2 0%,
    #000046 51%,
    #1cb5e0 100%
  );
}
</style>
