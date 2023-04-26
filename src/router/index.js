import { createRouter, createWebHistory } from 'vue-router';
// import { getWithExpiry } from '@/untils/LocalStorage';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const routes = [
  // =============Normal==============
  {
    path: '/',
    name: 'home',
    meta: {
      // layout: "default",
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "home" */ '../views/Normal/HomeView/HomeView.vue'
      ),
  },
  {
    path: '/discover/:slug/:slug2',
    name: 'discover',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "discover" */ '../views/Normal/DiscoverMovieView/DiscoverMovieView.vue'
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
        /* webpackChunkName: "info" */ '../views/Normal/PrevPlayView/PrevPlayView.vue'
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
        /* webpackChunkName: "infoTV" */ '../views/Normal/PrevPlayTVView/PrevPlayTVView.vue'
      ),
  },
  {
    path: '/play/movie/:id/:name',
    name: 'play',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "play" */ '../views/Normal/PlayView/PlayView.vue'
      ),
  },
  {
    path: '/play/tv/:id/:name/:tap',
    name: 'playTV',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "playTV" */ '../views/Normal/PlayViewTV/PlayViewTV.vue'
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
        /* webpackChunkName: "follow" */ '../views/Normal/FollowView/FollowView.vue'
      ),
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
        /* webpackChunkName: "history" */ '../views/Normal/HistoryView/HistoryView.vue'
      ),
  },
  {
    path: '/ranking',
    name: 'ranking',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "ranking" */ '../views/Normal/RankingView/RankingView.vue'
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
        /* webpackChunkName: "profile" */ '../views/Normal/ProfileView/ProfileView.vue'
      ),
  },
  {
    path: '/pricing',
    name: 'pricing',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "pricing" */ '../views/Normal/Pricing/Pricing.vue'
      ),
  },
  {
    path: '/billing',
    name: 'billing',
    meta: {
      layout: { name: 'default', component: DefaultLayout },
    },
    component: () =>
      import(
        /* webpackChunkName: "billing" */ '../views/Normal/Billing/Billing.vue'
      ),
  },
  // =============Admin==============
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '../views/Admin/DashBoard/DashBoardView.vue'
      ),
  },
  {
    path: '/dashboard/managefilm/movie',
    name: 'managemovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageMovieView/ManageMovieView.vue'
      ),
    children: [],
  },
  {
    path: '/dashboard/managefilm/movie/add',
    name: 'addmovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddMovieView/AddMovieView.vue'
      ),
  },
  {
    path: '/dashboard/managefilm/movie/:id/edit',
    name: 'editmovie',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "editmovie" */ '../views/Admin/EditMovieView/EditMovieView.vue'
      ),
  },
  {
    path: '/dashboard/managefilm/tv',
    name: 'managetv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageTVView/ManageTVView.vue'
      ),
  },
  {
    path: '/dashboard/managefilm/tv/add',
    name: 'addtv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddTvView/AddTvView.vue'
      ),
  },
  {
    path: '/dashboard/managefilm/tv/:id/edit',
    name: 'edittv',
    meta: {
      layout: { name: 'admin', component: AdminLayout },
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "editmovie" */ '../views/Admin/EditTvView/EditTvView.vue'
      ),
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
        /* webpackChunkName: "login" */ '../views/Normal/LoginView/LoginView.vue'
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
        /* webpackChunkName: "signup" */ '../views/Normal/SignupView/SignupView.vue'
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
        /* webpackChunkName: "NotFound" */ '../views/Normal/Error404View/Error404View.vue'
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
//   if (to.matched.some((record) => record.meta.requiresAdmin)) {
//     if (getWithExpiry('userAccount') != null) {
//       if (getWithExpiry('userAccount')?.role == 'admin') {
//         next();
//       } else {
//         next({ path: '/404' });
//       }
//     } else {
//       next({ path: '/404' });
//     }
//   } else {
//     next();
//   }
// });

export default router;
