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
            <div
              class="card-body py-3 d-flex flex-column justify-content-center align-items-center">
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
      <div v-else-if="groupedByLevel.length > 0">
        <div
          v-for="(levelGroup, levelIndex) in groupedByLevel"
          :key="levelGroup.name"
          :style="{ 'animation-delay': (levelIndex * 0.2) + 's' }"
          class="mb-5 animate-fade-in-up text-center"
        >
          <!-- FIX: Increased bottom margin from mb-4 to mb-5 for more spacing -->
          <h2 :data-level="levelGroup.levelKey"
              class="display-5 mb-5 fw-bold glass-text level-heading">
            {{ levelGroup.name }}
          </h2>

          <div
            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3 skill-col">
            <div
              v-for="(skill, skillIndex) in levelGroup.skills"
              :key="skill.uuid"
              :style="{ 'animation-delay': (levelIndex * 0.2 + skillIndex * 0.05) + 0.2 + 's' }"
              class="col animate-fade-in-up"
            >
              <div
                class="card glass-card glass-card-floating h-100 text-center shadow-sm interactive-card-lift interactive-card-shadow-primary"
              >
                <div v-if="skill.category" :title="skill.category" class="category-icon"
                     data-bs-toggle="tooltip">
                  <i :class="getCategoryIcon(skill.category)"></i>
                </div>

                <div
                  class="card-body py-3 d-flex flex-column justify-content-start align-items-center">
                  <div class="skill-icon mb-3">
                    <i :class="getIconClass(skill)"/>
                  </div>
                  <h6 class="card-title">{{ skill.name }}</h6>
                  <p v-if="skill.description" class="card-text small text-body-secondary px-2">
                    {{ skill.description }}</p>
                  <p v-else class="card-text small text-body-secondary px-2">&nbsp;</p>
                  <!-- FIX: Removed .toLowerCase() to match the uppercase CSS selectors -->
                  <div
                    :data-level="skill.level"
                    :title="skill.level.charAt(0).toUpperCase() + skill.level.slice(1).toLowerCase()"
                    class="proficiency-indicator"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
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
import {computed, onMounted, onUpdated} from 'vue';
import {usePublicPortfolioStore} from '@/stores/publicPortfolioStore.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import {Tooltip} from 'bootstrap';

const {portfolio, isLoading, error} = usePublicPortfolioStore();
const skills = computed(() => portfolio.value?.skills || []);

// --- Tooltip Initialization ---
onMounted(() => initializeTooltips());
onUpdated(() => initializeTooltips());

function initializeTooltips() {
  // Dispose of old tooltips to prevent memory leaks
  const oldTooltips = document.querySelectorAll('.tooltip');
  oldTooltips.forEach(t => t.remove());

  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new Tooltip(tooltipTriggerEl, {
      container: 'body', // Append tooltips to body to avoid z-index issues
      trigger: 'hover',
    });
  });
}

// --- Icon Rendering Logic ---

// Smart icon class renderer (handles FA, Devicon, etc.)
const faBrandIcons = new Set([
  'fa-java', 'fa-js', 'fa-vuejs', 'fa-react', 'fa-angular', 'fa-node-js',
  'fa-python', 'fa-php', 'fa-html5', 'fa-css3-alt', 'fa-git-alt',
  'fa-github', 'fa-linkedin', 'fa-docker', 'fa-bootstrap'
]);

const levelColorClasses = {
  EXPERT: 'text-success',
  ADVANCED: 'text-info',
  INTERMEDIATE: 'text-primary',
  BEGINNER: 'text-warning',
  DEFAULT: 'text-muted',
};

const levelDefaultIcons = {
  EXPERT: 'bi bi-trophy-fill',
  ADVANCED: 'bi bi-lightning-charge-fill',
  INTERMEDIATE: 'bi bi-tools',
  BEGINNER: 'bi bi-lightbulb-fill',
  DEFAULT: 'bi bi-gear-wide-connected',
};

const getIconClass = (skill) => {
  const icon = skill.icon;
  const level = skill.level || 'DEFAULT';
  const colorClass = levelColorClasses[level] || levelColorClasses.DEFAULT;

  let baseIconClass;

  if (!icon) {
    // If no specific icon is provided, use the default icon for the level.
    baseIconClass = levelDefaultIcons[level] || levelDefaultIcons.DEFAULT;
  } else {
    // A specific icon is provided, so format it correctly.
    if (icon.startsWith('devicon-') || icon.startsWith('bi-') || icon.includes(' ')) {
      baseIconClass = icon;
    } else if (icon.startsWith('fa-')) {
      baseIconClass = faBrandIcons.has(icon) ? `fa-brands ${icon}` : `fa-solid ${icon}`;
    } else {
      baseIconClass = icon;
    }
  }

  // Combine the icon shape with the level-based color.
  return `${baseIconClass} ${colorClass}`;
};

const categoryIcons = {
  'Frontend': 'bi bi-display-fill',
  'Backend': 'bi bi-server',
  'Programming Language': 'bi bi-code-slash',
  'Framework': 'bi bi-box-seam-fill',
  'DevOps': 'bi bi-cloud-arrow-up-fill',
  'Database': 'bi bi-stack',
  'Methodology': 'bi bi-diagram-3-fill',
  'default': 'bi bi-tag-fill'
};
const getCategoryIcon = (category) => {
  if (!category) return '';
  const key = Object.keys(categoryIcons).find(k => k.toLowerCase() === category.toLowerCase().trim());
  return categoryIcons[key] || categoryIcons.default;
};


