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
              <input id="projectLiveUrl" v-model="formState.liveUrl" class="form-control"
                     placeholder="https://..."
                     type="url">
            </div>
            <div class="col-md-6">
              <label class="form-label" for="projectRepoUrl">Repository URL</label>
              <input id="projectRepoUrl" v-model="formState.repoUrl" class="form-control"
                     placeholder="https://github.com/..."
                     type="url">
            </div>

            <!-- Display Order -->
            <div class="col-md-6">
              <label class="form-label" for="projectDisplayOrder">Display Order</label>
              <input id="projectDisplayOrder" v-model.number="formState.displayOrder"
                     class="form-control"
                     type="number">
            </div>

            <!-- REFACTOR: Use the standardized SkillTagInput component -->
            <div class="col-12">
              <hr class="my-3">
              <label class="form-label">Skills</label>
              <SkillTagInput v-model="formState.skills" :available-skills="userSkills"/>
            </div>

            <!-- Visibility Toggle -->
            <div class="col-12">
              <hr class="my-3">
              <div class="form-check form-switch">
                <input id="projectVisible" v-model="formState.visible" class="form-check-input"
                       role="switch"
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
// REFACTOR: Import the reusable SkillTagInput component.
import SkillTagInput from '@/components/user/SkillTagInput.vue';

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

// --- State for Skill Input ---
const userSkills = ref([]);

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
}, {immediate: true});

// --- Methods ---
const closeModal = () => {
  emit('close');
};

const submitForm = () => {
  emit('save', {...formState});
};
</script>

<style scoped>
/* All skill input styles are now encapsulated in the SkillTagInput component. */
</style>
