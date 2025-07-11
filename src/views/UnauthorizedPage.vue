<template>
  <div class="unauthorized-page text-center py-5">
    <div class="container">
      <h1 class="display-1 text-warning">401</h1>
      <h2 class="display-4">Access Denied</h2>
      <p class="lead my-4">
        Sorry, you do not have the necessary permissions to access this page.
        <br>
        Please check your account privileges or contact an administrator if you believe this is an
        error.
      </p>

      <div class="my-4">
        <!-- You can add an relevant icon or image here if desired -->
        <!-- Example: <i class="bi bi-shield-lock-fill" style="font-size: 5rem; color: var(--bs-warning);"></i> -->
        <svg class="bi bi-shield-lock-fill text-warning mb-3" fill="currentColor" height="80" viewBox="0 0 16 16"
             width="80" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0c-.086 0-.166.002-.243.005l-.028.002C6.238.04 5.012.163 3.998.527c-1.016.365-1.943.988-2.67 1.715A4.404 4.404 0 0 0 .527 3.998C.163 5.012.04 6.238.007 7.757L0 8c0 .086.002.166.005.243l.002.028C.04 9.762.163 10.988.527 12.002c.365 1.016.988 1.943 1.715 2.67a4.404 4.404 0 0 0 1.756 1.257c1.016.365 2.242.488 3.76.525l.028.002A68.395 68.395 0 0 0 8 16c.086 0 .166-.002.243-.005l.028-.002c1.518-.037 2.744-.16 3.76-.525a4.404 4.404 0 0 0 1.756-1.257c.727-.727 1.35-1.654 1.715-2.67.365-1.016.488-2.242.526-3.76l.002-.028A68.395 68.395 0 0 0 16 8c0-.086-.002-.166-.005-.243l-.002-.028C15.96 6.238 15.837 5.012 15.473 3.998a4.404 4.404 0 0 0-1.257-1.756C13.49 1.512 12.563.89 11.547.527 10.531.163 9.305.04 7.783.007L7.757 0H8zm2.5 7.99a.5.5 0 0 1-1 0V7.5a.5.5 0 0 1 1 0v.49zm-2.5 0a.5.5 0 0 1-1 0V7.5a.5.5 0 0 1 1 0v.49zm-.22-1.324a1.5 1.5 0 1 0-2.56 1.012A1.5 1.5 0 0 0 7.78 6.666z"
                fill-rule="evenodd"/>
        </svg>
      </div>

      <div class="d-flex justify-content-center gap-2">
        <router-link class="btn btn-outline-secondary btn-lg" to="/">
          Go to Homepage
        </router-link>
        <router-link class="btn btn-warning btn-lg" to="/login">
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/UnauthorizedPage.vue
 * @description An "Access Denied" page for users attempting to access restricted content.
 * Displays a 401-like message and links to homepage or login.
 */

// No specific script logic needed for this simple static page.
</script>

<style scoped>
.unauthorized-page {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fffcf0; /* Light yellow/cream background */
}

.display-1 {
  font-weight: bold;
  font-size: 6rem; /* Larger 401 text */
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}
</style>
