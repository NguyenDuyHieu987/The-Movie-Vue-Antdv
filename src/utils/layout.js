import { defineAsyncComponent } from 'vue';

export function registerGlobalComponent(app) {
  app.component(
    'default-layout',
    defineAsyncComponent(() => import('../layouts/DefaultLayout.vue'))
  );
  app.component(
    'auth-layout',
    defineAsyncComponent(() => import('../layouts/AuthLayout.vue'))
  );
}
