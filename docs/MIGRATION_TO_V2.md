# Frontend Migration Guide: Upgrading to ForkMyFolio v2.0.0

Welcome, frontend team! This guide helps you update our Vue.js application to work with the new ForkMyFolio v2.0.0 backend, which now supports multiple users with unique portfolio pages (e.g., `forkmyfolio.com/jane-doe`). The backend has shifted from a single-user app to a multi-user platform with role-based access (`Guest`, `ROLE_USER`, `ROLE_ADMIN`). This document provides clear steps and code examples to integrate with the new system using our existing `authService.js`, `apiClient.js`, `public.api.js`, `user.api.js`, and `admin.api.js`.

## 1. What’s New in v2.0.0?

The backend now supports multiple users, each with their own portfolio data. Key changes for the frontend:

- **Multiple Users**: Each user has a unique `slug` (e.g., `jane-doe`) for their public portfolio.
- **New API Structure**: APIs are grouped by role:
   - **Public**: For viewing portfolios (`/api/v1/portfolios/{slug}`) or authentication (`/api/v1/auth/*`).
   - **User**: For managing own data (`/api/v1/me/**`), requires `ROLE_USER` or `ROLE_ADMIN`.
   - **Admin**: For platform management (`/api/v1/admin/**`), requires `ROLE_ADMIN`.
- **Authentication**: Uses JWT `accessToken` (stored in `authService`) and an HttpOnly `refreshToken` cookie.
- **Visibility Controls**: Users can toggle whether portfolio sections (e.g., projects, skills) are public.
- **Standardized Responses**: All API responses use a JSON wrapper (`ApiResponseWrapper`) for consistent handling.

See `API_ENDPOINTS.md` for the full endpoint list.

## 2. Foundational Changes

### 2.1. API Client (`apiClient.js`)

Our existing `apiClient.js` is ready for the new backend, as it:
- Reads `VITE_API_BASE_URL` from `.env` (e.g., `VITE_API_BASE_URL=https://forkmyfolio.com/api/v1`).
- Adds `Authorization: Bearer <token>` headers using `authService.accessToken`.
- Intercepts `401 Unauthorized` errors to trigger `authService.refreshToken()`.

**Action**: Update `.env` to point to the new API base URL:

```env
# .env
VITE_API_BASE_URL=https://forkmyfolio.com/api/v1
```

Verify `apiClient.js` is correctly set up:

