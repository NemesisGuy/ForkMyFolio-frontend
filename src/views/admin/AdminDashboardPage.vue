<template>
  <div class="admin-dashboard-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Admin Dashboard</h1>
      <p class="lead mb-5">Manage your portfolio content and account settings from this central hub.</p>

      <div class="row g-4 justify-content-center">

        <!-- Card for Public Portfolio Profile -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-badge-fill me-2"></i>Manage Portfolio Profile</h5>
              <p class="card-text small text-muted">
                Edit the public content of your home page, including headline, summary, and social links.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/portfolio-profile">
                Go to Profile Editor
              </router-link>
            </div>
          </div>
        </div>

        <!-- Card for Private User Account -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-gear me-2"></i>Manage Account</h5>
              <p class="card-text small text-muted">
                Update your private account details like your name and email.
              </p>
              <!-- KEY CHANGE: This link is now enabled and styled as a primary action -->
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/account">
                Go to Account Settings
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
                Add, edit, or delete the projects showcased in your portfolio.
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
                Add or remove the skills listed in your portfolio.
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

        <!-- Manage Qualifications Section -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-patch-check-fill me-2"></i>Manage Qualifications</h5>
              <p class="card-text small text-muted">
                List your degrees, certifications, and other qualifications.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/qualifications">
                Go to Qualifications
              </router-link>
            </div>
          </div>
        </div>


        <!-- Card for Contact Messages -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-envelope-paper-fill me-2"></i>Manage Messages</h5>
              <p class="card-text small text-muted">
                View and manage messages submitted through your public contact form.
              </p>
              <router-link class="btn btn-outline-primary mt-auto align-self-start"
                           to="/admin/messages">
                Go to Messages
              </router-link>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
// No script changes needed
</script>

<style scoped>
/* No style changes needed */
</style>
