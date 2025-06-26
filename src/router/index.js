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
// const ProfilePage = () => import('../views/ProfilePage.vue');
// const MyProjectsPage = () => import('../views/MyProjectsPage.vue');
// const AdminDashboardPage = () => import('../views/AdminDashboardPage.vue');


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
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: ProfilePage,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/my-projects',
  //   name: 'my-projects',
  //   component: MyProjectsPage,
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   component: AdminDashboardPage,
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active', // Optional: class for active router links (Bootstrap uses 'active')
  linkExactActiveClass: 'exact-active' // Optional: class for exact active links
});

/**
 * @file src/router/index.js
 * @description Vue Router configuration.
 * Sets up routes for the application, employing lazy loading for page components.
 */
export default router;
