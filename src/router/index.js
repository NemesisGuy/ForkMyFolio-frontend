import {createRouter, createWebHistory} from 'vue-router';
import {authService} from '@/services/authService';

// --- Page Imports (using lazy loading for better performance) ---

// Public Pages
const HomePage = () => import('@/views/public/HomePage.vue');
const ProjectsPage = () => import('@/views/public/ProjectsPage.vue');
const ProjectDetailsPage = () => import('@/views/public/ProjectDetailsPage.vue');
const SkillsPage = () => import('@/views/public/SkillsPage.vue');
const ExperiencePage = () => import('@/views/public/ExperiencePage.vue');
const TestimonialsPage = () => import('@/views/public/TestimonialsPage.vue');
const QualificationsPage = () => import('@/views/public/QualificationsPage.vue');
const ContactPage = () => import('@/views/public/ContactPage.vue');
const LoginPage = () => import('@/views/public/LoginPage.vue');
const SignupPage = () => import('@/views/public/SignupPage.vue');
const UserAccountPage = () => import('@/views/admin/UserAccount.vue');

// Admin Pages
const AdminDashboardPage = () => import('@/views/admin/AdminDashboardPage.vue');
const AdminPortfolioProfilePage = () => import('@/views/admin/AdminPortfolioProfilePage.vue');
const AdminProjectsPage = () => import('@/views/admin/AdminProjectsPage.vue');
const AdminSkillsPage = () => import('@/views/admin/AdminSkillsPage.vue');
const AdminExperiencePage = () => import('@/views/admin/AdminExperiencePage.vue');
const AdminTestimonialsPage = () => import('@/views/admin/AdminTestimonialsPage.vue');
const AdminQualificationsPage = () => import('@/views/admin/AdminQualificationsPage.vue');
const AdminAccountPage = () => import('@/views/admin/AdminAccountPage.vue');
const AdminMessages = () => import('@/views/admin/AdminMessages.vue');
const AdminSettingsPage = () => import('@/views/admin/AdminSettings.vue');
const AdminStatsPage = () => import('@/views/admin/AdminStats.vue');
// --- KEY CHANGE: Import the new backup/restore page ---
const AdminBackupRestorePage = () => import('@/views/admin/AdminBackupRestorePage.vue');


// Utility Pages
const NotFoundPage = () => import('@/views/public/NotFoundPage.vue');
const UnauthorizedPage = () => import('@/views/public/UnauthorizedPage.vue');

const routes = [
  // --- Public Routes ---
  {path: '/', name: 'home', component: HomePage},
  {path: '/projects', name: 'projects', component: ProjectsPage},
  {
    path: '/projects/:uuid',
    name: 'project-details',
    component: ProjectDetailsPage,
    props: true // This allows the :uuid param to be passed as a prop to the component
  },
  {path: '/skills', name: 'skills', component: SkillsPage},
  {path: '/experience', name: 'experience', component: ExperiencePage},
  {path: '/testimonials', name: 'testimonials', component: TestimonialsPage},
  {path: '/qualifications', name: 'qualifications', component: QualificationsPage},
  {path: '/contact', name: 'contact', component: ContactPage},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/signup', name: 'signup', component: SignupPage},

  // Authenticated user route (for any logged-in user)
  {
    path: '/account',
    name: 'user-account',
    component: UserAccountPage,
    meta: {requiresAuth: true}
  },

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
  {
    path: '/admin/messages',
    name: 'AdminMessages',
    component: AdminMessages,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Contact Messages'
    }
  },
  {
    path: '/admin/pdf-settings',
    name: 'admin-pdf-settings',
    component: () => import('@/views/admin/AdminPdfSettings.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'PDF Settings'
    }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: AdminSettingsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Application Settings'
    }
  },
  {
    path: '/admin/stats',
    name: 'AdminStats',
    component: AdminStatsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Statistics'
    }
  },
  // --- KEY CHANGE: Add the new route for the backup/restore page ---
  {
    path: '/admin/backup',
    name: 'admin-backup-restore',
    component: AdminBackupRestorePage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Backup & Restore'
    }
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
  const user = authService.user.value;

  // If the route requires authentication and the user is not logged in, redirect to login.
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({name: 'login', query: {redirect: to.fullPath}});
  }
  // If the route requires admin privileges and the user is not an admin, redirect to unauthorized.
  else if (to.meta.requiresAdmin && (!user || !user.roles?.includes('ADMIN'))) {
    console.warn(`Unauthorized access attempt to admin route: ${to.path} by user:`, user);
    next({name: 'unauthorized'});
  }
  // Otherwise, allow navigation.
  else {
    next();
  }
});

export default router;
