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
      import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
  },
  {
    path: '/discover/:slug/:slug2',
    name: 'discover',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "discover" */ '../views/DiscoverMovieView.vue'
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
      import(/* webpackChunkName: "follow" */ '../views/FollowView.vue'),
  },
  {
    path: '/ranking',
    name: 'ranking',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "ranking" */ '../views/RankingView.vue'),
  },
  {
    path: '/info/:id/:name',
    name: 'info',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "info" */ '../views/PrevPlayView.vue'),
  },
  {
    path: '/play/:id/:name',
    name: 'play',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "play" */ '../views/PlayView.vue'),
  },
  {
    path: '/play/:id/:name/:tap',
    name: 'playtv',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "play" */ '../views/PlayView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'auth',
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      layout: 'auth',
    },
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/SignupView.vue'),
  },
  {
    // path: "*",
    path: '/404',
    name: '404',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '../views/Error404View.vue'),
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
