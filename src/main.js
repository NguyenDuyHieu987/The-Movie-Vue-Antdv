import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta';
import App from './App.vue';
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import './assets/style/globalStyle.scss';
import { registerGlobalComponent } from './untils/layout';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import VueSocialSharing from 'vue-social-sharing';
import VueLazyload from 'vue-lazyload';
import { initFacebookSdk } from './untils/facebook-login-vue';
// import GAuth from 'vue-google-oauth2';
import vue3GoogleLogin from 'vue3-google-login';

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
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue';
// import { faVideoCamera } from '@fortawesome/free-regular-svg-icons';

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
  faMagnifyingGlass
);

const gauthOption = {
  clientId:
    '973707203186-4f3sedatri213ib2f5j01ts0qj9c3fk0.apps.googleusercontent.com',
  // scope: 'profile email',
  // prompt: 'select_account',
  // fetch_basic_profile: true,
};

const app = createApp(App);
registerGlobalComponent(app);

app
  .use(Antd)
  .use(router)
  .use(store)
  .use(VueSocialSharing)
  .use(VueLazyload)
  .use(LottieAnimation)
  // .use(GAuth, gauthOption)
  .use(vue3GoogleLogin, gauthOption)
  .use(createMetaManager())
  .component('font-awesome-icon', FontAwesomeIcon);

initFacebookSdk().then(startApp);

function startApp() {
  app.mount('#app');
}
