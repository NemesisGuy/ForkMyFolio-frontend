<template>
  <div class="not-found-page text-center py-5">
    <div class="container">
      <h1 class="display-1 text-primary">404</h1>
      <h2 class="display-4">Page Not Found</h2>
      <p class="lead my-4">
        Oops! It seems you've ventured into uncharted territory.
        <br>
        Don't worry, we'll never give you up... on finding your way back!
      </p>

      <div class="rickroll-container my-4">
        <img
          v-if="!imageError"
          alt="Never Gonna Give You Up - Rick Astley GIF"
          class="img-fluid rounded shadow"
          src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
          @error="imageError = true"
        >
        <p v-if="imageError" class="text-muted">(Well, it seems the GIF decided to give us up.
          Imagine a witty animation here.)</p>
      </div>

      <router-link class="btn btn-primary btn-lg" to="/">
        Go Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

/**
 * @file src/views/NotFoundPage.vue
 * @description A 404 Page Not Found component.
 * Displays a humorous message and a link back to the homepage.
 * Features a classic Rickroll GIF.
 */

/** @type {import('vue').Ref<boolean>} - Tracks if the GIF image failed to load. */
const imageError = ref(false);

// No specific logic needed for this simple page beyond the template.
</script>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa; /* Light background for contrast */
}

.display-1 {
  font-weight: bold;
  font-size: 6rem; /* Larger 404 text */
}

.rickroll-container img {
  max-width: 100%;
  height: auto;
  max-height: 300px; /* Control GIF size */
  border: 3px solid #dee2e6; /* Optional border for the GIF */
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}
</style>
