<template>
  <div class="create-project-page py-4">
    <div class="container">
      <h1 class="display-5 mb-4">Create New Project</h1>

      <ProjectForm
        :field-errors="fieldErrors"
        :initial-data="newProject"
        :is-saving="isSaving"
        saving-text="Creating..."
        submit-text="Create Project"
        @cancel="cancelCreation"
        @submit-form="handleCreateProject"
      />
    </div>

    <ErrorModal
      v-if="error"
      :message="error.message"
      :title="error.title"
      :visible="showErrorModal"
      @close="closeErrorModal"
    />

    <SuccessModal
      v-if="successMessage"
      :message="successMessage"
      :visible="showSuccessModal"
      title="Project Created"
      @close="closeSuccessModalAndRedirect"
    />
  </div>
</template>

<script setup>
/**
 * @file src/views/CreateProjectPage.vue
 * @description Page for creating a new project.
 */
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {ApiError, createProject} from '@/services/api/index.js';
import ProjectForm from '../../components/forms/ProjectForm.vue';
import ErrorModal from '../../components/common/ErrorModal.vue';
import SuccessModal from '../../components/common/SuccessModal.vue';

const router = useRouter();

// --- Reactive State for New Project ---
/**
 * @type {import('vue').Ref<object>}
 * Data for the new project, initialized with default/empty values.
 * Structure should match what ProjectForm expects and ProjectDto for creation.
 */
const newProject = ref({
  title: '',
  description: '',
  techStack: [], // ProjectForm's techStackString will handle comma-separated input
  imageUrl: '',
  repoUrl: '',
  liveUrl: '',
  // userId will be set by the backend based on authenticated user
});

/** @type {import('vue').Ref<boolean>} Saving state for when the form is submitted. */
const isSaving = ref(false);

/** @type {import('vue').Ref<{title: string, message: string|string[]}|null>} Error object for ErrorModal. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the ErrorModal. */
const showErrorModal = ref(false);

/** @type {import('vue').Ref<string|null>} Success message for SuccessModal. */
const successMessage = ref(null);
/** @type {import('vue').Ref<boolean>} Controls visibility of the SuccessModal. */
const showSuccessModal = ref(false);

/** @type {Reactive<object>} Object to hold field-specific validation errors. */
const fieldErrors = reactive({}); // To be populated by validation logic

// --- Modal Control Methods ---
/** Closes the error modal. */
const closeErrorModal = () => {
  showErrorModal.value = false;
  error.value = null;
};

/** Closes the success modal and redirects. */
const closeSuccessModalAndRedirect = () => {
  showSuccessModal.value = false;
  successMessage.value = null;
  // Redirect to My Projects or the newly created project's page (if ID is available from response)
  router.push('/my-projects');
};

// --- Validation ---
/**
 * Validates the project form data.
 * @param {object} dataToValidate - The project data object to validate.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = (dataToValidate) => {
  Object.keys(fieldErrors).forEach(key => fieldErrors[key] = null); // Clear previous errors
  let isValid = true;

  if (!dataToValidate.title?.trim()) {
    fieldErrors.title = "Title is required.";
    isValid = false;
  }
  if (!dataToValidate.description?.trim()) {
    fieldErrors.description = "Description is required.";
    isValid = false;
  }
  // Basic URL validation (optional, can be more robust)
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (dataToValidate.imageUrl && !urlPattern.test(dataToValidate.imageUrl)) {
    fieldErrors.imageUrl = "Please enter a valid URL for the image.";
    isValid = false;
  }
  if (dataToValidate.repoUrl && !urlPattern.test(dataToValidate.repoUrl)) {
    fieldErrors.repoUrl = "Please enter a valid URL for the repository.";
    isValid = false;
  }
  if (dataToValidate.liveUrl && !urlPattern.test(dataToValidate.liveUrl)) {
    fieldErrors.liveUrl = "Please enter a valid URL for the live demo.";
    isValid = false;
  }
  // techStack is an array from ProjectForm, no specific string validation needed here unless for content.
  return isValid;
};


// --- Form Handling & API Call ---
/**
 * Handles the submission of the new project data from ProjectForm.
 * @param {object} projectDataFromForm - The project data emitted from ProjectForm.
 */
const handleCreateProject = async (projectDataFromForm) => {
  if (!validateForm(projectDataFromForm)) {
    error.value = {title: "Validation Error", message: "Please correct the errors in the form."};
    showErrorModal.value = true;
    return;
  }

  isSaving.value = true;
  error.value = null;
  showErrorModal.value = false;
  successMessage.value = null;
  showSuccessModal.value = false;

  try {
    // The projectDataFromForm should have the correct structure, including techStack as an array.
    const createdProject = await createProject(projectDataFromForm);

    successMessage.value = `Project "${createdProject.title}" created successfully!`;
    showSuccessModal.value = true;

    // Reset form after successful creation by resetting the newProject ref
    // which is bound as initialData to ProjectForm.
    // ProjectForm's watch on initialData will clear its internal editableProjectData.
    newProject.value = {
      title: '', description: '', techStack: [],
      imageUrl: '', repoUrl: '', liveUrl: ''
    };

  } catch (err) {
    console.error("Failed to create project:", err);
    let errorMessage = "Could not create project. Please try again later.";
    const errorDetails = [];

    if (err instanceof ApiError) {
      errorMessage = err.message || errorMessage;
      if (err.errors && err.errors.length > 0) {
        err.errors.forEach(apiErr => {
          errorDetails.push(apiErr.message);
          if (apiErr.field && fieldErrors.hasOwnProperty(apiErr.field)) {
            fieldErrors[apiErr.field] = apiErr.message;
          }
          // If API returns general error related to techStack, map it to form's techStack field
          else if (apiErr.field === 'techStackRequest' && fieldErrors.hasOwnProperty('techStack')) {
            fieldErrors.techStack = apiErr.message;
          }
        });
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    error.value = {
      title: 'Creation Failed',
      message: errorDetails.length > 0 ? errorDetails : errorMessage,
    };
    showErrorModal.value = true;
  } finally {
    isSaving.value = false;
  }
};

/**
 * Handles cancelling the project creation.
 * Navigates the user, e.g., back to dashboard or my-projects.
 */
const cancelCreation = () => {
  router.push('/dashboard'); // Or '/my-projects' or router.back()
};

</script>

<style scoped>
.create-project-page h1, .create-project-page .display-5 {
  font-weight: 300;
}

/* Styles from EditProjectPage can be reused or centralized if common form page styling is desired */
.form-label {
  font-weight: 500;
}
</style>
