<template>
  <div ref="modalRef" aria-hidden="true" aria-labelledby="projectFormModalLabel" class="modal fade"
       tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content glass-modal">
        <div class="modal-header">
          <h5 id="projectFormModalLabel" class="modal-title">
            {{ isEditing ? 'Edit Project' : 'Add New Project' }}</h5>
          <button aria-label="Close" class="btn-close" type="button" @click="closeModal"></button>
        </div>
        <div class="modal-body" style="max-height: 75vh; overflow-y: auto;">
          <form class="row g-3" @submit.prevent="submitForm">

            <!-- Project Title -->
            <div class="col-12">
              <label class="form-label" for="projectTitle">Project Title</label>
              <input id="projectTitle" v-model="formState.title" class="form-control" required
                     type="text">
            </div>

            <!-- Project Description -->
            <div class="col-12">
              <label class="form-label" for="projectDescription">Description</label>
              <textarea id="projectDescription" v-model="formState.description" class="form-control"
                        rows="4"></textarea>
            </div>

            <!-- URLs -->
            <div class="col-md-6">
              <label class="form-label" for="projectImageUrl">Image URL</label>
              <input id="projectImageUrl" v-model="formState.imageUrl" class="form-control"
                     placeholder="https://..." type="url">
            </div>
            <div class="col-md-6">
              <label class="form-label" for="projectLiveUrl">Live Demo URL</label>
              <input id="projectLiveUrl" v-model="formState.liveUrl" class="form-control" placeholder="https://..."
                     type="url">
            </div>
            <div class="col-md-6">
              <label class="form-label" for="projectRepoUrl">Repository URL</label>
              <input id="projectRepoUrl" v-model="formState.repoUrl" class="form-control" placeholder="https://github.com/..."
                     type="url">
            </div>

            <!-- Display Order -->
            <div class="col-md-6">
              <label class="form-label" for="projectDisplayOrder">Display Order</label>
              <input id="projectDisplayOrder" v-model.number="formState.displayOrder" class="form-control"
                     type="number">
            </div>

            <!-- Skill Tagging Input -->
            <div class="col-12">
              <hr class="my-3">
              <!-- 1. Area for displaying selected skills -->
              <div v-if="formState.skills.length > 0" class="mb-2">
                <label class="form-label">Selected Skills</label>
                <div class="selected-skills-container p-2 border rounded">
                  <span v-for="skillName in formState.skills" :key="skillName"
                        class="badge skill-tag">
                    {{ skillName }}
                    <button class="btn-close btn-close-white" type="button"
                            @click.stop="removeSkill(skillName)"></button>
                  </span>
                </div>
              </div>

              <!-- 2. Area for searching and adding new skills -->
              <div class="position-relative">
                <label class="form-label" for="skill-input">Add a Skill</label>
                <input
                  id="skill-input"
                  ref="skillInputRef"
                  v-model="skillSearchQuery"
                  class="form-control"
                  placeholder="Type a skill and press Enter or Comma..."
                  type="text"
                  @blur="hideSuggestions"
                  @focus="showSuggestions = true"
                  @keydown="handleKeydown"
                />
                <!-- Suggestions Dropdown -->
                <div v-if="showSuggestions && filteredSkills.length > 0"
                     class="skill-suggestions-dropdown">
                  <div class="p-2 d-flex flex-wrap gap-2">
                    <button
                      v-for="skill in filteredSkills"
                      :key="skill.uuid"
                      class="badge skill-suggestion-tag"
                      type="button"
                      @mousedown.prevent="addSkill(skill.name)"
                    >
                      <!-- THIS IS THE FIX: Use the centralized getIconClass function -->
                      <i :class="[getIconClass(skill), 'me-2']"></i>
                      {{ skill.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visibility Toggle -->
            <div class="col-12">
              <hr class="my-3">
              <div class="form-check form-switch">
                <input id="projectVisible" v-model="formState.visible" class="form-check-input" role="switch"
                       type="checkbox">
                <label class="form-check-label" for="projectVisible">Visible on public
                  portfolio</label>
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" @click="closeModal">Close</button>
          <button class="btn btn-primary" type="button" @click="submitForm">
            {{ isEditing ? 'Save Changes' : 'Add Project' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import {skillsApi} from '@/services/api/user.api.js';
// THIS IS THE FIX: Import the centralized icon service
import {getIconClass} from '@/services/iconService.js';

// --- Props and Emits ---
const props = defineProps({
  visible: Boolean,
  project: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['close', 'save']);

// --- Component State ---
const modalRef = ref(null);
let modalInstance = null;
const isEditing = ref(false);

const getInitialFormState = () => ({
  uuid: null,
  title: '',
  description: '',
  repoUrl: '',
  liveUrl: '',
  imageUrl: '',
  displayOrder: 100,
  skills: [], // Holds an array of skill NAMES
  visible: true,
});
const formState = reactive(getInitialFormState());

// --- Skill Input State ---
const userSkills = ref([]);
const skillSearchQuery = ref('');
const showSuggestions = ref(false);
const skillInputRef = ref(null);

// --- Lifecycle and Watchers ---
onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }
  // Fetch all available skills for the user once
  skillsApi.getAll().then(skills => {
    userSkills.value = skills;
  }).catch(e => console.error("Failed to load skills for form modal", e));
});

watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    modalInstance?.show();
  } else {
    modalInstance?.hide();
  }
});

