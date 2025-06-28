<template>
  <div class="testimonials-page py-5">
    <div class="container">
      <h1 class="display-5 mb-4 text-center">Testimonials</h1>
      <p class="lead text-center text-muted mb-5">What colleagues and clients are saying about my
        work.</p>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger">
        Could not load testimonials. Please try again later.
      </div>

      <div v-else-if="testimonials.length > 0"
           class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <i class="bi bi-quote display-4 text-primary opacity-25 mb-3"></i>
              <blockquote class="blockquote mb-4 flex-grow-1">
                <p>{{ testimonial.quote }}</p>
              </blockquote>
              <figcaption class="blockquote-footer mt-auto">
                <strong class="d-block">{{ testimonial.authorName }}</strong>
                <cite :title="testimonial.authorTitle">{{ testimonial.authorTitle }}</cite>
              </figcaption>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-chat-quote display-1 text-muted mb-3"></i>
        <h2 class="display-6">No Testimonials Yet</h2>
        <p class="lead text-muted">Testimonials have not been added yet. Please check back
          later.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ApiError, getPublicTestimonials} from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const testimonials = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    testimonials.value = await getPublicTestimonials();
  } catch (err) {
    console.error("Failed to fetch testimonials:", err);
    error.value = err instanceof ApiError ? err : {message: 'An unexpected error occurred.'};
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.testimonials-page h1 {
  font-weight: 300;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 0;
  border-top: 4px solid var(--bs-primary);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .15) !important;
}

.blockquote p {
  font-size: 1.05rem;
  font-style: italic;
  line-height: 1.6;
}

.blockquote-footer {
  font-size: 0.9rem;
}

.blockquote-footer strong {
  color: var(--bs-body-color);
}
</style>
