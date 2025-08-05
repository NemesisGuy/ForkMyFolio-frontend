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

      <LoadingModal :visible="isLoading"/>

      <!-- Skeleton loader -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="n in 4"
             :key="n"
             :style="{ 'animation-delay': (n * 0.05) + 's' }"
             class="col animate-fade-in-up">
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

      <!-- Error state -->
      <div v-else-if="error" class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Qualifications</h5>
          <p class="card-text text-light opacity-75">
            Could not load qualifications data. Please try again later.
          </p>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="qualifications.length > 0" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="(qual, index) in qualifications" :key="qual.uuid"
             :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }"
             class="col animate-fade-in-up">
          <div
            :aria-label="`View details for ${qual.qualificationName}`"
            class="card glass-card glass-card-floating h-100 interactive-card-lift interactive-card-shadow-primary position-relative" role="button" tabindex="0"
            @click="selectQualification(qual)">
            <div class="card-body d-flex align-items-center p-4 position-relative">
              <div class="qual-icon me-4">
                <img v-if="qual.institutionLogoUrl" :alt="`${qual.institutionName} Logo`"
                     :src="qual.institutionLogoUrl" class="institution-logo">
                <i v-else class="bi bi-building"></i>
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-2 glass-title">
                  {{ qual.qualificationName }}
                </h5>
                <h6 class="card-subtitle mb-2 glass-subtitle">
                  <i class="bi bi-geo-alt-fill me-1"></i>{{ qual.institutionName }}
                </h6>
                <p v-if="qual.fieldOfStudy" class="card-text mt-2 mb-0 small glass-text">
                  <i class="bi bi-book-half me-1 text-info"></i>
                  {{ qual.fieldOfStudy }}
                </p>
              </div>
              <div class="year-badge ms-3">
                <span v-if="qual.stillStudying">{{ qual.startYear }} - Present</span>
                <span v-else>{{ qual.completionYear || qual.startYear }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="glass-card mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-patch-check-fill"></i>
          </div>
          <h4 class="card-title glass-title mb-3">Qualifications Coming Soon</h4>
          <p class="card-text glass-subtitle mb-4">
            The owner is currently updating their degrees and certifications.
          </p>
        </div>
      </div>
    </div>

    <!-- Detail modal -->
    <div v-if="selectedQualification"
         class="modal fade show d-block"
         style="background: rgba(0,0,0,0.5);"
         @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content glass-modal border-0">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title text-white">
              {{ selectedQualification.qualificationName }}
            </h5>
            <button class="btn-close btn-close-white"
                    type="button"
                    @click="closeModal">
            </button>
          </div>
          <div class="modal-body">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h6 class="text-light opacity-75 mb-1">
                  {{ selectedQualification.institutionName }}
                </h6>
                <p v-if="selectedQualification.fieldOfStudy" class="text-info mb-3">
                  {{ selectedQualification.fieldOfStudy }}
                </p>
                <p v-if="selectedQualification.grade"
                   class="text-light mb-2">
                  <strong>Grade:</strong> {{ selectedQualification.grade }}
                </p>
                <p v-if="selectedQualification.level" class="text-light mb-2">
                  <strong>Level:</strong> {{
                    selectedQualification.level.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                  }}
                </p>
              </div>
              <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <div class="year-badge-large mb-3">
                  <span
                    v-if="selectedQualification.stillStudying">{{ selectedQualification.startYear }} - Present</span>
                  <span v-else>{{
                      selectedQualification.startYear
                    }} - {{ selectedQualification.completionYear }}</span>
                </div>
              </div>
            </div>
            <!-- CORRECTED: This block was broken -->
            <div
              class="mt-3 pt-3 border-top border-white border-opacity-10 d-flex justify-content-end gap-2 flex-wrap">
              <a v-if="selectedQualification.institutionWebsite"
                 :href="selectedQualification.institutionWebsite"
                 class="btn btn-outline-secondary" rel="noopener noreferrer"
                 target="_blank">
                <i class="bi bi-globe me-2"></i> Institution Website
              </a>
              <a v-if="selectedQualification.credentialUrl"
                 :href="selectedQualification.credentialUrl"
                 class="btn btn-primary" rel="noopener noreferrer"
                 target="_blank">
                <i class="bi bi-patch-check-fill me-2"></i> View Credential
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const {portfolio, isLoading, error} = usePublicPortfolioStore();

const qualifications = computed(() => {
  const quals = portfolio.value?.qualifications || [];
  // CORRECTED: More robust sorting
  return [...quals].sort((a, b) => {
    const yearA = a.stillStudying ? Infinity : a.completionYear || a.startYear || 0;
    const yearB = b.stillStudying ? Infinity : b.completionYear || b.startYear || 0;
    return yearB - yearA;
  });
});

const selectedQualification = ref(null);

const selectQualification = (qual) => {
  selectedQualification.value = qual;
};

const closeModal = () => {
  selectedQualification.value = null;
};
</script>

<style scoped>
/* --- Page Styling --- */
.qualifications-page {
  overflow-x: hidden;
}

.card[role="button"] {
  cursor: pointer;
}

.qual-icon {
  font-size: 2.5rem;
  color: var(--bs-primary);
  opacity: 0.8;
  width: 40px; /* Ensure consistent width for icon/logo container */
  text-align: center;
}

/* ADDED: Styles for the institution logo */
.institution-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
}

.year-badge {
  font-weight: 700;
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  padding: 0.5rem 1rem;
  border-radius: 50rem;
}

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

.modal.show {
  backdrop-filter: blur(10px);
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  opacity: 0.6;
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-year-badge {
  width: 60px;
  height: 30px;
  border-radius: 50rem;
}

.skeleton-grade {
  width: 40%;
  height: 14px;
  margin-top: 0.5rem;
}
</style>
