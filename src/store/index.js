import { createStore } from 'vuex';
import axios from 'axios';

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
    getMovieByYear: (state) => (inputVal) => {
      return state.listMovie.filter(
        (mov) => mov.release_date.slice(0, 4) == inputVal
      );
    },
    detailAccountData(state) {
      return state.detailAccountData;
    },
  },
  actions: {
    setActiveSideBar({ commit }) {
      commit('setActiveSideBar');
    },

    async getListAccount({ commit, state }) {
      state.loadingTable = true;
      const dataAccount = await axios
        .get(`${process.env.VUE_APP_SERVICE_URL}/account/getallaccount1`)
        .then((accountResponse) => accountResponse.data);

      commit('setListAccount', dataAccount);
      state.loadingTable = false;
    },

    async setDetailAccount({ commit }, { dataAccount }) {
      commit('setDetailAccountData', dataAccount);
    },

    async searchAccount({ commit, state }, { textInput }) {
      state.loadingTable = true;
      state.loadingSearch = true;
      const dataAccount = await axios
        .get(
          `${process.env.VUE_APP_SERVICE_URL}/account/searchaccount1?query=${textInput}`
        )
        .then((accountResponse) => accountResponse.data);
      console.log(dataAccount);
      commit('setListAccount', dataAccount);
      state.loadingTable = false;
      state.loadingSearch = false;
    },

    async getNumberOfAccount({ commit }) {
      const numberOfAccount = await axios
        .get(`${process.env.VUE_APP_SERVICE_URL}/account/getnumberofaccount`)
        .then((accountResponse) => accountResponse.data.result);

      commit('setNumberOfAccount', numberOfAccount);
    },
  },
});

export default store;
