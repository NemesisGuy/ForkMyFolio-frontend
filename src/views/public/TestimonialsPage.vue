<template>
  <div class="testimonials-page py-5 animated-gradient-background">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">
          <i class="bi bi-chat-left-quote" aria-hidden="true"></i> Testimonials
        </h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          What colleagues and clients are saying about my work.
        </p>
      </div>

      <!-- The glassmorphic modal will overlay everything while loading -->
      <LoadingModal :visible="isLoading" class="glass-modal" />

      <!-- A skeleton loader that mimics the new testimonial card style -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="n in 6"
             :key="n"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (n * 0.05) + 's' }">
          <div class="card glass-card glass-card-floating h-100">
            <div class="card-body d-flex flex-column">
              <div class="flex-grow-1">
                <div class="skeleton-line skeleton-subtitle mb-2"></div>
                <div class="skeleton-line skeleton-subtitle mb-2"></div>
                <div class="skeleton-line skeleton-grade" style="width: 70%;"></div>
              </div>
              <div class="mt-auto text-end">
                <div class="skeleton-line skeleton-title" style="width: 60%; margin-left: auto;"></div>
                <div class="skeleton-line skeleton-subtitle" style="width: 80%; margin-left: auto;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger shadow-sm" role="alert">
        <h4 class="alert-heading"><i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> Error Loading Testimonials</h4>
        <p>{{ error.message || 'Could not load testimonials. Please try again later.' }}</p>
      </div>

      <div v-else-if="testimonials.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="(testimonial, index) in testimonials"
             :key="testimonial.id"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.1 + 0.2) + 's' }">
          <div class="card glass-card glass-card-floating h-100 interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <i class="bi bi-quote card-quote-icon" aria-hidden="true"></i>
              <figure class="mb-0 d-flex flex-column flex-grow-1">
                <blockquote class="blockquote mb-4 flex-grow-1">
                  <p class="glass-description">{{ testimonial.quote }}</p>
                </blockquote>
                <figcaption class="blockquote-footer mt-auto text-end">
                  <strong class="d-block glass-title">{{ testimonial.authorName }}</strong>
                  <cite :title="testimonial.authorTitle" class="glass-subtitle">{{ testimonial.authorTitle }}</cite>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <!-- Updated empty state with new glass style -->
      <div v-else class="glass-card">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-chat-quote"></i>
          </div>
          <h4 class="card-title glass-title mb-3">No Testimonials Yet</h4>
          <p class="card-text glass-subtitle mb-4">
            Testimonials have not been added yet. Please check back later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/TestimonialsPage.vue
 * @description A page to display testimonials with a premium glassmorphic design.
 */
import { onMounted, ref } from 'vue';
import { getPublicTestimonials, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

const testimonials = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    testimonials.value = await getPublicTestimonials() || [];
  } catch (err) {
    console.error('Failed to fetch testimonials:', err);
    error.value = err instanceof ApiError ? err : { message: 'An unexpected error occurred.' };
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.testimonials-page {
  overflow-x: hidden;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Watermark Quote Icon */
.card-quote-icon {
  position: absolute;
  top: -10px;
  left: -10px;
  font-size: 8rem;
  color: var(--glass-shimmer);
  transform: rotate(-15deg);
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}

/* Card Body */
.card-body {
  z-index: 1;
}

/* Blockquote Styling */
.blockquote p {
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.7;
}

.blockquote-footer {
  font-size: 0.9rem;
}

.blockquote-footer strong {
  font-weight: 600;
}

/* Skeleton styles are now handled by global classes in common.css */
</style>
