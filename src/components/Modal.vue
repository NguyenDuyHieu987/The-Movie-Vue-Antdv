<template>
  <a-modal
    :visible="$store.state.modalVisible"
    centered
    width="750px"
    @cancel="$store.state.modalVisible = false"
  >
    <!-- bodyStyle="
      background-color: var(--background-content-color);
      border-left: 1px solid var(--border-regular);
      border-right: 1px solid var(--border-regular);
      color: #ffff
      " -->
    <template #title>
      <span v-if="$store.state.modalAction == 'add'">Add Account</span>
      <span v-else-if="$store.state.modalAction == 'detail'"
        >Detail Account</span
      >
      <span v-else-if="$store.state.modalAction == 'edit'">Edit Account</span>
      <span v-else-if="$store.state.modalAction == 'delete'"
        >Delete Account</span
      >
    </template>

    <a-skeleton
      :loading="$store.state.loadingDetailAccount"
      :paragraph="{ rows: 8 }"
      active
      v-if="
        $store.state.modalAction == 'detail' ||
        $store.state.modalAction == 'edit'
      "
    >
    </a-skeleton>

    <a-form
      :model="formState"
      name="form-account"
      v-bind="formItemLayout"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      scrollToFirstError
      v-if="
        ($store.state.modalAction == 'add' ||
          $store.state.modalAction == 'edit') &&
        $store.state.loadingDetailAccount == false
      "
    >
      <a-form-item
        v-if="$store.state.modalAction == 'add'"
        label="Id"
        v-bind="validateInfos.id"
      >
        <a-input v-model:value="modelRef.id" />
      </a-form-item>
      <a-form-item label="Full name" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" />
      </a-form-item>
      <a-form-item label="Phone" v-bind="validateInfos.phone">
        <a-input v-model:value="modelRef.phone" />
      </a-form-item>
      <a-form-item label="Iban" v-bind="validateInfos.iban">
        <a-input v-model:value="modelRef.iban" />
      </a-form-item>
      <a-form-item label="Pin" v-bind="validateInfos.pin">
        <a-input v-model:value="modelRef.pin" />
      </a-form-item>
      <a-form-item label="Address" v-bind="validateInfos.address">
        <a-input v-model:value="modelRef.address" />
      </a-form-item>
      <a-form-item label="Balance" v-bind="validateInfos.balance">
        <!-- <a-input v-model:value="modelRef.balance" /> -->
        <a-input-number
          v-model:value="modelRef.balance"
          :min="0"
          :step="10"
          addon-after="$"
        />
      </a-form-item>
      <a-form-item label="Email" v-bind="validateInfos.email">
        <a-input v-model:value="modelRef.email" />
      </a-form-item>
      <a-form-item name="date-picker" label="Date" v-bind="validateInfos.date">
        <a-date-picker
          v-model:value="modelRef.date"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>
    </a-form>

    <h2 v-if="$store.state.modalAction == 'delete'">
      Do you want to delete this account?
    </h2>

    <a-form
      v-bind="formItemLayout"
      v-if="
        $store.state.modalAction == 'detail' &&
        $store.state.loadingDetailAccount == false
      "
    >
      <a-form-item label="Id">
        <span>{{ $store.state.detailAccountData.id }} </span>
      </a-form-item>
      <a-form-item label="Full name">
        <span>{{ $store.state.detailAccountData.name }} </span>
      </a-form-item>
      <a-form-item label="Phone">
        <span>{{ $store.state.detailAccountData.phone }} </span>
      </a-form-item>
      <a-form-item label="Iban">
        <span>{{ $store.state.detailAccountData.iban }} </span>
      </a-form-item>
      <a-form-item label="Pin">
        <span>{{ $store.state.detailAccountData.pin }} </span>
      </a-form-item>
      <a-form-item label="Address">
        <span>{{ $store.state.detailAccountData.address }} </span>
      </a-form-item>
      <a-form-item label="Balance">
        <span>{{ $store.state.detailAccountData.balance }} </span>
      </a-form-item>
      <a-form-item label="Email">
        <span>{{ $store.state.detailAccountData.email }} </span>
      </a-form-item>
      <a-form-item label="Date">
        <span>{{ $store.state.detailAccountData.date }} </span>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button
        v-if="$store.state.modalAction == 'detail'"
        key="submit"
        type="primary"
        @click="handleCancel"
        >OK
      </a-button>
      <a-button v-else key="back" @click="handleCancel">Close</a-button>
      <!-- style="background-color: var(--background-content-color); color: #ffff" -->
      <a-button
        key="submit-add"
        type="primary"
        :loading="loading"
        @click="handleOk"
        html-type="submit"
        v-if="$store.state.modalAction == 'add'"
      >
        <span>Add</span>
      </a-button>
      <a-button
        key="submit-edit"
        type="primary"
        :loading="loading"
        @click="handleOk"
        html-type="submit"
        v-else-if="$store.state.modalAction == 'edit'"
      >
        <span>Update</span>
      </a-button>
      <a-button
        key="submit-delete"
        type="primary"
        :loading="loading"
        @click="handleOk"
        html-type="submit"
        v-else-if="$store.state.modalAction == 'delete'"
        class="delete-btn"
      >
        <span>Delete</span>
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  toRaw,
  computed,
  watchEffect,
} from 'vue';
import { useStore } from 'vuex';
import { Form, message } from 'ant-design-vue';
import axios from 'axios';
const useForm = Form.useForm;

