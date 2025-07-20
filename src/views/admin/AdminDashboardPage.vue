<template>
  <div class="admin-dashboard-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Admin Dashboard</h1>
      <p class="lead mb-5">Manage your portfolio content and account settings from this central hub.</p>

      <div class="row g-4 justify-content-center">

        <!-- Card for Statistics -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-bar-chart-line-fill me-2"></i>View Statistics</h5>
              <p class="card-text small text-muted">
                View detailed statistics on site engagement and authentication events.
              </p>
              <router-link :to="{ name: 'AdminStats' }" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Statistics
              </router-link>
            </div>
          </div>
        </div>

        <!-- Card for Public Portfolio Profile -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-badge-fill me-2"></i>Manage Portfolio Profile</h5>
              <p class="card-text small text-muted">
                Edit the public content of your home page, including headline, summary, and social links.
              </p>
              <router-link :to="{ name: 'admin-portfolio-profile' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-account' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-projects' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-skills' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-experience' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-testimonials' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'admin-qualifications' }" class="btn btn-outline-primary mt-auto align-self-start">
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
              <router-link :to="{ name: 'AdminMessages' }" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Messages
              </router-link>
            </div>
          </div>
        </div>

        <!-- Card for Backup & Restore -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-database-down me-2"></i>Backup & Restore</h5>
              <p class="card-text small text-muted">
                Download a full backup of your portfolio data or restore it from a file.
              </p>
              <router-link :to="{ name: 'admin-backup-restore' }" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Backup & Restore
              </router-link>
            </div>
          </div>
        </div>

        <!-- Card for Settings -->
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-gear-wide-connected me-2"></i>Application Settings</h5>
              <p class="card-text small text-muted">
                Control application-wide settings, such as enabling or disabling public portfolio sections.
              </p>
              <router-link :to="{ name: 'admin-settings' }" class="btn btn-outline-primary mt-auto align-self-start">
                Configure Settings
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
