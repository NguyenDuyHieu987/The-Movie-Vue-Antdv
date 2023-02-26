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
  faPlay,
  faStar,
  faAt,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
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
  faPlay,
  faYoutube,
  faStar,
  faAt
);

const app = createApp(App);
registerGlobalComponent(app);

app
  .use(Antd)
  .use(router)
  .use(store)
  .use(VueSocialSharing)
  .use(VueLazyload)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
