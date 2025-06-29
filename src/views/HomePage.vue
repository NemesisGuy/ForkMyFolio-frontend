<template>
  <div class="home-page">
    <LoadingSpinner v-if="isLoading"/>

    <!-- State 1: A real error occurred (e.g., server is down) -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">
        Could not load profile data. Please try again later.
      </div>
    </div>

    <!-- State 2: Profile was found AND is complete, so it's displayed -->
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
          <h1 class="display-4 fw-light">{{ fullName }}</h1>
          <p class="lead text-primary">{{ profile.headline }}</p>
          <p class="summary-text">{{ profile.summary }}</p>
          <div class="d-flex flex-wrap align-items-center mt-4">
            <a v-if="profile.resumeUrl" :href="profile.resumeUrl" class="btn btn-primary me-3 mb-2"
               target="_blank">
              <i class="bi bi-file-earmark-arrow-down-fill me-2"></i>View Resume
            </a>
            <button v-if="profile.coverLetterTemplate" class="btn btn-outline-secondary me-3 mb-2"
                    @click="showCoverLetterModal = true">
              <i class="bi bi-envelope-paper-fill me-2"></i>View Cover Letter
            </button>
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

    <!-- State 3: Profile not found OR is empty, show a friendly message -->
    <div v-else class="container py-5 text-center">
      <div class="py-5">
        <i class="bi bi-person-workspace display-1 text-muted mb-3"></i>
        <h1 class="display-4">Portfolio Coming Soon!</h1>
        <p class="lead text-muted">The owner is currently setting things up. Please check back
          later.</p>

        <!-- ENHANCEMENT: Helpful message for the logged-in admin -->
        <div v-if="isAdmin" class="alert alert-info mt-4 col-md-8 mx-auto">
          <p class="mb-1"><strong>Admin Tip:</strong> Your public profile is live but appears empty.</p>
          <p class="mb-0">
            <!-- KEY CHANGE: Link updated to the new, correct admin route -->
            <router-link to="/admin/portfolio-profile">Go to the Profile Editor</router-link>
            to add your headline, summary, and more.
          </p>
        </div>
      </div>
    </div>

    <!-- Cover Letter Modal -->
    <div v-if="showCoverLetterModal" class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cover Letter Template</h5>
            <button type="button" class="btn-close" @click="showCoverLetterModal = false"></button>
          </div>
          <div class="modal-body">
            <pre class="cover-letter-text">{{ profile.coverLetterTemplate }}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCoverLetterModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div v-if="showCoverLetterModal" class="modal-backdrop fade show"></div>

  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue';
import {ApiError, getPublicProfile} from '@/services/api';
import {authService} from '@/services/authService'; // Import authService
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showCoverLetterModal = ref(false);

const fullName = computed(() => {
  if (!profile.value) return '';
  return `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
});

// ENHANCEMENT: Computed property to check if the current user is an admin
const isAdmin = computed(() => authService.isAuthenticated.value && authService.user.value?.roles?.includes('ADMIN'));

onMounted(async () => {
  try {
    const fetchedProfile = await getPublicProfile();

    if (fetchedProfile && (fetchedProfile.headline || fetchedProfile.summary)) {
      profile.value = fetchedProfile;
    } else {
      profile.value = null;
      console.log("Profile found but is empty. Displaying 'Coming Soon' page.");
    }

  } catch (err) {
    if (err instanceof ApiError && err.httpStatus === 404) {
      console.log("Public profile not yet created by the owner. Displaying 'Coming Soon' page.");
      profile.value = null;
      error.value = null;
    } else {
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
  white-space: pre-wrap;
}

.social-links a {
  font-size: 2rem;
  color: #6c757d;
  margin-right: 15px;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--bs-primary);
}

.cover-letter-text {
  white-space: pre-wrap;
  font-family: var(--bs-font-sans-serif);
  font-size: 1rem;
  line-height: 1.6;
}
</style>
