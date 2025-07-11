<template>
  <form class="needs-validation" novalidate @submit.prevent="handleSubmit">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <div class="mb-3">
          <label class="form-label" for="projectTitle">Title</label>
          <input id="projectTitle" v-model="editableProjectData.title" :class="{'is-invalid': fieldErrors?.title}"
                 class="form-control" required
                 type="text">
          <div v-if="fieldErrors?.title" class="invalid-feedback">{{ fieldErrors.title }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="projectDescription">Description</label>
          <textarea id="projectDescription" v-model="editableProjectData.description"
                    :class="{'is-invalid': fieldErrors?.description}" class="form-control" required
                    rows="5"></textarea>
          <div v-if="fieldErrors?.description" class="invalid-feedback">{{
              fieldErrors.description
            }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="projectTechStack">Tech Stack (comma-separated)</label>
          <input id="projectTechStack" v-model="techStackString" :class="{'is-invalid': fieldErrors?.techStack}" class="form-control"
                 type="text">
          <div class="form-text">Enter technologies separated by commas (e.g., Vue, Node.js,
            PostgreSQL).
          </div>
          <div v-if="fieldErrors?.techStack" class="invalid-feedback">{{
              fieldErrors.techStack
            }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="projectImageUrl">Image URL</label>
          <input id="projectImageUrl" v-model="editableProjectData.imageUrl" :class="{'is-invalid': fieldErrors?.imageUrl}"
                 class="form-control"
                 type="url">
          <div v-if="fieldErrors?.imageUrl" class="invalid-feedback">{{
              fieldErrors.imageUrl
            }}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="projectRepoUrl">Repository URL</label>
            <input id="projectRepoUrl" v-model="editableProjectData.repoUrl" :class="{'is-invalid': fieldErrors?.repoUrl}"
                   class="form-control"
                   type="url">
            <div v-if="fieldErrors?.repoUrl" class="invalid-feedback">{{
                fieldErrors.repoUrl
              }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="projectLiveUrl">Live URL</label>
            <input id="projectLiveUrl" v-model="editableProjectData.liveUrl" :class="{'is-invalid': fieldErrors?.liveUrl}"
                   class="form-control"
                   type="url">
            <div v-if="fieldErrors?.liveUrl" class="invalid-feedback">{{
                fieldErrors.liveUrl
              }}
            </div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end">
          <button v-if="showCancelButton" class="btn btn-outline-secondary me-2" type="button"
                  @click="handleCancel">Cancel
          </button>
          <button :disabled="isSaving" class="btn btn-primary" type="submit">
            <span v-if="isSaving" aria-hidden="true" class="spinner-border spinner-border-sm me-1"
                  role="status"></span>
            {{ isSaving ? savingText : submitText }}
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import {computed, ref, watch} from 'vue';

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
    default: () => ({
      title: '',
      description: '',
      techStack: [],
      imageUrl: '',
      repoUrl: '',
      liveUrl: ''
    })
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
}, {immediate: true, deep: true});


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
