<template>
  <div class="skills-page py-5 animated-gradient-background">
    <div class="container-fluid">
      <!-- Hero Section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up glass-text">
          <i aria-hidden="true" class="bi bi-tools"></i> Skills & Proficiencies
        </h1>
        <p class="lead animate-fade-in-up glass-subtitle" style="animation-delay: 0.1s;">
          A curated list of my technical competencies and tools I love to use.
        </p>
      </div>

      <LoadingModal :visible="isLoading"/>

      <!-- Skeleton loader -->
      <div v-if="isLoading" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div v-for="n in 8" :key="n" class="col">
          <div class="card glass-card glass-card-floating h-100 text-center">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <div class="skeleton-icon mb-3"></div>
              <div class="skeleton-line skeleton-title" style="width: 70%;"></div>
              <div class="skeleton-line skeleton-subtitle" style="width: 80%; height: 8px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="glass-card glass-card-dark mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <i class="bi bi-exclamation-triangle-fill text-warning mb-3" style="font-size: 3rem;"></i>
          <h5 class="card-title text-white mb-3">Unable to Load Skills</h5>
          <p class="card-text text-light opacity-75">
            Could not load skills data. Please try again later.
          </p>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="groupedSkills.length > 0">
        <div v-for="(group, groupIndex) in groupedSkills" :key="group.name" class="mb-5">
          <h2 :style="{ 'animation-delay': (groupIndex * 0.2) + 's' }"
              class="display-6 mb-4 fw-light text-center animate-fade-in-up glass-text">
            {{ group.name }}
          </h2>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="(skill, skillIndex) in group.skills" :key="skill.uuid"
                 :style="{ 'animation-delay': (groupIndex * 0.2 + skillIndex * 0.05) + 0.2 + 's' }"
                 class="col animate-fade-in-up">
              <div
                class="card glass-card glass-card-floating h-100 text-center shadow-sm interactive-card-lift interactive-card-shadow-primary">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                  <div class="skill-icon mb-3">
                    <i :class="iconForLevel(skill.level)"/>
                  </div>
                  <h5 class="card-title">{{ skill.name }}</h5>
                  <div :data-level="skill.level.toLowerCase()"
                       :title="skill.level.charAt(0).toUpperCase() + skill.level.slice(1).toLowerCase()"
                       class="proficiency-indicator">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- The empty state is shown if loading is complete but there's no data -->
      <div v-else class="glass-card mx-auto" style="max-width: 800px;">
        <div class="card-body text-center p-5">
          <div class="empty-state-icon mb-4">
            <i class="bi bi-tools"></i>
          </div>
          <h4 class="card-title glass-title mb-3">No Skills Yet</h4>
          <p class="card-text glass-subtitle mb-4">
            The toolbox is being organized. Please check back later for a list of skills.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import {groupSkillsByLevel} from '@/services/skillsService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';

// Use the store to get reactive state.
const {portfolio, isLoading, error} = usePublicPortfolioStore();

// The skills are now a computed property derived from the central store.
const skills = computed(() => portfolio.value?.skills || []);

const iconForLevel = (level) => {
  switch (level) {
    case 'EXPERT':
      return 'bi bi-stars text-success';
    case 'ADVANCED':
      return 'bi bi-lightning-charge-fill text-info';
    case 'INTERMEDIATE':
      return 'bi bi-lightning-charge-fill text-primary';
    case 'BEGINNER':
      return 'bi bi-lightbulb-fill text-warning';
    default:
      return 'bi bi-gear-wide-connected text-muted';
  }
};

const groupedSkills = computed(() => groupSkillsByLevel(skills.value));
</script>

<style scoped>
/* --- Page Styling --- */
.skills-page {
  overflow-x: hidden;
}

.display-6 {
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 0.75rem;
  margin-bottom: 2rem !important;
}

/* --- Skill Card Styling --- */
.skill-icon {
  font-size: 2.75rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .skill-icon {
  transform: scale(1.2);
}

/* --- Proficiency Bar --- */
.proficiency-indicator {
  width: 80%;
  height: 8px;
  margin-top: 0.75rem;
  border-radius: 4px;
  background-color: rgba(var(--bs-body-color-rgb), 0.1);
  overflow: hidden;
  position: relative;
}

.proficiency-indicator::after {
  content: '';
  position: absolute;
  height: 100%;
  border-radius: 4px;
  width: 0;
  animation: fill-bar 1s ease-out 0.5s forwards;
}

.proficiency-indicator[data-level="expert"]::after {
  --target-width: 100%;
  background: linear-gradient(90deg, var(--bs-success), #28a745);
}

.proficiency-indicator[data-level="advanced"]::after {
  --target-width: 80%;
  background: linear-gradient(90deg, var(--bs-info), #0dcaf0);
}

.proficiency-indicator[data-level="intermediate"]::after {
  --target-width: 60%;
  background: linear-gradient(90deg, var(--bs-primary), #0d6efd);
}

.proficiency-indicator[data-level="beginner"]::after {
  --target-width: 35%;
  background: linear-gradient(90deg, var(--bs-warning), #ffc107);
}

/* --- General Animations --- */
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

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fill-bar {
  to {
    width: var(--target-width);
  }
}
</style>
