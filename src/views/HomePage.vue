<template>
  <div class="home-page">
    <LoadingSpinner v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger">
        Could not load profile data. Please try again later.
      </div>
    </div>

    <!-- Profile Display State -->
    <div v-else-if="profile" class="hero-section">
      <div class="container py-5">
        <div class="row align-items-center">
          <div class="col-md-4 text-center mb-4 mb-md-0">
            <a :href="profile.resumeUrl || '#'" target="_blank" class="profile-image-link animate-fade-in">
              <img v-if="profile.resumeImageUrl" :src="profile.resumeImageUrl"
                   alt="Resume Preview"
                   class="profile-image img-fluid rounded-circle shadow-lg" />
              <div v-else
                   class="profile-image-placeholder rounded-circle shadow-lg d-flex align-items-center justify-content-center">
                <i class="bi bi-file-earmark-text-fill"></i>
              </div>
            </a>
          </div>
          <div class="col-md-8">
            <h1 class="display-4 fw-light animate-fade-in-up text-gradient" style="animation-delay: 0.2s;">{{ fullName }}</h1>
            <p class="lead text-primary animate-fade-in-up" style="animation-delay: 0.4s;">{{ profile.headline }}</p>
            <p class="summary-text animate-fade-in-up" style="animation-delay: 0.6s;">{{ profile.summary }}</p>
            <div class="d-flex flex-wrap align-items-center mt-4 animate-fade-in-up" style="animation-delay: 0.8s;">
              <a v-if="profile.resumeUrl" :href="profile.resumeUrl" class="btn btn-primary me-3 mb-2" target="_blank">
                <i class="bi bi-file-earmark-arrow-down-fill me-2"></i>View Resume
              </a>
              <button v-if="profile.coverLetterTemplate" class="btn btn-outline-secondary me-3 mb-2" @click="showCoverLetterModal = true">
                <i class="bi bi-envelope-paper-fill me-2"></i>View Cover Letter
              </button>
              <div class="social-links">
                <a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" class="social-icon" target="_blank" title="LinkedIn"><i class="bi bi-linkedin"></i></a>
                <a v-if="profile.githubUrl" :href="profile.githubUrl" class="social-icon" target="_blank" title="GitHub"><i class="bi bi-github"></i></a>
                <a v-if="profile.websiteUrl" :href="profile.websiteUrl" class="social-icon" target="_blank" title="Personal Website"><i class="bi bi-globe"></i></a>
                <a v-if="profile.publicEmail" :href="`mailto:${profile.publicEmail}`" class="social-icon" title="Email Me"><i class="bi bi-envelope-fill"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Missing / Empty -->
    <div v-else class="container py-5 text-center">
      <div class="py-5">
        <i class="bi bi-person-workspace display-1 text-muted mb-3"></i>
        <h1 class="display-4">Portfolio Coming Soon!</h1>
        <p class="lead text-muted">The owner is currently setting things up. Please check back later.</p>
        <div v-if="isAdmin" class="alert alert-info mt-4 col-md-8 mx-auto">
          <p class="mb-1"><strong>Admin Tip:</strong> Your public profile is live but appears empty.</p>
          <p class="mb-0"><router-link to="/admin/portfolio-profile">Go to the Profile Editor</router-link> to add your headline, summary, and more.</p>
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
    <div v-if="showCoverLetterModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { getPublicProfile, ApiError } from '@/services/api';
import { authService } from '@/services/authService';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const profile = ref(null);
const isLoading = ref(true);
const error = ref(null);
const showCoverLetterModal = ref(false);

const fullName = computed(() => {
  if (!profile.value) return '';
  return `${profile.value.firstName || ''} ${profile.value.lastName || ''}`.trim();
});

const isAdmin = computed(() => authService.isAuthenticated.value && authService.user.value?.roles?.includes('ADMIN'));

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
  background: linear-gradient(125deg, var(--bs-body-bg), var(--bs-tertiary-bg), var(--bs-body-bg));
  background-size: 200% 200%;
  animation: animated-gradient 15s ease infinite;
  padding: 2rem 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
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
}

.summary-text {
  font-size: 1.1rem;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--bs-secondary-color);
}

.social-links a {
  font-size: 2.2rem;
  color: var(--bs-secondary-color);
  margin-right: 20px;
  transition: all 0.3s ease;
}
.social-links a:hover {
  color: var(--bs-primary);
  transform: translateY(-3px);
}

.btn {
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.3);
}

.cover-letter-text {
  white-space: pre-wrap;
  font-family: var(--bs-font-sans-serif);
  font-size: 1rem;
  line-height: 1.6;
}
</style>
