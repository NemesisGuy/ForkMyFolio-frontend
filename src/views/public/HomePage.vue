<template>
  <div class="home-page py-5 animated-gradient-background">
    <LoadingModal :visible="isLoading" class="glass-modal"/>

    <!-- Skeleton Loader: Updated with new glass styles -->
    <div v-if="isLoading" class="container">
      <!-- THIS IS THE FIX: The entrance animation is now on a dedicated wrapper div. -->
      <div class="animate-fade-in-up">
        <div class="card glass-card glass-card-floating p-4 p-md-5">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-4 text-center mb-4 mb-md-0">
                <div class="skeleton-line rounded-circle shadow-lg mx-auto" style="width: 250px; height: 250px;"></div>
              </div>
              <div class="col-md-8">
                <div class="skeleton-line skeleton-title" style="width: 70%; height: 48px;"></div>
                <div class="skeleton-line skeleton-subtitle" style="width: 50%; height: 28px;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 100%;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 90%;"></div>
                <div class="skeleton-line skeleton-grade" style="width: 80%; margin-bottom: 2rem;"></div>
                <div class="d-flex flex-wrap align-items-center mb-3">
                  <div class="skeleton-line me-3 mb-2" style="width: 180px; height: 48px; border-radius: 0.75rem;"></div>
                  <div class="skeleton-line mb-2" style="width: 180px; height: 48px; border-radius: 0.75rem;"></div>
                </div>
                <div class="d-flex flex-wrap">
                  <div class="skeleton-icon me-3"></div>
                  <div class="skeleton-icon me-3"></div>
                  <div class="skeleton-icon me-3"></div>
                  <div class="skeleton-icon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State: Updated with new glass styles -->
    <div v-else-if="error" class="container py-5">
      <div class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Profile</h5>
          <p class="card-text text-light opacity-75">
            Could not load profile data. Please try again later.
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Display State: Updated with new glass styles -->
    <div v-else-if="profile" class="hero-section">
      <div class="container">
        <!-- THIS IS THE FIX: The entrance animation is moved to this new wrapper div. -->
        <div class="animate-fade-in-up">
          <div class="card glass-card glass-card-floating p-4 p-md-5 interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                  <a :href="profile.resumeUrl || '#'" target="_blank" class="profile-image-link">
                    <img v-if="profile.resumeImageUrl" :src="profile.resumeImageUrl"
                         alt="Resume Preview"
                         class="profile-image img-fluid rounded-circle shadow-lg"/>
                    <div v-else
                         class="profile-image-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center">
                      <i class="bi bi-file-earmark-text-fill"></i>
                    </div>
                  </a>
                </div>
                <div class="col-md-8">
                  <h1 class="display-4 fw-light text-gradient">{{ fullName }}</h1>
                  <p class="lead text-primary glass-subtitle">{{ profile.headline }}</p>
                  <p class="summary-text glass-description">{{ profile.summary }}</p>

                  <div class="mt-4">
                    <div class="d-flex flex-wrap align-items-center mb-3">
                      <a v-if="profile.resumeUrl"
                         :href="profile.resumeUrl"
                         class="btn glass-btn-primary me-3 mb-2 interactive-lift"
                         target="_blank">
                        <i class="bi bi-file-earmark-arrow-down-fill me-2"></i>View Resume
                      </a>
                      <!-- THIS IS THE FIX: Changed class from glass-btn to glass-btn-primary -->
                      <button v-if="profile.coverLetterTemplate"
                              class="btn glass-btn-primary me-3 mb-2 interactive-lift"
                              @click="showCoverLetterModal = true">
                        <i class="bi bi-envelope-paper-fill me-2"></i>View Cover Letter
                      </button>
                    </div>
                    <div class="social-links d-flex flex-wrap">
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

    <!-- Profile Missing / Empty State: Updated with new glass styles -->
    <div v-else class="container py-5">
      <div class="glass-card mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-person-workspace"></i>
          </div>
          <h4 class="card-title glass-title mb-3">Portfolio Coming Soon!</h4>
          <p class="card-text glass-subtitle mb-4">
            The owner is currently setting things up. Please check back later.
          </p>
          <div v-if="isAdmin" class="alert alert-info mt-4">
            <p class="mb-1"><strong>Admin Tip:</strong> Your public profile is live but appears empty.</p>
            <p class="mb-0">
              <router-link to="/admin/portfolio-profile">Go to the Profile Editor</router-link>
              to add your headline, summary, and more.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cover Letter Modal with enhanced glassmorphic styling -->
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
    <!-- The backdrop for the modal -->
    <div v-if="showCoverLetterModal" class="modal-backdrop fade show" style="backdrop-filter: blur(5px);"></div>

    <!-- PDF Download Error Alert -->
    <div v-if="pdfDownloadError" class="pdf-error-toast alert alert-danger show" role="alert">
      <strong>Download Failed:</strong> {{ pdfDownloadError }}
      <button type="button" class="btn-close" @click="pdfDownloadError = null"></button>
    </div>

    <!-- Floating Action Button for PDF Download -->
    <button
      v-if="profile"
      class="btn btn-primary btn-lg rounded-circle shadow-lg pdf-download-button"
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
import {onMounted, ref, computed} from 'vue';
import {getPublicProfile, downloadPortfolioAsPdf, ApiError} from '@/services/api/index.js';
import {authService} from '@/services/authService.js';
import { settingsService } from '@/services/settingsService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showCoverLetterModal = ref(false);
const isDownloadingPdf = ref(false);
const pdfDownloadError = ref(null);