// --- Data Grouping ---
const SKILL_LEVELS = {
  EXPERT: 'Expert',
  ADVANCED: 'Advanced',
  INTERMEDIATE: 'Intermediate',
  BEGINNER: 'Beginner',
};
const groupedByLevel = computed(() => {
  if (!skills.value || skills.value.length === 0) return [];

  return skills.value.reduce((acc, skill) => {
    // Ensure every skill has a valid level, defaulting to 'INTERMEDIATE'.
    const level = skill.level || 'INTERMEDIATE';

    // Find the group for the current skill's level.
    let group = acc.find(g => g.levelKey === level);

    // If the group doesn't exist, create it.
    if (!group) {
      group = {
        name: SKILL_LEVELS[level] || 'Intermediate',
        levelKey: level,
        skills: []
      };
      acc.push(group);
    }

    // FIX: Create a new skill object for the view with a guaranteed, non-null level.
    // This prevents the template from ever receiving a null value for 'skill.level'.
    const skillForView = {
      ...skill,
      level: level,
    };
    group.skills.push(skillForView);

    return acc;
  }, [])
    // Sort the groups according to the predefined order.
    .sort((a, b) => {
      const orderA = Object.keys(SKILL_LEVELS).indexOf(a.levelKey);
      const orderB = Object.keys(SKILL_LEVELS).indexOf(b.levelKey);
      return orderA - orderB;
    });
});
</script>

<style scoped>
.skills-page {
  overflow-x: hidden;
}

.level-heading {
  position: relative;
  display: inline-block;
  padding-bottom: 0.75rem;
}

.level-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 2px;
}

.level-heading[data-level='EXPERT']::after {
  background: linear-gradient(90deg, var(--bs-success), var(--bs-success-text-emphasis));
}

.level-heading[data-level='ADVANCED']::after {
  background: linear-gradient(90deg, var(--bs-info), var(--bs-info-text-emphasis));
}

.level-heading[data-level='INTERMEDIATE']::after {
  background: linear-gradient(90deg, var(--bs-primary), var(--bs-primary-text-emphasis));
}

.level-heading[data-level='BEGINNER']::after {
  background: linear-gradient(90deg, var(--bs-warning), var(--bs-warning-text-emphasis));
}

.skill-icon {
  font-size: 2rem;
  /* The animation on hover provides a more engaging effect than a simple transition. */
}

.card:hover .skill-icon {
  /* Add the fa-beat-fade animation on hover for a more dynamic effect. */
  animation: beat-fade-effect 1s ease-in-out infinite;
}

.card-text {
  font-size: 0.75rem;
  line-height: 1.4;
  min-height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: auto;
}

.proficiency-indicator {
  width: 80%;
  height: 6px;
  margin-top: 0.5rem;
  border-radius: 4px;
  /* FIX: Use a theme-aware background color for better contrast in light mode */
  background-color: var(--bs-secondary-bg);
  overflow: hidden;
  position: relative;
  margin-top: auto;
}

.proficiency-indicator::after {
  content: '';
  position: absolute;
  left: 0;
  height: 100%;
  width: 0;
  border-radius: 4px;
  animation: fill-bar 1s ease-out 0.5s forwards;
}

.proficiency-indicator[data-level='EXPERT']::after {
  --target-width: 100%;
  background: linear-gradient(90deg, var(--bs-success), var(--bs-success-text-emphasis));
  box-shadow: 0 0 8px var(--bs-success);
}

.proficiency-indicator[data-level='ADVANCED']::after {
  --target-width: 80%;
  background: linear-gradient(90deg, var(--bs-info), var(--bs-info-text-emphasis));
  box-shadow: 0 0 8px var(--bs-info);
}

.proficiency-indicator[data-level='INTERMEDIATE']::after {
  --target-width: 60%;
  background: linear-gradient(90deg, var(--bs-primary), var(--bs-primary-text-emphasis));
  box-shadow: 0 0 8px var(--bs-primary);
}

.proficiency-indicator[data-level='BEGINNER']::after {
  --target-width: 35%;
  background: linear-gradient(90deg, var(--bs-warning), var(--bs-warning-text-emphasis));
  box-shadow: 0 0 8px var(--bs-warning);
}

.card:hover .proficiency-indicator::after {
  animation: reset-and-fill 1.2s ease-out forwards;
}

.skill-col .card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-icon {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 1rem;
  color: var(--bs-secondary-color);
  opacity: 0.5;
  transition: all 0.3s ease;
  cursor: help;
  z-index: 10;
}

.card:hover .category-icon {
  opacity: 1;
  transform: scale(1.1);
}

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


@keyframes reset-and-fill {
  0% {
    width: 0;
  }
  20% {
    width: 0;
  }
  100% {
    width: var(--target-width);
  }
}

/* Add the keyframes for the beat-fade animation */
@keyframes beat-fade-effect {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    /* This now includes the more pronounced "grow" effect you wanted */
    transform: scale(1.2);
    opacity: 0.4;
  }
}
</style>
