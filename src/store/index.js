import { createStore } from 'vuex';
import { getWithExpiry } from '@/utils/LocalStorage';

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
  actions: {},
});

export default store;
