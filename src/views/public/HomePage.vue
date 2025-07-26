<template>
  <div class="home-page py-5 animated-gradient-background">
    <LoadingModal :visible="isLoading" class="glass-modal"/>

    <!-- Skeleton Loader: Responsive glass-styled placeholder -->
    <div v-if="isLoading" class="container">
      <div class="animate-fade-in-up">
        <div class="card glass-card glass-card-floating p-2 p-md-5">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4 text-center mb-3 mb-md-0">
                <div class="skeleton-line rounded-circle shadow-lg mx-auto" style="width: 100%; max-width: 200px; aspect-ratio: 1/1;"></div>
              </div>
              <div class="col-md-8">
                <div class="skeleton-line skeleton-title" style="width: 70%; height: 36px;"></div>
                <div class="skeleton-line skeleton-subtitle" style="width: 50%; height: 24px;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 100%;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 90%;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 80%; margin-bottom: 1.5rem;"></div>
                <div class="d-flex flex-wrap align-items-center mb-3 justify-content-center">
                  <div class="skeleton-line me-2 mb-2" style="width: 140px; height: 36px; border-radius: 0.75rem;"></div>
                  <div class="skeleton-line mb-2" style="width: 140px; height: 36px; border-radius: 0.75rem;"></div>
                </div>
                <div class="d-flex flex-wrap justify-content-center">
                  <div class="skeleton-icon me-2"></div>
                  <div class="skeleton-icon me-2"></div>
                  <div class="skeleton-icon me-2"></div>
                  <div class="skeleton-icon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State: Glass-styled error display -->
    <div v-else-if="error" class="container py-4">
      <div class="glass-card glass-card-dark mx-auto" style="max-width: 90%;">
        <div class="card-body text-center p-3">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-2" style="font-size: 2rem;"></i>
          <h5 class="card-title text-white mb-2">Unable to Load Profile</h5>
          <p class="card-text text-light opacity-75">
            Could not load profile data. Please try again later.
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Display State: Responsive profile card -->
    <div v-else-if="profile" class="hero-section">
      <div class="container">
        <div class="animate-fade-in-up">
          <div class="card glass-card glass-card-floating p-2 p-md-5 interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-4 text-center mb-3 mb-md-0">
                  <a :href="profile.resumeUrl || '#'" target="_blank" class="profile-image-link shadow-lg">
                    <img v-if="profile.resumeImageUrl" :src="profile.resumeImageUrl"
                         alt="Resume Preview"
                         class="profile-image"/>
                    <div v-else
                         class="profile-image-placeholder d-flex align-items-center justify-content-center">
                      <i class="bi bi-file-earmark-text-fill"></i>
                    </div>
                  </a>
                </div>
                <div class="col-md-8">
                  <h1 class="display-4 fw-light text-gradient">{{ fullName }}</h1>
                  <p class="lead text-primary glass-subtitle">{{ profile.headline }}</p>
                  <p class="summary-text glass-description">{{ profile.summary }}</p>

                  <div class="mt-3">
                    <div class="d-flex flex-wrap align-items-center mb-3 justify-content-center">
                      <a v-if="profile.resumeUrl"
                         :href="profile.resumeUrl"
                         class="btn glass-btn-primary me-2 mb-2 interactive-lift"
                         target="_blank">
                        <i class="bi bi-file-earmark-arrow-down-fill me-1"></i>View Resume
                      </a>
                      <button v-if="profile.coverLetterTemplate"
                              class="btn glass-btn-primary me-2 mb-2 interactive-lift"
                              @click="showCoverLetterModal = true">
                        <i class="bi bi-envelope-paper-fill me-1"></i>View Cover Letter
                      </button>
                    </div>
                    <div class="social-links d-flex flex-wrap justify-content-center">
                      <a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" class="social-icon" target="_blank"
                         title="LinkedIn"><i class="bi bi-linkedin"></i></a>
                      <a v-if="profile.githubUrl" :href="profile.githubUrl" class="social-icon" target="_blank"
                         title="GitHub"><i class="bi bi-github"></i></a>
                      <a v-if="profile.websiteUrl" :href="profile.websiteUrl" class="social-icon" target="_blank"
                         title="Personal Website"><i class="bi bi-globe"></i></a>
                      <a v-if="profile.publicEmail" :href="`mailto:${profile.publicEmail}`" class="social-icon"
                         title="Email Me"><i class="bi bi-envelope-fill"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Missing / Empty State: Glass-styled placeholder -->
    <div v-else class="container py-4">
      <div class="glass-card mx-auto" style="max-width: 90%;">
        <div class="card-body text-center p-3">
          <div class="empty-state-icon mb-3">
            <i class="bi bi-person-workspace"></i>
          </div>
          <h4 class="card-title glass-title mb-2">Portfolio Coming Soon!</h4>
          <p class="card-text glass-subtitle mb-3">
            The owner is currently setting things up. Please check back later.
          </p>
          <div v-if="isAdmin" class="alert alert-info mt-3">
            <p class="mb-1"><strong>Admin Tip:</strong> Your public profile is live but appears empty.</p>
            <p class="mb-0">
              <router-link to="/admin/portfolio-profile">Go to the Profile Editor</router-link>
              to add your headline, summary, and more.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cover Letter Modal: Glassmorphic modal with responsive behavior -->
    <div v-if="showCoverLetterModal" class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content glass-modal">
          <div class="modal-header">
            <h5 class="modal-title glass-title">Cover Letter Template</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="showCoverLetterModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <pre class="cover-letter-text glass-description">{{ profile.coverLetterTemplate }}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn glass-btn" @click="showCoverLetterModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal backdrop: Clickable to close modal -->
    <div
      v-if="showCoverLetterModal"
      class="modal-backdrop fade show"
      style="backdrop-filter: blur(5px);"
      @click="showCoverLetterModal = false"
    ></div>

    <!-- Success and Error Modals: Reusable modals for feedback -->
    <SuccessModal
      :visible="showSuccessModal"
      title="Download Started"
      :message="successModalMessage"
      @close="showSuccessModal = false"
    />
    <ErrorModal
      :visible="showErrorModal"
      title="Download Failed"
      :message="errorModalMessage"
      @close="showErrorModal = false"
    />

    <!-- Floating Action Button: PDF download button -->
    <button
      v-if="profile"
      class="btn glass-btn-primary btn-lg rounded-circle shadow-lg pdf-download-button"
      title="Download Portfolio as PDF"
      :disabled="isDownloadingPdf"
      @click="handleDownloadPdf"
    >
      <span v-if="isDownloadingPdf" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <i v-else class="bi bi-download"></i>
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { getPublicProfile, ApiError } from '@/services/api/index.js';
import { authService } from '@/services/authService.js';
import { settingsService } from '@/services/settingsService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import { usePortfolioDownloader } from '@/composables/usePortfolioDownloader.js';

