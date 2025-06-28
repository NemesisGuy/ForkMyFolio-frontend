<template>
  <div class="skills-page py-4">
    <div class="container-fluid">
      <h1 class="mb-4 display-5">Skills</h1>
      <p class="lead mb-5">A curated list of technologies and competencies.</p>

      <LoadingSpinner v-if="isLoading"/>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error Loading Skills</h4>
        <p>{{ error.message || 'Could not fetch skills. Please try again later.' }}</p>
      </div>

      <div v-else-if="skills && skills.length > 0"
           class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        <div v-for="skill in skills" :key="skill.id" class="col">
          <div class="card h-100 shadow-sm text-center">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 class="card-title mb-2">{{ skill.name }}</h5>
              <span :class="getSkillBadgeClass(skill.level)" class="badge">
                {{ skill.level.charAt(0).toUpperCase() + skill.level.slice(1).toLowerCase() }}
              </span>
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
 */
import {onMounted, ref} from 'vue';
import {ApiError, getPublicSkills} from '@/services/api';
import {getSkillBadgeClass} from '@/utils/skillUtils';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const skills = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchSkills = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await getPublicSkills();

    // Sort skills by proficiency and then alphabetically
    const levelOrder = {'EXPERT': 1, 'INTERMEDIATE': 2, 'BEGINNER': 3};
    skills.value = (data || []).sort((a, b) => {
      const levelComparison = (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
      if (levelComparison !== 0) return levelComparison;
      return a.name.localeCompare(b.name);
    });

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
.skills-page h1, .skills-page .display-5 {
  font-weight: 300;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .15) !important;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.7em;
}
</style>
