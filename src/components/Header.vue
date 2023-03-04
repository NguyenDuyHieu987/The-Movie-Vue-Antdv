<template>
  <a-layout-header class="header">
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
    <!-- <a-dropdown :trigger="['click']">
      <a-input-search
        class="center-header"
        v-model:value="valueInput"
        enter-button
        placeholder="Nhập tên phim để tìm kiếm..."
        size="large"
        allowClear
        bordered
        :loading="loadingSearch"
        @search="handleSearch"
        @change="handleChangeInput"
        style="width: 40%; min-width: 300px; max-width: 550px"
      />
      <template #overlay v-if="valueInput.length">
        <a-menu class="dropdown-search">
          <a-menu-item
            v-for="(item, index) in dataSearch"
            :index="index"
            :key="item?.id"
          >
            <SearchCard :item="item" />

            >
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown> -->

    <a-auto-complete
      v-model:value="valueInput"
      class="center-header"
      dropdown-class-name="certain-category-search-dropdown"
      :options="dataSearch"
      style="width: 40%; min-width: 350px; max-width: 550px"
      :open="isOpenAutoComplete"
      @change="handleChangeInput"
      @focus="isOpenAutoComplete = true"
      @blur="isOpenAutoComplete = false"
      :backfill="true"
    >
      <template #option>
        <SearchCard
          v-for="(item, index) in dataSearch"
          :index="index"
          :key="item?.id"
          :item="item"
        />
      </template>
      <!-- enter-button -->
      <a-input-search
        class="center-header"
        placeholder="Nhập tên phim để tìm kiếm..."
        size="large"
        allowClear
        bordered
        :loading="loadingSearch"
        @search="handleSearch"
      >
        <template #enterButton>
          <a-tooltip title="Tìm kiếm">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </a-tooltip>
        </template>
      </a-input-search>
    </a-auto-complete>

    <div class="right-header">
      <a-popover trigger="click" placement="bottom" class="popover-search">
        <template #title>
          <h3 class="section-title search">
            <strong> Tìm kiếm </strong>
          </h3>
        </template>
        <template #content>
          <a-auto-complete
            v-model:value="valueInput"
            dropdown-class-name="certain-category-search-dropdown"
            :options="dataSearch"
            style="width: 100%"
            :open="isOpenAutoComplete"
            @change="handleChangeInput"
            @focus="isOpenAutoComplete = true"
            @blur="isOpenAutoComplete = false"
          >
            <template #option>
              <SearchCard
                v-for="(item, index) in dataSearch"
                :index="index"
                :key="item?.id"
                :item="item"
              />
            </template>
            <a-input-search
              class="center-header-responsive"
              enter-button
              placeholder="Nhập tên phim để tìm kiếm..."
              size="large"
              allowClear
              bordered
              :loading="loadingSearch"
              @search="handleSearch"
            ></a-input-search>
          </a-auto-complete>
        </template>

        <a-button
          type="primary"
          shape="circle"
          size="large"
          @click="handleOpenSearchBar"
        >
          <template #icon><SearchOutlined /></template>
        </a-button>
      </a-popover>

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
                <a-menu-item key="my-profile" v-if="$store.state.isLogin">
                  <router-link :to="{ name: 'profile' }"
                    ><span>My Profile</span>
                    <br />
                    <span style="font-size: 12px">{{
                      $store.state.userAccount?.username
                    }}</span>
                  </router-link>
                </a-menu-item>
                <a-menu-item key="account" v-if="$store.state.isLogin">
                  <router-link :to="{ name: 'home' }">Account Home</router-link>
                </a-menu-item>
                <a-menu-item key="logout">
                  <router-link :to="{ name: 'login' }" @click="handleLogout">
                    <span v-if="$store.state.isLogin"> Đăng xuất</span>
                    <span v-else> Đăng nhập</span>
                  </router-link>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
import {
  UserOutlined,
  CaretDownOutlined,
  MenuOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { getDaTaSearch } from '../services/MovieService';
import SearchCard from '@/components/SearchCard.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    UserOutlined,
    CaretDownOutlined,
    MenuOutlined,
    SearchOutlined,
    SearchCard,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const dataSearch = ref([]);
    const page = ref(1);
    const valueInput = ref('');
    const loadingSearch = ref(false);
    const isOpenAutoComplete = ref(true);
    const isLogin = computed(() => store.state.isLogin);
    const debounce = ref();

    const handleChangeInput = () => {
      if (valueInput.value.length > 0) {
        // dataSearch.value = [];

        clearTimeout(debounce.value);
        debounce.value = setTimeout(() => {
          loadingSearch.value = true;
          getDaTaSearch(valueInput.value, page.value).then((movieRespone) => {
            dataSearch.value = movieRespone?.data?.results;
          });
        }, 700);

        setTimeout(() => {
          loadingSearch.value = false;
        }, 2000);
      } else if (valueInput.value.length == 0) {
        dataSearch.value = [];
      }
    };

    const handleSearch = (value) => {
      if (value.length > 0) {
        router.push({
          name: 'discover',
          params: {
            slug: 'search',
            slug2: value?.replaceAll(' ', '+').toLowerCase(),
          },
        });
        valueInput.value = '';
        isOpenAutoComplete.value = false;
      }
    };

    const handleLogout = () => {
      if (isLogin.value) {
        window.localStorage.removeItem('userAccount');
        window.localStorage.removeItem('userToken');
        window.localStorage.removeItem('remember');
        window.localStorage.removeItem('isLogin');
      }
    };

    return {
      dataSearch,
      valueInput,
      loadingSearch,
      isOpenAutoComplete,
      isLogin,
      handleSearch,
      handleChangeInput,
      handleLogout,
    };
  },
};
</script>

<style lang="scss">
.ant-layout-header.header {
  // z-index: 100000;
  line-height: var(--header-height);
  line-height: var(--header-height);
}

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
    border: 1px solid #000;
    padding-left: 16px;
    &:hover {
      border-color: #000;
    }
  }
  .ant-input-affix-wrapper-focused {
    border-color: #b10044;
    &:hover {
      border-color: #b10044;
    }
  }

  .ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button {
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 0 20px 20px 0;
    background: transparent;
    // border: 1px solid #001628;
    border-left: none;
  }

  .right-header {
    .ant-btn {
      display: none;
    }
  }
}
</style>
