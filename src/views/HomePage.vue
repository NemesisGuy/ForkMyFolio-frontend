<template>
  <div class="home-page">
    <!-- The header now uses a Bootstrap background utility that adapts to the theme -->
    <header class="py-5 text-center bg-body-tertiary rounded-3">
      <div class="container">
        <h1 class="display-4">Welcome to ForkMyFolio</h1>
        <p class="lead text-body-secondary">The best place to showcase your amazing projects and skills!</p>
        <div class="mt-4">
          <router-link to="/projects" class="btn btn-primary btn-lg me-2">View Projects</router-link>
          <router-link to="/signup" class="btn btn-secondary btn-lg">Get Started</router-link>
        </div>
      </div>
    </header>

    <!-- The section content is wrapped in a container for proper alignment -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-lg-4 mb-4 mb-lg-0">
            <h2 class="h4">Easy to Use</h2>
            <p class="text-body-secondary">Quickly set up your portfolio and add projects with our intuitive interface.</p>
          </div>
          <div class="col-lg-4 mb-4 mb-lg-0">
            <h2 class="h4">Modern Design</h2>
            <p class="text-body-secondary">Leverage sleek, responsive templates.</p>
          </div>
          <div class="col-lg-4">
            <h2 class="h4">Showcase Your Skills</h2>
            <p class="text-body-secondary">Highlight your technical skills and link them directly to your projects.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// JSDoc for the component
/**
 * @file src/views/HomePage.vue
 * @description The main home page of the application.
 * Displays a welcome message and calls to action.
 */

// No specific script logic needed for this simple version.
</script>

<style scoped>
/* The hardcoded background color has been removed and replaced with Bootstrap utility classes. */
.home-page .display-4 {
  font-weight: 300;
}

.home-page header {
  padding-bottom: 3rem !important; /* Ensure padding with Bootstrap */
  /* Optional: Add a subtle transition for the background color change */
  transition: background-color 0.3s ease-in-out;
}
</style>
