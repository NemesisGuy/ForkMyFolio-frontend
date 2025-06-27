<template>
  <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <div class="mb-3">
          <label for="projectTitle" class="form-label">Title</label>
          <input type="text" class="form-control" id="projectTitle" v-model="editableProjectData.title" required :class="{'is-invalid': fieldErrors?.title}">
          <div v-if="fieldErrors?.title" class="invalid-feedback">{{ fieldErrors.title }}</div>
        </div>

        <div class="mb-3">
          <label for="projectDescription" class="form-label">Description</label>
          <textarea class="form-control" id="projectDescription" v-model="editableProjectData.description" rows="5" required :class="{'is-invalid': fieldErrors?.description}"></textarea>
          <div v-if="fieldErrors?.description" class="invalid-feedback">{{ fieldErrors.description }}</div>
        </div>

        <div class="mb-3">
          <label for="projectTechStack" class="form-label">Tech Stack (comma-separated)</label>
          <input type="text" class="form-control" id="projectTechStack" v-model="techStackString" :class="{'is-invalid': fieldErrors?.techStack}">
          <div class="form-text">Enter technologies separated by commas (e.g., Vue, Node.js, PostgreSQL).</div>
          <div v-if="fieldErrors?.techStack" class="invalid-feedback">{{ fieldErrors.techStack }}</div>
        </div>

        <div class="mb-3">
          <label for="projectImageUrl" class="form-label">Image URL</label>
          <input type="url" class="form-control" id="projectImageUrl" v-model="editableProjectData.imageUrl" :class="{'is-invalid': fieldErrors?.imageUrl}">
          <div v-if="fieldErrors?.imageUrl" class="invalid-feedback">{{ fieldErrors.imageUrl }}</div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="projectRepoUrl" class="form-label">Repository URL</label>
            <input type="url" class="form-control" id="projectRepoUrl" v-model="editableProjectData.repoUrl" :class="{'is-invalid': fieldErrors?.repoUrl}">
            <div v-if="fieldErrors?.repoUrl" class="invalid-feedback">{{ fieldErrors.repoUrl }}</div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="projectLiveUrl" class="form-label">Live URL</label>
            <input type="url" class="form-control" id="projectLiveUrl" v-model="editableProjectData.liveUrl" :class="{'is-invalid': fieldErrors?.liveUrl}">
            <div v-if="fieldErrors?.liveUrl" class="invalid-feedback">{{ fieldErrors.liveUrl }}</div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end">
          <button type="button" class="btn btn-outline-secondary me-2" @click="handleCancel" v-if="showCancelButton">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {{ isSaving ? savingText : submitText }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';

/**
 * @file src/components/forms/ProjectForm.vue
 * @description A reusable form component for creating or editing projects.
 */

const props = defineProps({
  /**
   * Initial data for the project form.
   * For creating, pass an object with default/empty values.
   * For editing, pass the fetched project data.
   * @type {Object}
   * @default () => ({ title: '', description: '', techStack: [], imageUrl: '', repoUrl: '', liveUrl: '' })
   */
  initialData: {
    type: Object,
    default: () => ({ title: '', description: '', techStack: [], imageUrl: '', repoUrl: '', liveUrl: '' })
  },
  /**
   * Indicates if the form is currently in a saving/submitting state.
   * Used to disable the submit button and show a spinner.
   * @type {Boolean}
   * @default false
   */
  isSaving: {
    type: Boolean,
    default: false
  },
  /**
   * An object containing field-specific validation errors.
   * Keys should match form field names (e.g., title, description).
   * @type {Object}
   * @default () => ({})
   */
  fieldErrors: {
    type: Object,
    default: () => ({})
  },
  /**
   * Text to display on the submit button.
   * @type {String}
   * @default 'Submit'
   */
  submitText: {
    type: String,
    default: 'Submit'
  },
  /**
   * Text to display on the submit button when isSaving is true.
   * @type {String}
   * @default 'Saving...'
   */
  savingText: {
    type: String,
    default: 'Saving...'
  },
  /**
   * Whether to show the cancel button.
   * @type {Boolean}
   * @default true
   */
  showCancelButton: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['submit-form', 'cancel']);

/**
 * Local reactive copy of the project data to allow editing within the form.
 * @type {import('vue').Ref<Object>}
 */
const editableProjectData = ref({});

// Watch for changes in initialData to update the local copy
// This is important for pre-filling the form when editing an existing project.
watch(() => props.initialData, (newData) => {
  // Deep copy to avoid mutating the prop directly, ensure all fields are present
  editableProjectData.value = JSON.parse(JSON.stringify({
    title: '',
    description: '',
    techStack: [],
    imageUrl: '',
    repoUrl: '',
    liveUrl: '',
    ...newData
  }));
  if (!Array.isArray(editableProjectData.value.techStack)) {
    editableProjectData.value.techStack = [];
  }
}, { immediate: true, deep: true });


/**
 * Computed property to get/set techStack as a comma-separated string.
 * Operates on the local editableProjectData.
 * @type {import('vue').ComputedRef<string>}
 */
const techStackString = computed({
  get: () => (editableProjectData.value && Array.isArray(editableProjectData.value.techStack) ? editableProjectData.value.techStack.join(', ') : ''),
  set: (value) => {
    if (editableProjectData.value) {
      editableProjectData.value.techStack = value.split(',')
        .map(tech => tech.trim())
        .filter(tech => tech); // Remove empty strings
    }
  },
});

/**
 * Handles the form submission by emitting the current form data.
 * Actual submission logic (API call, validation) is handled by the parent component.
 */
const handleSubmit = () => {
  // The parent component will perform validation before calling the API.
  // Emit a deep copy of the data to ensure the parent receives a snapshot.
  emit('submit-form', JSON.parse(JSON.stringify(editableProjectData.value)));
};

/**
 * Handles the click on the cancel button.
 * Emits a 'cancel' event.
 */
const handleCancel = () => {
  emit('cancel');
};

</script>

<style scoped>
.form-label {
  font-weight: 500;
}
/* Add any form-specific styles if needed */
</style>
