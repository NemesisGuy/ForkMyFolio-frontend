<template>
  <div class="user-account-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div v-if="user" class="mb-5 text-center">
        <h1 class="display-4 fw-light glass-text animate-fade-in-up">Profile & Account</h1>
        <p class="lead glass-subtitle animate-fade-in-up" style="animation-delay: 0.1s;">
          Manage your account details and public-facing portfolio profile.
        </p>
      </div>

      <!-- Navigation Cards -->
      <div class="row g-4 justify-content-center">
        <!-- Edit Account Card -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-person-gear me-2"></i>Edit Account Details</h5>
              <p class="card-text small text-muted">Manage your private account information like
                your name, email, and profile picture.</p>
              <router-link :to="{ name: 'edit-account', params: { slug: user.slug } }"
                           class="btn btn-outline-primary mt-auto align-self-start">
                Manage Account
              </router-link>
            </div>
          </div>
        </div>

        <!-- Edit Public Profile Card -->
        <div class="col-md-6 col-lg-4 animate-fade-in-up" style="animation-delay: 0.3s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-layout-text-sidebar-reverse me-2"></i>Edit
                Public Profile</h5>
              <p class="card-text small text-muted">Edit the public information on your portfolio,
                like your headline and summary.</p>
              <router-link :to="{ name: 'edit-public-profile', params: { slug: user.slug } }"
                           class="btn btn-outline-primary mt-auto align-self-start">
                Manage Public Profile
              </router-link>
            </div>
          </div>
        </div>

        <!-- View Public Page Card -->
        <div v-if="user && user.slug" class="col-md-6 col-lg-4 animate-fade-in-up"
             style="animation-delay: 0.4s;">
          <div class="card h-100 glass-card interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title"><i class="bi bi-box-arrow-up-right me-2"></i>View My Public
                Page</h5>
              <p class="card-text small text-muted">See how your portfolio looks to visitors and
                share the link.</p>
              <router-link :to="{ name: 'portfolio-home', params: { slug: user.slug } }"
                           class="btn btn-outline-primary mt-auto align-self-start" target="_blank">
                View My Page
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {authService} from '@/services/authService.js';

const user = computed(() => authService.user.value);
</script>

<style scoped>
.user-account-page .display-4 {
  font-weight: 300;
}

.card-title i {
  vertical-align: -0.125em;
  opacity: 0.8;
}
</style>
