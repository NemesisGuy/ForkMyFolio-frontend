<template>
  <div class="projects-page py-4">
    <div class="container-fluid">
      <h1 class="mb-4 display-5">Projects</h1>
      <p class="lead mb-5">Browse through the amazing projects showcased on ForkMyFolio.</p>

      <!-- Use a full-screen loading modal for a better UX -->
      <LoadingModal :visible="isLoading" />

      <!-- This content will only be rendered once loading is complete -->
      <div v-if="!isLoading">
        <div v-if="error" class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error Loading Projects</h4>
          <p>{{ error.message || 'Could not fetch projects. Please try again later.' }}</p>
          <hr v-if="error.errors && error.errors.length > 0">
          <ul v-if="error.errors && error.errors.length > 0" class="mb-0">
            <li v-for="(err, index) in error.errors" :key="index">
              {{ err.field ? `(${err.field}) ` : '' }}{{ err.message }}
            </li>
          </ul>
        </div>

        <div v-else-if="projects && projects.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="project in projects" :key="project.id" class="col">
            <div class="card h-100 shadow-sm">
              <img
                :src="project.imageUrl || 'https://via.placeholder.com/400x250?text=Project+Image'"
                class="card-img-top"
                :alt="project.title"
                style="height: 200px; object-fit: cover;"
              >
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ project.title }}</h5>
                <p class="card-text text-muted small">
                  {{ project.description?.substring(0, 100) }}{{ project.description?.length > 100 ? '...' : '' }}
                </p>

                <div v-if="project.techStack && project.techStack.length" class="mb-2">
                  <span v-for="tech in project.techStack" :key="tech" class="badge bg-secondary me-1 mb-1">{{ tech }}</span>
                </div>

                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                  <div>
                    <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn btn-sm btn-outline-primary me-2">Live Demo</a>
                    <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="btn btn-sm btn-outline-secondary">Source Code</a>
                  </div>
                  <small class="text-muted" v-if="project.createdAt">
                    {{ formatDate(project.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <h2 class="display-6">No Projects Yet</h2>
          <p class="lead text-muted">Check back later to see new projects, or be the first to add one!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublicProjects } from '@/services/api'; // CORRECT: Uses the public function
import { ApiError } from '@/services/api';
import { formatDate } from '@/utils';
import LoadingModal from '@/components/common/LoadingModal.vue';

/**
 * @file src/views/ProjectsPage.vue
 * @description Page to display a list of all projects.
 * Fetches and shows projects from the backend with loading and error states.
 */

const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);

/**
 * Fetches projects from the API.
 */
const fetchProjects = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // CORRECT: Calls the public function
    const data = await getPublicProjects();
    projects.value = data || []; // Ensure projects is an array even if data is null/undefined
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    if (err instanceof ApiError) {
      error.value = err;
    } else {
      error.value = { message: err.message || 'An unexpected error occurred while fetching projects.' };
    }
    projects.value = []; // Clear projects on error
  } finally {
    isLoading.value = false;
  }
};

// Fetch projects when the component is mounted
onMounted(fetchProjects);
</script>

<style scoped>
.projects-page h1, .projects-page .display-5, .projects-page .display-6 {
  font-weight: 300;
}
.card-img-top {
  border-bottom: 1px solid #dee2e6;
}
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15) !important;
}
.badge {
  font-size: 0.75rem;
  padding: 0.3em 0.6em;
}
.card-body {
  flex-grow: 1;
}
</style>
