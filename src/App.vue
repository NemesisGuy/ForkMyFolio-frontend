<script setup>
// Using <script setup> which is Vue 3 composition API standard.
// No specific lang attribute means JavaScript by default.
import {RouterView} from 'vue-router';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import { useTheme } from '@/services/themeService.js';

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

    <!--
      THIS IS THE FIX:
      Removed `container-fluid` and `py-4`. This makes the <main> element a simple
      flex container, allowing the child component from RouterView to control
      the entire content area's background and padding. This eliminates the
      "border" effect and ensures a consistent background color.
    -->
    <main class="main-content flex-shrink-0">
      <RouterView/>
    </main>

    <Footer/>
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

/*
  THIS IS THE FIX:
  The selector is updated from `main.container-fluid` to `main.main-content`
  to match the change in the template. This preserves the essential flex behavior
  that pushes the footer to the bottom of the page.
*/
main.main-content {
  flex: 1; /* Allows main content to grow and push footer down */
}
</style>
