import {createRouter, createWebHistory} from 'vue-router';
import {authService} from '@/services/authService';

// --- Page Imports ---
// Public Pages
const HomePage = () => import('@/views/HomePage.vue');
const ProjectsPage = () => import('@/views/ProjectsPage.vue');
const SkillsPage = () => import('@/views/SkillsPage.vue');
const ExperiencePage = () => import('@/views/ExperiencePage.vue');
const TestimonialsPage = () => import('@/views/TestimonialsPage.vue');
const QualificationsPage = () => import('@/views/QualificationsPage.vue');
const ContactPage = () => import('@/views/ContactPage.vue');
const LoginPage = () => import('@/views/LoginPage.vue');
const SignupPage = () => import('@/views/SignupPage.vue');

// Admin Pages
const AdminDashboardPage = () => import('@/views/admin/AdminDashboardPage.vue');
const AdminPortfolioProfilePage = () => import('@/views/admin/AdminPortfolioProfilePage.vue');
const AdminProjectsPage = () => import('@/views/admin/AdminProjectsPage.vue');
const AdminSkillsPage = () => import('@/views/admin/AdminSkillsPage.vue');
const AdminExperiencePage = () => import('@/views/admin/AdminExperiencePage.vue');
const AdminTestimonialsPage = () => import('@/views/admin/AdminTestimonialsPage.vue');
const AdminQualificationsPage = () => import('@/views/admin/AdminQualificationsPage.vue');
const AdminAccountPage = () => import('@/views/admin/AdminAccountPage.vue');

// Utility Pages
const NotFoundPage = () => import('@/views/NotFoundPage.vue');
const UnauthorizedPage = () => import('@/views/UnauthorizedPage.vue');

const routes = [
  // --- Public Routes ---
  {path: '/', name: 'home', component: HomePage},
  {path: '/projects', name: 'projects', component: ProjectsPage},
  {path: '/skills', name: 'skills', component: SkillsPage},
  {path: '/experience', name: 'experience', component: ExperiencePage},
  {path: '/testimonials', name: 'testimonials', component: TestimonialsPage},
  {path: '/qualifications', name: 'qualifications', component: QualificationsPage},
  {path: '/contact', name: 'contact', component: ContactPage},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/signup', name: 'signup', component: SignupPage},

  // --- Admin Routes (all protected by the navigation guard) ---
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/portfolio-profile',
    name: 'admin-portfolio-profile',
    component: AdminPortfolioProfilePage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/account',
    name: 'admin-account',
    component: AdminAccountPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: AdminProjectsPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/skills',
    name: 'admin-skills',
    component: AdminSkillsPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/experience',
    name: 'admin-experience',
    component: AdminExperiencePage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/testimonials',
    name: 'admin-testimonials',
    component: AdminTestimonialsPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin/qualifications',
    name: 'admin-qualifications',
    component: AdminQualificationsPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },

  // --- Error & Utility Routes ---
  {path: '/unauthorized', name: 'unauthorized', component: UnauthorizedPage},
  {path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage}
];

// Add development-only routes for testing purposes
if (import.meta.env.DEV) {
  const ModalTestPage = () => import('@/views/dev/ModalTestPage.vue');
  routes.push({
    path: '/dev/test-modals',
    name: 'test-modals',
    component: ModalTestPage,
  });
  console.log('Development routes enabled. Modal test page available at /dev/test-modals');
}

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

// Global navigation guard for security
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated.value;
  const user = authService.getUser();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({name: 'login', query: {redirect: to.fullPath}});
  }
  else if (to.meta.requiresAdmin && (!user || !user.roles?.includes('ADMIN'))) {
    console.warn(`Unauthorized access attempt to admin route: ${to.path} by user:`, user);
    next({name: 'unauthorized'});
  }
  else {
    next();
  }
});

export default router;
