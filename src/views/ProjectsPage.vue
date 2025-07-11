<template>
  <div class="projects-page py-5">
    <div class="container-fluid">
      <!-- KEY CHANGE: Centered and restyled hero section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up">💻 Projects Showcase</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          A curated collection of my work, from professional applications to personal experiments.
        </p>
      </div>

      <LoadingModal :visible="isLoading"/>

      <div v-if="!isLoading">
        <div v-if="error" class="alert alert-danger shadow-sm" role="alert">
          <h4 class="alert-heading">🚫 Error Loading Projects</h4>
          <p>{{ error.message || 'Could not fetch projects. Please try again later.' }}</p>
        </div>

        <div v-else-if="projects && projects.length > 0"
             class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="(project, index) in projects" :key="project.uuid"
               class="col animate-fade-in-up"
               :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }">
            <router-link :to="{ name: 'project-details', params: { uuid: project.uuid } }"
                         class="project-card-link">
              <div class="card h-100 shadow-sm">
                <div class="card-img-container">
                  <img
                    v-if="project.imageUrl"
                    :alt="project.title"
                    :src="project.imageUrl"
                    class="card-img-top"
                  >
                  <div v-else class="card-img-top project-image-placeholder">
                    <i class="bi bi-image"></i>
                  </div>
                  <div class="card-img-overlay">
                    <div class="icon"><i class="bi bi-box-arrow-up-right"></i></div>
                    <div class="text">View Project</div>
                  </div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ project.title }}</h5>
                  <!-- KEY CHANGE: Description length increased to 180 -->
                  <p class="card-text text-muted small">
                    {{
                      project.description?.substring(0, 180)
                    }}{{ project.description?.length > 180 ? '...' : '' }}
                  </p>

                  <div v-if="project.techStack && project.techStack.length" class="mt-auto pt-2">
                    <span v-for="tech in project.techStack" :key="tech"
                          class="badge me-1 mb-1">{{ tech }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-kanban display-1 text-muted mb-3"></i>
          <h2 class="display-6">No Projects Yet</h2>
          <p class="lead text-muted">Check back later to see new projects!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ApiError, getPublicProjects} from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';

const projects = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchProjects = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await getPublicProjects();
    projects.value = data || [];
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    if (err instanceof ApiError) {
      error.value = err;
    } else {
      error.value = {message: err.message || 'An unexpected error occurred while fetching projects.'};
    }
    projects.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProjects);
</script>

<style scoped>
/* --- Page Styling --- */
.projects-page {
  /* NEW: Animated Aurora Background */
  background: linear-gradient(125deg, var(--bs-body-bg), var(--bs-tertiary-bg), var(--bs-body-bg));
  background-size: 200% 200%;
  animation: animated-gradient 20s ease infinite;
  overflow-x: hidden;
}

.projects-page h1, .projects-page .display-5, .projects-page .display-6 {
  font-weight: 300;
}

/* --- Animations --- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* --- Link Wrapper for Card --- */
.project-card-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.project-card-link:hover {
  color: inherit;
}

/* --- Enhanced Card Styling --- */
.card {
  /* Glassmorphism effect */
  background: rgba(var(--bs-tertiary-bg-rgb), 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
}

.project-card-link:hover .card {
  transform: translateY(-8px);
  /* NEW: Primary color glow on hover */
  box-shadow: 0 8px 32px 0 rgba(var(--bs-primary-rgb), 0.3) !important;
}

.card-img-container {
  height: 200px;
  overflow: hidden;
  position: relative;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card-link:hover .card-img-top {
  transform: scale(1.1);
}

.project-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-secondary-color);
  font-size: 3rem;
  opacity: 0.5;
}

/* --- Image Overlay Styling --- */
.card-img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--bs-primary-rgb), 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.project-card-link:hover .card-img-overlay {
  opacity: 1;
}

.card-img-overlay .icon {
  font-size: 2.75rem;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.project-card-link:hover .card-img-overlay .icon {
  /* NEW: Icon animation */
  transform: scale(1.1) rotate(5deg);
}

.card-img-overlay .text {
  font-weight: 500;
}


/* --- Badge Styling --- */
.badge {
  font-weight: 500;
  /* NEW: Refined padding and colors */
  padding: 0.4em 0.7em;
  background-color: rgba(var(--bs-body-color-rgb), 0.1) !important;
  color: var(--bs-emphasis-color) !important;
  border: 1px solid transparent;
}
</style>
