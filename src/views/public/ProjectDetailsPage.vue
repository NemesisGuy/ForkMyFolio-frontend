<template>
  <!-- The root element correctly uses the global animated background class -->
  <div class="project-details-page animated-gradient-background">
    <LoadingModal :visible="isLoading" class="glass-modal"/>

    <!-- Skeleton Loader with new glass styles -->
    <div v-if="isLoading">
      <div class="hero-image-container skeleton-line"></div>
      <div class="container content-container">
        <div class="card glass-card glass-card-floating p-4 p-md-5">
          <!-- ... skeleton content ... -->
        </div>
      </div>
    </div>

    <!-- Error state with glassmorphic styling -->
    <div v-else-if="error" class="container py-5">
      <!-- ... error content ... -->
    </div>

    <div v-else-if="project">
      <!-- Hero Image Section -->
      <div :style="{ backgroundImage: `url(${project.imageUrl})` }"
           class="hero-image-container animate-fade-in">
        <div class="hero-overlay"></div>
      </div>

      <div class="container content-container">
        <!-- Main Content Card -->
        <div
          class="card glass-card glass-card-floating p-4 p-md-5 animate-fade-in-up interactive-card-lift interactive-card-shadow-primary">
          <!-- Header -->
          <div class="text-center mb-4">
            <h1 class="display-4 fw-bold glass-title">{{ project.title }}</h1>
          </div>

          <!-- Tech Stack -->
          <div v-if="project.skills && project.skills.length"
               class="text-center mb-4 d-flex flex-wrap justify-content-center gap-2">
            <!-- FIX: Replaced with the new SkillBadge component -->
            <!-- FIX: The key should be `skill.skillId` for consistency with other pages
                 like UserProjectsPage and ExperiencePage, which use the same data structure. -->
            <SkillBadge
              v-for="skill in project.skills"
              :key="skill.skillId"
              :skill="skill"
              class="tech-badge"
            />
          </div>

          <!-- Description -->
          <div class="project-description mb-5">
            <p class="glass-description">{{ project.description }}</p>
          </div>

          <!-- Links Section -->
          <div v-if="project.liveUrl || project.repoUrl"
               class="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <a v-if="project.liveUrl" :href="project.liveUrl"
               class="btn glass-btn-primary btn-lg interactive-lift"
               target="_blank">
              <i class="bi bi-box-arrow-up-right me-2"></i> Live Demo
            </a>
            <a v-if="project.repoUrl" :href="project.repoUrl"
               class="btn glass-btn btn-lg interactive-lift"
               target="_blank">
              <i class="bi bi-github me-2"></i> Source Code
            </a>
          </div>

          <div class="text-center">
            <router-link :to="{ name: 'projects-public', params: { slug: currentSlug } }"
                         class="btn btn-link glass-subtitle">
              <i class="bi bi-arrow-left me-1"></i> Back to All Projects
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found state with glassmorphic styling -->
    <div v-else-if="!isLoading" class="container py-5">
      <!-- ... not found content ... -->
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ApiError} from '@/services/api/index.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
// FIX: Import the new SkillBadge component
import SkillBadge from '@/components/common/SkillBadge.vue';

const props = defineProps({
  uuid: {
    type: String,
    required: true
  }
});

const project = ref(null);
const isLoading = ref(true);
const error = ref(null);

const {portfolio, currentSlug} = usePublicPortfolioStore();

// All tooltip logic has been removed from here and is now in SkillBadge.vue

const loadProject = async () => {
  isLoading.value = true;
  error.value = null;

  if (portfolio.value) {
    const foundProject = portfolio.value.projects?.find(p => p.uuid === props.uuid);
    if (foundProject) {
      project.value = foundProject;
    } else {
      error.value = {message: `Project with ID ${props.uuid} not found in this portfolio.`};
    }
    isLoading.value = false;
    return;
  }

  // Fallback logic remains the same
  console.warn('[ProjectDetails] Portfolio not in store. This should be handled by the router guard. Falling back to direct API call.');
  try {
    const {getPublicProjectById} = await import('@/services/api/index.js');
    project.value = await getPublicProjectById(props.uuid);
  } catch (err) {
    console.error(`Failed to fetch project with UUID ${props.uuid}:`, err);
    error.value = err instanceof ApiError ? err : {message: 'An unexpected error occurred.'};
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
/* --- Local styles remain the same, but badge styles are now in the component --- */
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
  margin-top: -15vh;
  position: relative;
  z-index: 2;
}

.project-description {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
}

/* Overriding the component's margin for this specific layout */
.tech-badge {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
