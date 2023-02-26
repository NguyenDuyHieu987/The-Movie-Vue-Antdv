<template>
  <a-layout-header>
    <div class="logo">
      <button class="menu-btn" @click="$store.state.openDrawer = true">
        <menu-outlined />
      </button>
      <router-link :to="{ name: 'home' }">
        <a-tooltip title="Trang chủ">
          <h1>PhimHay247</h1>
        </a-tooltip>
      </router-link>
    </div>
    <a-input-search
      v-model:value="value"
      enter-button
      placeholder="Nhập tên phim để tìm kiếm..."
      size="large"
      allowClear
      bordered
      :loading="$store.state.loadingSearch"
      @search="onSearch"
      @change="onChange"
      style="max-width: 40%"
    />
    <a-menu
      theme="dark"
      mode="horizontal"
      :selectable="false"
      style="height: 100%; background: transparent"
    >
      <a-menu-item key="1">
        <UserOutlined style="margin-right: 10px" />
        <a-dropdown
          :trigger="['click']"
          overlayStyle="border: 0.25px solid var(--border-regular);"
        >
          <a class="ant-dropdown-link" @click.prevent>
            <CaretDownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="my-profile">
                <router-link :to="{ name: 'profile' }"
                  ><span>My Profile</span>
                  <br />
                  <span style="font-size: 12px">{{
                    $store.state.userAccount?.user_name
                  }}</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="account">
                <router-link :to="{ name: 'home' }">Account Home</router-link>
              </a-menu-item>
              <a-menu-item key="login" @click="handleLogout">
                <router-link :to="{ name: 'login' }">Log out </router-link>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import {
  UserOutlined,
  CaretDownOutlined,
  MenuOutlined,
} from '@ant-design/icons-vue';

export default {
  components: {
    UserOutlined,
    CaretDownOutlined,
    MenuOutlined,
  },
  setup() {
    const handleLogout = () => {
      window.localStorage.removeItem('userToken');
      window.localStorage.removeItem('remember');
    };
    return { handleLogout };
  },
};
</script>

<style lang="scss">
.logo {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .menu-btn {
    display: none;
    padding: 16px 18px;
    height: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    // border-right: 0.25px solid var(--border-regular);
    // margin-right: 10px;

    svg {
      font-size: 1.4em;
      // cursor: pointer;
      // margin-right: 10px;
      // margin-bottom: 3px;
    }
  }

  h1 {
    background-image: linear-gradient(
      90deg,
      #230d72,
      #44107a,
      #ff1361,
      #ffc400,
      #ff5100,
      #231557
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textclip 3s linear infinite;
    display: inline-block;
    font-family: 'Lobster', cursive;
    font-weight: 200;
    font-size: 2em;
  }

  @keyframes textclip {
    from {
      background-position: 0% center;
    }
    to {
      background-position: 200% center;
    }
  }
}

.ant-layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0px 20px;
  border-bottom: 0.25px solid var(--border-regular);
  height: var(--header-height);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 3;
  background-image: linear-gradient(
    to right,
    var(--sider-header-background-color2),
    var(--sider-header-background-color3),
    var(--sider-header-background-color2)
  );

  .ant-input-search .ant-input {
    color: #fff;
    background: transparent;
  }

  .ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
    background: transparent;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  .ant-input-group-addon {
    background: none;
  }

  .ant-input-affix-wrapper {
    border: 1px solid #001628;
  }

  .ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button {
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 0 20px 20px 0;
  }
}
</style>
