import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import './assets/style/globalStyle.scss';
import { registerGlobalComponent } from './utils/layout';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import VueSocialSharing from 'vue-social-sharing';
import VueLazyload from 'vue-lazyload';
import { initFacebookSdk } from './utils/init-facebook-sdk';
import vue3GoogleLogin from 'vue3-google-login';
import GAuth from 'vue3-google-oauth2';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import vi from 'element-plus/dist/locale/vi.mjs';
import VueProgressBar from '@aacassandra/vue3-progressbar';
import { createMetaManager } from 'vue-meta';
// import 'material-icons/iconfont/material-icons.css';

import {
  faVideoCamera,
  faFilm,
  faRankingStar,
  faGlobe,
  faCalendarDays,
  faBookmark,
  faList,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faPlay,
  faStar,
  faAt,
  faCheck,
  faFilter,
  faMagnifyingGlass,
  faMoneyCheckDollar,
  faShare,
  faShareAlt,
  faClockRotateLeft,
  faEllipsisV,
  faTrashCan,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faBell as faBell1,
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faVideoCamera,
  faFilm,
  faRankingStar,
  faGlobe,
  faCalendarDays,
  faBookmark,
  faList,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faPlay,
  faYoutube,
  faStar,
  faAt,
  faCheck,
  faFilter,
  faFacebookF,
  faEnvelope,
  faMagnifyingGlass,
  faMoneyCheckDollar,
  faShare,
  faShareAlt,
  faClockRotateLeft,
  faEllipsisV,
  faTrashCan,
  faBell,
  faBell1
);

const gAuthOptions = {
  clientId:
    '973707203186-4f3sedatri213ib2f5j01ts0qj9c3fk0.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account',
  fetch_basic_profile: true,
};

const progressBarOptions = {
  color: '#e82b00',
  failedColor: 'red',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300,
  },
  autoRevert: true,
  location: 'top',
  inverse: false,
};

const app = createApp(App);
registerGlobalComponent(app);

app
  .use(Antd)
  .use(store)
  .use(router)
  .use(VueSocialSharing)
  .use(VueLazyload)
  .use(ElementPlus, {
    locale: vi,
  })
  .use(vue3GoogleLogin, gAuthOptions)
  .use(GAuth, gAuthOptions)
  .use(VueProgressBar, progressBarOptions)
  .use(createMetaManager())
  .component('font-awesome-icon', FontAwesomeIcon);

initFacebookSdk().then(startApp());

function startApp() {
  app.mount('#app');
}
