<template>
  <div class="testimonials-page py-5 animated-gradient-background">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up"><i class="bi bi-chat-left-quote" aria-hidden="true"></i> Testimonials</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          What colleagues and clients are saying about my work.
        </p>
      </div>

      <!-- The glassmorphic modal will overlay everything while loading -->
      <LoadingModal :visible="isLoading" />

      <!-- A shimmering skeleton loader that mimics the testimonial cards -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <!-- THIS IS THE FIX: The 'col' div now has the animation class and a staggered delay -->
        <div v-for="n in 6"
             :key="n"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (n * 0.05) + 's' }">
          <div class="card glass-card shimmering h-100">
            <div class="card-body d-flex flex-column">
              <div class="flex-grow-1">
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text-short"></div>
              </div>
              <div class="mt-auto text-end">
                <div class="skeleton-line skeleton-author"></div>
                <div class="skeleton-line skeleton-title"></div>
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
          <div class="card glass-card h-100 shadow-sm shimmering interactive-card-lift interactive-card-shadow-primary">
            <div class="card-body d-flex flex-column">
              <i class="bi bi-quote card-quote-icon" aria-hidden="true"></i>
              <figure class="mb-0 d-flex flex-column flex-grow-1">
                <blockquote class="blockquote mb-4 flex-grow-1">
                  <p>{{ testimonial.quote }}</p>
                </blockquote>
                <figcaption class="blockquote-footer mt-auto text-end">
                  <strong class="d-block">{{ testimonial.authorName }}</strong>
                  <cite :title="testimonial.authorTitle">{{ testimonial.authorTitle }}</cite>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-chat-quote display-1 text-muted mb-3" aria-hidden="true"></i>
        <h2 class="display-6">No Testimonials Yet</h2>
        <p class="lead text-muted">Testimonials have not been added yet. Please check back later.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/TestimonialsPage.vue
 * @description Sexy animated glassy testimonials page.
 */
import { onMounted, ref } from 'vue';
import { getPublicTestimonials, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/LoadingModal.vue';

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

/* Animations */
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

/* Watermark Quote Icon */
.card-quote-icon {
  position: absolute;
  top: -10px;
  left: -10px;
  font-size: 8rem;
  color: rgba(var(--bs-primary-rgb), 0.08);
  transform: rotate(-15deg);
  z-index: 0;
  pointer-events: none;
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
  color: var(--bs-emphasis-color);
}

.blockquote-footer {
  font-size: 0.9rem;
  color: var(--bs-secondary-color);
}

.blockquote-footer strong {
  color: var(--bs-emphasis-color);
  font-weight: 500;
}

/* --- Skeleton Placeholder Styles --- */
.skeleton-line {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 0.75rem;
}
.skeleton-text {
  width: 100%;
  height: 16px;
}
.skeleton-text-short {
  width: 70%;
  height: 16px;
}
.skeleton-author {
  width: 60%;
  height: 18px;
  margin-left: auto; /* Align to the right */
}
.skeleton-title {
  width: 80%;
  height: 14px;
  margin-left: auto; /* Align to the right */
}
</style>
