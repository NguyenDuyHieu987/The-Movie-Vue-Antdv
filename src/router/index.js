import { createRouter, createWebHistory } from 'vue-router';

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
    path: '/movie',
    name: 'movie',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "movie" */ '../views/MovieView.vue'),
  },
  {
    path: '/series',
    name: 'series',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(/* webpackChunkName: "series" */ '../views/SeriesView.vue'),
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
