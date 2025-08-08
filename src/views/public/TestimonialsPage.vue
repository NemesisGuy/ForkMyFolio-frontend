<template>
  <div class="testimonials-page py-5 animated-gradient-background">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">
          <i aria-hidden="true" class="bi bi-chat-left-quote-fill"></i> Testimonials
        </h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          What colleagues and clients are saying about my work.
        </p>
      </div>

      <LoadingModal :visible="isLoading"/>

      <!-- A skeleton loader that mimics the new testimonial card style -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="n in 6"
             :key="n"
             :style="{ 'animation-delay': (n * 0.05) + 's' }"
             class="col animate-fade-in-up">
          <div class="card glass-card glass-card-floating h-100">
            <div class="card-body d-flex flex-column">
              <div class="flex-grow-1">
                <div class="skeleton-line skeleton-subtitle mb-2"></div>
                <div class="skeleton-line skeleton-subtitle mb-2"></div>
                <div class="skeleton-line skeleton-grade" style="width: 70%;"></div>
              </div>
              <div class="mt-auto text-end">
                <div class="skeleton-line skeleton-title"
                     style="width: 60%; margin-left: auto;"></div>
                <div class="skeleton-line skeleton-subtitle"
                     style="width: 80%; margin-left: auto;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Testimonials</h5>
          <p class="card-text text-light opacity-75">
            {{ error.message || 'Could not load testimonials. Please try again later.' }}
          </p>
        </div>
      </div>

      <!-- State for when a portfolio is loaded and has testimonials -->
      <div v-else-if="testimonials.length > 0"
           class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="(testimonial, index) in testimonials"
             :key="testimonial.uuid"
             :style="{ 'animation-delay': (index * 0.1 + 0.2) + 's' }"
             class="col animate-fade-in-up"
        >
          <div
            class="card glass-card glass-card-floating h-100 interactive-card-lift interactive-card-shadow-primary"
            role="button" tabindex="0"
            @click="selectTestimonial(testimonial)"
          >
            <div class="card-body d-flex flex-column">
              <i aria-hidden="true" class="bi bi-quote card-quote-icon"></i>
              <figure class="mb-0 d-flex flex-column flex-grow-1">
                <blockquote class="blockquote mb-4 flex-grow-1">
                  <p class="glass-description">{{ testimonial.quote }}</p>
                </blockquote>
                <figcaption class="blockquote-footer mt-auto text-end">
                  <strong class="d-block glass-title">{{ testimonial.authorName }}</strong>
                  <cite :title="testimonial.authorTitle"
                        class="glass-subtitle">{{ testimonial.authorTitle }}</cite>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <!-- State for when a portfolio is loaded but has no testimonials -->
      <div v-else class="glass-card mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-chat-quote-fill"></i>
          </div>
          <h4 class="card-title glass-title mb-3">No Testimonials Yet</h4>
          <!-- Generic message for public visitors -->
          <p v-if="!isOwner" class="card-text glass-subtitle mb-4">
            This user has not added any testimonials yet. Please check back later.
          </p>

          <!-- Helpful tip for the portfolio owner -->
          <div v-else class="alert alert-info mt-3">
            <p class="mb-1"><strong>Hey there!</strong> It looks like you don't have any testimonials
              visible on your public page.</p>
            <p class="mb-0">
              Go to your
              <router-link :to="{ name: 'my-testimonials', params: { slug: currentSlug } }">
                Testimonial Management
              </router-link>
              page to add new entries.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <TestimonialDetailsModal
      :testimonial="selectedTestimonial"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import {authService} from '@/services/authService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import TestimonialDetailsModal from '@/components/public/TestimonialDetailsModal.vue';

// Use the store to get reactive state.
const {portfolio, isLoading, error, currentSlug} = usePublicPortfolioStore();

// The testimonials are now a computed property derived from the central store.
// FIX: The public page should only display testimonials that are marked as visible.
// The portfolio store contains all testimonials (visible and hidden), so we must
// filter them here on the client side.
const testimonials = computed(() => (portfolio.value?.testimonials || []).filter(t => t.visible));
// Check if the currently logged-in user is the owner of this portfolio.
const isOwner = computed(() => {
  return authService.isAuthenticated.value && authService.user.value?.slug === currentSlug.value;
});

// --- Modal State & Focus Management ---
// REFACTOR: Manually manage focus to prevent accessibility issues.
// We store the element that triggered the modal and return focus to it on close.
const selectedTestimonial = ref(null);
let lastFocusedElement = null;

const selectTestimonial = (testimonial) => {
  lastFocusedElement = document.activeElement; // Store the focused element
  selectedTestimonial.value = testimonial;
};

const closeModal = () => {
  selectedTestimonial.value = null;
  lastFocusedElement?.focus(); // Return focus to the trigger
  lastFocusedElement = null;
};
</script>

<style scoped>
.testimonials-page {
  overflow-x: hidden;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.card[role="button"] {
  cursor: pointer;
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

.empty-state-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  opacity: 0.6;
}
</style>
