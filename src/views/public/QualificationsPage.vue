<template>
  <div class="qualifications-page py-5 animated-gradient-background">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">
          🎓 Qualifications & Certifications
        </h1>
        <p class="lead text-muted animate-fade-in-up glass-subtitle"
           style="animation-delay: 0.1s;">
          My academic achievements and professional certifications.
        </p>
      </div>

      <!-- Enhanced glassmorphic modal with premium styling -->
      <LoadingModal :visible="isLoading" class="glass-modal"/>

      <!-- Enhanced skeleton loader with glassmorphic cards -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="n in 4"
             :key="n"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (n * 0.05) + 's' }">
          <div class="card glass-card glass-card-floating h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="skeleton-icon me-4"></div>
              <div class="flex-grow-1">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
                <div class="skeleton-line skeleton-grade"></div>
              </div>
              <div class="skeleton-year-badge ms-3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state with glassmorphic styling -->
      <div v-else-if="error" class="glass-card glass-card-dark">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Qualifications</h5>
          <p class="card-text text-light opacity-75">
            Could not load qualifications data. Please try again later.
          </p>
          <button @click="retryLoad" class="btn btn-outline-light glass-btn mt-3">
            <i class="bi bi-arrow-clockwise me-2"></i>Retry
          </button>
        </div>
      </div>

      <!-- Enhanced qualification cards with premium glassmorphic effects -->
      <div v-else-if="qualifications.length > 0" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="(qual, index) in qualifications" :key="qual.uuid"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }">
          <div class="card glass-card glass-card-floating h-100 interactive-card-lift interactive-card-shadow-primary"
               @click="selectQualification(qual)">
            <div class="card-body d-flex align-items-center p-4 position-relative">
              <!-- Qualification icon with enhanced styling -->
              <div class="qual-icon me-4">
                <i class="bi bi-patch-check-fill"></i>
              </div>

              <!-- Content section -->
              <div class="flex-grow-1">
                <h5 class="card-title mb-2 glass-title">
                  {{ qual.qualificationName }}
                </h5>
                <h6 class="card-subtitle mb-2 glass-subtitle">
                  {{ qual.institutionName }}
                </h6>
                <p v-if="qual.grade" class="card-text mt-2 mb-0 small glass-text">
                  <i class="bi bi-star-fill me-1 text-warning"></i>
                  <strong>Grade:</strong> {{ qual.grade }}
                </p>
                <p v-if="qual.description" class="card-text mt-2 mb-0 small glass-description">
                  {{ qual.description }}
                </p>
              </div>

              <!-- Year badge with enhanced glassmorphic styling -->
              <div class="year-badge ms-3">
                {{ qual.completionYear }}
              </div>

              <!-- Hover indicator -->
              <div class="position-absolute top-0 end-0 p-3 glass-hover-indicator">
                <i class="bi bi-arrow-up-right text-primary opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced empty state with glassmorphic styling -->
      <div v-else class="glass-card glass-card-dark">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-patch-check-fill"></i>
          </div>
          <h4 class="card-title text-white mb-3">Qualifications Coming Soon</h4>
          <p class="card-text text-light opacity-75 mb-4">
            The owner is currently updating their degrees and certifications.
            Please check back later for the latest information.
          </p>
          <div class="d-flex justify-content-center gap-3">
            <button @click="retryLoad" class="btn btn-outline-light glass-btn">
              <i class="bi bi-arrow-clockwise me-2"></i>Refresh
            </button>
            <button class="btn btn-outline-primary glass-btn">
              <i class="bi bi-bell me-2"></i>Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced qualification detail modal -->
    <div v-if="selectedQualification"
         class="modal fade show d-block"
         tabindex="-1"
         style="background: rgba(0,0,0,0.5);"
         @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glass-modal border-0">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title text-white">
              {{ selectedQualification.qualificationName }}
            </h5>
            <button type="button"
                    class="btn-close btn-close-white"
                    @click="closeModal">
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8">
                <h6 class="text-light opacity-75 mb-3">
                  {{ selectedQualification.institutionName }}
                </h6>
                <p v-if="selectedQualification.description"
                   class="text-light mb-3">
                  {{ selectedQualification.description }}
                </p>
                <p v-if="selectedQualification.grade"
                   class="text-light mb-2">
                  <strong>Grade:</strong> {{ selectedQualification.grade }}
                </p>
              </div>
              <div class="col-md-4 text-end">
                <div class="year-badge-large">
                  {{ selectedQualification.completionYear }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublicQualifications, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const qualifications = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedQualification = ref(null);

const retryLoad = async () => {
  isLoading.value = true;
  error.value = null;
  await loadQualifications();
};

const selectQualification = (qual) => {
  selectedQualification.value = qual;
};

const closeModal = () => {
  selectedQualification.value = null;
};

const loadQualifications = async () => {
  try {
    const data = await getPublicQualifications();
    qualifications.value = data.sort((a, b) => b.completionYear - a.completionYear);
  } catch (err) {
    console.error("Failed to fetch qualifications data:", err);
    if (!(err instanceof ApiError && err.httpStatus === 404)) {
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadQualifications();
});
</script>

<style scoped>
/* ==========================================================================
   Enhanced Glassmorphic Component Styles
   ========================================================================== */

/* Typography enhancements */
.glass-text {
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.glass-title {
  color: rgba(255, 255, 255, 0.98);
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.glass-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.glass-description {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

/* Enhanced interactive elements */
.glass-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Hover indicator */
.glass-hover-indicator {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-card:hover .glass-hover-indicator {
  opacity: 1;
}

/* Empty state icon */
.empty-state-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  opacity: 0.7;
  animation: floatingGlow 4s ease-in-out infinite;
}

/* Enhanced year badge for modal */
.year-badge-large {
  font-size: 2rem;
  font-weight: 800;
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.15);
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(var(--bs-primary-rgb), 0.3);
  text-align: center;
  box-shadow: 0 8px 30px rgba(var(--bs-primary-rgb), 0.2);
}

/* Modal enhancements */
.modal.show {
  backdrop-filter: blur(20px);
}

/* Additional skeleton styles */
.skeleton-grade {
  width: 40%;
  height: 14px;
  margin-bottom: 0.25rem;
}

/* Card interaction cursor */
.glass-card[role="button"],
.glass-card[tabindex] {
  cursor: pointer;
}

/* Focus states for accessibility */
.glass-card:focus-visible {
  outline: 2px solid var(--bs-primary);
  outline-offset: 4px;
}

.glass-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Loading state refinements */
.qualifications-page .container > * {
  position: relative;
  z-index: 1;
}
</style>
