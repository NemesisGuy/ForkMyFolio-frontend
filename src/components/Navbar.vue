<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
    <div class="container">
      <router-link class="navbar-brand" to="/">ForkMyFolio</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/projects">Projects</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/skills">Skills</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/contact">Contact</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/login">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/signup">Sign Up</router-link>
          </li>
          <!-- Auth-aware links will be added later -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No script logic needed for this basic version of Navbar.
// JSDoc for the component itself.
/**
 * @file src/components/Navbar.vue
 * @description Navigation bar component for the application.
 * Displays main navigation links. Uses Bootstrap for styling.
 */
</script>

<style scoped>
/* Custom scoped styles for Navbar if Bootstrap classes aren't enough */
.navbar-brand {
  font-weight: bold;
}
/* Ensure active class is visibly distinct if default Bootstrap active isn't prominent enough */
/* .nav-link.active { */
  /* color: var(--bs-primary) !important; */
  /* font-weight: 500; */
/* } */
</style>
