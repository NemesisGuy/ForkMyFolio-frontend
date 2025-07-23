<template>
  <div class="qualifications-page py-5 animated-gradient-background">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up">🎓 Qualifications & Certifications</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          My academic achievements and professional certifications.
        </p>
      </div>

      <!-- The glassmorphic modal will overlay everything while loading -->
      <LoadingModal :visible="isLoading"/>

      <!-- THIS IS THE FIX: A shimmering skeleton loader that mimics the qualification cards -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="n in 4"
             :key="n"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (n * 0.05) + 's' }">
          <div class="card glass-card shimmering h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="skeleton-icon me-4"></div>
              <div class="flex-grow-1">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-subtitle"></div>
              </div>
              <div class="skeleton-year-badge ms-3"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger shadow-sm">
        Could not load qualifications data. Please try again later.
      </div>

      <div v-else-if="qualifications.length > 0" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="(qual, index) in qualifications" :key="qual.uuid"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }">
          <div class="card glass-card h-100 shadow-sm shimmering interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex align-items-center p-4">
              <div class="qual-icon me-4">
                <i class="bi bi-patch-check-fill"></i>
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">{{ qual.qualificationName }}</h5>
                <h6 class="card-subtitle text-muted">{{ qual.institutionName }}</h6>
                <p v-if="qual.grade" class="card-text mt-2 mb-0 text-muted small">
                  <strong>Grade:</strong> {{ qual.grade }}
                </p>
              </div>
              <div class="year-badge ms-3">
                {{ qual.completionYear }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmptyState
        v-else
        title="Qualifications Coming Soon"
        message="The owner is currently updating their degrees and certifications. Please check back later."
        icon-class="bi-patch-check-fill"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {getPublicQualifications, ApiError} from '@/services/api/index.js';
// THIS IS THE FIX: Import LoadingModal instead of LoadingSpinner
import LoadingModal from '@/components/common/LoadingModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const qualifications = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await getPublicQualifications();
    // Sort by completion year, most recent first
    qualifications.value = data.sort((a, b) => b.completionYear - a.completionYear);
  } catch (err) {
    console.error("Failed to fetch qualifications data:", err);
    // Only show a user-facing error for critical failures, not for 404s
    if (!(err instanceof ApiError && err.httpStatus === 404)) {
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* --- Page Styling --- */
.qualifications-page {
  overflow-x: hidden;
}

/* --- Animations --- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
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

/* --- Card Content Styling --- */
.qual-icon {
  font-size: 2.5rem;
  color: var(--bs-primary);
  line-height: 1;
}

.card-title {
  font-weight: 500;
  color: var(--bs-emphasis-color);
}

.year-badge {
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--bs-primary);
  opacity: 0.7;
}

/* --- THIS IS THE FIX: Skeleton Placeholder Styles --- */
.skeleton-line, .skeleton-icon, .skeleton-year-badge {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.skeleton-icon {
  width: 40px; /* Matches the font-size of the real icon */
  height: 40px;
  border-radius: 8px;
}

.skeleton-line {
  margin-bottom: 0.5rem;
}

.skeleton-title {
  width: 80%;
  height: 20px;
}

.skeleton-subtitle {
  width: 60%;
  height: 16px;
}

.skeleton-year-badge {
  width: 50px;
  height: 28px;
}
</style>
