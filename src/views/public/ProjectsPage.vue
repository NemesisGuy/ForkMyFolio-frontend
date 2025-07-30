<template>
  <div class="projects-page py-5 animated-gradient-background">
    <div class="container-fluid">
      <!-- Centered and restyled hero section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">
          <i class="bi bi-kanban" aria-hidden="true"></i> Projects Showcase
        </h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          A curated collection of my work, from professional applications to personal experiments.
        </p>
      </div>

      <LoadingModal :visible="isLoading" />

      <!-- Skeleton loader with new glass styles -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="n in 6"
             :key="n"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (n * 0.05) + 's' }">
          <div class="card h-100 glass-card glass-card-floating">
            <div class="card-img-top skeleton-line" style="height: 200px; border-radius: 1.5rem 1.5rem 0 0;"></div>
            <div class="card-body d-flex flex-column">
              <div class="skeleton-line skeleton-title" style="width: 60%;"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-subtitle" style="width: 80%;"></div>
              <div class="d-flex flex-wrap mt-auto pt-3">
                <div class="skeleton-line me-1 mb-1" style="width: 50px; height: 24px; border-radius: 0.25rem;"></div>
                <div class="skeleton-line me-1 mb-1" style="width: 70px; height: 24px; border-radius: 0.25rem;"></div>
                <div class="skeleton-line me-1 mb-1" style="width: 60px; height: 24px; border-radius: 0.25rem;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state with glassmorphic styling -->
      <div v-else-if="error" class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Projects</h5>
          <p class="card-text text-light opacity-75">
            Could not load projects data. Please try again later.
          </p>
        </div>
      </div>

      <div v-else-if="projects && projects.length > 0"
           class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="(project, index) in projects" :key="project.uuid"
             class="col animate-fade-in-up"
             :style="{ 'animation-delay': (index * 0.1) + 0.2 + 's' }">
          <router-link :to="{ name: 'project-details', params: { uuid: project.uuid } }"
                       class="project-card-link interactive-card-lift interactive-card-shadow-primary">
            <div class="card h-100 glass-card glass-card-floating">
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
                <h5 class="card-title glass-title">{{ project.title }}</h5>
                <p class="card-text small glass-description">
                  {{
                    project.description?.substring(0, 180)
                  }}{{ project.description?.length > 180 ? '...' : '' }}
                </p>

                <div v-if="project.skills && project.skills.length" class="mt-auto pt-2">
                  <span v-for="skill in project.skills" :key="skill.uuid" class="badge tech-badge me-1 mb-1">
                    <i v-if="skill.icon" :class="skill.icon" class="me-1"></i>
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- --- THIS IS THE FIX --- -->
      <!-- Enhanced empty state with a helpful tip for the owner -->
      <div v-else class="glass-card mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-kanban"></i>
          </div>
          <h4 class="card-title glass-title mb-3">No Projects Yet</h4>

          <!-- Generic message for public visitors -->
          <p v-if="!isOwner" class="card-text glass-subtitle mb-4">
            New projects are in the pipeline. Please check back later to see the showcase.
          </p>

          <!-- Helpful tip for the portfolio owner -->
          <div v-else class="alert alert-info mt-3">
            <p class="mb-1"><strong>Hey there!</strong> It looks like you don't have any projects visible on your public page.</p>
            <p class="mb-0">
              Go to your <router-link :to="{ name: 'my-projects', params: { slug: currentSlug } }">Project Management</router-link> page to add new projects or make existing ones visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePublicPortfolioStore } from '@/stores/publicPortfolioStore.js';
import { authService } from '@/services/authService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

// Use the central store for all data
const { portfolio, isLoading, error, currentSlug } = usePublicPortfolioStore();

// Projects are now a computed property from the store's portfolio
const projects = computed(() => {
  const projs = portfolio.value?.projects || [];
  // Sort by displayOrder ascending (lower number first)
  return projs.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
});

// --- THIS IS THE FIX ---
// Check if the currently logged-in user is the owner of this portfolio
const isOwner = computed(() => {
  return authService.isAuthenticated.value && authService.user.value?.slug === currentSlug.value;
});

// All local data fetching logic (fetchProjects, onMounted, etc.) has been removed.
// The router guard is now the single source of truth for data fetching.
</script>

<style scoped>
/* --- Page Styling --- */
.projects-page {
  overflow-x: hidden;
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

/* --- Link Wrapper for Card --- */
.project-card-link {
  display: block;
  height: 100%;
  text-decoration: none;
  color: inherit;
  border-radius: 1rem;
  /* The interactive classes will apply their transitions */
}

.project-card-link:hover {
  color: inherit;
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
  background-color: var(--glass-bg);
  color: var(--glass-text-secondary);
  font-size: 3rem;
  opacity: 0.8;
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
  transform: scale(1.1) rotate(5deg);
}

.card-img-overlay .text {
  font-weight: 500;
}


/* --- Badge Styling --- */
.tech-badge {
  font-weight: 500;
  padding: 0.4em 0.7em;
  background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
  color: var(--bs-primary) !important;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  opacity: 0.6;
}
</style>
