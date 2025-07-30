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
                  <label for="skillCategory" class="form-label">Category</label>
                  <input type="text" class="form-control" id="skillCategory" v-model="currentSkill.category" list="category-suggestions" placeholder="e.g., Frontend, Backend, DevOps">
                  <datalist id="category-suggestions">
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat"></option>
                  </datalist>
                </div>
                <div class="mb-3">
                  <label for="skillIcon" class="form-label">Icon</label>
                  <input type="text" class="form-control" id="skillIcon" v-model="currentSkill.icon" placeholder="e.g., bi bi-vue">
                  <div class="form-text">Optional: A Bootstrap Icon class name (e.g., 'bi bi-git').</div>
                </div>
                <div class="mb-3">
                  <label for="skillDescription" class="form-label">Description</label>
                  <textarea class="form-control" id="skillDescription" v-model="currentSkill.description" rows="2" maxlength="255" placeholder="A short description of your experience with this skill."></textarea>
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

      <!-- Grouped Skills List -->
      <div v-if="!isLoading && skills.length > 0">
        <div v-for="(categoryGroup, catIndex) in groupedSkills" :key="categoryGroup.category" class="mb-5 animate-fade-in-up" :style="{ 'animation-delay': (catIndex * 0.2) + 's' }">
          <h3 class="mb-4 glass-title">{{ categoryGroup.category }}</h3>
          <div v-for="levelGroup in categoryGroup.levels" :key="levelGroup.name" class="mb-4">
            <h4 class="glass-subtitle mb-3 ps-2">{{ levelGroup.name }}</h4>
            <div class="card glass-card">
              <ul class="list-group list-group-flush">
                <li v-for="skill in levelGroup.skills" :key="skill.uuid" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span>{{ skill.name }}</span>
                    <p v-if="skill.description" class="small text-muted mb-0">{{ skill.description }}</p>
                  </div>
                  <div class="actions d-flex align-items-center">
                    <div class="form-check form-switch me-3" title="Toggle Visibility">
                      <input class="form-check-input" type="checkbox" role="switch" :checked="skill.visible" @change="handleVisibilityToggle(skill)">
                    </div>
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
          </div>
        </div>
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
import { ref, onMounted, reactive, computed } from 'vue';
import { skillsApi } from '@/services/api/user.api.js';
import { groupSkills, SKILL_LEVELS } from '@/services/skillsService.js';
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
  category: '',
  icon: '',
  description: '',
  visible: true,
});

const skillLevels = SKILL_LEVELS;

// --- Computed Properties ---
const groupedSkills = computed(() => groupSkills(skills.value));
const uniqueCategories = computed(() => {
  const categories = new Set(skills.value.map(s => s.category).filter(Boolean));
  return Array.from(categories).sort();
});


// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchSkills();
  if (skillModalRef.value) {
    skillModalInstance = new Modal(skillModalRef.value);
  }
});

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
  currentSkill.level = 'INTERMEDIATE';
  currentSkill.category = '';
  currentSkill.icon = '';
  currentSkill.description = '';
  skillModalInstance?.show();
};

const openEditModal = (skill) => {
  isEditing.value = true;
  currentSkill.uuid = skill.uuid;
  currentSkill.name = skill.name;
  currentSkill.level = skill.level;
  currentSkill.visible = skill.visible;
  currentSkill.category = skill.category || '';
  currentSkill.icon = skill.icon || '';
  currentSkill.description = skill.description || '';
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

const buildPayload = (skill) => ({
  name: skill.name,
  level: skill.level,
  visible: skill.visible,
  category: skill.category,
  icon: skill.icon,
  description: skill.description,
});

const handleAddSkill = async () => {
  if (!currentSkill.name.trim() || !currentSkill.level) {
    error.value = "Skill name and level are required.";
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    const payload = buildPayload(currentSkill);
    await skillsApi.create(payload);
    await fetchSkills();
    successMessage.value = `Skill '${payload.name}' was added successfully.`;
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
    const payload = buildPayload(currentSkill);
    await skillsApi.update(currentSkill.uuid, payload);
    await fetchSkills();
    successMessage.value = `Skill was updated to '${payload.name}' successfully.`;
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
    await fetchSkills();
    successMessage.value = `Skill '${skillToDelete.value.name}' was deleted successfully.`;
  } catch (err)
  {
    console.error("Failed to delete skill:", err);
    error.value = err.message || 'An error occurred while deleting the skill.';
  } finally {
    isLoading.value = false;
    skillToDelete.value = null;
  }
};

const handleVisibilityToggle = async (skill) => {
  const originalVisibility = skill.visible;
  skill.visible = !skill.visible;

  try {
    const payload = buildPayload(skill);
    await skillsApi.update(skill.uuid, payload);
    successMessage.value = `Visibility for '${skill.name}' updated.`;
  } catch (err) {
    skill.visible = originalVisibility;
    console.error("Failed to update visibility:", err);
    error.value = err.message || 'An error occurred while updating visibility.';
  }
};
</script>

<style scoped>
.list-group-item {
  background-color: transparent;
  border-bottom: 1px solid var(--glass-border);
  color: var(--glass-text);
  transition: background-color 0.3s ease;
  padding: 1rem 1.25rem;
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

.empty-state-icon {
  font-size: 4rem;
  color: var(--glass-text);
}

.form-check-input {
  cursor: pointer;
}
</style>
