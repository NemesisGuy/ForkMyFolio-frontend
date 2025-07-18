<template>
  <div class="skills-page py-5">
    <div class="container-fluid">
      <!-- Hero Section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold animate-fade-in-up">🛠️ Skills & Proficiencies</h1>
        <p class="lead text-muted animate-fade-in-up" style="animation-delay: 0.1s;">
          A curated list of my technical competencies and tools I love to use.
        </p>
      </div>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger shadow-sm" role="alert">
        <h4 class="alert-heading">🚫 Error Loading Skills</h4>
        <p>{{ error.message || 'Could not fetch skills. Please try again later.' }}</p>
      </div>

      <div v-else-if="groupedSkills.length > 0">
        <div v-for="(group, groupIndex) in groupedSkills" :key="group.level" class="mb-5">
          <!-- KEY CHANGE: Updated header style -->
          <h2 class="display-6 mb-4 fw-light text-center animate-fade-in-up"
              :style="{ 'animation-delay': (groupIndex * 0.2) + 's' }">
            {{ group.level }}
          </h2>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="(skill, skillIndex) in group.skills" :key="skill.id"
                 class="col animate-fade-in-up"
                 :style="{ 'animation-delay': (groupIndex * 0.2 + skillIndex * 0.05) + 0.2 + 's' }">
              <!-- KEY CHANGE: Added dynamic class for hover glow -->
              <div class="card glass-card h-100 text-center shadow-sm" :class="`glow-on-hover-${skill.level.toLowerCase()}`">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                  <div class="skill-icon mb-3">
                    <i :class="iconForLevel(skill.level)"/>
                  </div>
                  <h5 class="card-title">{{ skill.name }}</h5>
                  <div class="proficiency-indicator" :data-level="skill.level.toLowerCase()"
                       :title="skill.level.charAt(0).toUpperCase() + skill.level.slice(1).toLowerCase()">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-tags-fill display-1 text-muted mb-3"></i>
        <h2 class="display-6">No Skills Yet</h2>
        <p class="lead text-muted">Come back soon — my toolbox grows weekly.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/SkillsPage.vue
 * @description A sexy, polished, and animated version of the skills listing page.
 */
import {onMounted, ref, computed} from 'vue';
import {getPublicSkills, ApiError} from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const skills = ref([]);
const isLoading = ref(true);
const error = ref(null);

const iconForLevel = (level) => {
  switch (level) {
    case 'EXPERT':
      return 'bi bi-stars text-success';
    case 'INTERMEDIATE':
      return 'bi bi-lightning-charge-fill text-primary';
    case 'BEGINNER':
      return 'bi bi-lightbulb-fill text-warning';
    default:
      return 'bi bi-gear-wide-connected text-muted';
  }
};

const groupedSkills = computed(() => {
  const groups = {EXPERT: [], INTERMEDIATE: [], BEGINNER: []};

  // Only proceed if skills.value is a valid array
  const sortedSkills = Array.isArray(skills.value)
    ? [...skills.value].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  sortedSkills.forEach(skill => {
    if (groups[skill.level]) {
      groups[skill.level].push(skill);
    }
  });

  return [
    { level: 'Expert', skills: groups.EXPERT },
    { level: 'Intermediate', skills: groups.INTERMEDIATE },
    { level: 'Beginner', skills: groups.BEGINNER },
  ].filter(group => group.skills.length > 0);
});



const fetchSkills = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    skills.value = await getPublicSkills() || [];
  } catch (err) {
    console.error('Failed to fetch skills:', err);
    error.value = err instanceof ApiError ? err : {message: 'An unexpected error occurred.'};
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSkills);
</script>

<style scoped>
/* --- Page Styling --- */
.skills-page {
  /* NEW: Animated Aurora Background */
  overflow-x: hidden;
}

.display-6 {
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 1rem;
  margin-bottom: 2rem !important;
  color: var(--bs-emphasis-color);
}

/* --- NEW: Dynamic Hover Glow --- */
.glass-card:hover {
  transform: var(--glass-card-hover-transform);
}
.glow-on-hover-expert:hover {
  box-shadow: 0 8px 32px 0 rgba(var(--bs-success-rgb), 0.3);
}
.glow-on-hover-intermediate:hover {
  box-shadow: var(--glass-card-hover-box-shadow);
}
.glow-on-hover-beginner:hover {
  box-shadow: 0 8px 32px 0 rgba(var(--bs-warning-rgb), 0.3);
}

/* --- Skill Icon --- */
.skill-icon {
  font-size: 2.75rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.glass-card:hover .skill-icon {
  transform: scale(1.2);
}

/* --- Card Title --- */
.card-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--bs-emphasis-color);
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
  /* NEW: Animate the bar filling up */
  width: 0;
  animation: fill-bar 1s ease-out 0.5s forwards;
}

.proficiency-indicator[data-level="expert"]::after {
  --target-width: 100%;
  background: linear-gradient(90deg, var(--bs-success), #28a745);
}
.proficiency-indicator[data-level="intermediate"]::after {
  --target-width: 66%;
  background: linear-gradient(90deg, var(--bs-primary), #0d6efd);
}
.proficiency-indicator[data-level="beginner"]::after {
  --target-width: 33%;
  background: linear-gradient(90deg, var(--bs-warning), #ffc107);
}

/* --- Animations --- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* NEW: Keyframe for proficiency bar fill */
@keyframes fill-bar {
  to {
    width: var(--target-width);
  }
}
</style>