export default defineComponent({
  props: {},
  setup() {
    const store = useStore();
    const loading = ref(false);

    // let modelRef = reactive({
    //   id: '',
    //   name: '',
    //   phone: '',
    //   iban: '',
    //   pin: '',
    //   address: '',
    //   balance: '',
    //   email: '',
    //   date: '',
    // });

    const modalAction = computed(() => store.state.modalAction);

    const modelRef = computed(() => store.getters.detailAccountData);

    watchEffect(() => {
      if (modalAction.value == 'add') {
        modelRef.value['id'] = '';
        reset();
      }
    });

    // watch(store.state.detailAccount, (newVal) => {
    //   if (store.state.modalAction == 'edit') {
    //     // modelRef = account;
    //     modelRef = newVal;
    //   }
    // });

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };

    const config = {
      rules: [
        {
          required: true,
          message: 'Please select date!',
        },
      ],
    };

    const formState = reactive({});

    const { resetFields, validate, validateInfos } = useForm(
      modelRef,
      reactive({
        id: [
          // {
          //   required: true,
          //   message: 'Please input id!',
          // },
        ],
        name: [
          {
            required: true,
            message: 'Please input full name!',
          },
        ],
        phone: [
          {
            required: true,
            message: 'Please input phone number!',
          },
          {
            message: 'Please input least 10 numbers!',
            min: 10,
          },
          // {
          //   pattern: new RegExp(/^[0-9]+$/),
          //   message: 'Please input number only!',
          // },
        ],
        iban: [
          {
            required: true,
            message: 'Please input iban!',
          },
          {
            message: 'Please input least 10 numbers!',
            min: 10,
          },
          {
            pattern: new RegExp(/^[0-9]+$/),
            message: 'Please input number only!',
          },
        ],
        pin: [
          {
            required: true,
            message: 'Please input pin!',
          },
          {
            pattern: new RegExp(/^.{4}$/),
            message: 'Pin is limited to 4 numbers!',
            // len: 4,
          },
          {
            pattern: new RegExp(/^[0-9]+$/),
            message: 'Please input number only!',
          },
        ],
        address: [
          {
            required: true,
            message: 'Please input address!',
          },
          {
            message: 'Please input least 10 characters!',
            min: 10,
          },
        ],
        balance: [
          {
            required: true,
            message: 'Please input balance number!',
          },
        ],
        email: [
          {
            required: true,
            message: 'Please input email!',
          },
          {
            type: 'email',
            message: 'Please input correct format email!',
            pattern: new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
          },
        ],
        date: [
          {
            // type: 'date',
            required: true,
            message: 'Please select date!',
          },
        ],
      })
    );

    const handleOk = () => {
      validate()
        .then(() => {
          loading.value = true;
          switch (store.state.modalAction) {
            case 'add':
              axios
                .post(
                  `${process.env.VUE_APP_SERVICE_URL}/account/addaccount`,
                  toRaw(modelRef).value
                )
                .then((response) => {
                  if (response.data.success) {
                    setTimeout(() => {
                      message.success({
                        content: 'Add account successfully!',
                        duration: 3,
                      });
                    }, 2500);
                  } else {
                    setTimeout(() => {
                      message.error({
                        content: 'Add account failed!',
                        duration: 3,
                      });
                    }, 2200);
                  }
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
              break;
            case 'edit':
              axios
                .post(
                  `${process.env.VUE_APP_SERVICE_URL}/account/updateaccount`,
                  toRaw(modelRef).value
                )
                .then((response) => {
                  if (response.data.success) {
                    setTimeout(() => {
                      message.success({
                        content: 'Update account successfully!',
                        duration: 3,
                      });
                    }, 2500);
                  } else {
                    setTimeout(() => {
                      message.error({
                        content: 'Update account failed!',
                        duration: 3,
                      });
                    }, 2200);
                  }
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
              break;
            case 'delete':
              axios
                .post(
                  `${process.env.VUE_APP_SERVICE_URL}/account/removeaccount`,
                  toRaw(modelRef).value
                )
                .then((response) => {
                  if (response.data.success) {
                    setTimeout(() => {
                      message.success({
                        content: 'Delete account successfully!',
                        duration: 3,
                      });
                    }, 2500);
                  } else {
                    setTimeout(() => {
                      message.error({
                        content: 'Delete account failed!',
                        duration: 3,
                      });
                    }, 2200);
                  }
                })
                .catch((e) => {
                  if (axios.isCancel(e)) return;
                });
              break;
          }

          setTimeout(() => {
            loading.value = false;
            store.state.modalVisible = false;
            store.dispatch('getListAccount');
            reset();
          }, 2000);
        })
        .catch((err) => {
          console.log('error', err);
        });
    };

    const handleCancel = () => {
      store.state.modalVisible = false;
    };

    const onFinish = () => {
      alert('g');
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const reset = () => {
      resetFields();
    };

    return {
      formItemLayout,
      loading,
      modelRef,
      validateInfos,
      formState,
      config,
      handleOk,
      handleCancel,
      reset,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style lang="scss">
// .ant-modal-content {
//   .ant-modal-close-x {
//     color: #ffff;
//   }

//   .ant-modal-header {
//     background-color: #222222;
//     border: 1px solid var(--border-regular);

//     .ant-modal-title {
//       color: #ffff;
//     }
//   }
//   .ant-modal-footer {
//     background-color: #222222;
//     border: 1px solid var(--border-regular);
//     color: #ffff;
//   }
// }

.ant-modal-body {
  max-height: 70vh;
  overflow-y: scroll;
}

.ant-modal-body::-webkit-scrollbar {
  width: 10px;
}

.ant-modal-body::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #acacac;
  // display: none;
}

.ant-col-xs-24.ant-form-item-label {
  flex: 0 0 20%;
}

.ant-col-xs-24.ant-form-item-control {
  max-width: 100%;
}

.ant-form-item-label {
  text-align: left;
}

.ant-modal-footer {
  padding: 15px;
}

.ant-btn-primary.delete-btn {
  background: var(--btn-delete-background-color);
  border-color: var(--btn-delete-background-color);
}

.ant-btn-primary.delete-btn:hover,
.ant-btn-primary.delete-btn:focus {
  border-color: var(--btn-delete-hover-color);
  background: var(--btn-delete-hover-color);
}
</style>