const fullName = computed(() => {
  if (!profile.value) return '';
  return `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
});

const isAdmin = computed(() => authService.isAuthenticated.value && authService.user.value?.roles?.includes('ADMIN'));

const handleDownloadPdf = async () => {
  const templateName = settingsService.settings.value['DEFAULT_PDF_TEMPLATE'];

  if (!templateName) {
    pdfDownloadError.value = 'Default PDF template is not configured by the owner.';
    setTimeout(() => { pdfDownloadError.value = null; }, 5000);
    return;
  }

  isDownloadingPdf.value = true;
  pdfDownloadError.value = null;
  try {
    const pdfBlob = await downloadPortfolioAsPdf(templateName);

    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const userName = fullName.value ? fullName.value.replace(/\s/g, '') : 'Portfolio';
    const today = new Date().toISOString().slice(0, 10);
    a.download = `${userName}-Resume-${today}.pdf`;
    document.body.appendChild(a);
    a.click();

    window.requestAnimationFrame(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  } catch (err) {
    console.error("Failed to download portfolio PDF:", err);
    pdfDownloadError.value = err.message || 'An unknown error occurred. Please try again.';
    setTimeout(() => {
      pdfDownloadError.value = null;
    }, 5000);
  } finally {
    isDownloadingPdf.value = false;
  }
};

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
.home-page {
  overflow-x: hidden;
}

.hero-section {
  width: 100%;
}

.profile-image-link {
  display: inline-block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image-link:hover {
  transform: scale(1.05);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

.profile-image, .profile-image-placeholder {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border: 5px solid var(--glass-bg);
}

.profile-image-placeholder .bi {
  font-size: 6rem;
  color: var(--glass-text-secondary);
}

.text-gradient {
  background: linear-gradient(45deg, var(--bs-primary), var(--bs-info));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  color: var(--bs-primary); /* fallback */
  padding-bottom: 0.2em;
}

.summary-text {
  font-size: 1.1rem;
  line-height: 1.7;
  white-space: pre-wrap;
}

.social-links {
  gap: 20px;
}

.social-links a {
  margin-right: 0;
  font-size: 2.2rem;
  color: var(--glass-text-secondary);
  transition: all 0.3s ease;
}

.social-links a:hover {
  color: var(--bs-primary);
  transform: translateY(-3px);
}

.pdf-download-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1030;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  transition: transform 0.2s ease-in-out;
}

.pdf-download-button:hover {
  transform: scale(1.1);
}

.pdf-error-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1051;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cover-letter-text {
  white-space: pre-wrap;
  font-family: var(--bs-font-sans-serif);
  font-size: 1rem;
  line-height: 1.6;
}

/*
  All skeleton, modal, and animation styles are now handled by global classes
  in common.css, so local styles can be removed for a cleaner component.
*/
</style>
