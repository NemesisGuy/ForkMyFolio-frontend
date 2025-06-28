<template>
  <div class="home-page">
    <LoadingSpinner v-if="isLoading"/>

    <!-- State 1: A real error occurred (e.g., server is down) -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">
        Could not load profile data. Please try again later.
      </div>
    </div>

    <!-- State 2: Profile was found and is displayed -->
    <div v-else-if="profile" class="container py-5">
      <div class="row align-items-center">
        <div class="col-md-4 text-center mb-4 mb-md-0">
          <img v-if="profile.profileImageUrl" :src="profile.profileImageUrl"
               alt="Profile Picture" class="profile-image img-fluid rounded-circle shadow-lg">
          <div v-else
               class="profile-image-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>
        <div class="col-md-8">
          <h1 class="display-4 fw-light">{{ profile.firstName }} {{ profile.lastName }}</h1>
          <p class="lead text-primary">{{ profile.headline }}</p>
          <p class="summary-text">{{ profile.summary }}</p>
          <div class="d-flex flex-wrap align-items-center mt-4">
            <a v-if="profile.resumeUrl" :href="profile.resumeUrl" class="btn btn-primary me-3 mb-2"
               target="_blank">
              <i class="bi bi-file-earmark-arrow-down-fill me-2"></i>View Resume
            </a>
            <div class="social-links">
              <a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" class="social-icon"
                 target="_blank" title="LinkedIn"><i class="bi bi-linkedin"></i></a>
              <a v-if="profile.githubUrl" :href="profile.githubUrl" class="social-icon"
                 target="_blank" title="GitHub"><i class="bi bi-github"></i></a>
              <a v-if="profile.websiteUrl" :href="profile.websiteUrl" class="social-icon"
                 target="_blank" title="Personal Website"><i class="bi bi-globe"></i></a>
              <a v-if="profile.publicEmail" :href="`mailto:${profile.publicEmail}`"
                 class="social-icon" title="Email Me"><i class="bi bi-envelope-fill"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- State 3 (NEW): Profile not found, show a friendly message -->
    <div v-else class="container py-5 text-center">
      <div class="py-5">
        <i class="bi bi-person-workspace display-1 text-muted mb-3"></i>
        <h1 class="display-4">Portfolio Coming Soon!</h1>
        <p class="lead text-muted">The owner is currently setting things up. Please check back
          later.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ApiError, getPublicProfile} from '@/services/api'; // Import ApiError
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    profile.value = await getPublicProfile();
  } catch (err) {
    // Check if the error is a 404 "Not Found"
    if (err instanceof ApiError && err.httpStatus === 404) {
      // This is an expected state, not a "real" error.
      // We leave `profile` as null and clear the error state.
      console.log("Public profile not yet created by the owner. Displaying 'Coming Soon' page.");
      error.value = null;
    } else {
      // For any other error (500, network, etc.), we treat it as a real error.
      console.error("Failed to fetch profile data:", err);
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.profile-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.profile-image-placeholder {
  width: 200px;
  height: 200px;
  background-color: #e9ecef;
}

.profile-image-placeholder .bi {
  font-size: 5rem;
  color: #adb5bd;
}

.summary-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.social-links a {
  font-size: 2rem;
  color: #6c757d;
  margin-right: 15px;
  transition: color 0.2s;
}

.social-links a:hover {
  color: #0d6efd; /* Bootstrap primary color */
}
</style>
