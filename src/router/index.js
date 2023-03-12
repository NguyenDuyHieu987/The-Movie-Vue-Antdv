import { createRouter, createWebHistory } from 'vue-router';
// import { getWithExpiry } from '../untils/LocalStorage';

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/HomeView/HomeView.vue'),
  },
  {
    path: '/discover/:slug/:slug2',
    name: 'discover',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "discover" */ '../views/DiscoverMovieView/DiscoverMovieView.vue'
      ),
  },
  {
    path: '/follow',
    name: 'follow',
    meta: {
      layout: 'default',
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "follow" */ '../views/FollowView/FollowView.vue'
      ),
  },
  {
    path: '/ranking',
    name: 'ranking',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "ranking" */ '../views/RankingView/RankingView.vue'
      ),
  },
  {
    path: '/info/:id/:name',
    name: 'info',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "info" */ '../views/PrevPlayView/PrevPlayView.vue'
      ),
  },
  {
    path: '/play/:id/:name',
    name: 'play',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "play" */ '../views/PlayView/PlayView.vue'),
  },
  {
    path: '/play/:id/:name/:tap',
    name: 'playtv',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "play" */ '../views/PlayView/PlayView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: 'default',
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
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "pricing" */ '../views/Pricing/Pricing.vue'),
  },
  {
    path: '/billing',
    name: 'billing',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "billing" */ '../views/Billing/Billing.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'auth',
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
      layout: 'auth',
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
//   // if (to.matched.some((route) => route.meta.requireAuth)) {
//   if (getWithExpiry('isLogin') != true) next('/login');
//   else next();
//   // } else next();
// });

export default router;
