import { createStore } from 'vuex';
import { getWithExpiry } from '../untils/LocalStorage';

// import axios from 'axios';

const store = createStore({
  state() {
    return {
      openDrawer: false,
      modalVisible: false,
      isLogin:
        //  JSON.parse(window.localStorage.getItem('isLogin'))
        getWithExpiry('isLogin'),
      breadCrumbValue: '',
      loadingSearch: false,
      loadingTable: false,
      userAccount:
        // JSON.parse(window.localStorage.getItem('userAccount'))
        getWithExpiry('userAccount'),
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
