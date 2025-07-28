<template>
  <div class="dashboard-page py-5 animated-gradient-background">
    <div class="container">
      <div v-if="user" class="mb-5 text-center">
        <h1 class="display-4 fw-light glass-text animate-fade-in-up">Welcome, {{ user.firstName || 'User' }}!</h1>
        <p class="lead glass-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
          This is your personal dashboard. Manage your public portfolio from here.
        </p>
      </div>

      <div class="row g-4 justify-content-center">
        <!-- Profile & Account -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-badge-fill me-2"></i>Profile & Account</h5>
              <p class="card-text small text-muted">Update your public profile and private account details.</p>
              <router-link :to="{ name: 'profile' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Profile
              </router-link>
            </div>
          </div>
        </div>

        <!-- Projects -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-kanban-fill me-2"></i>Projects</h5>
              <p class="card-text small text-muted">Add, edit, and manage the visibility of your projects.</p>
              <router-link :to="{ name: 'projects' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Projects
              </router-link>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.4s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-tags-fill me-2"></i>Skills</h5>
              <p class="card-text small text-muted">Curate the list of skills and technologies you want to showcase.</p>
              <router-link :to="{ name: 'skills' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Skills
              </router-link>
            </div>
          </div>
        </div>

        <!-- Experience -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.5s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-briefcase-fill me-2"></i>Experience</h5>
              <p class="card-text small text-muted">Update your professional work history and job descriptions.</p>
              <router-link :to="{ name: 'experience' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Experience
              </router-link>
            </div>
          </div>
        </div>

        <!-- Qualifications -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.6s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-patch-check-fill me-2"></i>Qualifications</h5>
              <p class="card-text small text-muted">List your degrees, certifications, and other qualifications.</p>
              <router-link :to="{ name: 'qualifications' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Qualifications
              </router-link>
            </div>
          </div>
        </div>

        <!-- Testimonials -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.7s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-chat-quote-fill me-2"></i>Testimonials</h5>
              <p class="card-text small text-muted">Manage the quotes and recommendations from colleagues.</p>
              <router-link :to="{ name: 'testimonials' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Testimonials
              </router-link>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.8s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-envelope-paper-fill me-2"></i>Messages</h5>
              <p class="card-text small text-muted">View and manage messages sent to you via your public profile.</p>
              <router-link :to="{ name: 'messages' }" class="btn btn-outline-primary mt-auto align-self-start">
                View Messages
              </router-link>
            </div>
          </div>
        </div>

        <!-- Backup & Restore -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.9s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-database-down me-2"></i>Backup & Restore</h5>
              <p class="card-text small text-muted">Download a full backup of your portfolio or restore from a file.</p>
              <router-link :to="{ name: 'backup' }" class="btn btn-outline-primary mt-auto align-self-start">
                Go to Backup
              </router-link>
            </div>
          </div>
        </div>

        <!-- Display Settings -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 1.0s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-toggles me-2"></i>Display Settings</h5>
              <p class="card-text small text-muted">Configure the visibility of sections on your public portfolio.</p>
              <router-link :to="{ name: 'display-settings' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage Display
              </router-link>
            </div>
          </div>
        </div>

        <!-- PDF Settings -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 1.1s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-file-earmark-pdf-fill me-2"></i>PDF Settings</h5>
              <p class="card-text small text-muted">Choose the default template for your downloadable PDF portfolio.</p>
              <router-link :to="{ name: 'pdf-settings' }" class="btn btn-outline-primary mt-auto align-self-start">
                Manage PDF
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { authService } from '@/services/authService';

/**
 * @file src/views/user/UserDashboardPage.vue
 * @description The central dashboard for an authenticated user, providing navigation to all management sections.
 */

const user = computed(() => authService.user.value);
</script>

<style scoped>
.dashboard-page .display-4,
.dashboard-page .display-5 {
  font-weight: 300;
}

.card-title i {
  vertical-align: -0.125em;
  opacity: 0.8;
}
</style>
