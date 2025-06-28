<script setup>
// Using <script setup> which is Vue 3 composition API standard.
// No specific lang attribute means JavaScript by default.
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue'; // <-- 1. IMPORT THE NEW COMPONENT

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

    <!-- 2. USE THE NEW COMPONENT -->
    <Footer />
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

main.container-fluid { /* Adjusted to match your main element */
  flex: 1; /* Allows main content to grow and push footer down */
}

/* 3. REMOVED old .footer style, as it's now in Footer.vue */
</style>
