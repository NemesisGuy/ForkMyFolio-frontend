<template>
  <div class="projects-page">
    <h1 class="mb-4">Projects</h1>
    <p class="lead mb-4">Browse through the amazing projects showcased on ForkMyFolio.</p>
    <!-- Placeholder for project listing -->
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Project Alpha (Placeholder)</h5>
            <p class="card-text">A revolutionary app that changes the way you do things. Built with Vue and Spring Boot.</p>
            <a href="#" class="btn btn-primary">View Details</a>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Project Beta (Placeholder)</h5>
            <p class="card-text">An innovative platform for creative collaboration. Features real-time updates.</p>
            <a href="#" class="btn btn-primary">View Details</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// JSDoc for the component
/**
 * @file src/views/ProjectsPage.vue
 * @description Page to display a list of projects.
 * Will fetch and show projects from the backend.
 */

// Future: import project fetching logic, manage loading/error states
</script>

<style scoped>
.projects-page h1 {
  font-weight: 300;
}
</style>
