import { createRouter, createWebHistory } from 'vue-router';

// Route level code-splitting (lazy loading) for page components.
// This generates a separate chunk for each route which is lazy-loaded when the route is visited.
const HomePage = () => import('../views/HomePage.vue');
const ProjectsPage = () => import('../views/ProjectsPage.vue');
const SkillsPage = () => import('../views/SkillsPage.vue');
const ContactPage = () => import('../views/ContactPage.vue');
const LoginPage = () => import('../views/LoginPage.vue');
const SignupPage = () => import('../views/SignupPage.vue');
const NotFoundPage = () => import('../views/NotFoundPage.vue');
const UnauthorizedPage = () => import('../views/UnauthorizedPage.vue');

// Placeholder for authenticated pages - will be added later with route guards
import { authService } from '../services/authService'; // Import authService

// Authenticated pages
const ProfilePage = () => import('../views/ProfilePage.vue');
const MyProjectsPage = () => import('../views/MyProjectsPage.vue');
const AdminDashboardPage = () => import('../views/AdminDashboardPage.vue');
const DashboardPage = () => import('../views/DashboardPage.vue');
const EditProjectPage = () => import('../views/EditProjectPage.vue');
const CreateProjectPage = () => import('../views/CreateProjectPage.vue');
const EditProfilePage = () => import('../views/EditProfilePage.vue');


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
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: EditProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: MyProjectsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/create',
    name: 'create-project',
    component: CreateProjectPage,
    meta: { requiresAuth: true, requiresAdmin: true } // Admin only as per API spec
  },
  {
    path: '/my-projects/:id/edit',
    name: 'edit-project',
    component: EditProjectPage,
    meta: { requiresAuth: true },
    props: true // Pass route params as props to the component
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboardPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // Error Pages
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
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
    // If route requires admin and user is not an admin (or not logged in), redirect to unauthorized page
    console.warn(`Unauthorized access attempt to admin route: ${to.path} by user:`, user);
    next({ name: 'unauthorized' });
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
