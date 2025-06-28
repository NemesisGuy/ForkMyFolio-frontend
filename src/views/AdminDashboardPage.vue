<template>
  <div class="admin-dashboard-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Admin Dashboard</h1>
      <p class="lead mb-5">Manage your portfolio content from this central hub.</p>

      <div class="row g-4 justify-content-center">

        <!-- Edit Profile Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-badge-fill me-2"></i>Edit Profile</h5>
              <p class="card-text small text-muted">
                Update your headline, summary, contact info, and social links.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/profile/edit">
                Go to Profile Editor
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage Projects Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-kanban-fill me-2"></i>Manage Projects</h5>
              <p class="card-text small text-muted">
                Oversee, edit, or delete any project in the system.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/projects">
                Go to Project Management
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage Skills Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-tags-fill me-2"></i>Manage Skills</h5>
              <p class="card-text small text-muted">
                Add, edit, or remove skills available in the system.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/skills">
                Go to Skill Management
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage Experience Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-briefcase-fill me-2"></i>Manage Experience</h5>
              <p class="card-text small text-muted">
                Add and edit your work history and professional experience.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/experience">
                Go to Experience
              </router-link>
            </div>
          </div>
        </div>

        <!-- Manage Testimonials Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-chat-quote-fill me-2"></i>Manage Testimonials
              </h5>
              <p class="card-text small text-muted">
                Curate quotes and recommendations from colleagues and clients.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/testimonials">
                Go to Testimonials
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/AdminDashboardPage.vue
 * @description Admin dashboard providing links to various management sections.
 */
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
  box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, .175) !important;
}

.card-title {
  font-weight: 500;
}

.card-title i {
  vertical-align: text-bottom;
}
</style>
