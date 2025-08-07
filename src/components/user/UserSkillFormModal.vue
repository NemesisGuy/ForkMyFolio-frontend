<template>
  <div id="skillFormModal" ref="modalRef" aria-hidden="true" aria-labelledby="skillModalLabel"
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
          <form @submit.prevent="submitForm">
            <!-- New Skill "Pill" Input -->
            <div v-if="!isEditing" class="mb-3">
              <label class="form-label" for="skillNameInput">Skill Name</label>
              <div :class="{ 'has-pill': !!formState.name }"
                   class="pill-input-container form-control"
                   @click="focusInput">
                <!-- The Pill (if a skill is selected) -->
                <div v-if="formState.name" class="skill-pill">
                  <span>{{ formState.name }}</span>
                  <button aria-label="Remove Skill" class="btn-close" type="button"
                          @click.stop="removeSkillPill"></button>
                </div>

                <!-- The actual input field -->
                <input
                  v-if="!formState.name"
                  id="skillNameInput"
                  ref="skillInputRef"
                  v-model="skillSearchText"
                  autocomplete="off"
                  placeholder="Type a skill..."
                  type="text"
                  @keydown.enter.prevent="addSkillFromText"
                  @keydown.comma.prevent="addSkillFromText"
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
              <input id="skillCategory" v-model="formState.category"
                     :disabled="isPlatformSkillSelected"
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
              <input id="skillIcon" v-model="formState.icon"
                     :disabled="isPlatformSkillSelected" class="form-control"
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
              <textarea id="skillDescription" v-model="formState.description"
                        class="form-control" maxlength="255"
                        placeholder="A short description of your experience."
                        rows="2"></textarea>
            </div>
            <!-- Proficiency Level -->
            <div class="mb-3">
              <label class="form-label" for="skillLevel">Proficiency Level</label>
              <select id="skillLevel" v-model="formState.level" class="form-select" required>
                <option disabled value="">Please select a level</option>
                <option v-for="level in skillLevels" :key="level.value" :value="level.value">
                  {{ level.text }}
                </option>
              </select>
            </div>
            <!-- Visibility Switch -->
            <div class="form-check form-switch mb-3">
              <input id="skillVisible" v-model="formState.visible" class="form-check-input"
                     role="switch"
                     type="checkbox">
              <label class="form-check-label" for="skillVisible">Visible on public
                portfolio</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
          <button :disabled="!formState.name"
                  class="btn btn-primary" type="button"
                  @click="submitForm">
            {{ isEditing ? 'Save Changes' : 'Add Skill' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import {getIconClass} from '@/services/iconService.js';
import {SKILL_LEVELS as skillLevels} from '@/services/skillsService.js';

const props = defineProps({
  skill: {type: Object, default: null},
  isEditing: {type: Boolean, default: false},
  platformSkills: {type: Array, required: true},
  userSkills: {type: Array, required: true},
});

const emit = defineEmits(['save']);

const modalRef = ref(null);
let modalInstance = null;

const formState = reactive({
  userSkillId: null, name: '', level: '', category: '', description: '', visible: true, icon: ''
});
const isPlatformSkillSelected = ref(false);

const skillSearchText = ref('');
const suggestions = ref([]);
const skillInputRef = ref(null);

const uniqueCategories = computed(() => {
  const categories = new Set(props.platformSkills.map(s => s.category).filter(Boolean));
  return Array.from(categories).sort();
});

watch(() => props.skill, (newSkill) => {
  if (newSkill) {
    Object.assign(formState, JSON.parse(JSON.stringify(newSkill)));
  } else {
    Object.assign(formState, {
      userSkillId: null, name: '', level: 'INTERMEDIATE', category: '', description: '', visible: true, icon: ''
    });
  }
}, {deep: true});

watch(() => formState.name, (newName) => {
  if (props.isEditing) return;
  if (!newName) {
    isPlatformSkillSelected.value = false;
    formState.category = '';
    formState.icon = '';
    formState.description = '';
    return;
  }
  const matchedSkill = props.platformSkills.find(p => p.name.toLowerCase() === newName.toLowerCase());
  if (matchedSkill) {
    formState.category = matchedSkill.category || '';
    formState.icon = matchedSkill.icon || '';
    formState.description = matchedSkill.description || '';
    isPlatformSkillSelected.value = true;
  } else {
    isPlatformSkillSelected.value = false;
  }
});

watch(skillSearchText, (newText) => {
  if (newText) {
    suggestions.value = props.platformSkills.filter(skill =>
      skill.name.toLowerCase().includes(newText.toLowerCase()) &&
      !props.userSkills.some(userSkill => userSkill.name.toLowerCase() === skill.name.toLowerCase())
    ).slice(0, 5);
  } else {
    suggestions.value = [];
  }
});

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
  }
});

function selectSkill(skillName) {
  const trimmedName = skillName.trim();
  if (!trimmedName) return;
  if (props.userSkills.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
    skillSearchText.value = '';
    suggestions.value = [];
    return;
  }
  formState.name = trimmedName;
  skillSearchText.value = '';
  suggestions.value = [];
}

const addSkillFromText = () => selectSkill(skillSearchText.value);
const selectSuggestion = (suggestion) => selectSkill(suggestion.name);

function removeSkillPill() {
  formState.name = '';
  nextTick(() => skillInputRef.value?.focus());
}

function focusInput() {
  if (!formState.name) {
    skillInputRef.value?.focus();
  }
}

const submitForm = () => {
  emit('save', {...formState});
};

defineExpose({
  show: () => modalInstance?.show(),
  hide: () => modalInstance?.hide(),
  modalRef,
});
</script>

<style scoped>
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

.suggestions-dropdown {
  position: absolute;
  z-index: 1056;
  width: calc(100% - 2rem);
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