/**
 * Reactive state for profile data
 * @type {Ref<Object|null>}
 */
const profile = ref(null);

/**
 * Reactive state for loading status
 * @type {Ref<boolean>}
 */
const isLoading = ref(true);

/**
 * Reactive state for error handling
 * @type {Ref<Object|null>}
 */
const error = ref(null);

/**
 * Reactive state for cover letter modal visibility
 * @type {Ref<boolean>}
 */
const showCoverLetterModal = ref(false);

/**
 * Computed property for full name
 * @returns {string} Concatenated first and last name
 */
const fullName = computed(() => {
  if (!profile.value) return '';
  return `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
});

/**
 * Encapsulated PDF download logic and state from our new composable.
 */
const {
  isDownloadingPdf,
  showSuccessModal,
  successModalMessage,
  showErrorModal,
  errorModalMessage,
  handleDownloadPdf
} = usePortfolioDownloader(fullName);

/**
 * Computed property to check if user is admin
 * @returns {boolean} True if user is authenticated and has ADMIN role
 */
const isAdmin = computed(() => authService.isAuthenticated.value && authService.user.value?.roles?.includes('ADMIN'));

/**
 * Lifecycle hook to fetch profile and settings on component mount
 * @async
 */
onMounted(async () => {
  isLoading.value = true;
  try {
    const [fetchedProfile] = await Promise.all([
      getPublicProfile(),
      settingsService.fetchSettings()
    ]);

    if (fetchedProfile && (fetchedProfile.headline || fetchedProfile.summary)) {
      profile.value = fetchedProfile;
    } else {
      profile.value = null;
      console.log("Profile found but is empty. Displaying 'Coming Soon' page.");
    }
  } catch (err) {
    if (err instanceof ApiError && err.httpStatus === 404) {
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
/**
 * Styles for the home page container
 */
.home-page {
  overflow-x: hidden;
}

/**
 * Styles for the hero section
 */
.hero-section {
  width: 100%;
}

/**
 * Styles for the profile image link container
 */
.profile-image-link {
  display: inline-block;
  position: relative;
  width: 100%;
  max-width: 200px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 50%;
  border: 4px solid var(--glass-bg);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/**
 * Hover effect for profile image link
 */
.profile-image-link:hover {
  transform: scale(1.05);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

/**
 * Styles for profile image and placeholder
 */
.profile-image,
.profile-image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/**
 * Styles for profile image placeholder
 */
.profile-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

/**
 * Icon styles within profile image placeholder
 */
.profile-image-placeholder .bi {
  font-size: 4rem;
  color: var(--glass-text-secondary);
}

/**
 * Gradient text effect for headings
 */
.text-gradient {
  background: linear-gradient(45deg, var(--bs-primary), var(--bs-info));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  color: var(--bs-primary);
  padding-bottom: 0.15em;
}

/**
 * Styles for summary text
 */
.summary-text {
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

/**
 * Styles for social links container
 */
.social-links {
  gap: 15px;
}

/**
 * Styles for social link icons
 */
.social-links a {
  margin-right: 0;
  font-size: 1.8rem;
  color: var(--glass-text-secondary);
  transition: all 0.3s ease;
}

/**
 * Hover effect for social links
 */
.social-links a:hover {
  color: var(--bs-primary);
  transform: translateY(-2px);
}

/**
 * Hover effect for PDF download button
 */
.pdf-download-button:hover {
  transform: scale(1.1);
  animation-play-state: paused;
}

/**
 * Pulse animation for PDF download button
 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--bs-primary-rgb), 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--bs-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--bs-primary-rgb), 0);
  }
}

/**
 * Styles for PDF download button
 */
.pdf-download-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1030;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  animation: pulse 2.5s infinite cubic-bezier(0.66, 0, 0, 1);
}

/**
 * Styles for cover letter text in modal
 */
.cover-letter-text {
  white-space: pre-wrap;
  font-family: var(--bs-font-sans-serif);
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  line-height: 1.5;
}

/**
 * Responsive styles for small devices (e.g., iPhone SE)
 */
@media (max-width: 576px) {
  .col-md-8 {
    text-align: center;
  }

  .profile-image-link {
    width: 70%;
    max-width: 160px;
  }

  .skeleton-line.rounded-circle {
    width: 70%;
    max-width: 140px;
    aspect-ratio: 1 / 1;
  }

  h1.display-4 {
    font-size: clamp(1.2rem, 4.5vw, 1.8rem);
  }

  p.lead {
    font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  }

  .d-flex.flex-wrap {
    justify-content: center !important;
    gap: 8px;
  }

  .pdf-download-button {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .modal-dialog.modal-lg {
    margin: 0.5rem;
    max-width: 98%;
  }

  .card-body {
    padding: 1rem;
  }

  .glass-card {
    max-width: 95%;
  }

  .social-links a {
    font-size: 1.5rem;
  }

  .btn.glass-btn-primary {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
}
</style>
