<template>
  <div class="experience-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Centered and animated hero section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up">💼 Work Experience</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          A timeline of my professional journey and accomplishments.
        </p>
      </div>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger shadow-sm">
        Could not load experience data. Please try again later.
      </div>

      <div v-else-if="experiences.length > 0" class="timeline">
        <div v-for="(exp, index) in experiences" :key="exp.id"
             class="timeline-item animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.15) + 0.2 + 's' }">
          <!-- The timeline card now has the consistent interactive classes -->
          <div class="timeline-content card shadow-sm glass-card shimmering interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body">
              <h5 class="card-title">{{ exp.jobTitle }}</h5>
              <h6 class="card-subtitle mb-2 text-primary">{{ exp.companyName }}</h6>
              <p class="card-text text-muted small">
                <i class="bi bi-calendar-event me-1"></i>
                {{ formatDate(exp.startDate) }} -
                {{ exp.endDate ? formatDate(exp.endDate) : 'Present' }}
                <br>
                <i class="bi bi-geo-alt-fill me-1"></i>
                {{ exp.location }}
              </p>
              <p class="card-text">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-briefcase display-1 text-muted mb-3"></i>
        <h2 class="display-6">Experience Coming Soon!</h2>
        <p class="lead text-muted">Work history has not been added yet. Please check back later.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getPublicExperience} from '@/services/api/index.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const experiences = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = {year: 'numeric', month: 'long'};
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(async () => {
  try {
    const data = await getPublicExperience();
    // Sort by end date descending (most recent first)
    experiences.value = data.sort((a, b) => new Date(b.endDate || new Date()) - new Date(a.endDate || new Date()));
  } catch (err) {
    console.error("Failed to fetch experience data:", err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* --- Page Styling --- */
.experience-page {
  overflow-x: hidden;
}

.experience-page h1, .experience-page .display-5, .experience-page .display-6 {
  font-weight: 300;
}

/*
  KEY FIX: This ensures the card's content is clickable by lifting it
  above the decorative ::before pseudo-element.
*/
.card-body {
  position: relative;
  z-index: 1;
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
  background-color: var(--bs-border-color-translucent);
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
  background-color: var(--bs-body-bg);
  border: 4px solid var(--bs-primary);
  top: 15px;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 10px rgba(var(--bs-primary-rgb), 0.5);
}

.timeline-item:nth-child(even)::after {
  left: -12.5px;
}

/* --- Card Content --- */
.timeline-content {
  position: relative;
  border-radius: var(--bs-card-border-radius);
}

/*
  KEY CHANGE: The arrow is now on the timeline-item's ::before pseudo-element,
  which frees up the card's ::before for the orb effect from common.css.
*/
.timeline-item::before {
  content: '';
  position: absolute;
  top: 28px;
  width: 15px;
  height: 15px;
  /* Replicating the glass effect as we can no longer inherit from the card */
  background: rgba(var(--bs-tertiary-bg-rgb), 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(-50%) rotate(45deg);
  z-index: 0; /* Sits behind the card */
}

.timeline-item:nth-child(odd)::before {
  /* Position it on the right side of the item, just inside the padding boundary */
  right: 32.5px; /* 40px padding - 7.5px half-width */
}

.timeline-item:nth-child(even)::before {
  /* Position it on the left side of the item */
  left: 32.5px; /* 40px padding - 7.5px half-width */
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

  /* Adjust arrow position for mobile view */
  .timeline-item::before {
    left: 62.5px; /* 70px padding - 7.5px half-width */
    right: auto;
  }
}
</style>
