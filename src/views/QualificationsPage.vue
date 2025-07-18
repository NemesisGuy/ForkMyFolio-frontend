<template>
  <div class="qualifications-page py-5">
    <div class="container">
      <!-- KEY CHANGE: Centered and animated hero section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up">🎓 Qualifications & Certifications</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          My academic achievements and professional certifications.
        </p>
      </div>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger shadow-sm">
        Could not load qualifications data. Please try again later.
      </div>

      <!-- KEY CHANGE: Using a responsive grid layout instead of a single column -->
      <div v-else-if="qualifications.length > 0" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="(qual, index) in qualifications" :key="qual.uuid"
             class="col">
          <!-- KEY CHANGE: Using new glass-card style -->
          <div class="card glass-card h-100 shadow-sm animate-fade-in-up" :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }">
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
import {getPublicQualifications, ApiError} from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
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

@keyframes animated-gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
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
</style>
