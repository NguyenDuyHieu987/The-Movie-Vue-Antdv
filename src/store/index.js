import { createStore } from 'vuex';
import { getWithExpiry } from '@/untils/LocalStorage';

const store = createStore({
  state() {
    return {
      openDrawer: false,
      modalVisible: false,
      isLogin: getWithExpiry('userAccount') != null ? true : false,
      breadCrumbValue: '',
      role: 'normal',
      loadingSearch: false,
      loadingTable: false,
      userAccount: getWithExpiry('userAccount'),
      allGenres: [],
      allCountries: [],
    };
  },
  mutations: {
    setListAccount(state, dataAccount) {
      state.listAccount = dataAccount;
    },
    setDetailAccountData(state, dataAccount) {
      state.detailAccountData = dataAccount;
    },
  },
  getters: {
    getUserAccount(state) {
      return state.userAccount;
    },
  },
  actions: {},
});

export default store;
