<template>
  <div class="skills-page py-4">
    <div class="container-fluid">
      <h1 class="mb-4 display-5">Skills</h1>
      <p class="lead mb-5">Explore the diverse skill set showcased on ForkMyFolio.</p>

      <LoadingSpinner v-if="isLoading" />

      <div v-else-if="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error Loading Skills</h4>
        <p>{{ error.message || 'Could not fetch skills. Please try again later.' }}</p>
        <hr v-if="error.errors && error.errors.length > 0">
        <ul v-if="error.errors && error.errors.length > 0" class="mb-0">
          <li v-for="(err, index) in error.errors" :key="index">
            {{ err.field ? `(${err.field}) ` : '' }}{{ err.message }}
          </li>
        </ul>
      </div>

      <div v-else-if="skills && skills.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div v-for="skill in skills" :key="skill.id" class="col">
          <div class="card h-100 shadow-sm text-center">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 class="card-title mb-2">{{ skill.name }}</h5>
              <span :class="`badge bg-${getBadgeColorForLevel(skill.level)}`">{{ skill.level }}</span>
              <!-- Uncomment to display dates
              <small class="text-muted mt-2" v-if="skill.createdAt">
                Added: {{ formatDate(skill.createdAt, { year: 'numeric', month: 'short' }) }}
              </small>
              -->
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h2 class="display-6">No Skills Yet</h2>
        <p class="lead text-muted">No skills have been added yet. Check back later!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * @file src/views/SkillsPage.vue
 * @description Page to display a list of all skills.
 * Fetches and shows skills from the backend with loading and error states.
 */
import { ref, onMounted } from 'vue';
import { getSkills } from '../services/apiService';
import { ApiError } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import { formatDate } from '../utils'; // Assuming this path is correct and utils/index.js exports it

/** @type {import('vue').Ref<Array<object>>} SkillDto list */
const skills = ref([]);
/** @type {import('vue').Ref<boolean>} */
const isLoading = ref(true);
/** @type {import('vue').Ref<ApiError|Error|null>} */
const error = ref(null);

/**
 * Fetches skills from the API.
 */
const fetchSkills = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // getSkills from apiService is expected to return the unwrapped List<SkillDto>
    const data = await getSkills();
    skills.value = data || []; // Ensure skills is an array even if data is null/undefined
  } catch (err) {
    console.error('Failed to fetch skills:', err);
    if (err instanceof ApiError) {
      error.value = err;
    } else {
      error.value = { message: err.message || 'An unexpected error occurred while fetching skills.' };
    }
    skills.value = []; // Clear skills on error
  } finally {
    isLoading.value = false;
  }
};

// Fetch skills when the component is mounted
onMounted(fetchSkills);

/**
 * Determines the Bootstrap badge background color based on skill level.
 * @param {string} level - The skill level ('BEGINNER', 'INTERMEDIATE', 'EXPERT').
 * @returns {string} The Bootstrap background color class (e.g., 'success', 'primary', 'warning').
 */
const getBadgeColorForLevel = (level) => {
  switch (level?.toUpperCase()) {
    case 'EXPERT':
      return 'danger'; // Or 'success' if expert is considered positive
    case 'INTERMEDIATE':
      return 'primary'; // Or 'warning'
    case 'BEGINNER':
      return 'secondary'; // Or 'info'
    default:
      return 'light'; // Fallback for unknown levels
  }
};
</script>

<style scoped>
.skills-page h1, .skills-page .display-5 {
  font-weight: 300;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15) !important;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.7em;
}
</style>
