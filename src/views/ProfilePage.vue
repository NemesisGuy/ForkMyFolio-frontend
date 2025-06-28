<template>
  <div class="profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <LoadingModal :visible="authService.isLoading.value"/>

          <div v-if="!authService.isLoading.value">
            <!-- This correctly reads the user profile directly from the central authService -->
            <div v-if="authService.user.value" class="card profile-card shadow-sm p-4">
              <h5 class="card-title mb-4">User Profile</h5>
              <div class="mb-3">
                <strong>Name:</strong> {{ authService.user.value.firstName }}
                {{ authService.user.value.lastName }}
              </div>
              <div class="mb-3">
                <strong>Email:</strong> {{ authService.user.value.email }}
              </div>
              <div class="mb-3">
                <strong>Roles:</strong>
                <span v-for="role in authService.user.value.roles" :key="role"
                      class="badge bg-info text-dark me-1">
                  {{ role }}
                </span>
              </div>
              <!-- This correctly links to the page for editing the public portfolio -->
              <router-link class="btn btn-outline-primary mt-3 align-self-start" to="/profile/edit">
                Edit Portfolio Profile
              </router-link>
            </div>

            <div v-else class="text-center py-5">
              <h2 class="display-6 text-muted">Not Logged In</h2>
              <p class="lead">Please
                <router-link to="/login">login</router-link>
                to view your profile.
              </p>
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
 * Data is read directly from the global authService state, which is the correct pattern.
 */
import {authService} from '@/services/authService';
import LoadingModal from '@/components/common/LoadingModal.vue';
</script>

<style scoped>
/* No style changes needed */
</style>