```javascript
// src/api/apiClient.js
import axios from 'axios';
import { authService } from './authService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(config => {
  if (authService.accessToken) {
    config.headers.Authorization = `Bearer ${authService.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        await authService.refreshToken();
        error.config.headers.Authorization = `Bearer ${authService.accessToken}`;
        return apiClient(error.config);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### 2.2. Resource IDs

- **Old**: Numeric IDs (e.g., `/projects/1`).
- **New**: UUID strings (e.g., `/api/v1/me/projects/123e4567-e89b-12d3-a456-426614174000`).

**Action**: Update all API calls to use `uuid` fields from responses instead of `id`.

## 3. Authentication Flow (`authService.js`)

Update `authService.js` to handle the new user object (`id`, `slug`, `username`, `email`, `roles`) and refresh flow.

**Example (`authService.js`)**:

```javascript
// src/api/authService.js
import { reactive } from 'vue';
import apiClient from './apiClient';

export const authService = reactive({
  loggedIn: false,
  accessToken: null,
  user: null,
  roles: [],
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.status === 'success') {
      this.setAuth(response.data.data.user, response.data.data.accessToken);
      await this.fetchUserDetails(); // Fetch full user details
    } else {
      throw new Error(response.data.errors[0]?.message || 'Login failed');
    }
  },
  async register(credentials) {
    const response = await apiClient.post('/auth/register', credentials);
    if (response.data.status === 'success') {
      this.setAuth(response.data.data.user, response.data.data.accessToken);
      await this.fetchUserDetails();
    } else {
      throw new Error(response.data.errors[0]?.message || 'Registration failed');
    }
  },
  async refreshToken() {
    const response = await apiClient.post('/auth/refresh-token');
    if (response.data.status === 'success') {
      this.accessToken = response.data.data.accessToken;
    } else {
      throw new Error('Token refresh failed');
    }
  },
  async fetchUserDetails() {
    const response = await apiClient.get('/me');
    if (response.data.status === 'success') {
      this.user = response.data.data;
      this.roles = response.data.data.roles;
    }
  },
  setAuth(user, accessToken) {
    this.loggedIn = true;
    this.user = user;
    this.accessToken = accessToken;
    this.roles = user.roles;
  },
  logout() {
    apiClient.post('/auth/logout');
    this.loggedIn = false;
    this.accessToken = null;
    this.user = null;
    this.roles = [];
  },
});
```

**Actions**:
1. Update `login` and `register` to handle the new user object with `slug` and `roles`.
2. Add `fetchUserDetails` to get full user data via `GET /api/v1/me` after login/refresh.
3. Ensure `refreshToken` updates `accessToken` and retries failed requests.

## 4. Routing (`router/index.js`)

Update routes to support public portfolios, user dashboard, and admin panel.

| Old Route          | New Route            | Component              | Description                           |
|--------------------|----------------------|------------------------|---------------------------------------|
| `/`                | `/:slug`             | `PortfolioPage.vue`    | Displays a user’s public portfolio.   |
| `/projects`        | `/me/projects`       | `UserProjectsPage.vue` | User’s project management page.       |
| `/admin/dashboard` | `/admin/dashboard`   | `AdminDashboard.vue`   | Admin’s management dashboard.         |
| `/login`           | `/login`             | `LoginPage.vue`        | Unchanged (login page).               |
| `/register`        | `/register`          | `RegisterPage.vue`     | Unchanged (registration page).        |

**Example (`router/index.js`)**:

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../api/authService';
import PortfolioPage from '../views/PortfolioPage.vue';
import UserProjectsPage from '../views/UserProjectsPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

const routes = [
  { path: '/:slug', component: PortfolioPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/me/projects',
    component: UserProjectsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
    meta: { requiresAdmin: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.loggedIn) {
    return next('/login');
  }
  if (to.meta.requiresAdmin && !authService.roles.includes('ADMIN')) {
    return next('/403');
  }
  next();
});

export default router;
```

**Actions**:
1. Add `/:slug` for public portfolios.
2. Replace old routes (e.g., `/projects`) with `/me/*` (e.g., `/me/projects`).
3. Implement route guards for `requiresAuth` and `requiresAdmin`.

## 5. Public Portfolio Pages

Create a new `PortfolioPage.vue` to display public portfolios using `GET /api/v1/portfolios/{slug}`. Only show sections marked `visible: true`.

**Example (`PortfolioPage.vue`)**:

```vue
<!-- src/views/PortfolioPage.vue -->
<template>
  <div v-if="portfolio" class="portfolio-container">
    <h1>{{ portfolio.user.username }}'s Portfolio</h1>
    <section v-if="portfolio.profile?.visible">
      <h2>About</h2>
      <p>{{ portfolio.profile.summary }}</p>
    </section>
    <section v-if="portfolio.projects?.length">
      <h2>Projects</h2>
      <div v-for="project in portfolio.projects" :key="project.uuid" v-if="project.visible">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </section>
  </div>
  <div v-else>Loading...</div>
</template>
<script>
import { publicApi } from '../api/public.api';

export default {
  data() {
    return { portfolio: null };
  },
  async created() {
    try {
      const response = await publicApi.getPortfolioBySlug(this.$route.params.slug);
      if (response.data.status === 'success') {
        this.portfolio = response.data.data;
      } else {
        this.$router.push('/404');
      }
    } catch (error) {
      this.$router.push('/404');
    }
  },
};
</script>
<style scoped>
.portfolio-container {
  @apply max-w-4xl mx-auto p-4;
  animation: fadeIn 1s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
```

**Action**: Create `public.api.js` to handle public API calls.

```javascript
// src/api/public.api.js
import apiClient from './apiClient';

export const publicApi = {
  async getPortfolioBySlug(slug) {
    return apiClient.get(`/portfolios/${slug}`);
  },
};
```

## 6. User Dashboard

Update the dashboard to use `/api/v1/me/*` endpoints for managing user data (projects, skills, etc.). Add visibility toggles for each entity.

### 6.1. API Layer (`user.api.js`)

Create `user.api.js` for user-specific endpoints.

```javascript
// src/api/user.api.js
import apiClient from './apiClient';

export const userApi = {
  async getProjects() {
    return apiClient.get('/me/projects');
  },
  async createProject(project) {
    return apiClient.post('/me/projects', project);
  },
  async updateProject(uuid, project) {
    return apiClient.put(`/me/projects/${uuid}`, project);
  },
  async deleteProject(uuid) {
    return apiClient.delete(`/me/projects/${uuid}`);
  },
  async toggleProjectVisibility(uuid, visible) {
    return apiClient.put(`/me/projects/${uuid}/visibility`, { visible });
  },
  // Add similar methods for skills, experiences, qualifications, testimonials
};
```

### 6.2. Example (`UserProjectsPage.vue`)

Manage projects with visibility toggles.

```vue
<!-- src/views/UserProjectsPage.vue -->
<template>
  <div class="dashboard-container">
    <h1>My Projects</h1>
    <div v-for="project in projects" :key="project.uuid" class="project-item">
      <h3>{{ project.title }}</h3>
      <label>
        <input
          type="checkbox"
          :checked="project.visible"
          @change="toggleProjectVisibility(project.uuid, $event.target.checked)"
        >
        Public
      </label>
      <button @click="deleteProject(project.uuid)">Delete</button>
    </div>
    <form @submit.prevent="createProject">
      <input v-model="newProject.title" placeholder="Project Title" required>
      <textarea v-model="newProject.description" placeholder="Description"></textarea>
      <label><input type="checkbox" v-model="newProject.visible"> Public</label>
      <button type="submit">Add Project</button>
    </form>
  </div>
</template>
<script>
import { userApi } from '../api/user.api';

export default {
  data() {
    return {
      projects: [],
      newProject: { title: '', description: '', visible: true },
    };
  },
  async created() {
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await userApi.getProjects();
        if (response.data.status === 'success') {
          this.projects = response.data.data;
        } else {
          alert('Error: ' + response.data.errors[0]?.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data.errors[0]?.message || 'Network issue'));
      }
    },
    async createProject() {
      try {
        const response = await userApi.createProject(this.newProject);
        if (response.data.status === 'success') {
          this.projects.push(response.data.data);
          this.newProject = { title: '', description: '', visible: true };
        } else {
          alert('Error: ' + response.data.errors[0]?.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data.errors[0]?.message || 'Network issue'));
      }
    },
    async toggleProjectVisibility(uuid, visible) {
      try {
        const response = await userApi.toggleProjectVisibility(uuid, visible);
        if (response.data.status === 'success') {
          const project = this.projects.find(p => p.uuid === uuid);
          project.visible = response.data.data.visible;
        } else {
          alert('Error: ' + response.data.errors[0]?.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data.errors[0]?.message || 'Network issue'));
      }
    },
    async deleteProject(uuid) {
      try {
        const response = await userApi.deleteProject(uuid);
        if (response.data.status === 'success') {
          this.projects = this.projects.filter(p => p.uuid !== uuid);
        } else {
          alert('Error: ' + response.data.errors[0]?.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data.errors[0]?.message || 'Network issue'));
      }
    },
  },
};
</script>
<style scoped>
.dashboard-container { @apply max-w-4xl mx-auto p-4; }
.project-item { @apply border p-2 mb-2; }
</style>
```

**Action**: Create similar components for `skills`, `experiences`, `qualifications`, `testimonials`, using endpoints like `/api/v1/me/skills/{uuid}/visibility`.

## 7. Admin Dashboard

Update `AdminDashboard.vue` to use `/api/v1/admin/*` endpoints (e.g., `/api/v1/admin/users`).

**Example (`admin.api.js`)**:

```javascript
// src/api/admin.api.js
import apiClient from './apiClient';

export const adminApi = {
  async getUsers() {
    return apiClient.get('/admin/users');
  },
  // Add methods for other admin endpoints
};
```

## 8. Handle API Responses

All responses use `ApiResponseWrapper`:

```json
{
  "status": "success", // or "fail", "unauthorized", "validation_failed", "error"
  "data": {},         // Data or null
  "errors": []        // Error details (e.g., [{ field: "email", message: "Invalid email" }])
}
```

**Example (Error Handling)**:

```javascript
// src/views/UserProjectsPage.vue
async fetchProjects() {
  try {
    const response = await userApi.getProjects();
    if (response.data.status === 'success') {
      this.projects = response.data.data;
    } else {
      this.errors = response.data.errors;
      alert('Error: ' + this.errors[0]?.message);
    }
  } catch (error) {
    this.errors = error.response?.data.errors || [{ field: 'general', message: 'Network error' }];
    alert('Error: ' + this.errors[0].message);
  }
}
```

## 9. Frontend Actions Checklist

1. **API Layer**:
   - Create `user.api.js` for `/api/v1/me/**` endpoints (e.g., `getProjects`, `toggleProjectVisibility`).
   - Update `public.api.js` for `/api/v1/portfolios/{slug}` (e.g., `getPortfolioBySlug`).
   - Verify `admin.api.js` for `/api/v1/admin/**` endpoints.

2. **Authentication**:
   - Update `authService.js` to handle new user object (`slug`, `roles`) and `GET /api/v1/me`.
   - Test login, register, refresh, and logout flows.

3. **Routing**:
   - Update `router/index.js` with new routes (`/:slug`, `/me/*`, `/admin/*`).
   - Add route guards for `requiresAuth` (`ROLE_USER`) and `requiresAdmin` (`ROLE_ADMIN`).

4. **Component Refactoring**:
   - Create `PortfolioPage.vue` for public `/:slug` route.
   - Refactor management pages (e.g., `UserProjectsPage.vue`) under `/me/*`.
   - Update API calls to use `user.api.js` and UUIDs.
   - Add visibility toggle checkboxes for each entity (e.g., projects, skills).

5. **Testing**:
   - Update Jest tests for components (`PortfolioPage.vue`, `UserProjectsPage.vue`).
   - Add Cypress E2E tests for public portfolio, user dashboard, and admin flows.

## 10. Notes

- **Security**: Store `accessToken` in `authService` (not localStorage). The `refreshToken` cookie is HttpOnly and managed by the backend.
- **Swagger UI**: Test endpoints at `http://localhost:8080/swagger-ui.html` (or production URL).
- **Documentation**: Refer to `API_ENDPOINTS.md` for all endpoints and schemas.
- **Styling**: Use Tailwind CSS for responsive designs, as per the backend plan.
- **Performance**: Public portfolio data is cached server-side for 5 minutes. Consider client-side caching for repeated views.