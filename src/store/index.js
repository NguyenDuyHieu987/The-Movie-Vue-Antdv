import { createStore } from 'vuex';
import { getWithExpiry } from '@/utils/LocalStorage';
import axios from 'axios';
import {
  getTrending,
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
      isLogin: getWithExpiry('userAccount') != null ? true : false,
      breadCrumbValue: '',
      role: 'normal',
      loadingHomePage: false,
      loadingMisc: false,
      loadingDashBoard: false,
      userAccount: {},
      allGenres: [],
      allCountries: [],
      allYears: [],
      trendings: [],
      nowPlayings: [],
      upComings: [],
      tvAiringTodays: [],
      topRateds: [],
      recommends: [],
    };
  },
  mutations: {
    setTrending(state, data) {
      state.trendings = data;
    },
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
        getTrending(1),
        getNowPlaying(1),
        getUpComing(1),
        getTvAiringToday(1),
        getTopRated(1),
        state?.isLogin ? getMyRecommend(state.userAccount?.id, 1) : null,
      ])
        .then((response) => {
          commit('setTrending', response[0].data?.results.slice(0, 11));
          commit('setNowPlaying', response[1].data?.results.slice(0, 10));
          commit('setUpComing', response[2].data?.results.slice(0, 10));
          commit('setTvAiringToday', response[3].data?.results.slice(0, 10));
          commit('setTopRated', response[4].data?.results.slice(0, 10));
          if (state?.isLogin) {
            commit('setRecommend', response[5].data?.results);
          }
          state.loadingHomePage = true;
        })
        .catch((e) => {
          // state.loadingHomePage = false;
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
          state.loadingMisc = true;
        })
        .catch((e) => {
          // state.loadingMisc = false;
          if (axios.isCancel(e)) return;
        });
    },
  },
});

export default store;
