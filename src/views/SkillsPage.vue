<template>
  <div class="skills-page">
    <h1 class="mb-4">Skills</h1>
    <p class="lead mb-4">Discover the various skills and technologies used in projects on ForkMyFolio.</p>
    <!-- Placeholder for skills listing -->
    <div class="d-flex flex-wrap gap-2">
      <span class="badge bg-primary p-2">JavaScript</span>
      <span class="badge bg-secondary p-2">Vue.js</span>
      <span class="badge bg-success p-2">Node.js</span>
      <span class="badge bg-danger p-2">Python</span>
      <span class="badge bg-warning text-dark p-2">SQL</span>
      <span class="badge bg-info p-2">Bootstrap</span>
    </div>
  </div>
</template>

<script setup>
// JSDoc for the component
/**
 * @file src/views/SkillsPage.vue
 * @description Page to display a list of skills.
 * Will fetch and show skills from the backend.
 */

// Future: import skill fetching logic, manage loading/error states
</script>

<style scoped>
.skills-page h1 {
  font-weight: 300;
}
.badge {
  font-size: 1rem; /* Make badges a bit larger */
}
</style>
