<script setup>
// Using <script setup> which is Vue 3 composition API standard.
// No specific lang attribute means JavaScript by default.
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue'; // Will create this next

/**
 * @file src/App.vue
 * @description Main application component. Sets up the global layout including Navbar,
 *              the main content area for routes, and a footer.
 */
</script>

<template>
  <div id="app-layout" class="d-flex flex-column min-vh-100">
    <Navbar />

    <main class="flex-shrink-0 container-fluid py-4">
      <RouterView />
    </main>

    <footer class="footer mt-auto py-3 bg-light border-top">
      <div class="container-fluid text-center">
        <span class="text-muted">
          © {{ new Date().getFullYear() }} ForkMyFolio. All rights reserved.
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Scoped styles for App.vue if needed. Global styles are in main.css or imported via Bootstrap. */
/* Ensure container pushes footer down */
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main.container {
  flex: 1; /* Allows main content to grow and push footer down */
}

/* Basic footer styling, can be enhanced */
.footer {
  font-size: 0.9rem;
}
</style>
