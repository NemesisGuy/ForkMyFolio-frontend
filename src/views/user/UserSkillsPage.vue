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
      <ErrorModal :message="error" :visible="!!error" title="An Error Occurred"
                  @close="error = null"/>
      <SuccessModal :message="successMessage" :visible="!!successMessage" title="Success"
                    @close="successMessage = null"/>
      <ConfirmModal
        :message="`Are you sure you want to remove the skill '${skillToDelete?.name}' from your portfolio?`"
        :visible="!!skillToDelete"
        title="Confirm Deletion"
        @close="skillToDelete = null"
        @confirm="handleDeleteSkill"
      />

      <!-- Add/Edit Skill Modal -->
      <div id="skillModal" ref="skillModalRef" aria-hidden="true" aria-labelledby="skillModalLabel"
           class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content glass-modal">
            <div class="modal-header">
              <h5 id="skillModalLabel" class="modal-title">
                {{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h5>
              <button aria-label="Close" class="btn-close" data-bs-dismiss="modal"
                      type="button"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleFormSubmit">
                <!-- New Skill "Pill" Input -->
                <div v-if="!isEditing" class="mb-3">
                  <label class="form-label" for="skillNameInput">Skill Name</label>
                  <div :class="{ 'has-pill': !!currentSkill.name }" class="pill-input-container form-control"
                       @click="focusInput">
                    <!-- The Pill (if a skill is selected) -->
                    <div v-if="currentSkill.name" class="skill-pill">
                      <span>{{ currentSkill.name }}</span>
                      <button aria-label="Remove Skill" class="btn-close" type="button"
                              @click.stop="removeSkillPill"></button>
                    </div>

                    <!-- The actual input field -->
                    <input
                      v-if="!currentSkill.name"
                      id="skillNameInput"
                      ref="skillInputRef"
                      v-model="skillSearchText"
                      autocomplete="off"
                      placeholder="Type a skill..."
                      type="text"
                      @keydown.enter.prevent="addSkillFromText"
                      @keydown.,.prevent="addSkillFromText"
                    >
                  </div>
                  <!-- Suggestions dropdown -->
                  <div v-if="suggestions.length > 0" class="suggestions-dropdown">
                    <div class="p-2 d-flex flex-wrap gap-2">
                      <button
                        v-for="suggestion in suggestions"
                        :key="suggestion.uuid"
                        class="badge skill-suggestion-tag"
                        type="button"
                        @mousedown.prevent="selectSuggestion(suggestion)"
                      >
                        <i :class="getIconClass(suggestion)" class="me-2"></i>
                        {{ suggestion.name }}
                      </button>
                    </div>
                  </div>
                  <div class="form-text">Select an existing skill or type a new one and press Enter
                    or Comma.
                  </div>
                </div>

                <!-- Category (only for new skills) -->
                <div v-if="!isEditing" class="mb-3">
                  <label class="form-label" for="skillCategory">Category</label>
                  <input id="skillCategory" v-model="currentSkill.category" :disabled="isPlatformSkillSelected"
                         class="form-control" list="category-suggestions"
                         placeholder="e.g., Frontend, Backend, DevOps"
                         type="text">
                  <datalist id="category-suggestions">
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat"></option>
                  </datalist>
                </div>

                <!-- Icon Input Field -->
                <div v-if="!isEditing" class="mb-3">
                  <label class="form-label" for="skillIcon">Icon Class (Optional)</label>
                  <input id="skillIcon" v-model="currentSkill.icon" :disabled="isPlatformSkillSelected" class="form-control"
                         placeholder="e.g., devicon-vuejs-plain"
                         type="text">
                  <div class="form-text">
                    Use classes from
                    <a href="https://icons.getbootstrap.com/" rel="noopener noreferrer"
                       target="_blank">Bootstrap Icons</a>,
                    <a href="https://fontawesome.com/icons" rel="noopener noreferrer"
                       target="_blank">Font Awesome</a>, or
                    <a href="https://devicon.dev/" rel="noopener noreferrer"
                       target="_blank">Devicon</a>.
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label class="form-label" for="skillDescription">Your Description</label>
                  <textarea id="skillDescription" v-model="currentSkill.description"
                            class="form-control" maxlength="255" placeholder="A short description of your experience."
                            rows="2"></textarea>
                </div>
                <!-- Proficiency Level -->
                <div class="mb-3">
                  <label class="form-label" for="skillLevel">Proficiency Level</label>
                  <select id="skillLevel" v-model="currentSkill.level" class="form-select" required>
                    <option disabled value="">Please select a level</option>
                    <option v-for="level in skillLevels" :key="level.value" :value="level.value">
                      {{ level.text }}
                    </option>
                  </select>
                </div>
                <!-- Visibility Switch -->
                <div class="form-check form-switch mb-3">
                  <input id="skillVisible" v-model="currentSkill.visible" class="form-check-input" role="switch"
                         type="checkbox">
                  <label class="form-check-label" for="skillVisible">Visible on public
                    portfolio</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
              <button :disabled="isSaving || (!isEditing && !currentSkill.name)" class="btn btn-primary" type="button"
                      @click="handleFormSubmit">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Skill') }}
              </button>
            </div>
          </div>
        </div>
      </div>

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
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue';
import {skillsApi} from '@/services/api/user.api.js';
import {platformSkillApi} from '@/services/api/skill.api.js';
import {groupSkills, SKILL_LEVELS} from '@/services/skillsService.js';
import {getIconClass} from '@/services/iconService.js';
import LoadingModal from '@/components/common/modals/LoadingModal.vue';
import ErrorModal from '@/components/common/modals/ErrorModal.vue';
import SuccessModal from '@/components/common/modals/SuccessModal.vue';
import ConfirmModal from '@/components/common/modals/ConfirmModal.vue';
import {Modal} from 'bootstrap';

// --- State ---
const userSkills = ref([]);
const platformSkills = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);
const successMessage = ref(null);
const skillToDelete = ref(null);

// --- Modal State ---
const skillModalRef = ref(null);
let skillModalInstance = null;
const isEditing = ref(false);
// FIX: The unique ID from the API is 'userSkillId', not 'uuid'.
const currentSkill = reactive({
  userSkillId: null, name: '', level: '', category: '', description: '', visible: true, icon: ''
});
const skillLevels = SKILL_LEVELS;
const isPlatformSkillSelected = ref(false);

// --- Pill Input State ---
const skillSearchText = ref('');
const suggestions = ref([]);
const skillInputRef = ref(null);

// --- Computed Properties ---
const groupedSkills = computed(() => groupSkills(userSkills.value));
const uniqueCategories = computed(() => {
  const categories = new Set(platformSkills.value.map(s => s.category).filter(Boolean));
  return Array.from(categories).sort();
});

// --- Watchers ---

// Watcher for the smart form (auto-fills category/icon/description)
watch(() => currentSkill.name, (newName) => {
  if (isEditing.value) return;

  if (!newName) {
    // Clear fields when the skill pill is removed
    isPlatformSkillSelected.value = false;
    currentSkill.category = '';
    currentSkill.icon = '';
    currentSkill.description = '';
    return;
  }

  const matchedSkill = platformSkills.value.find(p => p.name.toLowerCase() === newName.toLowerCase());
  if (matchedSkill) {
    // Pre-populate fields from the global platform skill
    currentSkill.category = matchedSkill.category || '';
    currentSkill.icon = matchedSkill.icon || '';
    currentSkill.description = matchedSkill.description || '';
    isPlatformSkillSelected.value = true;
  } else {
    // The user is creating a brand new skill not in the platform list
    isPlatformSkillSelected.value = false;
  }
});

// Watcher for the pill input (shows suggestions)
watch(skillSearchText, (newText) => {
  if (newText) {
    suggestions.value = platformSkills.value.filter(skill =>
      skill.name.toLowerCase().includes(newText.toLowerCase()) &&
      !userSkills.value.some(userSkill => userSkill.name.toLowerCase() === skill.name.toLowerCase())
    ).slice(0, 5);
  } else {
    suggestions.value = [];
  }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchData();
  if (skillModalRef.value) {
    skillModalInstance = new Modal(skillModalRef.value);
  }
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
    userSkills.value = userSkillsData;
    platformSkills.value = platformSkillsData;
  } catch (err) {
    console.error("Failed to fetch skills data:", err);
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
};

// --- Pill Input Methods ---
function selectSkill(skillName) {
  const trimmedName = skillName.trim();
  if (!trimmedName) return;

  if (userSkills.value.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
    console.warn(`User already has skill: ${trimmedName}`);
    // Here you could show a toast/error message to the user
    skillSearchText.value = '';
    suggestions.value = [];
    return;
  }

  currentSkill.name = trimmedName;
  skillSearchText.value = '';
  suggestions.value = [];
}

function addSkillFromText() {
  selectSkill(skillSearchText.value);
}

function selectSuggestion(suggestion) {
  selectSkill(suggestion.name);
}

function removeSkillPill() {
  currentSkill.name = ''; // This will trigger the watcher to clear other fields
  nextTick(() => {
    skillInputRef.value?.focus();
  });
}

function focusInput() {
  if (!currentSkill.name) {
    skillInputRef.value?.focus();
  }
}

// --- Modal Handling ---
const openAddModal = () => {
  isEditing.value = false;
  isPlatformSkillSelected.value = false;
  // FIX: Reset the correct ID field
  Object.assign(currentSkill, {
    userSkillId: null,
    name: '',
    level: 'INTERMEDIATE',
    category: '',
    description: '',
    visible: true,
    icon: ''
  });
  skillSearchText.value = '';
  suggestions.value = [];
  skillModalInstance?.show();
};

const openEditModal = (skill) => {
  isEditing.value = true;
  // This deep copy correctly captures the 'userSkillId' from the skill object
  Object.assign(currentSkill, JSON.parse(JSON.stringify(skill)));
  skillModalInstance?.show();
};

// --- CRUD Operations ---
const handleFormSubmit = async () => {
  isSaving.value = true;
  error.value = null;
  try {
    if (isEditing.value) {
      const payload = {
        level: currentSkill.level,
        visible: currentSkill.visible,
        description: currentSkill.description,
      };
      // FIX: Send the correct ID for updates
      await skillsApi.update(currentSkill.userSkillId, payload);
      successMessage.value = `Skill '${currentSkill.name}' was updated.`;
    } else {
      const payload = {
        name: currentSkill.name,
        category: currentSkill.category,
        level: currentSkill.level,
        visible: currentSkill.visible,
        description: currentSkill.description,
        icon: currentSkill.icon,
      };
      await skillsApi.create(payload);
      successMessage.value = `Skill '${payload.name}' was added.`;
    }
    await fetchData();
    skillModalInstance?.hide();
  } catch (err) {
    console.error("Failed to save skill:", err);
    error.value = err.message || 'An error occurred while saving the skill.';
  } finally {
    isSaving.value = false;
  }
};

const handleDeleteSkill = async () => {
  if (!skillToDelete.value) return;
  isSaving.value = true;
  error.value = null;
  try {
    // FIX: Send the correct ID for deletion
    await skillsApi.remove(skillToDelete.value.userSkillId);
    successMessage.value = `Skill '${skillToDelete.value.name}' was removed.`;
    await fetchData();
  } catch (err) {
    console.error("Failed to delete skill:", err);
    error.value = err.message || 'An error occurred while deleting the skill.';
  } finally {
    isSaving.value = false;
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
