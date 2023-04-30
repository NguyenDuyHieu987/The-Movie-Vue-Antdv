<template>
  <!-- <a-drawer
    placement="left"
    :visible="$store.state.openDrawer"
    @close="onClose"
    :width="250"
    :closable="true"
  >
    <template #extra>
      <div class="logo">
        <router-link :to="{ path: '/' }">
          <h1>Phimhay247</h1>
        </router-link>
      </div>
    </template>
    <TheMenu />
  </a-drawer> -->

  <el-drawer
    v-model="$store.state.openDrawer"
    direction="ltr"
    placement="left"
    :show-close="false"
  >
    <template #header>
      <div class="logo">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <div
            class="user-image-container"
            v-if="!$store.state.collapsed && $store.state.isLogin"
          >
            <img
              class="avatar"
              :src="
                !isNaN(+$store.state?.userAccount?.avatar)
                  ? `/images/account_avatar/account${$store.state?.userAccount?.avatar}.jpg`
                  : $store.state?.userAccount?.avatar
              "
            />
          </div>

          <h4 style="color: #fff">
            {{ $store.state.userAccount?.username }}
          </h4>
        </div>
      </div>
    </template>
    <TheMenu />
  </el-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
// import { MenufoldOutlined } from '@ant-design/icons-vue';
import TheMenu from '../TheMenu/TheMenu.vue';

export default defineComponent({
  components: {
    TheMenu,
    // MenufoldOutlined,
  },
  setup() {
    const store = useStore();
    const visible = ref(false);

    const onClose = () => {
      store.state.openDrawer = false;
    };

    return {
      visible,
      onClose,
    };
  },
});
</script>

<style lang="scss" src="./Drawer.scss"></style>
