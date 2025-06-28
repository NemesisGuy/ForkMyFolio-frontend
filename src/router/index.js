import {createRouter, createWebHistory} from 'vue-router';
import {authService} from '@/services/authService';

// Public pages
const HomePage = () => import('@/views/HomePage.vue');
const ProjectsPage = () => import('@/views/ProjectsPage.vue');
const SkillsPage = () => import('@/views/SkillsPage.vue');
const ExperiencePage = () => import('@/views/ExperiencePage.vue'); // NEW
const TestimonialsPage = () => import('@/views/TestimonialsPage.vue'); // NEW
const ContactPage = () => import('@/views/ContactPage.vue');
const LoginPage = () => import('@/views/LoginPage.vue');
const SignupPage = () => import('@/views/SignupPage.vue');

// Admin pages
const AdminDashboardPage = () => import('@/views/AdminDashboardPage.vue');
const EditProfilePage = () => import('@/views/EditProfilePage.vue');
const AdminProjectsPage = () => import('@/views/admin/AdminProjectsPage.vue');
const AdminSkillsPage = () => import('@/views/admin/AdminSkillsPage.vue');
const AdminExperiencePage = () => import('@/views/admin/AdminExperiencePage.vue'); // NEW
const AdminTestimonialsPage = () => import('@/views/admin/AdminTestimonialsPage.vue'); // NEW

// Utility pages
const NotFoundPage = () => import('@/views/NotFoundPage.vue');
const UnauthorizedPage = () => import('@/views/UnauthorizedPage.vue');

const routes = [
  // --- Public Routes ---
  {path: '/', name: 'home', component: HomePage},
  {path: '/projects', name: 'projects', component: ProjectsPage},
  {path: '/skills', name: 'skills', component: SkillsPage},
  {path: '/experience', name: 'experience', component: ExperiencePage}, // NEW
  {path: '/testimonials', name: 'testimonials', component: TestimonialsPage}, // NEW
  {path: '/contact', name: 'contact', component: ContactPage},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/signup', name: 'signup', component: SignupPage},

  // --- Admin Routes ---
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: EditProfilePage,
    meta: {requiresAuth: true, requiresAdmin: true}
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardPage,
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
  }, // NEW
  {
    path: '/admin/testimonials',
    name: 'admin-testimonials',
    component: AdminTestimonialsPage,
    meta: {requiresAuth: true, requiresAdmin: true}
  }, // NEW

  // --- Error Routes ---
  {path: '/unauthorized', name: 'unauthorized', component: UnauthorizedPage},
  {path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage}
];

// Add development-only routes
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
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active'
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated.value;
  const user = authService.getUser();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({name: 'login', query: {redirect: to.fullPath}});
  } else if (to.meta.requiresAdmin && (!user || !user.roles?.includes('ADMIN'))) {
    console.warn(`Unauthorized access attempt to admin route: ${to.path} by user:`, user);
    next({name: 'unauthorized'});
  } else {
    next();
  }
});

export default router;
