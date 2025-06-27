<template>
  <div class="profile-page py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div v-if="isLoading" class="loading-spinner-container d-flex justify-content-center align-items-center py-5">
            <LoadingSpinner />
          </div>
          <div v-else-if="userProfile" class="card profile-card shadow-sm p-4">
            <h5 class="card-title mb-4">User Profile</h5>
            <div class="mb-3">
              <strong>Name:</strong> {{ userProfile.firstName }} {{ userProfile.lastName }}
            </div>
            <div class="mb-3">
              <strong>Email:</strong> {{ userProfile.email }}
            </div>
            <div class="mb-3">
              <strong>Roles:</strong>
              <span v-for="role in userProfile.roles" :key="role" class="badge bg-info text-dark me-1">
                {{ role }}
              </span>
            </div>
            <!-- Example: Displaying creation date if available from UserDto and needed -->
            <!--
            <div class="mb-3" v-if="userProfile.createdAt">
              <strong>Joined:</strong> {{ formatDate(userProfile.createdAt, { year: 'numeric', month: 'long' }) }}
            </div>
            -->
            <button class="btn btn-outline-primary mt-3 align-self-start">Edit Profile</button>
          </div>
          <div v-else-if="!isLoading && !showErrorModal" class="text-center py-5">
             <!-- This message shows if not loading, no profile, and no error modal is active -->
            <h2 class="display-6 text-muted">Profile Information Not Available</h2>
            <p class="lead">We could not load your profile details at this time.</p>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal
      v-if="error"
      :visible="showErrorModal"
      :title="error?.title || 'Error'"
      :message="error?.message || 'An unexpected error occurred.'"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/ProfilePage.vue
 * @description Page to display the authenticated user's profile information.
 * Fetches data from /api/v1/users/me/profile.
 */
import { ref, onMounted } from 'vue';
import { getUserProfile, ApiError } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import ErrorModal from '../components/common/ErrorModal.vue';
// import { formatDate } from '../utils'; // Will re-add if creation dates are displayed from UserDto

// --- Reactive State ---
/** @type {import('vue').Ref<object|null>} UserDto - The user's profile data. */
const userProfile = ref(null);
/** @type {import('vue').Ref<boolean>} - Loading state for fetching profile. */
const isLoading = ref(true);
/** @type {import('vue').Ref<{title: string, message: string|string[], details?: any[]}|null>} - Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} - Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

// --- Lifecycle Hooks & Fetch Logic ---

/**
 * Fetches the user profile from the API.
 */
const fetchUserProfile = async () => {
  isLoading.value = true;
  error.value = null;
  showErrorModal.value = false;
  try {
    const profileData = await getUserProfile();
    userProfile.value = profileData;
  } catch (err) {
    console.error("Failed to load user profile:", err);
    let errorMessage = 'Could not fetch user profile. Please try again later.';
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      // If ApiError has specific error messages, use them.
      // ErrorModal is designed to take a string or array for its message prop.
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0]; // Single error as string
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Profile Load Error',
      message: errorMessage,
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});

// --- Methods ---
/**
 * Closes the error modal.
 */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null; // Optionally clear the error state
};

</script>

<style scoped>
.profile-page {
  /* Basic page styling */
}
/* Ensure spinner is centered if not wrapped in a card yet */
.loading-spinner-container {
  min-height: 200px; /* Ensure container has height for centering */
}
</style>
