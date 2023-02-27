import { createStore } from 'vuex';
// import axios from 'axios';

const store = createStore({
  state() {
    return {
      openDrawer: false,
      modalVisible: false,
      modalAction: '',
      loadingDetailAccount: false,
      loadingSearch: false,
      loadingTable: false,
      userAccount: {},
      listAccount: [],
      numberOfAccount: 0,
      detailAccountData: {},
    };
  },
  mutations: {
    setListAccount(state, dataAccount) {
      state.listAccount = dataAccount;
    },
    setDetailAccountData(state, dataAccount) {
      state.detailAccountData = dataAccount;
    },
    setNumberOfAccount(state, numberOfAccount) {
      state.numberOfAccount = numberOfAccount;
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
