<template>
  <div v-if="testimonials && testimonials.length > 0" class="card glass-card">
    <div class="card-body">
      <h3 class="card-title glass-title mb-4">Testimonials</h3>
      <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.uuid"
            :class="['carousel-item', { active: index === 0 }]"
          >
            <!-- CORRECTED: Wrapped blockquote and figcaption in a <figure> tag -->
            <figure class="text-center px-4">
              <blockquote class="blockquote">
                <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
              </blockquote>
              <figcaption class="blockquote-footer mt-2">
                <span class="author-name">{{ testimonial.authorName }}</span>
                <cite v-if="testimonial.authorTitle" :title="testimonial.authorTitle" class="author-title d-block">{{ testimonial.authorTitle }}</cite>
              </figcaption>
            </figure>
          </div>
        </div>
        <button v-if="testimonials.length > 1" class="carousel-control-prev" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button v-if="testimonials.length > 1" class="carousel-control-next" type="button" :data-bs-target="`#${carouselId}`" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  testimonials: {
    type: Array,
    required: true,
  },
});

const carouselId = computed(() => `testimonial-carousel-${Math.random().toString(36).substring(2, 9)}`);
</script>

<style scoped>
.card-body {
  padding: 1.5rem;
}

.testimonial-quote {
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.6;
  color: var(--glass-text);
}

.author-name {
  font-weight: 600;
  color: var(--bs-primary);
}

.author-title {
  font-size: 0.85rem;
  color: var(--glass-text-secondary);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(var(--bs-primary-rgb), 0.5);
  border-radius: 50%;
  padding: 1rem;
  background-size: 50% 50%;
}

.carousel-control-prev, .carousel-control-next {
  width: 5%;
}
</style>
