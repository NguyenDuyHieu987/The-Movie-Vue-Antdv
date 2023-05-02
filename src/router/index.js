import { createRouter, createWebHistory } from 'vue-router';
// import { getWithExpiry } from '@/untils/LocalStorage';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import requireAuth from '@/middleware/requireAuth';
// import store from '@/store';

const routes = [
  // =============Default==============
  {
    path: '/',
    name: 'home',
    meta: {
      // layout: "default",
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/HomeView/HomeView.vue'),
  },
  {
    path: '/discover/:slug/:slug2',
    name: 'discover',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "discover" */ '../views/DiscoverMovieView/DiscoverMovieView.vue'
      ),
  },
  {
    path: '/info/movie/:id/:name',
    name: 'info',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "info" */ '../views/PrevPlayView/PrevPlayView.vue'
      ),
  },
  {
    path: '/info/tv/:id/:name',
    name: 'infoTV',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "infoTV" */ '../views/PrevPlayTVView/PrevPlayTVView.vue'
      ),
  },
  {
    path: '/play/movie/:id/:name',
    name: 'play',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(/* webpackChunkName: "play" */ '../views/PlayView/PlayView.vue'),
  },
  {
    path: '/play/tv/:id/:name/:tap',
    name: 'playTV',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "playTV" */ '../views/PlayViewTV/PlayViewTV.vue'
      ),
  },
  {
    path: '/follow',
    name: 'follow',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "follow" */ '../views/FollowView/FollowView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAuth(to, from, next);
    },
  },
  {
    path: '/history',
    name: 'history',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "history" */ '../views/HistoryView/HistoryView.vue'
      ),
    beforeEnter: (to, from, next) => {
      requireAuth(to, from, next);
    },
  },
  {
    path: '/ranking',
    name: 'ranking',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "ranking" */ '../views/RankingView/RankingView.vue'
      ),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "profile" */ '../views/ProfileView/ProfileView.vue'
      ),
  },
  {
    path: '/pricing',
    name: 'pricing',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(/* webpackChunkName: "pricing" */ '../views/Pricing/Pricing.vue'),
  },
  {
    path: '/billing',
    name: 'billing',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(/* webpackChunkName: "billing" */ '../views/Billing/Billing.vue'),
  },
  // =============Auth==============
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: { name: 'auth', component: AuthLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "login" */ '../views/LoginView/LoginView.vue'
      ),
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      layout: { name: 'auth', component: AuthLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "signup" */ '../views/SignupView/SignupView.vue'
      ),
  },
  {
    // path: "*",
    path: '/404',
    name: '404',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "NotFound" */ '../views/Error404View/Error404View.vue'
      ),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '404',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.name == 'home')) {
//     if (store.state.loadingHomePage == true) {
//       next();
//     } else {
//       new Promise((resolve) => {
//         // loadingHomePage.value = true;

//         resolve(
//           store.dispatch('getDataHomePage'),
//           store.dispatch('getDataMisc')
//         );
//       }).then(() => {
//         setTimeout(() => {
//           // loadingHomePage.value = false;
//           next();
//         }, 2000);
//       });
//     }
//   } else {
//     next();
//   }
// });

export default router;
