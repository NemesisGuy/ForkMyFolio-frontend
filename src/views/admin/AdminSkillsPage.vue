<template>
  <div class="admin-skills-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Skill Management</h1>

      <LoadingModal :visible="isLoading" />
      <ErrorModal v-if="error.message" :visible="showErrorModal" :title="error.title" :message="error.message" @close="closeErrorModal" />
      <ConfirmModal
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the skill: '${skillToDelete?.name}'?`"
        @confirm="executeDelete"
        @cancel="cancelDelete"
      />

      <div class="row g-5">
        <!-- Add New Skill Form -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">Add New Skill</h5>
              <form @submit.prevent="handleCreateSkill">
                <!-- Skill Name Input -->
                <div class="mb-3">
                  <label for="skillName" class="form-label">Skill Name</label>
                  <input type="text" class="form-control" id="skillName" v-model="newSkill.name" required>
                </div>

                <!-- START: Skill Level Dropdown -->
                <div class="mb-3">
                  <label for="skillLevel" class="form-label">Proficiency Level</label>
                  <select class="form-select" id="skillLevel" v-model="newSkill.level" required>
                    <option v-for="level in skillLevels" :key="level" :value="level">
                      {{ level.charAt(0).toUpperCase() + level.slice(1).toLowerCase() }}
                    </option>
                  </select>
                </div>
                <!-- END: Skill Level Dropdown -->

                <button type="submit" class="btn btn-primary w-100" :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  {{ isSaving ? 'Adding...' : 'Add Skill' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Existing Skills List -->
        <div class="col-lg-8">
          <div v-if="!isLoading && skills.length > 0" class="card shadow-sm">
            <div class="card-header">
              Existing Skills
            </div>
            <ul class="list-group list-group-flush">
              <!-- UPDATED: Display skill level -->
              <li v-for="skill in skills" :key="skill.id" class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {{ skill.name }}
                  <span class="badge rounded-pill ms-2" :class="getSkillBadgeClass(skill.level)">
                    {{ skill.level }}
                  </span>
                </span>
                <button class="btn btn-sm btn-outline-danger" @click="requestDelete(skill)" title="Delete Skill">
                  <i class="bi bi-x-lg"></i>
                </button>
              </li>
            </ul>
          </div>
          <div v-else-if="!isLoading && !error.message" class="text-center py-5">
            <p class="lead text-muted">No skills found. Add one to get started!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllSkills, createSkill, deleteSkill, ApiError } from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';

const skills = ref([]);
// UPDATED: Initialize newSkill with a default level
const newSkill = reactive({ name: '', level: 'INTERMEDIATE' });
const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT']; // From SkillLevel enum

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref({ title: '', message: '' });
const showErrorModal = ref(false);

const showDeleteConfirmModal = ref(false);
const skillToDelete = ref(null);

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = { title: '', message: '' };
};

const fetchSkills = async () => {
  isLoading.value = true;
  try {
    // Sort skills alphabetically for better display
    const fetchedSkills = await getAllSkills();
    skills.value = fetchedSkills.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Failed to fetch skills:", err);
    error.value = {
      title: 'Failed to Load Skills',
      message: err instanceof ApiError ? err.message : 'An unexpected error occurred.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleCreateSkill = async () => {
  if (!newSkill.name.trim()) return;
  isSaving.value = true;
  try {
    // UPDATED: Send the complete newSkill object
    await createSkill({ name: newSkill.name, level: newSkill.level });
    // UPDATED: Reset the form
    newSkill.name = '';
    newSkill.level = 'INTERMEDIATE';
    await fetchSkills(); // Refresh the list
  } catch (err) {
    console.error("Failed to create skill:", err);
    error.value = {
      title: 'Creation Failed',
      message: err instanceof ApiError ? err.message : 'Could not create the skill. Please check the details and try again.'
    };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

const requestDelete = (skill) => {
  skillToDelete.value = skill;
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  skillToDelete.value = null;
};

const executeDelete = async () => {
  if (!skillToDelete.value) return;
  isLoading.value = true;
  try {
    await deleteSkill(skillToDelete.value.id);
    await fetchSkills(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete skill:", err);
    error.value = {
      title: 'Deletion Failed',
      message: err instanceof ApiError ? err.message : 'Could not delete the skill.'
    };
    showErrorModal.value = true;
  } finally {
    isLoading.value = false;
    cancelDelete();
  }
};

// ADDED: Helper function for styling skill level badges
const getSkillBadgeClass = (level) => {
  switch (level) {
    case 'EXPERT':
      return 'bg-primary';
    case 'INTERMEDIATE':
      return 'bg-success';
    case 'BEGINNER':
      return 'bg-secondary';
    default:
      return 'bg-light text-dark';
  }
};

onMounted(fetchSkills);
</script>

<style scoped>
.admin-skills-page h1 {
  font-weight: 300;
}
</style>
