<template>
  <div class="home-page py-5 animated-gradient-background">
    <LoadingModal :visible="isLoading"/>

    <!-- Skeleton Loader: Shown ONLY during the initial load -->
    <div v-if="isLoading" class="container">
      <div class="card glass-card shimmering p-4 p-md-5 animate-fade-in-up">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-4 text-center mb-4 mb-md-0">
              <div class="skeleton-image rounded-circle shadow-lg mx-auto"></div>
            </div>
            <div class="col-md-8">
              <div class="skeleton-line skeleton-main-title"></div>
              <div class="skeleton-line skeleton-subtitle mb-4"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text-short mb-4"></div>
              <div class="d-flex flex-wrap align-items-center mb-3">
                <div class="skeleton-button me-3 mb-2"></div>
                <div class="skeleton-button mb-2"></div>
              </div>
              <div class="d-flex flex-wrap">
                <div class="skeleton-social-icon"></div>
                <div class="skeleton-social-icon"></div>
                <div class="skeleton-social-icon"></div>
                <div class="skeleton-social-icon"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State: Shown if loading fails -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">
        Could not load profile data. Please try again later.
      </div>
    </div>

    <!-- Profile Display State: Shown if profile data is successfully loaded -->
    <div v-else-if="profile" class="hero-section">
      <div class="container">
        <div class="card glass-card shimmering p-4 p-md-5 animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
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
                <p class="lead text-primary">{{ profile.headline }}</p>
                <p class="summary-text">{{ profile.summary }}</p>

                <div class="mt-4">
                  <div class="d-flex flex-wrap align-items-center mb-3">
                    <a v-if="profile.resumeUrl"
                       :href="profile.resumeUrl"
                       class="btn btn-primary me-3 mb-2 interactive-lift interactive-shadow-primary"
                       target="_blank">
                      <i class="bi bi-file-earmark-arrow-down-fill me-2"></i>View Resume
                    </a>
                    <button v-if="profile.coverLetterTemplate"
                            class="btn btn-secondary me-3 mb-2 interactive-lift"
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

    <!-- Profile Missing / Empty State: Shown if loading is done but no profile was found -->
    <div v-else class="container py-5 text-center">
      <div class="py-5">
        <i class="bi bi-person-workspace display-1 text-muted mb-3"></i>
        <h1 class="display-4">Portfolio Coming Soon!</h1>
        <p class="lead text-muted">The owner is currently setting things up. Please check back later.</p>
        <div v-if="isAdmin" class="alert alert-info mt-4 col-md-8 mx-auto">
          <p class="mb-1"><strong>Admin Tip:</strong> Your public profile is live but appears empty.</p>
          <p class="mb-0">
            <router-link to="/admin/portfolio-profile">Go to the Profile Editor</router-link>
            to add your headline, summary, and more.
          </p>
        </div>
      </div>
    </div>

    <!-- Cover Letter Modal with Glassmorphic styling -->
    <div v-if="showCoverLetterModal" class="modal fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content glass-card">
          <div class="modal-header">
            <h5 class="modal-title">Cover Letter Template</h5>
            <button
              type="button"
              :class="['btn-close', { 'btn-close-white': currentTheme === 'dark' }]"
              aria-label="Close"
              @click="showCoverLetterModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <pre class="cover-letter-text">{{ profile.coverLetterTemplate }}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="showCoverLetterModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- The backdrop for the modal -->
    <div v-if="showCoverLetterModal" class="modal-backdrop fade show"></div>

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
import LoadingModal from '@/components/common/LoadingModal.vue';
import { useTheme } from '@/services/themeService.js';

const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showCoverLetterModal = ref(false);
const isDownloadingPdf = ref(false);
const pdfDownloadError = ref(null);

const { currentTheme } = useTheme();

const fullName = computed(() => {
  if (!profile.value) return '';
  return `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
});

const isAdmin = computed(() => authService.isAuthenticated.value && authService.user.value?.roles?.includes('ADMIN'));

const handleDownloadPdf = async () => {
  isDownloadingPdf.value = true;
  pdfDownloadError.value = null;
  try {
    const pdfBlob = await downloadPortfolioAsPdf();
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
    const fetchedProfile = await getPublicProfile();
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

.card-body {
  position: relative;
  z-index: 1;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
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
  border: 5px solid var(--bs-body-bg);
}

.profile-image-placeholder .bi {
  font-size: 6rem;
  color: #adb5bd;
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
  color: var(--bs-secondary-color);
}

.social-links {
  gap: 20px;
}

.social-links a {
  margin-right: 0;
  font-size: 2.2rem;
  color: var(--bs-secondary-color);
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

/* Cover Letter Modal Styling */
.modal-content.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-content.glass-card .modal-header {
  background-color: rgba(var(--bs-body-color-rgb), 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--bs-emphasis-color);
}

.modal-content.glass-card .modal-body {
  color: var(--bs-body-color);
}

.modal-content.glass-card .modal-footer {
  background-color: rgba(var(--bs-body-color-rgb), 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/*
  THIS IS THE FIX: Lifts the modal's content above the shimmering
  pseudo-element, making all buttons inside clickable.
*/
.modal-content.glass-card .modal-header,
.modal-content.glass-card .modal-body,
.modal-content.glass-card .modal-footer {
  position: relative;
  z-index: 1;
}


/* --- Skeleton Placeholder Styles --- */
.skeleton-image {
  width: 250px;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.1);
}

.skeleton-line {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-main-title {
  width: 70%;
  height: 48px;
}

.skeleton-subtitle {
  width: 50%;
  height: 28px;
}

.skeleton-text {
  width: 100%;
  height: 18px;
}

.skeleton-text-short {
  width: 80%;
  height: 18px;
}

.skeleton-button {
  width: 180px;
  height: 48px;
  border-radius: var(--bs-btn-border-radius);
  background-color: rgba(255, 255, 255, 0.1);
}

.skeleton-social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 20px;
}
</style>
