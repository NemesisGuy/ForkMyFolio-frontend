<template>
  <div class="profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <!-- UPDATED: Use the new full-screen loading modal for consistency -->
          <LoadingModal :visible="authService.isLoading.value" />

          <!-- This content will be hidden by the loading modal when isLoading is true -->
          <div v-if="!authService.isLoading.value">
            <!-- Read the user profile directly from authService -->
            <div v-if="authService.user.value" class="card profile-card shadow-sm p-4">
              <h5 class="card-title mb-4">User Profile</h5>
              <div class="mb-3">
                <strong>Name:</strong> {{ authService.user.value.firstName }} {{ authService.user.value.lastName }}
              </div>
              <div class="mb-3">
                <strong>Email:</strong> {{ authService.user.value.email }}
              </div>
              <div class="mb-3">
                <strong>Roles:</strong>
                <span v-for="role in authService.user.value.roles" :key="role" class="badge bg-info text-dark me-1">
                  {{ role }}
                </span>
              </div>
              <!-- UPDATED: Changed button to a router-link to navigate to the edit page -->
              <router-link to="/profile/edit" class="btn btn-outline-primary mt-3 align-self-start">
                Edit Profile
              </router-link>
            </div>

            <div v-else class="text-center py-5">
              <h2 class="display-6 text-muted">Not Logged In</h2>
              <p class="lead">Please <router-link to="/login">login</router-link> to view your profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/ProfilePage.vue
 * @description Page to display the authenticated user's profile information.
 * Data is read directly from the global authService state.
 */
import { authService } from '@/services/authService';
import LoadingModal from '@/components/common/LoadingModal.vue'; // <-- UPDATED IMPORT

</script>

<style scoped>
.profile-page { }
/* The .loading-spinner-container class is no longer needed here */
</style>
