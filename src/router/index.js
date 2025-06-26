import { createRouter, createWebHistory } from 'vue-router';

// Route level code-splitting (lazy loading) for page components.
// This generates a separate chunk for each route which is lazy-loaded when the route is visited.
const HomePage = () => import('../views/HomePage.vue'); // Will create this page
const ProjectsPage = () => import('../views/ProjectsPage.vue'); // Will create this page
const SkillsPage = () => import('../views/SkillsPage.vue'); // Will create this page
const ContactPage = () => import('../views/ContactPage.vue'); // Will create this page
const LoginPage = () => import('../views/LoginPage.vue'); // Will create this page
const SignupPage = () => import('../views/SignupPage.vue'); // Will create this page

// Placeholder for authenticated pages - will be added later with route guards
import { authService } from '../services/authService'; // Import authService

// Route level code-splitting (lazy loading) for page components.
// This generates a separate chunk for each route which is lazy-loaded when the route is visited.
const HomePage = () => import('../views/HomePage.vue');
const ProjectsPage = () => import('../views/ProjectsPage.vue');
const SkillsPage = () => import('../views/SkillsPage.vue');
const ContactPage = () => import('../views/ContactPage.vue');
const LoginPage = () => import('../views/LoginPage.vue');
const SignupPage = () => import('../views/SignupPage.vue');

// Authenticated pages
const ProfilePage = () => import('../views/ProfilePage.vue'); // Will create this page
const MyProjectsPage = () => import('../views/MyProjectsPage.vue'); // Will create this page
const AdminDashboardPage = () => import('../views/AdminDashboardPage.vue'); // Will create this page


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsPage,
  },
  {
    path: '/skills',
    name: 'skills',
    component: SkillsPage,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: MyProjectsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active'
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated.value;
  const user = authService.getUser(); // Get the plain user object for role checking

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If route requires auth and user is not authenticated, redirect to login
    next({
      name: 'login',
      query: { redirect: to.fullPath } // Pass the intended path for redirection after login
    });
  } else if (to.meta.requiresAdmin && (!user || !user.roles || !user.roles.includes('ADMIN'))) {
    // If route requires admin and user is not an admin (or not logged in), redirect to home
    // Or, you could redirect to a specific 'Unauthorized' page
    console.warn(`Unauthorized access attempt to admin route: ${to.path} by user:`, user);
    next({ name: 'home' });
  } else {
    // Otherwise, proceed to the route
    next();
  }
});

/**
 * @file src/router/index.js
 * @description Vue Router configuration.
 * Sets up routes for the application, employing lazy loading for page components
 * and global navigation guards for authentication and authorization.
 */
export default router;
