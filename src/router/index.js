// C:/Users/Reign/IdeaProjects/ForkMyFolio-frontend-vue/src/router/index.js
import {createRouter, createWebHistory} from 'vue-router';
import {authService} from '@/services/authService.js';
import {settingsService} from '@/services/settingsService.js';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';

// Helper to check if a user is authenticated
const isAuthenticated = () => authService.isAuthenticated.value;

// Helper for admin-only routes
const isAdmin = () => isAuthenticated() && authService.user.value?.roles.includes('ADMIN');

const routes = [
  // --- Static Public Routes ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/LandingPage.vue'),
  },

  // --- Auth Routes ---
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/LoginPage.vue'),
    // UPDATED: Redirect to the slug-based dashboard if already logged in.
    beforeEnter: (to, from, next) => (isAuthenticated() ? next({
      name: 'dashboard',
      params: {slug: authService.user.value.slug}
    }) : next()),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/public/SignupPage.vue'),
    // UPDATED: Redirect to the slug-based dashboard if already logged in.
    beforeEnter: (to, from, next) => (isAuthenticated() ? next({
      name: 'dashboard',
      params: {slug: authService.user.value.slug}
    }) : next()),
  },

  // --- Authenticated User Routes ---
  {
    path: '/:slug/manage/dashboard',
    name: 'dashboard',
    component: () => import('@/views/user/UserDashboardPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/messages',
    name: 'user-messages', // THIS IS THE FIX: Changed from 'my-messages' to match the Navbar link.
    component: () => import('@/views/user/UserMessagesPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/exports',
    name: 'my-data-exports',
    component: () => import('@/views/user/UserDataExportsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/projects',
    name: 'my-projects',
    component: () => import('@/views/user/UserProjectsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/skills',
    name: 'my-skills',
    component: () => import('@/views/user/UserSkillsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/experience',
    name: 'my-experience',
    component: () => import('@/views/user/UserExperiencePage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/testimonials',
    name: 'my-testimonials',
    component: () => import('@/views/user/UserTestimonialsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/qualifications',
    name: 'my-qualifications',
    component: () => import('@/views/user/UserQualificationsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/backup',
    name: 'my-backup',
    component: () => import('@/views/user/UserBackupRestorePage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/profile',
    name: 'profile',
    component: () => import('@/views/user/UserAccountPage.vue'), // UPDATED
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/profile/edit-account',
    name: 'edit-account',
    component: () => import('@/views/user/UserAccountEditPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/profile/edit-public-profile',
    name: 'edit-public-profile',
    component: () => import('@/views/user/UserProfileEditPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/settings/display',
    name: 'display-settings',
    component: () => import('@/views/user/UserSettingsPage.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: '/:slug/manage/settings/pdf',
    name: 'pdf-settings',
    component: () => import('@/views/user/UserPdfSettings.vue'),
    props: true,
    meta: {requiresAuth: true},
  },

  // --- Admin Routes ---
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminDashboardPage.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/messages',
    name: 'admin-messages',
    component: () => import('@/views/admin/AdminMessagesPage.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/admin/AdminUsersPage.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/users/create',
    name: 'admin-user-create',
    component: () => import('@/views/admin/AdminUserCreatePage.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/users/edit/:id',
    name: 'admin-user-edit',
    component: () => import('@/views/admin/AdminUserEditPage.vue'),
    props: true,
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('@/views/admin/AdminSettings.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/pdf-settings',
    name: 'admin-pdf-settings',
    component: () => import('@/views/admin/AdminPdfSettings.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/stats',
    name: 'admin-stats',
    component: () => import('@/views/admin/AdminStats.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },
  {
    path: '/admin/backup-restore',
    name: 'admin-backup-restore',
    component: () => import('@/views/admin/AdminBackupRestorePage.vue'),
    meta: {requiresAuth: true, requiresAdmin: true},
  },

  // --- Dynamic Public Portfolio Routes (MUST BE LAST before 404) ---
  // These routes are now nested under a slug parameter.
  {
    path: '/:slug',
    name: 'portfolio-home', // Renamed from portfolio-slug for clarity
    component: () => import('@/views/public/HomePage.vue'),
    props: true,
  },
  {
    path: '/:slug/projects',
    name: 'projects-public',
    component: () => import('@/views/public/ProjectsPage.vue'),
    props: true,
  },
  {
    path: '/:slug/skills',
    name: 'skills-public',
    component: () => import('@/views/public/SkillsPage.vue'),
    props: true,
  },
  {
    path: '/:slug/experience',
    name: 'experience-public',
    component: () => import('@/views/public/ExperiencePage.vue'),
    props: true,
  },
  {
    path: '/:slug/testimonials',
    name: 'testimonials-public',
    component: () => import('@/views/public/TestimonialsPage.vue'),
    props: true,
  },
  {
    path: '/:slug/qualifications',
    name: 'qualifications-public',
    component: () => import('@/views/public/QualificationsPage.vue'),
    props: true,
  },
  {
    path: '/:slug/contact',
    name: 'contact',
    component: () => import('@/views/public/ContactPage.vue'),
    props: true,
  },
  {
    path: '/:slug/project/:uuid', // Project details now also need the slug for context
    name: 'project-details',
    component: () => import('@/views/public/ProjectDetailsPage.vue'),
    props: true,
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
      return {top: 0};
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const publicPortfolioPages = ['portfolio-home', 'projects-public', 'skills-public', 'experience-public', 'testimonials-public', 'qualifications-public', 'contact', 'project-details'];

  if (publicPortfolioPages.includes(to.name)) {
    const {fetchPortfolio} = usePublicPortfolioStore();
    const slugToFetch = to.params.slug;

    // If a route that requires a slug is accessed without one, it's an invalid state.
    // This is a safety net; with the new structure, this should not happen.
    if (!slugToFetch) {
      console.error(`[Router Guard] Route '${to.name}' is missing the 'slug' parameter. Redirecting to home.`);
      return next({name: 'home'});
    }

    // The slug from the URL is now the single source of truth for fetching data.
    await Promise.all([
      fetchPortfolio(slugToFetch),
      settingsService.initialize(slugToFetch)
    ]);
  } else if (to.name === 'home') {
    // For the main landing page, initialize with global defaults.
    await settingsService.initialize('default');
    const store = usePublicPortfolioStore();
    store.portfolio.value = null;
    store.currentSlug.value = null;
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    // For authenticated user pages, initialize with their own settings.
    await settingsService.initialize();
  }

  // Authentication checks
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated()) {
    return next({name: 'login', query: {redirect: to.fullPath}});
  }

  // --- NEW: Ownership check for management routes ---
  // A management route has a slug parameter and requires auth, but is not an admin route.
  // This prevents a user from accessing /another-user/manage/dashboard
  if (to.params.slug && requiresAuth && !to.path.startsWith('/admin')) {
    const userSlug = authService.user.value?.slug;
    if (to.params.slug !== userSlug) {
      console.warn(`[Router Guard] Unauthorized access attempt to manage slug '${to.params.slug}' by user with slug '${userSlug}'.`);
      return next({name: 'not-found'});
    }
  }

  if (requiresAdmin && !isAdmin()) {
    return next({name: 'not-found'});
  }

  next();
});

export default router;
