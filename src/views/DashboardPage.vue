<template>
  <div class="dashboard-page py-4">
    <div class="container">
      <div v-if="user" class="mb-4">
        <h1 class="display-5">Welcome, {{ user.firstName || 'User' }}!</h1>
        <p class="lead">This is your personal dashboard. Manage your profile and projects from
          here.</p>
      </div>
      <div v-else class="mb-4">
        <h1 class="display-5">Dashboard</h1>
        <p class="lead">Loading user information...</p>
        <!-- Fallback if user data isn't immediately available -->
      </div>

      <div class="row g-4">
        <!-- Profile Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-circle me-2"></i>Your Profile</h5>
              <p class="card-text small text-muted">
                View and update your personal information.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start" to="/profile">
                Go to Profile
              </router-link>
            </div>
          </div>
        </div>

        <!-- My Projects Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-collection-fill me-2"></i>My Projects</h5>
              <p class="card-text small text-muted">
                Access and manage all your projects.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/my-projects">
                View My Projects
              </router-link>
            </div>
          </div>
        </div>

        <!-- Create New Project Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm bg-light border-success">
            <div class="card-body d-flex flex-column text-center justify-content-center">
              <h5 class="card-title"><i class="bi bi-plus-circle-fill me-2 text-success"></i>Create
                Project</h5>
              <p class="card-text small text-muted">
                Start a new project and showcase your work.
              </p>
              <router-link class="btn btn-success mt-3" to="/projects/create">
                Create New Project
              </router-link>
            </div>
          </div>
        </div>

        <!-- Future sections for stats etc. can be added here -->

      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {authService} from '../services/authService';
// import { useRouter } from 'vue-router'; // For programmatic navigation if needed

/**
 * @file src/views/DashboardPage.vue
 * @description Dashboard page for authenticated users.
 * Provides quick links to profile, user's projects, and creating new projects.
 */

// const router = useRouter(); // Uncomment if needed

/**
 * Computed property to get the current authenticated user's data.
 * @type {import('vue').ComputedRef<object|null>}
 */
const user = computed(() => authService.user.value);

// No onMounted fetch needed here as we are relying on authService.user
// which is populated on login/app load.
// If more detailed/fresh data were needed beyond what authService.user provides,
// an onMounted fetch to a specific dashboard endpoint could be added.

</script>

<style scoped>
.dashboard-page h1, .dashboard-page .display-5 {
  font-weight: 300;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, .175) !important;
}

.card-title {
  font-weight: 500;
}

.card-title i { /* Bootstrap Icons styling */
  vertical-align: text-bottom;
}

.bg-light.border-success {
  border-width: 2px !important;
}
</style>
