<script setup>
import {RouterView} from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
// We no longer need the NotificationContainer
import {useTheme} from '@/services/themeService.js';

/**
 * @file src/App.vue
 * @description Main application component. Sets up the global layout including Navbar,
 *              the main content area for routes, and a footer.
 */
useTheme();
</script>

<template>
  <div id="app-layout" class="d-flex flex-column min-vh-100">
    <Navbar/>

    <main class="main-content flex-shrink-0">
      <RouterView/>
    </main>

    <Footer/>

    <!-- The NotificationContainer has been removed from here -->
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

main.main-content {
  flex: 1; /* Allows main content to grow and push footer down */
}
</style>
