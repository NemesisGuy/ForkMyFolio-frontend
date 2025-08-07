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
      <LoadingModal :visible="isLoading"/>
      <ErrorModal :message="error || ''" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage || ''" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ConfirmModal
        :message="`Are you sure you want to remove the skill '${skillToDelete?.name}' from your portfolio?`"
        :visible="!!skillToDelete"
        title="Confirm Deletion"
        @close="skillToDelete = null"
        @confirm="handleDeleteSkill"
      />

      <UserSkillFormModal
        ref="skillFormModalRef"
        :is-editing="isEditing"
        :platform-skills="platformSkills"
        :skill="currentSkillForModal"
        :user-skills="userSkills"
        @save="handleSaveSkill"
      />

      <!-- Grouped Skills List -->
      <div v-if="!isLoading && userSkills.length > 0">
        <div v-for="(categoryGroup, catIndex) in groupedSkills" :key="categoryGroup.category"
             :style="{ 'animation-delay': (catIndex * 0.2) + 's' }" class="mb-5 animate-fade-in-up">
          <h3 class="mb-4 glass-title">{{ categoryGroup.category }}</h3>
          <div v-for="levelGroup in categoryGroup.levels" :key="levelGroup.name" class="mb-4">
            <h4 class="glass-subtitle mb-3 ps-2">{{ levelGroup.name }}</h4>
            <div class="card glass-card">
              <ul class="list-group list-group-flush">
                <!-- FIX: Use the correct key 'userSkillId' which is present on the skill object -->
                <li v-for="skill in levelGroup.skills" :key="skill.userSkillId"
                    class="list-group-item d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <i :class="getIconClass(skill)" class="me-3"
                       style="font-size: 1.5rem; min-width: 24px;"></i>
                    <div>
                      <span class="fw-bold">{{ skill.name }}</span>
                      <p v-if="skill.description" class="small text-muted mb-0">{{
                          skill.description
                        }}</p>
                    </div>
                  </div>
                  <div class="actions d-flex align-items-center">
                    <VisibilityToggle :is-loading="skill.isVisibilityLoading" :visible="skill.visible"
                                      class="me-3" @toggle="handleVisibilityToggle(skill)"/>
                    <button class="btn btn-sm btn-outline-primary me-2"
                            title="Edit Skill" @click="openEditModal(skill)">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Delete Skill"
                            @click="skillToDelete = skill">
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
      <div v-else-if="!isLoading" class="text-center p-5 glass-card animate-fade-in-up"
           style="animation-delay: 0.1s;">
        <div class="empty-state-icon mb-4"><i class="bi bi-tags-fill"></i></div>
        <h4 class="glass-title">No Skills Found</h4>
        <p class="glass-subtitle">You haven't added any skills yet. Click the button above to get
          started!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {skillsApi} from '@/services/api/user.api.js';
import {platformSkillApi} from '@/services/api/skill.api.js';
// REFACTOR: Import all business logic from centralized services
import {groupSkills} from '@/services/skillsService.js';
import {getIconClass} from '@/services/iconService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
// FIX: Import the new component
import VisibilityToggle from '@/components/common/VisibilityToggle.vue';
import UserSkillFormModal from '@/components/user/UserSkillFormModal.vue';

// --- State ---
const userSkills = ref([]);
const platformSkills = ref([]);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const skillToDelete = ref(null);

// --- Modal State ---
const skillFormModalRef = ref(null); // Ref for the component instance
const isEditing = ref(false);
const currentSkillForModal = ref(null); // Data to pass to the modal

// --- Computed Properties ---
// REFACTOR: The grouping logic is now handled by the centralized skillsService.
const groupedSkills = computed(() => groupSkills(userSkills.value));

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchData();
});

