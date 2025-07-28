<template>
  <div class="user-skills-page py-5 animated-gradient-background">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
        <h2 class="mb-0 glass-text">Manage My Skills</h2>
        <button class="btn btn-primary interactive-lift" @click="openAddModal">
          <i class="bi bi-plus-circle me-2"></i>Add New Skill
        </button>
      </div>

      <!-- Modals -->
      <LoadingModal :visible="isLoading" />
      <ErrorModal :visible="!!error" :message="error" title="An Error Occurred" @close="error = null" />
      <SuccessModal :visible="!!successMessage" :message="successMessage" title="Success" @close="successMessage = null" />
      <ConfirmModal
        :visible="!!skillToDelete"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete the skill '${skillToDelete?.name}'? This action cannot be undone.`"
        @confirm="handleDeleteSkill"
        @close="skillToDelete = null"
      />

      <!-- Add/Edit Skill Modal -->
      <div class="modal fade" id="skillModal" tabindex="-1" aria-labelledby="skillModalLabel" aria-hidden="true" ref="skillModalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="skillModalLabel">{{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleFormSubmit">
                <div class="mb-3">
                  <label for="skillName" class="form-label">Skill Name</label>
                  <input type="text" class="form-control" id="skillName" v-model="currentSkill.name" required>
                </div>
                <div class="mb-3">
                  <label for="skillLevel" class="form-label">Proficiency Level</label>
                  <select class="form-select" id="skillLevel" v-model="currentSkill.level" required>
                    <option disabled value="">Please select a level</option>
                    <option v-for="level in skillLevels" :key="level.value" :value="level.value">
                      {{ level.text }}
                    </option>
                  </select>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" role="switch" id="skillVisible" v-model="currentSkill.visible">
                  <label class="form-check-label" for="skillVisible">Visible on public portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="handleFormSubmit">{{ isEditing ? 'Save Changes' : 'Add Skill' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills List -->
      <div v-if="!isLoading && skills.length > 0" class="card glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <ul class="list-group list-group-flush">
          <li v-for="skill in skills" :key="skill.uuid" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span>{{ skill.name }}</span>
              <span class="badge rounded-pill ms-2" :class="levelBadgeClass(skill.level)">
                {{ formatSkillLevel(skill.level) }}
              </span>
              <span :class="['badge', 'rounded-pill', 'ms-2', skill.visible ? 'bg-success' : 'bg-secondary']">
                {{ skill.visible ? 'Visible' : 'Hidden' }}
              </span>
            </div>
            <div class="actions">
              <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(skill)" title="Edit Skill">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="skillToDelete = skill" title="Delete Skill">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4">
          <i class="bi bi-tags-fill"></i>
        </div>
        <h4 class="glass-title">No Skills Found</h4>
        <p class="glass-subtitle">You haven't added any skills yet. Click the button above to get started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { skillsApi } from '@/services/api/user.api.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import { Modal } from 'bootstrap';

// --- State ---
const skills = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const skillToDelete = ref(null);

// For the Add/Edit Modal
const skillModalRef = ref(null);
let skillModalInstance = null;
const isEditing = ref(false);
const currentSkill = reactive({
  uuid: null,
  name: '',
  level: '',
  visible: true,
});

const skillLevels = [
  { value: 'BEGINNER', text: 'Beginner' },
  { value: 'INTERMEDIATE', text: 'Intermediate' },
  { value: 'ADVANCED', text: 'Advanced' },
  { value: 'EXPERT', text: 'Expert' }
];

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchSkills();
  if (skillModalRef.value) {
    skillModalInstance = new Modal(skillModalRef.value);
  }
});

// --- Helper Functions ---
const formatSkillLevel = (level) => {
  if (!level) return '';
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

const levelBadgeClass = (level) => {
  switch (level) {
    case 'BEGINNER': return 'bg-secondary bg-opacity-75';
    case 'INTERMEDIATE': return 'bg-info bg-opacity-75';
    case 'ADVANCED': return 'bg-primary bg-opacity-75';
    case 'EXPERT': return 'bg-success bg-opacity-75';
    default: return 'bg-light text-dark';
  }
};

// --- Data Fetching ---
const fetchSkills = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    skills.value = await skillsApi.getAll();
  } catch (err) {
    console.error("Failed to fetch user skills:", err);
    error.value = err.message || 'An unexpected error occurred while fetching your skills.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  isEditing.value = false;
  currentSkill.uuid = null;
  currentSkill.name = '';
  currentSkill.visible = true;
  currentSkill.level = 'INTERMEDIATE'; // Set a sensible default
  skillModalInstance?.show();
};

const openEditModal = (skill) => {
  isEditing.value = true;
  currentSkill.uuid = skill.uuid;
  currentSkill.name = skill.name;
  currentSkill.level = skill.level;
  currentSkill.visible = skill.visible;
  skillModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  if (isEditing.value) {
    await handleUpdateSkill();
  } else {
    await handleAddSkill();
  }
};

const handleAddSkill = async () => {
  if (!currentSkill.name.trim() || !currentSkill.level) {
    error.value = "Skill name and level are required.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    // This payload now correctly matches the CreateSkillRequest DTO
    const payload = { name: currentSkill.name, level: currentSkill.level, visible: currentSkill.visible };
    const newSkill = await skillsApi.create(payload);

    skills.value.push(newSkill);
    successMessage.value = `Skill '${newSkill.name}' was added successfully.`;
    skillModalInstance?.hide();
  } catch (err) {
    console.error("Failed to add skill:", err);
    error.value = err.message || 'An error occurred while adding the skill.';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateSkill = async () => {
  if (!currentSkill.name.trim() || !currentSkill.level) {
    error.value = "Skill name and level are required.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    // This payload also matches the expected structure for an update
    const payload = { name: currentSkill.name, level: currentSkill.level, visible: currentSkill.visible };
    const updatedSkill = await skillsApi.update(currentSkill.uuid, payload);

    const index = skills.value.findIndex(s => s.uuid === currentSkill.uuid);
    if (index !== -1) {
      skills.value[index] = updatedSkill;
    }
    successMessage.value = `Skill was updated to '${updatedSkill.name}' successfully.`;
    skillModalInstance?.hide();
  } catch (err) {
    console.error("Failed to update skill:", err);
    error.value = err.message || 'An error occurred while updating the skill.';
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteSkill = async () => {
  if (!skillToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await skillsApi.remove(skillToDelete.value.uuid);
    skills.value = skills.value.filter(s => s.uuid !== skillToDelete.value.uuid);
    successMessage.value = `Skill '${skillToDelete.value.name}' was deleted successfully.`;
  } catch (err) {
    console.error("Failed to delete skill:", err);
    error.value = err.message || 'An error occurred while deleting the skill.';
  } finally {
    isLoading.value = false;
    skillToDelete.value = null; // Close the confirm modal
  }
};
</script>

<style scoped>
.list-group-item {
  background-color: transparent;
  border-bottom: 1px solid var(--glass-border);
  color: var(--glass-text);
  transition: background-color 0.3s ease;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background-color: var(--glass-bg-hover);
}

.list-group-item .actions {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.list-group-item:hover .actions {
  opacity: 1;
}

.badge {
  font-weight: 500;
  font-size: 0.75em;
  padding: 0.4em 0.7em;
}
</style>
