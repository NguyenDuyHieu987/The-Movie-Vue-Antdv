import { createRouter, createWebHistory } from 'vue-router';
// import { getWithExpiry } from '@/untils/LocalStorage';

const routes = [
  // =============Normal==============
  {
    path: '/',
    name: 'home',
    meta: {
      layout: 'default',
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
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "discover" */ '../views/Normal/DiscoverMovieView/DiscoverMovieView.vue'
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
        /* webpackChunkName: "info" */ '../views/Normal/PrevPlayView/PrevPlayView.vue'
      ),
  },
  {
    path: '/play/:id/:name',
    name: 'play',
    meta: {
      layout: 'default',
    },
    component: () =>
      import(
        /* webpackChunkName: "play" */ '../views/Normal/PlayView/PlayView.vue'
      ),
    children: [
      {
        path: ':tap',
        name: 'playtv',
        meta: {
          layout: 'default',
        },
        component: () =>
          import(
            /* webpackChunkName: "playtv" */ '../views/Normal/PlayView/PlayView.vue'
          ),
      },
    ],
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
        /* webpackChunkName: "follow" */ '../views/Normal/FollowView/FollowView.vue'
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
        /* webpackChunkName: "ranking" */ '../views/Normal/RankingView/RankingView.vue'
      ),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: {
      layout: 'default',
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
      layout: 'default',
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
      layout: 'default',
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
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '../views/Admin/DashBoard/DashBoardView.vue'
      ),
  },
  {
    path: '/managefilm/movie',
    name: 'managemovie',
    meta: {
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageMovieView/ManageMovieView.vue'
      ),
  },
  {
    path: '/managefilm/movie/add',
    name: 'addmovie',
    meta: {
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddMovieView/AddMovieView.vue'
      ),
  },
  {
    path: '/managefilm/movie/:id/edit',
    name: 'editmovie',
    meta: {
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "editmovie" */ '../views/Admin/EditMovieView/EditMovieView.vue'
      ),
  },
  {
    path: '/managefilm/tv',
    name: 'managetv',
    meta: {
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/ManageTVView/ManageTVView.vue'
      ),
  },
  {
    path: '/managefilm/tv/add',
    name: 'addtv',
    meta: {
      layout: 'admin',
      requiresAdmin: true,
      requiresAuth: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "addmovie" */ '../views/Admin/AddTvView/AddTvView.vue'
      ),
  },
  {
    path: '/managefilm/tv/:id/edit',
    name: 'edittv',
    meta: {
      layout: 'admin',
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
      layout: 'auth',
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
      layout: 'auth',
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
