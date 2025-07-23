<template>
  <!-- THIS IS THE FIX: The page now uses the animated background and flexbox for centering -->
  <div class="not-found-page py-5 animated-gradient-background d-flex align-items-center">
    <div class="container" style="max-width: 600px;">
      <!-- The content is now wrapped in a beautiful, animated glass card -->
      <div class="card glass-card shimmering animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
        <div class="card-body text-center p-4 p-md-5">
          <h1 class="display-4 fw-bold text-primary">404</h1>
          <h2 class="display-5">Page Not Found</h2>
          <p class="lead text-muted my-4">
            Oops! It seems you've ventured into uncharted territory.
          </p>

          <div class="rickroll-container my-4">
            <img
              v-if="!imageError"
              alt="Never Gonna Give You Up - Rick Astley GIF"
              class="img-fluid rounded shadow-sm"
              src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
              @error="imageError = true"
            >
            <p v-if="imageError" class="text-muted small mt-2">(Well, it seems the GIF decided to give us up. Imagine a witty animation here.)</p>
          </div>

          <!-- The button now has interactive classes -->
          <router-link class="btn btn-primary btn-lg interactive-lift interactive-shadow-primary" to="/">
            Go Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

/**
 * @file src/views/public/NotFoundPage.vue
 * @description A 404 Page Not Found component.
 * Displays a humorous message and a link back to the homepage.
 * Features a classic Rickroll GIF.
 */

const imageError = ref(false);
</script>

<style scoped>
/* THIS IS THE FIX: The page now takes up the full viewport height for better vertical centering */
.not-found-page {
  min-height: calc(100vh - 56px - 1px); /* Full height minus navbar and its border */
  overflow-x: hidden;
}

.card-body {
  position: relative;
  z-index: 1;
}

h1, h2 {
  font-weight: 300;
}

.rickroll-container img {
  max-width: 100%;
  height: auto;
  max-height: 250px; /* Adjusted size for the card layout */
}

/* THIS IS THE FIX: Adds the fade-in animation */
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
</style>
