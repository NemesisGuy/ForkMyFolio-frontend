<template>
  <div class="profile-page container mt-4 mb-5">
    <h1 class="mb-4">My Profile</h1>

    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading profile...</span>
      </div>
      <p class="mt-2">Loading profile...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Error Loading Profile</h4>
      <p>{{ error.message || 'Could not fetch your profile information. Please try again later.' }}</p>
      <hr v-if="error.errors && error.errors.length > 0">
      <ul v-if="error.errors && error.errors.length > 0" class="mb-0">
        <li v-for="(err, index) in error.errors" :key="index">
          {{ err.field ? `${err.field}: ` : '' }}{{ err.message }}
        </li>
      </ul>
    </div>

    <div v-else-if="profile" class="card">
      <div class="card-header">
        User Details
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 text-center mb-3 mb-md-0">
            <img
              :src="profile.profileImageUrl || 'https://via.placeholder.com/150'"
              class="img-fluid rounded-circle"
              alt="Profile image"
              style="width: 150px; height: 150px; object-fit: cover;"
            >
          </div>
          <div class="col-md-9">
            <h5 class="card-title mb-3">
              {{ profile.firstName || '' }} {{ profile.lastName || '' }}
              <small class="text-muted">(@{{ profile.username || profile.email }})</small>
            </h5>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p v-if="profile.firstName"><strong>First Name:</strong> {{ profile.firstName }}</p>
            <p v-if="profile.lastName"><strong>Last Name:</strong> {{ profile.lastName }}</p>
            <p><strong>Roles:</strong> <span v-for="(role, index) in profile.roles" :key="role" class="badge bg-secondary me-1">{{ role }}</span></p>
            <p v-if="profile.createdAt"><strong>Joined:</strong> {{ formattedJoinDate }}</p>
            <!-- Add more profile fields as needed -->
            <!-- <button class="btn btn-outline-primary mt-3">Edit Profile (Placeholder)</button> -->
          </div>
        </div>
      </div>
    </div>
     <div v-else class="alert alert-info">
      No profile data available. You might need to log in again or complete your profile.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { authService } from '../services/authService'; // To check if user is initially available
import { getUserProfile } from '../services/apiService'; // Direct API call
import { ApiError } from '../services/apiService';
import { formatDate } from '../utils'; // Import formatDate utility

/**
 * @file src/views/ProfilePage.vue
 * @description Displays the authenticated user's profile information.
 */

/** @type {import('vue').Ref<object|null>} UserDto - The user's profile data. */
const profile = ref(null);
/** @type {import('vue').Ref<boolean>} */
const isLoading = ref(true);
/** @type {import('vue').Ref<ApiError|Error|null>} */
const error = ref(null);

/**
 * Fetches the user profile data from the API.
 */
const fetchProfile = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // getUserProfile from apiService returns the unwrapped UserDto
    const userProfileData = await getUserProfile();
    profile.value = userProfileData;
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    if (err instanceof ApiError) {
      error.value = err; // Store the structured ApiError
    } else {
      error.value = { message: err.message || 'An unexpected error occurred.' };
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * Computed property to format the join date.
 * @returns {string} Formatted date string or empty if no date.
 */
const formattedJoinDate = computed(() => {
  if (profile.value && profile.value.createdAt) {
    return formatDate(profile.value.createdAt, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return '';
});

// Fetch profile when component is mounted
onMounted(() => {
  // Check if user data is already available from authService (e.g. after login)
  // This provides immediate data if available, otherwise fetch.
  // The API spec says /users/me/profile is the source of truth for full UserDto.
  // authService.user.value might be a slightly different/minimal DTO post-login initially.
  // So, always fetching from /users/me/profile is more robust for this page.
  fetchProfile();
});
</script>

<style scoped>
.profile-page h1 {
  font-weight: 300;
}
.card-header {
  font-weight: 500;
}
.badge {
  text-transform: capitalize;
}
</style>
