<template>
  <div class="admin-dashboard-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Admin Dashboard</h1>
      <p class="lead mb-5">Manage application data and users from this central hub.</p>

      <div class="row g-4">
        <!-- Manage Users Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-people-fill me-2"></i>Manage Users</h5>
              <p class="card-text small text-muted">
                View, edit, or manage user accounts and roles.
              </p>
              <router-link to="/admin/users" class="btn btn-outline-primary mt-auto align-self-start">
                Go to User Management
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage All Projects Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-kanban-fill me-2"></i>Manage Projects</h5>
              <p class="card-text small text-muted">
                Oversee, edit, or delete any project in the system.
              </p>
              <router-link to="/admin/projects" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Project Management
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage All Skills Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-tags-fill me-2"></i>Manage Skills</h5>
              <p class="card-text small text-muted">
                Add, edit, or remove skills available in the system.
              </p>
              <router-link to="/admin/skills" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Skill Management
              </router-link>
            </div>
          </div>
        </div>

        <!-- Future admin sections can be added here -->

      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/AdminDashboardPage.vue
 * @description Admin dashboard providing links to various management sections.
 * This page requires admin privileges.
 */
// import { useRouter } from 'vue-router'; // For programmatic navigation if needed

// const router = useRouter(); // Uncomment if needed

// No specific data fetching or complex logic needed for this initial dashboard structure.
// It primarily serves as a navigation hub for admin functionalities.
</script>

<style scoped>
.admin-dashboard-page h1, .admin-dashboard-page .display-5 {
  font-weight: 300;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.6rem 1.2rem rgba(0,0,0,.175) !important;
}

.card-title {
  font-weight: 500;
}

.card-title i { /* Bootstrap Icons styling */
  vertical-align: text-bottom;
}
</style>
