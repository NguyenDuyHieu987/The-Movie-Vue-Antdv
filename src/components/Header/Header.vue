<template>
  <a-layout-header class="header">
    <div class="logo">
      <button
        class="menu-btn"
        @click="$store.state.openDrawer = !$store.state.openDrawer"
      >
        <menu-outlined v-if="$store.state.openDrawer == false" />
        <el-icon v-else><Close /></el-icon>
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
      <template #option="item">
        <!-- v-for="(item, index) in dataSearch"
        :index="index" 
        -->
        <SearchCard :key="item?.id" :item="item" />
      </template>

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
          <el-tooltip title="Tìm kiếm" content="Tìm kiếm" effect="dark">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          </el-tooltip>
        </template>
      </a-input-search>
    </a-auto-complete>

    <div class="right-header">
      <el-popover trigger="click" placement="bottom" class="popover-search">
        <template #reference>
          <a-button type="primary" shape="circle" size="large">
            <template #icon><SearchOutlined /></template>
          </a-button>
        </template>

        <template #title> </template>
        <template #default>
          <h3 class="section-title search">
            <strong> Tìm kiếm </strong>
          </h3>
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
            <template #option="item">
              <!-- v-for="(item, index) in dataSearch"
                  :index="index" -->
              <SearchCard :key="item?.id" :item="item" />
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
      </el-popover>
      <a-menu
        theme="dark"
        mode="horizontal"
        :selectable="false"
        style="height: 100%; background: transparent"
        triggerSubMenuAction="click"
      >
        <a-menu-item key="account">
          <template #icon>
            <UserOutlined />
          </template>

          <a-dropdown :trigger="['click']" class="dropdown-account">
            <a class="ant-dropdown-link" @click.prevent>
              <CaretDownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="my-profile" v-if="$store.state?.isLogin">
                  <router-link :to="{ name: 'profile' }"
                    ><span>My Profile</span>
                    <br />
                    <span style="font-size: 12px">{{
                      $store.state.userAccount?.username
                    }}</span>
                  </router-link>
                </a-menu-item>
                <a-menu-item key="accounthome" v-if="$store.state?.isLogin">
                  <router-link :to="{ path: '/' }">Account Home</router-link>
                </a-menu-item>
                <a-menu-item key="pricing" v-if="$store.state?.isLogin">
                  <router-link :to="{ path: '/billing' }">Billing</router-link>
                </a-menu-item>
                <a-menu-item key="logout">
                  <router-link :to="{ path: '/login' }" @click="handleLogout">
                    <span v-if="$store.state.isLogin"> Đăng xuất</span>
                    <span v-else> Đăng nhập</span>
                  </router-link>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-menu-item>

        <!-- <a-sub-menu key="account">
          <template #icon>
            <UserOutlined />
          </template>
          <template #title>
            <CaretDownOutlined />
          </template>

          <a-menu-item key="my-profile" v-if="$store.state?.isLogin">
            <router-link :to="{ name: 'profile' }">
              <span
                >My Profile
                <br />
                <span style="font-size: 12px">{{
                  $store.state.userAccount?.username
                }}</span>
              </span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="accounthome" v-if="$store.state?.isLogin">
            <router-link :to="{ path: '/' }">Account Home</router-link>
          </a-menu-item>
          <a-menu-item key="logout">
            <router-link :to="{ path: '/login' }" @click="handleLogout">
              <span v-if="$store.state.isLogin"> Đăng xuất</span>
              <span v-else> Đăng nhập</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu> -->
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
import { getDaTaSearch } from '../../services/MovieService';
import SearchCard from '@/components/SearchCard/SearchCard.vue';
import { useRouter } from 'vue-router';
import { Close } from '@element-plus/icons-vue';

export default {
  components: {
    UserOutlined,
    CaretDownOutlined,
    MenuOutlined,
    SearchOutlined,
    SearchCard,
    Close,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const dataSearch = ref([]);
    const page = ref(1);
    const loadingSearch = ref(false);
    const isOpenAutoComplete = ref(true);
    const isLogin = computed(() => store.state.isLogin);
    const debounce = ref();
    const valueInput = ref('');

    const handleChangeInput = () => {
      if (valueInput.value.length > 0) {
        clearTimeout(debounce.value);
        debounce.value = setTimeout(() => {
          loadingSearch.value = true;

          getDaTaSearch(valueInput.value, page.value).then((movieRespone) => {
            dataSearch.value = movieRespone?.data?.results;
          });
        }, 1000);

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
        store.state.userAccount = {};
        store.state.isLogin = false;
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

<style lang="scss" src="./Header.scss"></style>
