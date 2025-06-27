<template>
  <div class="my-projects-page py-4">
    <div class="container-fluid">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5">My Projects</h1>
        <!-- Optional: "Create Project" button can be added here later -->
        <!-- <button class="btn btn-primary">Create New Project</button> -->
      </div>
      <p class="lead mb-5">View and manage projects associated with your account.</p>

      <div v-if="isLoading" class="loading-spinner-container d-flex justify-content-center align-items-center py-5">
        <LoadingSpinner />
      </div>

      <div v-else-if="myProjects && myProjects.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="project in myProjects" :key="project.id" class="col">
          <div class="card h-100 shadow-sm">
            <img
              :src="project.imageUrl || 'https://via.placeholder.com/400x250?text=Project+Image'"
              class="card-img-top"
              :alt="project.title"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ project.title }}</h5>
              <p class="card-text text-muted small">{{ project.description?.substring(0, 100) }}{{ project.description?.length > 100 ? '...' : '' }}</p>

              <div v-if="project.techStack && project.techStack.length" class="mb-2">
                <span v-for="tech in project.techStack" :key="tech" class="badge bg-secondary me-1 mb-1">{{ tech }}</span>
              </div>

              <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                <div>
                  <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn btn-sm btn-outline-primary me-2">Live Demo</a>
                  <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="btn btn-sm btn-outline-secondary">Source Code</a>
                </div>
                <!-- Optional: Add project date if available and formatDate is imported -->
                <!-- <small class="text-muted" v-if="project.createdAt">{{ formatDate(project.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }) }}</small> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!isLoading && !showErrorModal" class="alert alert-info text-center" role="alert">
        <h4 class="alert-heading">No Projects Found</h4>
        <p>You have not created or been associated with any projects yet.</p>
        <!-- Optional: Link to create project page -->
        <!-- <router-link to="/projects/create" class="btn btn-primary mt-2">Create Your First Project</router-link> -->
      </div>
    </div>
    <ErrorModal
      v-if="error"
      :visible="showErrorModal"
      :title="error?.title || 'Error'"
      :message="error?.message || 'An unexpected error occurred.'"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/MyProjectsPage.vue
 * @description Page for authenticated users to view their projects.
 * Fetches projects from /api/v1/users/me/projects.
 */
import { ref, onMounted } from 'vue';
import { getMyProjects, ApiError } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import ErrorModal from '../components/common/ErrorModal.vue';
// import { formatDate } from '../utils'; // If project dates are to be displayed

// --- Reactive State ---
/** @type {import('vue').Ref<Array<object>>} List of ProjectDto for the current user. */
const myProjects = ref([]);
/** @type {import('vue').Ref<boolean>} Loading state for fetching projects. */
const isLoading = ref(true);
/** @type {import('vue').Ref<{title: string, message: string|string[]}|null>} Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

// --- Lifecycle Hooks & Fetch Logic ---
/**
 * Fetches the authenticated user's projects from the API.
 */
const fetchMyProjects = async () => {
  isLoading.value = true;
  error.value = null;
  showErrorModal.value = false;
  try {
    const projectsData = await getMyProjects();
    myProjects.value = projectsData || []; // Ensure it's an array
  } catch (err) {
    console.error("Failed to load user's projects:", err);
    let errorMessage = "Could not fetch your projects. Please try again later.";
    if (err instanceof ApiError && err.errors && err.errors.length > 0) {
      errorMessage = err.errors.map(e => e.message);
      if (errorMessage.length === 1) errorMessage = errorMessage[0];
    } else if (err.message) {
      errorMessage = err.message;
    }
    error.value = {
      title: 'Failed to Load Projects',
      message: errorMessage,
    };
    showErrorModal.value = true;
    myProjects.value = []; // Clear projects on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMyProjects();
});

// --- Methods ---
/**
 * Closes the error modal.
 */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

</script>

<style scoped>
.my-projects-page h1, .my-projects-page .display-5 {
  font-weight: 300;
}
/* Add more styles as needed, similar to ProjectsPage.vue for card consistency */
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15) !important;
}
.card-img-top {
  border-bottom: 1px solid #dee2e6;
  height: 200px; /* Consistent image height */
  object-fit: cover;
}
.badge {
  font-size: 0.75rem;
  padding: 0.3em 0.6em;
}
.card-body {
  flex-grow: 1; /* Ensure footer buttons in card are pushed to bottom */
}
.loading-spinner-container {
  min-height: 200px;
}
</style>
