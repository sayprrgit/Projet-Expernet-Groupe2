import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/formations',
      name: 'formations',
      component: () => import('@/views/FormationsView.vue'),
    },
    {
      path: '/campus',
      name: 'campus',
      component: () => import('@/views/CampusView.vue'),
    },
    {
      path: '/expernet-pro',
      name: 'expernet-pro',
      component: () => import('@/views/ProView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true, bare: true },
    },
    {
      path: '/galia',
      name: 'galia',
      component: () => import('@/views/GaliaView.vue'),
    },
    {
      path: '/galia/espace',
      name: 'galia-espace',
      component: () => import('@/views/galia/GaliaEspaceView.vue'),
      meta: { requiresAuth: true, bare: true },
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamsView.vue'),
    },
    {
      path: '/teams/messagerie',
      name: 'teams-messagerie',
      component: () => import('@/views/TeamsChatView.vue'),
      meta: { requiresAuth: true, bare: true },
    },
    {
      path: '/a-propos',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('@/views/PlanningView.vue'),
    },
    {
      path: '/candidature',
      name: 'candidature',
      component: () => import('@/views/CandidatureView.vue'),
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/views/DocsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
    const { useAuthStore } = await import('@/stores/auth');
    const auth = useAuthStore();
    await auth.ensureSession();
    if (!auth.user) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }
  }

  if (to.meta.guest && token) {
    const { useAuthStore } = await import('@/stores/auth');
    const auth = useAuthStore();
    await auth.ensureSession();
    if (auth.user) {
      return { name: 'galia-espace' };
    }
  }

  return true;
});

router.afterEach(() => {
  window.scrollTo({ top: 0 });
});

export default router;
