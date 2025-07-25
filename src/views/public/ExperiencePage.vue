<template>
  <div class="experience-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Centered and animated hero section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">💼 Work Experience</h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          A timeline of my professional journey and accomplishments.
        </p>
      </div>

      <!-- The glassmorphic modal will overlay everything while loading -->
      <LoadingModal :visible="isLoading" class="glass-modal"/>

      <!-- A skeleton loader that mimics the new timeline style -->
      <div v-if="isLoading" class="timeline">
        <div v-for="n in 3" :key="n" class="timeline-item">
          <div class="timeline-content card glass-card glass-card-floating h-100">
            <div class="card-body">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-grade" style="width: 50%; margin-top: 1rem; margin-bottom: 1rem;"></div>
              <div class="skeleton-line skeleton-subtitle" style="width: 90%;"></div>
              <div class="skeleton-line skeleton-subtitle" style="width: 75%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state with glassmorphic styling -->
      <div v-else-if="error" class="glass-card glass-card-dark">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Experience</h5>
          <p class="card-text text-light opacity-75">
            Could not load work experience data. Please try again later.
          </p>
          <button @click="retryLoad" class="btn btn-outline-light glass-btn mt-3">
            <i class="bi bi-arrow-clockwise me-2"></i>Retry
          </button>
        </div>
      </div>

      <div v-else-if="experiences.length > 0" class="timeline">
        <div v-for="(exp, index) in experiences" :key="exp.id"
             class="timeline-item animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.15) + 0.2 + 's' }">
          <!-- The real timeline card with new glass styles -->
          <div class="timeline-content card glass-card glass-card-floating h-100 interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body">
              <h5 class="card-title glass-title">{{ exp.jobTitle }}</h5>
              <h6 class="card-subtitle mb-2 glass-subtitle">{{ exp.companyName }}</h6>
              <p class="card-text glass-text-secondary small mb-3">
                <i class="bi bi-calendar-event me-1"></i>
                {{ formatDate(exp.startDate) }} -
                {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}
                <br>
                <i class="bi bi-geo-alt-fill me-1"></i>
                {{ exp.location }}
              </p>
              <p class="card-text glass-description experience-description">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced empty state with glassmorphic styling -->
      <div v-else class="glass-card">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-briefcase"></i>
          </div>
          <h4 class="card-title glass-title mb-3">No Work Experience Yet</h4>
          <p class="card-text glass-subtitle mb-4">
            Work history has not been added yet. Please check back later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getPublicExperience, ApiError} from '@/services/api/index.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const experiences = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {year: 'numeric', month: 'long'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const loadExperience = async () => {
  try {
    const data = await getPublicExperience() || [];
    // Sort by end date descending (most recent first)
    experiences.value = data.sort((a, b) => new Date(b.endDate || new Date()) - new Date(a.endDate || new Date()));
  } catch (err) {
    console.error("Failed to fetch experience data:", err);
    if (!(err instanceof ApiError && err.httpStatus === 404)) {
      error.value = err;
    }
  } finally {
    isLoading.value = false;
  }
};

const retryLoad = async () => {
  isLoading.value = true;
  error.value = null;
  await loadExperience();
};

onMounted(() => {
  loadExperience();
});
</script>

<style scoped>
/* --- Page Styling --- */
.experience-page {
  overflow-x: hidden;
}

.experience-description {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* --- Animations --- */
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* --- Timeline Styling --- */
.timeline {
  position: relative;
  padding: 20px 0;
  max-width: 900px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background-image: linear-gradient(to bottom, transparent, var(--glass-border-hover), transparent);
  transform: translateX(-50%);
  border-radius: 3px;
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 10px 40px;
  margin-bottom: 20px;
}

.timeline-item:nth-child(odd) {
  left: 0;
}

.timeline-item:nth-child(even) {
  left: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -12.5px;
  background-color: var(--glass-bg);
  border: 4px solid var(--bs-primary);
  top: 15px;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 15px rgba(var(--bs-primary-rgb), 0.5);
  transition: all 0.3s ease;
}

.timeline-item:hover::after {
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(var(--bs-primary-rgb), 0.7);
}

.timeline-item:nth-child(even)::after {
  left: -12.5px;
}

.timeline-content {
  position: relative;
}

/* The little arrow pointing from the card to the timeline */
.timeline-item::before {
  content: '';
  position: absolute;
  top: 28px;
  width: 15px;
  height: 15px;
  background: var(--glass-bg); /* Use the glass background for consistency */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateY(-50%) rotate(45deg);
  z-index: 0;
}

.timeline-item:nth-child(odd)::before {
  right: 32.5px;
  border-top: 1px solid var(--glass-border);
  border-right: 1px solid var(--glass-border);
  border-left: none;
  border-bottom: none;
}

.timeline-item:nth-child(even)::before {
  left: 32.5px;
  border-left: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
  border-top: none;
  border-right: none;
}

/* --- Responsive Adjustments --- */
@media (max-width: 767.98px) {
  .timeline::before {
    left: 15px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }

  .timeline-item:nth-child(odd),
  .timeline-item:nth-child(even) {
    left: 0;
  }

  .timeline-item::after {
    left: 2.5px;
  }

  .timeline-item::before {
    left: 62.5px;
    right: auto;
    border-left: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
    border-top: none;
    border-right: none;
  }
}
</style>
