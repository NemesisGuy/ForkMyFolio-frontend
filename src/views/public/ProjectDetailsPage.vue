<template>
  <!-- The root element correctly uses the global animated background class -->
  <div class="project-details-page animated-gradient-background">
    <LoadingModal :visible="isLoading" class="glass-modal"/>

    <!-- Skeleton Loader with new glass styles -->
    <div v-if="isLoading">
      <div class="hero-image-container skeleton-line"></div>
      <div class="container content-container">
        <div class="card glass-card glass-card-floating p-4 p-md-5">
          <div class="text-center mb-4">
            <div class="skeleton-line skeleton-title mx-auto" style="width: 60%; height: 45px;"></div>
          </div>
          <div class="d-flex justify-content-center flex-wrap gap-2 mb-4">
            <div class="skeleton-line me-1 mb-1" style="width: 80px; height: 30px; border-radius: 0.5rem;"></div>
            <div class="skeleton-line me-1 mb-1" style="width: 100px; height: 30px; border-radius: 0.5rem;"></div>
            <div class="skeleton-line me-1 mb-1" style="width: 70px; height: 30px; border-radius: 0.5rem;"></div>
          </div>
          <div class="project-description mb-5">
            <div class="skeleton-line skeleton-subtitle"></div>
            <div class="skeleton-line skeleton-subtitle" style="width: 90%;"></div>
            <div class="skeleton-line skeleton-subtitle" style="width: 75%;"></div>
          </div>
          <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <div class="skeleton-line" style="width: 180px; height: 48px; border-radius: 0.75rem;"></div>
            <div class="skeleton-line" style="width: 180px; height: 48px; border-radius: 0.75rem;"></div>
          </div>
          <div class="text-center">
            <div class="skeleton-line skeleton-subtitle mx-auto" style="width: 200px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state with glassmorphic styling -->
    <div v-else-if="error" class="container py-5">
      <div class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Error Loading Project</h5>
          <p class="card-text text-light opacity-75">
            {{ error.message || 'Could not fetch the project details. It might not exist or there was a server error.' }}
          </p>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <router-link to="/projects" class="btn btn-outline-light glass-btn">
              <i class="bi bi-arrow-left me-2"></i>Back to Projects
            </router-link>
            <button @click="retryLoad" class="btn btn-outline-primary glass-btn">
              <i class="bi bi-arrow-clockwise me-2"></i>Retry
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="project">
      <!-- Hero Image Section -->
      <div class="hero-image-container animate-fade-in" :style="{ backgroundImage: `url(${project.imageUrl})` }">
        <div class="hero-overlay"></div>
      </div>

      <div class="container content-container">
        <!-- Main Content Card -->
        <div class="card glass-card glass-card-floating p-4 p-md-5 animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
          <!-- Header -->
          <div class="text-center mb-4">
            <h1 class="display-4 fw-bold glass-title">{{ project.title }}</h1>
          </div>

          <!-- Tech Stack -->
          <div v-if="project.techStack && project.techStack.length" class="text-center mb-4">
            <span v-for="tech in project.techStack" :key="tech" class="badge tech-badge me-2 mb-2">
              {{ tech }}
            </span>
          </div>

          <!-- Description -->
          <div class="project-description mb-5">
            <p class="glass-description">{{ project.description }}</p>
          </div>

          <!-- Links Section -->
          <div v-if="project.liveUrl || project.repoUrl" class="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="btn glass-btn-primary btn-lg interactive-lift">
              <i class="bi bi-box-arrow-up-right me-2"></i> Live Demo
            </a>
            <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="btn glass-btn btn-lg interactive-lift">
              <i class="bi bi-github me-2"></i> Source Code
            </a>
          </div>

          <div class="text-center">
            <router-link to="/projects" class="btn btn-link glass-subtitle">
              <i class="bi bi-arrow-left me-1"></i> Back to All Projects
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found state with glassmorphic styling -->
    <div v-else-if="!isLoading" class="container py-5">
      <div class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-question-circle-fill text-info mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Project Not Found</h5>
          <p class="card-text text-light opacity-75">
            The project you are looking for does not exist or has been moved.
          </p>
          <router-link to="/projects" class="btn btn-outline-light glass-btn mt-4">
            <i class="bi bi-arrow-left me-2"></i>Back to All Projects
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPublicProjectById, ApiError } from '@/services/api/index.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

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

const loadProject = async () => {
  isLoading.value = true;
  error.value = null;
  try {
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
};

const retryLoad = () => {
  loadProject();
};

onMounted(loadProject);
</script>

<style scoped>
.project-details-page {
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

.project-description {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap; /* Respects newlines in the description */
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.2s forwards; /* Added delay */
}

/*
  All skeleton and badge styles are now handled by global classes in common.css,
  so local styles can be removed for a cleaner component.
*/
</style>
