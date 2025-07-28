import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/authService.js';
import { settingsService } from '@/services/settingsService.js';
import { usePublicPortfolioStore } from '@/stores/publicPortfolioStore.js';

// Helper to check if a user is authenticated
const isAuthenticated = () => authService.isAuthenticated.value;

// Helper for admin-only routes
const isAdmin = () => isAuthenticated() && authService.user.value?.roles.includes('ADMIN');

const routes = [
  // --- Static Public Routes (Define these first!) ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/PortfolioPage.vue'),
    // This route now specifically handles the root path
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/public/ProjectsPage.vue'),
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('@/views/public/SkillsPage.vue'),
  },
  {
    path: '/experience',
    name: 'experience',
    component: () => import('@/views/public/ExperiencePage.vue'),
  },
  {
    path: '/testimonials',
    name: 'testimonials',
    component: () => import('@/views/public/TestimonialsPage.vue'),
  },
  {
    path: '/qualifications',
    name: 'qualifications',
    component: () => import('@/views/public/QualificationsPage.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/public/ContactPage.vue'),
  },

  // --- Auth Routes ---
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/LoginPage.vue'),
    beforeEnter: (to, from, next) => (isAuthenticated() ? next({ name: 'dashboard' }) : next()),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/public/SignupPage.vue'),
    beforeEnter: (to, from, next) => (isAuthenticated() ? next({ name: 'dashboard' }) : next()),
  },

  // --- Authenticated User Routes ---
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/user/UserDashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit-account',
    name: 'edit-account',
    component: () => import('@/views/user/UserAccountEditPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit-public-profile',
    name: 'edit-public-profile',
    component: () => import('@/views/user/UserProfileEditPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/display',
    name: 'display-settings',
    component: () => import('@/views/user/UserSettingsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/pdf',
    name: 'pdf-settings',
    component: () => import('@/views/user/UserPdfSettings.vue'),
    meta: { requiresAuth: true },
  },

  // --- Admin Routes ---
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminDashboardPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // --- Dynamic Public Portfolio Route (MUST BE LAST) ---
  {
    path: '/:slug',
    name: 'portfolio-slug',
    component: () => import('@/views/public/PortfolioPage.vue'),
    // This route will only be matched if no static routes above match.
  },

  // --- Not Found Route ---
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/public/UnauthorizedPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  // Initialize settings on first load
  if (!settingsService.isInitialized.value) {
    await settingsService.initialize();
  }

  // Fetch portfolio data if navigating to a public page that needs it
  const publicPages = ['home', 'projects', 'skills', 'experience', 'testimonials', 'qualifications', 'contact', 'portfolio-slug'];
  if (publicPages.includes(to.name)) {
    const slug = to.params.slug || 'default'; // Use 'default' or your primary user's slug for root pages
    const { fetchPortfolio } = usePublicPortfolioStore();
    await fetchPortfolio(slug);
  }

  // Authentication checks
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated()) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (requiresAdmin && !isAdmin()) {
    next({ name: 'not-found' }); // Or a dedicated 'unauthorized' page
  } else {
    next();
  }
});

export default router;