watch(() => props.project, (newProject) => {
  if (newProject) {
    isEditing.value = true;
    Object.assign(formState, {
      ...newProject,
      // Ensure skills are an array of names, not objects
      skills: newProject.skills ? newProject.skills.map(s => s.name) : [],
    });
  } else {
    isEditing.value = false;
    Object.assign(formState, getInitialFormState());
  }
  skillSearchQuery.value = ''; // Reset search on open
}, {immediate: true});

// --- Computed Properties ---
const filteredSkills = computed(() => {
  if (!skillSearchQuery.value) {
    // Show available skills that aren't yet selected
    return userSkills.value.filter(skill => !formState.skills.includes(skill.name));
  }
  const query = skillSearchQuery.value.toLowerCase();
  // Filter skills that include the search query AND are not already selected
  return userSkills.value.filter(skill =>
    skill.name.toLowerCase().includes(query) &&
    !formState.skills.includes(skill.name)
  );
});

// --- Methods ---
const closeModal = () => {
  emit('close');
};

const submitForm = () => {
  emit('save', {...formState});
};

// --- Skill Input Methods ---
const addSkill = (skillName) => {
  const trimmedName = skillName.trim();
  if (trimmedName && !formState.skills.includes(trimmedName)) {
    formState.skills.push(trimmedName);
  }
  skillSearchQuery.value = '';
  skillInputRef.value?.focus();
};

const removeSkill = (skillNameToRemove) => {
  formState.skills = formState.skills.filter(name => name !== skillNameToRemove);
};

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (filteredSkills.value.length > 0 && filteredSkills.value[0].name.toLowerCase().startsWith(skillSearchQuery.value.toLowerCase())) {
      // If suggestions are showing and match, Enter selects the top one
      addSkill(filteredSkills.value[0].name);
    } else {
      // Otherwise, Enter adds the typed text as a new skill
      addSkill(skillSearchQuery.value);
    }
  } else if (event.key === ',') {
    event.preventDefault();
    // Comma always adds the typed text as a new skill
    addSkill(skillSearchQuery.value);
  }
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<style scoped>
/* --- Styles for Skill Input --- */
.selected-skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 40px;
  background-color: rgba(var(--bs-tertiary-bg-rgb), 0.5);
}

.skill-tag {
  background-color: var(--bs-primary);
  color: white;
  padding: 0.3em 0.6em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9em;
}

.skill-tag .btn-close {
  width: 0.5em;
  height: 0.5em;
  padding: 0;
  filter: brightness(0) invert(1); /* Make the 'x' white */
}

.skill-suggestions-dropdown {
  position: absolute;
  width: 100%;
  z-index: 1056; /* Higher than modal z-index */
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-top: none;
  border-radius: 0 0 var(--bs-border-radius) var(--bs-border-radius);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.skill-suggestion-tag {
  background-color: rgba(var(--bs-primary-rgb), 0.15);
  color: var(--bs-primary);
  border: 1px solid transparent;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
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
