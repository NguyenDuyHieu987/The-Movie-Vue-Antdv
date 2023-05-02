import { createStore } from 'vuex';
import { getWithExpiry } from '@/utils/LocalStorage';
import axios from 'axios';
import {
  getNowPlaying,
  getTvAiringToday,
  getTopRated,
  getUpComing,
  getMyRecommend,
  getAllGenre,
  getAllNational,
  getAllYear,
} from '@/services/MovieService';

const store = createStore({
  state() {
    return {
      collapsed: false,
      openDrawer: false,
      modalVisible: false,
      isLogin: getWithExpiry('userAccount') ? true : false,
      breadCrumbValue: '',
      role: 'normal',
      loadingHomePage: false,
      loadingMisc: false,
      loadingDashBoard: false,
      userAccount: getWithExpiry('userAccount') || {},
      allGenres: [],
      allCountries: [],
      allYears: [],
      nowPlayings: [],
      upComings: [],
      tvAiringTodays: [],
      topRateds: [],
      recommends: [],
    };
  },
  mutations: {
    setNowPlaying(state, data) {
      state.nowPlayings = data;
    },
    setUpComing(state, data) {
      state.upComings = data;
    },
    setTvAiringToday(state, data) {
      state.tvAiringTodays = data;
    },
    setTopRated(state, data) {
      state.topRateds = data;
    },
    setRecommend(state, data) {
      state.recommends = data;
    },
    setGenres(state, data) {
      state.allGenres = data;
    },
    setYears(state, data) {
      state.allYears = data;
    },
    setCountries(state, data) {
      state.allCountries = data;
    },
  },
  getters: {
    getUserAccount(state) {
      return state.userAccount;
    },
  },
  actions: {
    async getDataHomePage({ commit, state }) {
      await Promise.all([
        getNowPlaying(1),
        getUpComing(1),
        getTvAiringToday(1),
        getTopRated(1),
        state?.isLogin ? getMyRecommend(state.userAccount?.id, 1) : null,
      ])
        .then((response) => {
          commit('setNowPlaying', response[0].data?.results);
          commit('setUpComing', response[1].data?.results);
          commit('setTvAiringToday', response[2].data?.results);
          commit('setTopRated', response[3].data?.results);
          commit('setRecommend', response[4].data?.results);
          state.loadingHomePage = true;
        })
        .catch((e) => {
          state.loadingHomePage = false;
          if (axios.isCancel(e)) return;
        });
    },

    async getDataMisc({ commit, state }) {
      state.loadingMisc = true;

      Promise.all([getAllGenre(), getAllYear(), getAllNational()])
        .then((response) => {
          commit('setGenres', response[0].data);
          commit(
            'setYears',
            response[1].data.sort(function (a, b) {
              return +b.name.slice(-4) - +a.name.slice(-4);
            })
          );
          commit('setCountries', response[2].data);
          state.loadingMisc = false;
        })
        .catch((e) => {
          state.loadingMisc = false;
          if (axios.isCancel(e)) return;
        });
    },
  },
});

export default store;
