<template>
  <div class="profile-page py-4 animated-gradient-background">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <LoadingModal :visible="isLoading"/>
          <ErrorModal v-if="error" :visible="true" title="Error Loading Profile" :message="error" @close="error = null" />

          <!-- This entire block is only rendered after the API call is successful -->
          <div v-if="!isLoading && user">
            <div class="card glass-card shimmering shadow-sm p-4">

              <!-- The user's profile image is displayed from the fetched data -->
              <div class="text-center mb-4">
                <img v-if="user.profileImageUrl" :src="user.profileImageUrl"
                     alt="Profile Picture" class="profile-image img-fluid rounded-circle shadow">
                <div v-else
                     class="profile-image-placeholder rounded-circle shadow d-flex align-items-center justify-content-center">
                  <i class="bi bi-person-fill"></i>
                </div>
              </div>

              <h5 class="card-title mb-4 text-center">User Profile</h5>
              <!-- The rest of the display is populated with the other user data -->
              <div class="mb-3">
                <strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}
              </div>
              <div class="mb-3">
                <strong>Email:</strong> {{ user.email }}
              </div>
              <div class="mb-3">
                <strong>Roles:</strong>
                <span v-for="role in user.roles" :key="role"
                      class="badge bg-info text-dark me-1">
                  {{ role }}
                </span>
              </div>

              <div class="d-flex flex-wrap justify-content-center justify-content-sm-start mt-3">
                <router-link class="btn btn-primary me-2 mb-2 interactive-lift interactive-shadow-primary" to="/admin/account">
                  <i class="bi bi-person-gear me-1"></i> Edit Account
                </router-link>
                <router-link class="btn btn-outline-secondary mb-2 interactive-lift" to="/admin/portfolio-profile">
                  <i class="bi bi-layout-text-sidebar-reverse me-1"></i> Edit Public Profile
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * @file src/views/PortfolioProfilePage.vue
 * @description Page to display the authenticated user's profile information.
 * This component now actively fetches its own data on mount to ensure it's always current.
 */
import { ref, onMounted } from 'vue';
// 1. Import the function to get account data from the API.
import { getAccount } from '@/services/api/index.js';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';

// 2. Create local state to hold the fetched user data.
const user = ref(null);
const isLoading = ref(true);
const error = ref(null);

// 3. Use the onMounted hook to fetch data as soon as the page is ready.
onMounted(async () => {
  try {
    isLoading.value = true;
    // 4. Actively call the API to get the latest user account details.
    user.value = await getAccount();
  } catch (err) {
    console.error("Failed to fetch profile page data:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your profile.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid #fff;
}

.profile-image-placeholder {
  width: 150px;
  height: 150px;
  background-color: #e9ecef;
  border: 3px solid #fff;
}

.profile-image-placeholder .bi {
  font-size: 4rem;
  color: #adb5bd;
}

/* REMOVED: .profile-card styling. Handled by global utility classes. */
</style>
