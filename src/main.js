import { createApp } from 'vue';
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
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
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
  faFilter
);

const app = createApp(App);
registerGlobalComponent(app);

app
  .use(Antd)
  .use(router)
  .use(store)
  .use(VueSocialSharing)
  .use(VueLazyload)
  .use(LottieAnimation)
  .component('font-awesome-icon', FontAwesomeIcon);
// .mount('#app');

initFacebookSdk().then(startApp);

function startApp() {
  app.mount('#app');
}