// --- Data Fetching ---
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [userSkillsData, platformSkillsData] = await Promise.all([
      skillsApi.getAll(),
      platformSkillApi.getAll(),
    ]);
    userSkills.value = userSkillsData.map(s => ({...s, isVisibilityLoading: false}));
    platformSkills.value = platformSkillsData;
  } catch (err) {
    console.error("Failed to fetch skills data:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

// --- Modal Handling ---
const openAddModal = () => {
  isEditing.value = false;
  // Pass a default skill object structure to the modal
  currentSkillForModal.value = {
    level: 'INTERMEDIATE',
    visible: true,
    description: '',
  };
  skillFormModalRef.value?.show();
};

const openEditModal = (skill) => {
  isEditing.value = true;
  // Pass a deep copy of the skill to the modal to avoid direct mutation
  currentSkillForModal.value = JSON.parse(JSON.stringify(skill));
  skillFormModalRef.value?.show();
};

// --- CRUD Operations ---
const handleSaveSkill = async (payload) => {
  isLoading.value = true;
  skillFormModalRef.value?.hide();
  error.value = null;
  try {
    if (isEditing.value) {
      // For updates, we only send a subset of fields
      // FIX: Use a different variable name to avoid shadowing the 'payload' parameter.
      const updatePayload = {
        level: payload.level,
        visible: payload.visible,
        description: payload.description,
      };
      await skillsApi.update(payload.userSkillId, updatePayload);
      successMessage.value = `Skill '${payload.name}' was updated.`;
    } else {
      // For creates, we send the full payload from the form
      await skillsApi.create(payload);
      successMessage.value = `Skill '${payload.name}' was added.`;
    }
    await fetchData(); // Refresh the list
  } catch (err) {
    console.error("Failed to save skill:", err);
    error.value = err.message || 'An error occurred while saving the skill.';
  } finally {
    isLoading.value = false;
  }
};

const handleVisibilityToggle = async (skill) => {
  skill.isVisibilityLoading = true;
  const originalVisibility = skill.visible;
  skill.visible = !skill.visible;

  try {
    // The skills update endpoint takes a partial payload
    const payload = {
      level: skill.level,
      visible: skill.visible,
      description: skill.description,
    };
    await skillsApi.update(skill.userSkillId, payload);
    successMessage.value = `Visibility for '${skill.name}' updated.`;
  } catch (err) {
    skill.visible = originalVisibility;
    error.value = err.message || 'Failed to update visibility.';
  } finally {
    skill.isVisibilityLoading = false;
  }
};

const handleDeleteSkill = async () => {
  if (!skillToDelete.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    await skillsApi.remove(skillToDelete.value.userSkillId);
    successMessage.value = `Skill '${skillToDelete.value.name}' was removed.`;
    await fetchData(); // Refresh the list
  } catch (err) {
    console.error("Failed to delete skill:", err);
    error.value = err.message || 'An error occurred while deleting the skill.';
  } finally {
    isLoading.value = false;
    skillToDelete.value = null;
  }
};
</script>

<style scoped>
/* Styles for the list view */
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

/* --- Pill Input Styles --- */
.pill-input-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.375rem 0.75rem;
  cursor: text;
  min-height: calc(1.5em + 0.75rem + 2px);
}

.pill-input-container.has-pill {
  padding: 5px;
}

.pill-input-container input {
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--bs-body-color);
  flex-grow: 1;
  padding: 0;
  min-width: 100px;
}

.skill-pill {
  display: inline-flex;
  align-items: center;
  background-color: var(--bs-primary);
  color: white;
  border-radius: 1rem;
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  margin: 2px;
  font-size: 0.9em;
}

.skill-pill .btn-close {
  margin-left: 0.5rem;
  filter: invert(1) grayscale(100%) brightness(200%);
  width: 0.5em;
  height: 0.5em;
}

/* --- New styles for the suggestion dropdown --- */
.suggestions-dropdown {
  position: absolute;
  z-index: 1056; /* Higher than modal z-index */
  width: calc(100% - 2rem); /* Match modal padding */
  margin-top: 0.25rem;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-top: none;
  border-radius: 0 0 var(--bs-border-radius) var(--bs-border-radius);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
}

.skill-suggestion-tag {
  background-color: rgba(var(--bs-primary-rgb), 0.15);
  color: var(--bs-primary);
  border: 1px solid transparent;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.9em;
  padding: 0.4em 0.8em;
}

.skill-suggestion-tag:hover {
  background-color: var(--bs-primary);
  color: white;
  border-color: var(--bs-primary);
}

.skill-suggestion-tag i {
  font-size: 1.1em;
  line-height: 1;
}
</style>
