<template>
  <div class="home-page">
    <header class="py-5 text-center">
      <h1>Welcome to ForkMyFolio</h1>
      <p class="lead">The best place to showcase your amazing projects and skills!</p>
      <div class="mt-4">
        <router-link class="btn btn-primary btn-lg me-2" to="/projects">View Projects</router-link>
        <router-link class="btn btn-secondary btn-lg" to="/signup">Get Started</router-link>
      </div>
    </header>

    <section class="py-5">
      <div class="row">
        <div class="col-md-4">
          <h2>Easy to Use</h2>
          <p>Quickly set up your portfolio and add projects with our intuitive interface.</p>
        </div>
        <div class="col-md-4">
          <h2>Modern Design</h2>
          <p>Leverage sleek, responsive templates.</p>
        </div>
        <div class="col-md-4">
          <h2>Showcase Your Skills</h2>
          <p>Highlight your technical skills and link them directly to your projects.</p>
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
.home-page header {
  background-color: #f8f9fa; /* Light grey background for header */
  padding-bottom: 3rem !important; /* Ensure padding with Bootstrap */
}

.home-page h1 {
  font-weight: 300;
}
</style>
