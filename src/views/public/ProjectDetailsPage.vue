<template>
  <!-- The root element correctly uses the global animated background class -->
  <div class="project-details-page animated-gradient-background">
    <LoadingModal :visible="isLoading" />

    <div v-if="error" class="container py-5 text-center">
      <div class="alert alert-danger shadow-sm">
        <h4 class="alert-heading">🚫 Error Loading Project</h4>
        <p>{{ error.message || 'Could not fetch the project details. It might not exist or there was a server error.' }}</p>
        <hr>
        <router-link to="/projects" class="btn btn-outline-danger">
          <i class="bi bi-arrow-left me-2"></i>Back to All Projects
        </router-link>
      </div>
    </div>

    <div v-else-if="project">
      <!-- Hero Image Section -->
      <div class="hero-image-container animate-fade-in" :style="{ backgroundImage: `url(${project.imageUrl})` }">
        <div class="hero-overlay"></div>
      </div>

      <div class="container content-container">
        <!-- Main Content Card -->
        <div class="card glass-card shimmering p-4 p-md-5 animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
          <!-- Header -->
          <div class="text-center mb-4">
            <h1 class="display-4 fw-bold">{{ project.title }}</h1>
          </div>

          <!-- Tech Stack -->
          <div v-if="project.techStack && project.techStack.length" class="text-center mb-4">
            <span v-for="tech in project.techStack" :key="tech" class="badge me-2 mb-2">
              {{ tech }}
            </span>
          </div>

          <!-- Description -->
          <div class="project-description mb-5">
            <p>{{ project.description }}</p>
          </div>

          <!-- Links Section -->
          <div v-if="project.liveUrl || project.repoUrl" class="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <!-- Buttons correctly use the global interactive classes -->
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn btn-primary btn-lg interactive-lift interactive-shadow-primary">
              <i class="bi bi-box-arrow-up-right me-2"></i> Live Demo
            </a>
            <!-- KEY CHANGE: Switched to a solid button for better contrast in dark mode -->
            <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="btn btn-secondary btn-lg interactive-lift">
              <i class="bi bi-github me-2"></i> Source Code
            </a>
          </div>

          <div class="text-center">
            <router-link to="/projects" class="btn btn-link text-muted">
              <i class="bi bi-arrow-left me-1"></i> Back to All Projects
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading" class="container py-5 text-center">
      <div class="alert alert-warning shadow-sm">
        <h4 class="alert-heading">Project Not Found</h4>
        <p>The project you are looking for does not exist.</p>
        <hr>
        <router-link to="/projects" class="btn btn-outline-warning">
          <i class="bi bi-arrow-left me-2"></i>Back to All Projects
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublicProjectById, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/LoadingModal.vue';

const props = defineProps({
  /**
   * The UUID of the project, passed as a prop from the router.
   * @type {String}
   * @required
   */
  uuid: {
    type: String,
    required: true
  }
});

const project = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    project.value = await getPublicProjectById(props.uuid);
  } catch (err) {
    console.error(`Failed to fetch project with UUID ${props.uuid}:`, err);
    if (err instanceof ApiError) {
      error.value = err;
    } else {
      error.value = { message: 'An unexpected error occurred.' };
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.project-details-page {
  /* REMOVED: background, background-size, animation. Handled by .animated-gradient-background */
  overflow-x: hidden;
  padding-bottom: 5rem;
}

.hero-image-container {
  height: 50vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, var(--bs-body-bg) 5%, rgba(var(--bs-body-bg-rgb), 0.5) 100%);
}

.content-container {
  margin-top: -15vh; /* Pull the content card up over the hero image */
  position: relative;
  z-index: 2;
}

/*
  KEY FIX: This ensures the card's content is clickable by lifting it
  above the decorative ::before pseudo-element.
*/
.card > * {
  position: relative;
  z-index: 1;
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap; /* Respects newlines in the description */
  color: var(--bs-secondary-color);
}

.badge {
  font-weight: 500;
  padding: 0.5em 0.9em;
  background-color: rgba(var(--bs-primary-rgb), 0.15) !important;
  color: var(--bs-primary) !important;
  border: 1px solid transparent;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.2s forwards; /* Added delay */
}
</style>
