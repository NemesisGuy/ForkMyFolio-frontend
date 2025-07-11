<template>
  <div class="admin-skills-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Skill Management</h1>

      <LoadingModal :visible="isLoading"/>
      <ErrorModal v-if="error.message" :message="error.message" :title="error.title"
                  :visible="showErrorModal" @close="closeErrorModal"/>
      <ConfirmModal
        :message="`Are you sure you want to delete the skill: '${skillToDelete?.name}'?`"
        :visible="showDeleteConfirmModal"
        title="Confirm Deletion"
        @cancel="cancelDelete"
        @confirm="executeDelete"
      />
      <!-- ADDED: Success Modal for positive feedback -->
      <SuccessModal
        :visible="showSuccessModal"
        title="Success"
        :message="successMessage"
        @close="closeSuccessModal"
      />

      <div class="row g-5">
        <!-- Add New Skill Form -->
        <div class="col-lg-4">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title mb-3">Add New Skill</h5>
              <form @submit.prevent="handleCreateSkill">
                <div class="mb-3">
                  <label class="form-label" for="skillName">Skill Name</label>
                  <input id="skillName" v-model="newSkill.name" class="form-control" placeholder="e.g., Vue.js"
                         required type="text">
                </div>

                <div class="mb-3">
                  <label class="form-label" for="skillLevel">Proficiency Level</label>
                  <select id="skillLevel" v-model="newSkill.level" class="form-select" required>
                    <option v-for="level in skillLevels" :key="level" :value="level">
                      {{ level.charAt(0).toUpperCase() + level.slice(1).toLowerCase() }}
                    </option>
                  </select>
                </div>

                <button :disabled="isSaving" class="btn btn-primary w-100" type="submit">
                  <span v-if="isSaving" aria-hidden="true" class="spinner-border spinner-border-sm me-1"
                        role="status"></span>
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
              <li v-for="skill in skills" :key="skill.uuid"
                  class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {{ skill.name }}
                  <span :class="getSkillBadgeClass(skill.level)" class="badge rounded-pill ms-2">
                    {{ skill.level.toLowerCase() }}
                  </span>
                </span>
                <button class="btn btn-sm btn-outline-danger" title="Delete Skill"
                        @click="requestDelete(skill)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </li>
            </ul>
          </div>
          <EmptyState
            v-else-if="!isLoading && !error.message"
            icon-class="bi-tags-fill"
            message="Add a new skill using the form to get started."
            title="No Skills Found"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {ApiError, createSkill, deleteSkill, getPublicSkills} from '@/services/api';
import LoadingModal from '@/components/common/LoadingModal.vue';
import ErrorModal from '@/components/common/ErrorModal.vue';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
// ADDED: Import SuccessModal
import SuccessModal from '@/components/common/SuccessModal.vue';
import {getSkillBadgeClass} from '@/utils/skillUtils';

const skills = ref([]);
const newSkill = reactive({name: '', level: 'INTERMEDIATE'});
const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const isLoading = ref(true);
const isSaving = ref(false);

// Error state
const error = ref({title: '', message: ''});
const showErrorModal = ref(false);

// Delete confirmation state
const showDeleteConfirmModal = ref(false);
const skillToDelete = ref(null);

// ADDED: Success state
const showSuccessModal = ref(false);
const successMessage = ref('');

const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = {title: '', message: ''};
};

// ADDED: Function to close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false;
  successMessage.value = '';
};

const fetchSkills = async () => {
  isLoading.value = true;
  try {
    const fetchedSkills = await getPublicSkills();
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
    const createdSkillName = newSkill.name;
    await createSkill({name: newSkill.name, level: newSkill.level});
    successMessage.value = `Skill '${createdSkillName}' has been added successfully.`;
    showSuccessModal.value = true;
    newSkill.name = '';
    newSkill.level = 'INTERMEDIATE';
    await fetchSkills();
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
  isSaving.value = true;
  const deletedSkillName = skillToDelete.value.name;
  try {
    await deleteSkill(skillToDelete.value.uuid);
    successMessage.value = `Skill '${deletedSkillName}' has been deleted successfully.`;
    showSuccessModal.value = true;
    await fetchSkills();
  } catch (err) {
    console.error("Failed to delete skill:", err);
    error.value = {
      title: 'Deletion Failed',
      message: err instanceof ApiError ? err.message : 'Could not delete the skill.'
    };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
    cancelDelete();
  }
};

onMounted(fetchSkills);
</script>

<style scoped>
.admin-skills-page h1 {
  font-weight: 300;
}

.list-group-item .btn {
  opacity: 0.5;
  transition: opacity 0.2s ease-in-out;
}

.list-group-item:hover .btn {
  opacity: 1;
}
</style>
